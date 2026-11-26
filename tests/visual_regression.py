#!/usr/bin/env python3
"""Compare baseline and refactored static site screenshots using Chromium.
Requires: pip install playwright pillow; Chromium installed locally.
Example: python3 tests/visual_regression.py --baseline /path/to/abiko_dashboard_v82 --candidate .
"""
import argparse, contextlib, hashlib, json, shutil, threading
from pathlib import Path
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from io import BytesIO
from PIL import Image, ImageChops
from playwright.sync_api import sync_playwright

ROUTES=['index.html','projects.html','budget.html','issues.html','city-dashboard.html','compare.html','gikai.html','council.html','case-photo-sources.html']
ROUTES += sorted('articles/'+f.name for f in (Path(__file__).resolve().parents[1]/'articles').glob('*.html'))
VIEWPORTS=[(1440,900),(390,844)]
# The homepage shuffles editorial cards on each load.
DETERMINISTIC_RANDOM = '''
(() => {
  let state = 42;
  const next = () => state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
  Math.random = () => next() / 2 ** 32;
  const original = Crypto.prototype.getRandomValues;
  Crypto.prototype.getRandomValues = function (values) {
    if (values instanceof Uint32Array && values.length === 1) {
      values[0] = next();
      return values;
    }
    return original.call(this, values);
  };
})();
'''

@contextlib.contextmanager
def server(root):
  class QuietHandler(SimpleHTTPRequestHandler):
    def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(root),**kwargs)
    def log_message(self,*args):pass
  s=ThreadingHTTPServer(('127.0.0.1',0),QuietHandler)
  t=threading.Thread(target=s.serve_forever,daemon=True);t.start()
  try:yield 'http://127.0.0.1:'+str(s.server_port)+'/'
  finally:s.shutdown();s.server_close();t.join(timeout=2)

def capture(browser,base,route,w,h,scroll_y):
  page=browser.new_page(viewport={'width':w,'height':h},device_scale_factor=1,reduced_motion='reduce')
  # Disable unpredictable third-party resources in both builds, not local assets.
  page.add_init_script(DETERMINISTIC_RANDOM)
  page.route('**/*',lambda route:route.continue_() if route.request.url.startswith(base) else route.abort())
  bad=[];errors=[]
  page.on('response',lambda r:bad.append((r.status,r.url)) if r.status>=400 and r.url.startswith(base) else None)
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(base+route,wait_until='load',timeout=30000)
  page.wait_for_timeout(150)
  page.evaluate("(y) => window.scrollTo({top: y, behavior: 'instant'})", scroll_y)
  page.wait_for_timeout(100)
  screenshot=page.screenshot(animations='disabled')
  data={'title':page.title(), 'url_path':page.url.split(base)[-1], 'body_text':hashlib.sha256(page.locator('body').inner_text(timeout=10000).encode()).hexdigest(), 'bad_local_http':bad,'page_errors':errors, 'size':list(Image.open(BytesIO(screenshot)).size)}
  page.close()
  return screenshot,data

def main():
  ap=argparse.ArgumentParser(); ap.add_argument('--baseline',required=True);ap.add_argument('--candidate',default=str(Path(__file__).resolve().parents[1]));ap.add_argument('--quick',action='store_true');args=ap.parse_args()
  root=Path(args.candidate).resolve();old=Path(args.baseline).resolve()
  routes=ROUTES if not args.quick else ['index.html','budget.html','city-dashboard.html','gikai.html','compare.html','articles/aizu-cityhall.html']
  n=0; diffs=[]; fail=[]; same=0
  with server(old) as old_base, server(root) as new_base, sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path=shutil.which('chromium'),args=['--no-sandbox','--disable-dev-shm-usage'])
    for route in routes:
      for w,h in VIEWPORTS:
        for sy in [0,850] if not args.quick else [0,600]:
          try:
            a,ad=capture(browser,old_base,route,w,h,sy)
            b,bd=capture(browser,new_base,route,w,h,sy)
            n+=1
            imga=Image.open(BytesIO(a)).convert('RGB');imgb=Image.open(BytesIO(b)).convert('RGB')
            bbox=ImageChops.difference(imga,imgb).getbbox()
            if bbox is None:same+=1
            else:diffs.append({'route':route,'w':w,'scrollY':sy,'bbox':bbox});
            if ad['body_text']!=bd['body_text'] or ad['title']!=bd['title'] or ad['url_path']!=bd['url_path'] or ad['bad_local_http'] or bd['bad_local_http'] or ad['page_errors']!=bd['page_errors']:
              fail.append({'route':route,'w':w,'scrollY':sy,'original':ad,'refactor':bd})
          except Exception as e:fail.append({'route':route,'w':w,'scrollY':sy,'exception':str(e)})
    browser.close()
  report={'samples':n,'pixel_identical':same,'pixel_differences':diffs,'behavior_or_loading_issues':fail,'note':'External network resources deliberately blocked in both runs for reproducibility; full interactive flows and network-fed visuals are not exhaustively tested.'}
  target=root/'tests/_reports';target.mkdir(exist_ok=True)
  (target/'visual-regression.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
  print(json.dumps({'samples':n,'pixel_identical':same,'pixel_diff_count':len(diffs),'issue_count':len(fail)},ensure_ascii=False))
  for e in (diffs+fail)[:15]:print(e)
  if diffs or fail:raise SystemExit(1)
if __name__=='__main__':main()
