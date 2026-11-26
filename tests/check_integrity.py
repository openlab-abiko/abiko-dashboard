#!/usr/bin/env python3
"""Verify that the v0.82 static site has not changed beyond moved CSS/JS paths."""
from datetime import date
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import hashlib, json, sys, argparse
ap=argparse.ArgumentParser()
ap.add_argument("--strict-baseline",action="store_true",help="Check byte-for-byte original v0.82 content after reversing path substitutions; use during migration only")
args=ap.parse_args()
ROOT=Path(__file__).resolve().parents[1]
MIGRATION=ROOT/'docs/migration'
old_hashes=json.loads((MIGRATION/'original-sha256.json').read_text())
file_map=json.loads((MIGRATION/'file-map.json').read_text())
changes=json.loads((MIGRATION/'html-reference-changes.json').read_text())
errors=[]

def sha(b):return hashlib.sha256(b).hexdigest()
class HTMLRefParser(HTMLParser):
  def __init__(self):
    super().__init__();self.references=[]
  def handle_starttag(self,tag,attrs):
    d=dict(attrs)
    for key in ('src','href','poster'):
      if key in d and d[key]:self.references.append((tag,key,d[key]))
    if 'srcset' in d:
      for part in d['srcset'].split(','):
        v=part.strip().split(' ')[0]
        if v:self.references.append((tag,'srcset',v))

html_files=[p for p in ROOT.rglob('*.html') if 'docs' not in p.parts and 'tests' not in p.parts]
if args.strict_baseline:
  for old_path,expected in old_hashes.items():
    if old_path=='README.md':continue
    newpath=ROOT/file_map.get(old_path,old_path)
    if not newpath.is_file():errors.append('MISSING FILE: '+str(newpath));continue
    actual=newpath.read_bytes()
    if old_path.endswith('.html'):
      s=actual.decode('utf-8')
      for c in reversed(changes.get(old_path,[])):
        if s.count(c['new'])<c['count']:
          errors.append(f'NOT REVERSIBLE: {old_path}: {c}')
        s=s.replace(c['new'],c['old'])
      actual=s.encode('utf-8')
    if sha(actual)!=expected:
      errors.append('SOURCE DIFFERENCE: '+old_path)

# Runtime-injected legacy script path in commons-content.js must still resolve.
legacy=ROOT/'assets/js/v34.js'
if not legacy.is_file():errors.append('MISSING RUNTIME-INJECTED SCRIPT: assets/js/v34.js')
elif sha(legacy.read_bytes())!=old_hashes.get('assets/js/v34.js'):errors.append('RUNTIME-INJECTED SCRIPT DIFFERS FROM v0.82')

missing_refs=[]
for p in html_files:
  parser=HTMLRefParser();parser.feed(p.read_text(encoding='utf-8'))
  for tag,key,ref in parser.references:
    u=urlsplit(ref)
    if not u.path or u.scheme or u.netloc or ref.startswith(('#','mailto:','tel:','data:','javascript:')):continue
    if u.path.startswith('/'):
      # Root-absolute paths may refer to external host/deployment routes; preserve them.
      continue
    path=(p.parent/unquote(u.path)).resolve()
    if not path.is_file():missing_refs.append((p.relative_to(ROOT).as_posix(),tag,key,ref))
for x in missing_refs:errors.append('BROKEN LOCAL REF: '+repr(x))
mandatory=['index.html','projects.html','budget.html','issues.html','city-dashboard.html','compare.html','gikai.html','council.html','case-photo-sources.html']
for x in mandatory:
 if not (ROOT/x).is_file():errors.append('MISSING ENTRY PAGE: '+x)
if len(list((ROOT/'articles').glob('*.html')))<21:errors.append('FEWER THAN 21 BASELINE ARTICLES')
if args.strict_baseline and len(html_files)!=len([x for x in old_hashes if x.endswith('.html')]): errors.append('NUMBER OF HTML PAGES CHANGED')
for f in (ROOT/'assets/data').rglob('*.json'):
  try: json.loads(f.read_text(encoding='utf-8'))
  except Exception as e:errors.append('INVALID JSON: '+str(f)+' '+str(e))
catalog_path = ROOT / 'assets/data/catalog.json'
if catalog_path.is_file() or not args.strict_baseline:
  def check_date(value):
    if value is not None and date.fromisoformat(value).isoformat() != value:
      raise ValueError(f'expected YYYY-MM-DD or null: {value}')

  try:
    datasets = json.loads(catalog_path.read_text(encoding='utf-8'))['datasets']
    if not isinstance(datasets, list) or not datasets:
      raise ValueError('datasets must be a non-empty list')
    ids = set()
    for dataset in datasets:
      dataset_id = dataset['id']
      for field in ('id', 'title', 'data_path', 'coverage'):
        if not isinstance(dataset[field], str) or not dataset[field].strip():
          raise ValueError(f'{dataset_id}: missing {field}')
      if dataset_id in ids:
        raise ValueError(f'duplicate dataset ID: {dataset_id}')
      ids.add(dataset_id)
      data_path = (ROOT / dataset['data_path']).resolve()
      if ROOT not in data_path.parents or not data_path.is_file():
        raise ValueError(f'{dataset_id}: invalid data path')
      check_date(dataset['updated_on'])
      if not isinstance(dataset['sources'], list) or not dataset['sources']:
        raise ValueError(f'{dataset_id}: expected at least one source')
      for source in dataset['sources']:
        for field in ('publisher', 'title', 'url'):
          if not isinstance(source[field], str) or not source[field].strip():
            raise ValueError(f'{dataset_id}: source missing {field}')
        url = urlsplit(source['url'])
        if url.scheme not in ('http', 'https') or not url.netloc:
          raise ValueError(f'{dataset_id}: invalid source URL')
        check_date(source['retrieved_on'])
  except (OSError, ValueError, TypeError, KeyError) as e:
    errors.append(f'INVALID DATA CATALOG: {e}')

print('Strict baseline:',args.strict_baseline,'| HTML pages:',len(html_files),'| Moved assets:',len(file_map),'| Broken local refs:',len(missing_refs))
if errors:
 for x in errors: print('ERROR:',x)
 sys.exit(1)
print('PASS: local references resolve, minimum entry pages exist and JSON parses.' + (' All original source content is byte-identical after reversing path-only HTML changes.' if args.strict_baseline else ''))
