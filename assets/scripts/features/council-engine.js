/* Council explorer: public records, article routes and source links. */
(() => {
  'use strict';

  const get = id => document.getElementById(id);
  const site = window.ABIKO_COUNCIL;
  if (!site) {
    const message = document.createElement('p');
    message.className = 'council-container council-note';
    message.setAttribute('role', 'status');
    message.textContent = '議会の記録を読み込めませんでした。ページを再読み込みしてください。';
    get('main').prepend(message);
    return;
  }

  const types = {
    bill: '議案', petition: '請願・陳情', question: '一般質問',
    resolution: '意見書', report: '市政一般報告',
  };
  const positions = {
    yes: '賛成', no: '反対', left: '退席', absent: '欠席', chair: '議長は不参加',
  };
  const views = new Map([...document.querySelectorAll('[data-council-view]')]
    .map(view => [view.dataset.councilView, view]));
  const sessions = new Map(site.sessions.map(session => [session.meta.id, session]));
  const themes = new Map(site.themes.map(theme => [theme.id, theme]));
  const weekday = new Intl.DateTimeFormat('ja-JP', { weekday: 'short', timeZone: 'UTC' });
  const records = new Map();
  for (const session of site.sessions) {
    for (const item of session.records) {
      records.set(session.meta.id + '/' + item.id, { item, session });
    }
  }
  const form = get('council-search');
  const pickupBatch = 15;
  const pickupTabs = get('council-pickup-tabs');
  const pickupResults = get('council-pickup-results');
  const pickupMore = get('council-pickup-more');
  let pickupTheme = '';
  let pickupShown = 0;
  let lastList = '';
  let activeView = '';
  let pendingSearch;

  const esc = value => String(value ?? '').replace(/[&<>"']/g, character =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  const normalize = value => String(value).normalize('NFKC').toLowerCase().trim();

  function dateLabel(date, includeYear = false) {
    const [year, month, day] = date.split('-').map(Number);
    return (includeYear ? year + '年' : '') + month + '月' + day + '日';
  }

  function time(date, includeYear = false) {
    return `<time datetime="${esc(date)}">${dateLabel(date, includeYear)}</time>`;
  }

  function calendarDate(date, includeYear = false) {
    const [year, month, day] = date.split('-');
    const label = includeYear ? `${year}.${month}.${day}` : `${Number(month)}.${day}`;
    return `<time datetime="${esc(date)}">${label}<small>（${weekday.format(new Date(date))}）</small></time>`;
  }

  function sourceLink(session, ref) {
    const source = session.sources[ref.id];
    const url = ref.page ? source.url + '#page=' + ref.page : source.url;
    const location = ref.page ? ' · PDF ' + ref.page + (ref.endPage ? '–' + ref.endPage : '') + 'ページ' : '';
    return `<a class="council-source-link" href="${esc(url)}">${esc(source.label + location)}</a>`;
  }

  function articleRoute(session, id) {
    return '#record/' + session.meta.id + '/' + id;
  }

  function listRoute(filters = {}) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value) params.set(key, value);
    }
    const query = params.toString();
    return '#records' + (query ? '?' + query : '');
  }

  function meta(item, session, showType = false) {
    const label = esc(item.label);
    const status = esc(item.status);
    const who = item.person ? `<span>${esc(item.person)} 議員</span>` : '';
    const date = time(item.date);
    const type = types[item.type];
    return `<p class="council-meta">
      ${showType && type !== item.label ? `<span class="council-chip">${esc(type)}</span>` : ''}
      <span class="council-chip">${label}</span><span class="council-chip">${status}</span>
      ${who}${date}<span class="council-chip council-chip--muted">${esc(session.meta.shortName)}</span>
    </p>`;
  }

  function tags(item, session) {
    return `<div class="council-tag-list">${item.themes.map(id =>
      `<a class="council-chip council-chip--muted" href="${esc(listRoute({ theme: id, session: session.meta.id }))}">${esc(themes.get(id).label)}</a>`).join('')}</div>`;
  }

  function exchangeCard(item, session) {
    const source = session.sources[item.source.id];
    return `<div class="council-qa"><dl>
      <dt><span class="council-chip council-chip--filled">質問・指摘</span> ${esc(item.speaker)} 議員</dt>
      <dd>${esc(item.question)}</dd>
      <dt><span class="council-chip council-chip--filled">市の答弁</span>${item.role ? ' ' + esc(item.role) : ''}</dt>
      <dd>${esc(item.answer || '答弁未確認')}</dd></dl>
      <p class="council-citation">${time(source.date)} ${esc(source.venue)} · ${sourceLink(session, item.source)}</p></div>`;
  }

  function nextMeeting() {
    const meeting = site.nextMeeting;
    const introduction = meeting
      ? `<span class="g-status${meeting.status === '招集予定' ? ' g-status--upcoming' : ''}">${esc(meeting.status)}</span>
         <h3>${esc(meeting.name)}</h3>
         <div class="g-date-num">${calendarDate(meeting.date, true)}${meeting.time ? ' <small>' + esc(meeting.time) + '</small>' : ''}</div>
         ${meeting.note ? '<p class="g-next-p">' + esc(meeting.note) + '</p>' : ''}
         <p class="g-small">確認日 ${time(meeting.checkedOn, true)}</p>`
      : '<p>次の開催予定は、市議会の公式案内でご確認ください。</p>';
    return `<div class="council-next-meeting">${introduction}
      <a class="g-inline-link" href="${esc(meeting?.url || site.councilUrl)}">公式日程・最新情報 <span aria-hidden="true">↗</span></a></div>`;
  }

  function renderEdition() {
    const session = sessions.get(site.legacySession);
    get('council-edition-title').textContent = session.meta.name;
    get('council-edition-period').innerHTML =
      `${time(session.meta.start, true)}〜${time(session.meta.end)} <span>${esc(session.meta.status)}</span>`;
    get('council-edition-types').innerHTML = Object.entries(types).map(([id, name]) => {
      const count = session.records.filter(item => item.type === id).length;
      return `<li><a href="${esc(listRoute({ type: id, session: session.meta.id }))}">
        <span>${name}${id === 'report' ? '（掲載分）' : ''}</span>
        <strong>${count}<small>${id === 'question' ? '人' : '件'}</small> <span aria-hidden="true">→</span></strong>
      </a></li>`;
    }).join('');
  }

  function recordCard({ item, session }, onPickup = false) {
    const photoId = site.photos.byRecord[session.meta.id + '/' + item.id]
      || item.themes.map(id => site.photos.byTheme[id]).find(Boolean);
    const photo = site.photos.assets[photoId];
    const image = photo ? `<img src="${esc(photo.path)}" alt="" width="${photo.width}" height="${photo.height}" loading="lazy" decoding="async">` : '';
    const heading = onPickup ? 'h3' : 'h2';
    return `
      <li class="g-bill v73-bill council-result-card">
        <div class="council-photo-frame"><span aria-hidden="true">写真を表示できません</span>${image}</div>
        <div class="council-card-content">
          <${heading}><a class="council-result-link" href="${articleRoute(session, item.id)}">${esc(item.title)}</a></${heading}>
          ${meta(item, session, onPickup)}
          <p class="v73-bill-lead">${esc(item.lead)}</p>${tags(item, session)}
          ${photo ? `<p class="council-photo-credit"><a href="case-photo-sources.html#photo-${esc(photoId)}"
            aria-label="写真はイメージです。写真の出典を見る">写真はイメージです</a></p>` : ''}
          <div class="g-billbottom">${billVotePills(item, session)}<b aria-hidden="true">詳しく見る ↗</b></div>
        </div>
      </li>`;
  }

  function shuffle(entries) {
    const order = [...entries];
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
  }

  function randomPickupOrder() {
    const order = shuffle(records.values());
    const reserved = new Set();
    const seenTypes = new Set();
    const seenSessions = new Set();
    for (const entry of order) {
      if (reserved.size === pickupBatch) break;
      const sessionId = entry.session.meta.id;
      if (seenTypes.has(entry.item.type) && seenSessions.has(sessionId)) continue;
      reserved.add(entry);
      seenTypes.add(entry.item.type);
      seenSessions.add(sessionId);
    }
    const rest = order.filter(entry => !reserved.has(entry));
    const fill = pickupBatch - reserved.size;
    return [...shuffle([...reserved, ...rest.slice(0, fill)]), ...rest.slice(fill)];
  }

  function setupPickup() {
    const order = randomPickupOrder();
    const options = [['', 'すべて'], ...site.themes.map(theme => [theme.id, theme.label])];
    pickupTabs.innerHTML = options.map(([id, label]) =>
      `<button type="button" class="council-pickup-tab" data-theme="${esc(id)}" aria-pressed="${!id}">${esc(label)}</button>`).join('');

    function show(append) {
      const matching = pickupTheme ? order.filter(({ item }) => item.themes.includes(pickupTheme)) : order;
      if (!append) {
        pickupShown = 0;
        pickupResults.replaceChildren();
      }
      const previous = pickupShown;
      const newCards = matching.slice(previous, previous + pickupBatch);
      pickupResults.insertAdjacentHTML('beforeend', newCards.map(entry => recordCard(entry, true)).join(''));
      pickupShown += newCards.length;
      pickupMore.hidden = pickupShown >= matching.length;
      get('council-pickup-status').textContent = matching.length
        ? `${pickupShown}件 / 全${matching.length}件` : 'このテーマの記録はまだありません。';
      if (append && pickupMore.hidden) {
        pickupResults.children[previous]?.querySelector('a.council-result-link')?.focus({ preventScroll: true });
      }
    }

    pickupTabs.addEventListener('click', event => {
      const button = event.target.closest('button[data-theme]');
      if (!button || button.dataset.theme === pickupTheme) return;
      pickupTheme = button.dataset.theme;
      for (const tab of pickupTabs.querySelectorAll('button')) {
        tab.setAttribute('aria-pressed', String(tab === button));
      }
      show(false);
    });
    pickupMore.addEventListener('click', () => show(true));
    show(false);
  }

  function meetingRow(meeting) {
    const date = meeting.end ? time(meeting.date) + '〜' + time(meeting.end) : time(meeting.date);
    const calendar = meeting.session && sessions.has(meeting.session)
      ? `<a href="#schedule-${esc(meeting.session)}">会期内の詳しい日程</a>`
      : meeting.scheduleUrl ? `<a href="${esc(meeting.scheduleUrl)}">公式の会期日程</a>` : '';
    return `<li class="council-meeting-row">
      <div><h3>${esc(meeting.name)}</h3>
        <p>${date}${meeting.time ? ' ' + esc(meeting.time) : ''}</p>
        <span class="council-chip">${esc(meeting.status)}</span></div>
      <div class="council-meeting-links"><a href="${esc(meeting.url)}">公式の会期資料</a>${calendar}</div>
    </li>`;
  }

  function renderSchedule() {
    get('council-next-schedule').innerHTML = nextMeeting();
    get('council-year-meetings').innerHTML = site.yearMeetings.map(meetingRow).join('');
    if (site.extraMeetings?.length) {
      get('council-extra-meetings').innerHTML = site.extraMeetings.map(meetingRow).join('');
      get('council-extra-section').hidden = false;
    }
    const yearChecked = get('council-year-checked');
    if (site.yearMeetingsCheckedOn) {
      yearChecked.innerHTML = `資料確認日 ${time(site.yearMeetingsCheckedOn, true)}`;
      yearChecked.hidden = false;
    }
    get('council-session-calendars').innerHTML = site.sessions.map(session => {
      const official = session.sources.schedule
        ? sourceLink(session, { id: 'schedule' })
        : `<a href="${esc(session.sources.term?.url || site.councilUrl)}">公式の会期案内</a>`;
      return `
      <section class="council-utility-section" id="schedule-${esc(session.meta.id)}">
        <h2 tabindex="-1">${esc(session.meta.name)}の会期日程</h2>
        <p>${time(session.meta.start, true)}〜${time(session.meta.end)} · ${esc(session.meta.status)}。
          時刻は公表された会期日程によります。</p>
        <ol class="council-calendar-list">${session.calendar.map(event =>
          `<li><p class="council-event-date">${time(event.date)} <span>${esc(event.time)}</span></p>
            <div><h3>${esc(event.title)}</h3>${event.note ? '<p class="council-note">' + esc(event.note) + '</p>' : ''}</div></li>`).join('')}</ol>
        <p>${official} ·
          <a href="${esc(listRoute({ session: session.meta.id }))}">この会期の記録を探す</a></p>
        <p class="council-note">資料確認日 ${time(session.meta.checkedOn, true)}</p>
      </section>`;
    }).join('');
  }

  function renderSources() {
    const primary = [
      'term', 'votes', 'minutes', 'minutes-search', 'question-index', 'bills', 'reports',
      'petitions', 'opinions', 'referral', 'council-procedure',
    ];
    get('council-primary-sources').innerHTML = site.sessions.map(session => `
      <section class="council-utility-section">
        <h2>${esc(session.meta.name)}の一次資料</h2>
        <p>${esc(session.meta.coverage)}</p><p>${esc(session.meta.minutesNote)}</p>
        <ul class="council-source-list">${primary.filter(id => session.sources[id]).map(id => '<li>' + sourceLink(session, { id }) + '</li>').join('')}</ul>
        <p>資料確認日 ${time(session.meta.checkedOn, true)}</p>
      </section>`).join('');
  }

  function setupFilters() {
    const options = (select, entries) => {
      select.replaceChildren(new Option('すべて', ''), ...entries.map(([id, name]) => new Option(name, id)));
    };
    options(form.elements.type, Object.entries(types));
    options(form.elements.theme, site.themes.map(theme => [theme.id, theme.label]));
    options(form.elements.session, site.sessions.map(session => [session.meta.id, session.meta.name]));
  }

  function applyFilters(params) {
    form.elements.q.value = params.get('q') || '';
    for (const key of ['type', 'theme', 'session']) {
      const select = form.elements[key];
      const value = params.get(key);
      select.value = [...select.options].some(option => option.value === value) ? value : '';
    }
    form.elements.divided.checked = params.get('divided') === '1';
  }

  function filters() {
    return {
      type: form.elements.type.value,
      theme: form.elements.theme.value,
      session: form.elements.session.value,
      q: form.elements.q.value.trim(),
      divided: form.elements.divided.checked ? '1' : '',
    };
  }

  function searchable(item, session) {
    const exchanges = (item.exchanges || []).flatMap(qa => [qa.speaker, qa.role, qa.question, qa.answer]);
    const remarks = (item.remarks || []).flatMap(remark => [remark.speaker, remark.summary]);
    return normalize([
      item.label, types[item.type], item.title, item.officialTitle, item.lead, item.status, item.person,
      item.group, item.date, dateLabel(item.date, true), session.meta.name, item.article.background,
      ...item.article.points, ...item.themes.map(id => themes.get(id).label), ...exchanges, ...remarks,
    ].filter(Boolean).join(' '));
  }

  const searchIndex = [...records.values()].map(entry => ({ ...entry, search: searchable(entry.item, entry.session) }));

  function votingGroups(item, session) {
    const groups = Object.fromEntries(Object.keys(positions).map(key => [key, []]));
    for (const member of session.members) {
      const vote = item.voting.exceptions[member] || item.voting.default;
      groups[vote].push(member);
    }
    return groups;
  }

  function billVotePills(item, session) {
    if (item.type !== 'bill' || !item.voting) return '';
    const { yes, no, left } = votingGroups(item, session);
    return `<span class="v73-vote-row">
      <span class="g-vote-pill g-vote-pill--yes">${positions.yes} ${yes.length}人</span>
      <span class="g-vote-pill g-vote-pill--no${no.length ? ' has-no' : ''}">${positions.no} ${no.length}人</span>
      ${left.length ? `<span class="g-vote-pill g-vote-pill--left">${positions.left} ${left.length}人</span>` : ''}
    </span>`;
  }

  function renderList(query) {
    const terms = normalize(query.q).split(/\s+/).filter(Boolean);
    const matches = searchIndex.filter(({ item, session, search }) => {
      if (query.type && query.type !== item.type) return false;
      if (query.theme && !item.themes.includes(query.theme)) return false;
      if (query.session && query.session !== session.meta.id) return false;
      if (query.divided && (item.type !== 'bill' || !item.voting || !votingGroups(item, session).no.length)) return false;
      return terms.every(term => search.includes(term));
    });
    get('council-result-count').textContent = `${matches.length}件 / 全${records.size}件`;
    get('council-results').innerHTML = matches.map(entry => recordCard(entry)).join('');
    get('council-empty').hidden = matches.length > 0;
    get('council-coverage').textContent = query.session
      ? sessions.get(query.session).meta.coverage
      : '市政一般報告は、会期ごとに本サイトが選んだ項目を掲載しています。';
  }

  function updateList() {
    clearTimeout(pendingSearch);
    const query = filters();
    lastList = listRoute(query);
    history.replaceState(history.state, '', lastList);
    renderList(query);
  }

  function voteCard(item, session) {
    const groups = votingGroups(item, session);
    const entries = Object.entries(positions);
    const total = session.members.length;
    const cast = groups.yes.length + groups.no.length;
    const bar = entries.filter(([id]) => groups[id].length).map(([id]) =>
      `<span class="council-vote-${id}" style="flex-grow:${groups[id].length}"></span>`).join('');
    const legend = entries.map(([id, label]) =>
      `<div class="council-vote-${id}"><dt>${label}</dt><dd>${groups[id].length}人</dd></div>`).join('');
    const roll = entries.filter(([id]) => groups[id].length).map(([id, label]) =>
      `<dt>${label}</dt><dd>${groups[id].map(esc).join('、')}</dd>`).join('');
    return `<div class="council-voting">
      <p class="council-note">採決表の対象 ${total}人 · 賛否を投じた議員 ${cast}人</p>
      <div class="council-vote-bar" aria-hidden="true">${bar}</div>
      <dl class="council-vote-legend">${legend}</dl>
      ${item.voting.note ? '<p class="council-note">' + esc(item.voting.note) + '</p>' : ''}
      <details class="council-rollcall"><summary>議員別の賛否を見る</summary><dl>${roll}</dl></details>
      <p class="council-citation">出典 ${sourceLink(session, item.voting.source)}</p>
    </div>`;
  }

  function billNavigation(item, session) {
    if (item.type !== 'bill') return '';
    const bills = session.records.filter(record => record.type === 'bill');
    const index = bills.indexOf(item);
    const previous = bills[index - 1];
    const next = bills[index + 1];
    return `<nav class="council-article-nav" aria-label="同じ会期の議案">
      ${previous ? `<a class="council-text-link" rel="prev" href="${articleRoute(session, previous.id)}">← 前の議案</a>` : ''}
      ${next ? `<a class="council-text-link" rel="next" href="${articleRoute(session, next.id)}">次の議案 →</a>` : ''}
    </nav>`;
  }

  function renderDetail({ item, session }) {
    const related = (item.related || []).map(id => records.get(id.includes('/') ? id : session.meta.id + '/' + id));
    const back = lastList || listRoute({ type: item.type, session: session.meta.id });
    get('council-article-back').href = back;
    const exchanges = item.exchanges?.length
      ? `<p class="council-note">会議録から、この話題に関する発言を要約しました。発言全文は原資料で確認できます。</p>
         <div class="council-qa-list">${item.exchanges.map(qa => exchangeCard(qa, session)).join('')}</div>`
      : '<p class="council-note">答弁未確認。このページで要約できる質疑・答弁は収録していません。</p>';
    const discussion = ['bill', 'question'].includes(item.type) || item.exchanges?.length ? `
      <section id="council-qa"><h2>議員は何を問い、市はどう答えたか</h2>${exchanges}</section>` : '';
    const remarks = item.remarks || [];
    const deliberation = remarks.length ? `<section><h2>審査で出た意見</h2>
      <p class="council-note">委員会会議録から発言を要約しました。</p>
      <ul>${remarks.map(remark => `<li><strong>${esc(remark.speaker)}（${esc(remark.role)}）</strong>
        ${esc(remark.summary)} ${sourceLink(session, remark.source)}</li>`).join('')}</ul></section>` : '';
    const article = item.article;
    const sources = new Map([...item.sources, ...(item.exchanges || []).map(qa => qa.source), ...remarks.map(remark => remark.source)]
      .map(source => [`${source.id}:${source.page || ''}:${source.endPage || ''}`, source]));
    if (session.sources['minutes-search'] && [...sources.values()].some(ref => session.sources[ref.id].edition === 'provisional')) {
      sources.set('minutes-search', { id: 'minutes-search' });
    }
    const milestones = article.milestones?.length ? `
      <ol class="council-milestones">${article.milestones.map(event =>
        `<li>${time(event.date)}　${esc(event.text)} ${sourceLink(session, event.source)}</li>`).join('')}</ol>` : '';
    let outcome = article.outcome;
    if (!outcome && item.voting) {
      outcome = '本会議の結果は「' + item.status + '」でした。';
    }
    get('council-article').innerHTML = `<article aria-labelledby="council-article-title">
      <header class="council-detail-header">
        <h1 id="council-article-title" tabindex="-1">${esc(item.title)}</h1>
        <p class="council-lead">${esc(article.lead || item.lead)}</p>
        <p class="council-official">${esc(item.officialTitle)}${item.submittedOn ? ' · 提出 ' + time(item.submittedOn) : ''}
        ${item.questionType ? ' · ' + esc(item.questionType + '／' + item.group) : ''}</p>
        ${meta(item, session)}${tags(item, session)}
      </header>
      <div class="council-detail-grid">
        <div class="council-body">
          <section><h2>${item.type === 'question' ? '取り上げた論点' : '背景と内容'}</h2>
            <p>${esc(article.background)}</p>
            ${article.points.length ? '<ul>' + article.points.map(point => '<li>' + esc(point) + '</li>').join('') + '</ul>' : ''}
          </section>
          ${discussion}
          ${deliberation}
          <section><h2>${item.voting ? '審議・採決の結果' : 'この記録の位置づけ'}</h2>
            ${milestones}
            ${outcome ? '<p>' + esc(outcome) + '</p>' : ''}
            ${item.voting ? voteCard(item, session) : ''}
          </section>
          ${article.questions.length ? `<section><h2>これから確認したいこと</h2>
            <p class="council-note">本サイトの編集上の確認点です。</p>
            <ul>${article.questions.map(question => '<li>' + esc(question) + '</li>').join('')}</ul></section>` : ''}
          ${billNavigation(item, session)}
        </div>
        <aside class="council-article-aside" aria-label="関連記事と出典">
          ${related.length ? `<section class="council-aside-card"><h2>関連する記録</h2>
            <ul>${related.map(({ item: other, session: term }) => `<li>
              <span class="council-chip">${esc(other.label)}</span>
              <a href="${articleRoute(term, other.id)}">${esc(other.title)}</a></li>`).join('')}</ul></section>` : ''}
          <section class="council-aside-card"><h2>根拠となる公式資料</h2>
            <ul class="council-citation">${[...sources.values()].map(ref => '<li>' + sourceLink(session, ref) + '</li>').join('')}</ul>
            <p class="council-citation">資料確認日 ${time(session.meta.checkedOn, true)}</p>
          </section>
        </aside>
      </div></article>`;
  }

  function readRoute() {
    const hash = location.hash.slice(1);
    if (['pickup', 'highlights', 'themes'].includes(hash)) return { view: 'home', anchor: 'pickup' };
    if (hash === 'stories') return { view: 'records', query: new URLSearchParams({ theme: 'education', q: '給食' }) };
    if (hash === 'debate') {
      return { view: 'detail', entry: records.get(site.legacySession + '/bill-13'), anchor: 'council-qa' };
    }
    if (hash === 'calendar') return { view: 'schedule' };
    if (hash === 'learning') return { view: 'guide' };
    if (hash.startsWith('schedule-') && sessions.has(hash.slice('schedule-'.length))) {
      return { view: 'schedule', anchor: hash };
    }
    if (hash.startsWith('guide-') && views.get('guide').contains(get(hash))) {
      return { view: 'guide', anchor: hash };
    }
    if (hash === 'bills' || hash === 'allBills' || hash === 'explore') {
      return { view: 'records', query: new URLSearchParams(hash === 'explore' ? '' : 'type=bill') };
    }
    if (hash === 'records' || hash.startsWith('records?')) {
      return { view: 'records', query: new URLSearchParams(hash.split('?')[1] || '') };
    }
    if (hash.startsWith('record/') || hash.startsWith('record=') || /^bill-\d+$/.test(hash)) {
      const id = hash.replace(/^record[=/]/, '');
      const entry = records.get(id.includes('/') ? id : site.legacySession + '/' + id);
      return { view: 'detail', entry };
    }
    if (['schedule', 'guide', 'sources'].includes(hash)) return { view: hash };
    return { view: 'home' };
  }

  function showPage(initial = false) {
    clearTimeout(pendingSearch);
    const route = readRoute();
    for (const [name, view] of views) view.hidden = name !== route.view;
    const section = route.view === 'detail' ? 'records' : route.view;
    for (const link of document.querySelectorAll('[data-council-nav]')) {
      if (link.dataset.councilNav === section) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    if (route.view === 'records') {
      applyFilters(route.query);
      const query = filters();
      lastList = listRoute(query);
      renderList(query);
    } else if (route.view === 'detail') {
      if (route.entry) renderDetail(route.entry);
      else {
        get('council-article-back').href = '#records';
        get('council-article').innerHTML = '<h1 tabindex="-1">記録が見つかりません</h1><p>記録一覧から探し直せます。</p><a href="#records">議会の記録を探す</a>';
      }
    }
    const view = views.get(route.view);
    const heading = view.querySelector('h1');
    const target = (route.anchor && get(route.anchor)) || heading;
    document.title = (route.view === 'home' ? '市議会を見る' : heading.textContent.trim()) + '｜あびこ、どうなってる？';
    const switched = activeView !== route.view;
    activeView = route.view;
    requestAnimationFrame(() => {
      if (route.anchor) {
        target.scrollIntoView({ block: 'start', behavior: 'instant' });
        if (!initial) target.querySelector('[tabindex="-1"]')?.focus({ preventScroll: true });
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
        if (!initial && (switched || route.view === 'detail')) heading.focus({ preventScroll: true });
      }
    });
  }

  function setupDiagrams() {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in-view');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.18 });
    for (const diagram of document.querySelectorAll('.council-diagram')) observer.observe(diagram);
  }

  function init() {
    setupFilters();
    get('main').addEventListener('error', event => {
      if (event.target.matches?.('.council-photo-frame img')) event.target.hidden = true;
    }, true);
    renderEdition();
    setupPickup();
    renderSchedule();
    renderSources();
    setupDiagrams();
    form.addEventListener('submit', event => {
      event.preventDefault();
      updateList();
    });
    form.addEventListener('change', updateList);
    form.elements.q.addEventListener('input', event => {
      if (event.isComposing) return;
      clearTimeout(pendingSearch);
      pendingSearch = setTimeout(updateList, 180);
    });
    form.elements.q.addEventListener('compositionend', updateList);
    get('council-reset').addEventListener('click', () => {
      form.reset();
      updateList();
      form.elements.q.focus();
    });
    window.addEventListener('hashchange', () => showPage());
    showPage(true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
