// MUN Navigator AI FaaS
// 能力：实时联网检索（DuckDuckGo HTML 解析）/ RAG 对话 / 立场文件分区生成 /
//       内容方向生成 / 自由笔记整理为决议草案结构
// 运行时：妙笔 FaaS，全局 magic/lark 提供 ai({system,user,temperature})

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8',
  }
}
function respond(s, o) {
  return new Response(JSON.stringify(o), { status: s, headers: corsHeaders() })
}
async function readBody(e) {
  try { return typeof e.text === 'function' ? await e.text() : (e.body || '') } catch { return '' }
}

const AI_MODEL_TEMP = 0.6
async function callAI(system, user, temperature) {
  const runtime = (typeof magic !== 'undefined' && magic)
    || (typeof l !== 'undefined' && l)
    || (typeof lark !== 'undefined' && lark)
  if (!runtime?.ai) throw new Error('AI 服务暂不可用')
  const r = await runtime.ai({
    system, user,
    temperature: temperature ?? AI_MODEL_TEMP,
    thinking: { type: 'disabled' },
    reasoning_effort: 'minimal',
  })
  const text = r?.data?.result || (typeof r?.data === 'string' ? r.data : '') || ''
  if (!text) throw new Error('AI 未返回内容')
  return text
}

// ---------------- 实时联网检索 ----------------
function decodeDDG(href) {
  try {
    const u = new URL(href.startsWith('//') ? 'https:' + href : href, 'https://duckduckgo.com')
    if (u.hostname.includes('duckduckgo.com') && u.pathname.startsWith('/l/')) {
      const t = u.searchParams.get('uddg')
      if (t) return t
    }
    return u.toString()
  } catch { return href }
}
const stripTags = (s) => String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
function decodeHTML(s) {
  return String(s || '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
}

// UN News 主题 RSS：按议题关键词映射，兜底用全站 feed
const UN_NEWS_FEEDS_MAP = [
  { feed: 'climate-change', re: /climat|carbon|emission|biodiversity|environment|pollution|ocean|forest|desert|energy|plastic|marine|warming|气候|环境|海洋|污染|能源/ },
  { feed: 'sustainable-development', re: /sustainab|sdg|development|poverty|hunger|food|发展|可持续|贫困|饥饿/ },
  { feed: 'peace-and-security', re: /peace|security|war|conflict|weapon|disarm|military|nuclear|terror|和平|安全|战争|冲突|武器|核/ },
  { feed: 'humanitarian-aid', re: /humanitarian|disaster|relief|famine|aid crisis|人道|灾害|救援|饥荒/ },
  { feed: 'migrants-and-refugees', re: /refugee|migrant|displaced|asylum|displacement|难民|移民|流离|庇护/ },
  { feed: 'human-rights', re: /human right|rights|discrimination|gender|women|children|minority|人权|歧视|性别|妇女|儿童|少数/ },
  { feed: 'health', re: /health|disease|pandemic|epidemic|vaccine|medical|who|卫生|疾病|疫情|疫苗|医疗/ },
  { feed: 'economic-development', re: /econom|trade|debt|finance|investment|currency|经济|贸易|债务|金融|投资/ },
  { feed: 'law-and-crime-prevention', re: /crime|law|corruption|trafficking|justice|legal|犯罪|法律|腐败|贩运|司法/ },
]
function pickNewsFeeds(query) {
  const hits = UN_NEWS_FEEDS_MAP.filter((m) => m.re.test(query)).map((m) => m.feed)
  if (!hits.length) return ['https://news.un.org/feed/subscribe/en/news/all/rss.xml']
  return hits.slice(0, 2).map((f) => `https://news.un.org/feed/subscribe/en/news/topic/${f}/rss.xml`)
}
function parseRSS(xml) {
  const items = []
  xml.split('<item>').slice(1).forEach((blk) => {
    const body = blk.split('</item>')[0]
    const g = (re) => { const m = body.match(re); return m ? decodeHTML(m[1]).trim() : '' }
    const title = g(/<title(?:\s[^>]*)?>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)
    const link = g(/<link(?:\s[^>]*)?>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/)
    const desc = g(/<description(?:\s[^>]*)?>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/)
    const date = g(/<pubDate(?:\s[^>]*)?>([\s\S]*?)<\/pubDate>/)
    if (title && link) items.push({ title, url: link, snippet: stripTags(desc).slice(0, 240), date })
  })
  return items
}
async function unNewsSearch(query) {
  const feeds = ['https://news.un.org/feed/subscribe/en/news/all/rss.xml']
  const lists = await Promise.all(feeds.map(async (u) => {
    try {
      const c = new AbortController()
      const t = setTimeout(() => c.abort(), 6000)
      const r = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: c.signal })
      clearTimeout(t)
      return parseRSS(await r.text())
    } catch { return [] }
  }))
  const words = query.toLowerCase().split(/[^a-z\u4e00-\u9fa5]+/).filter((w) => w.length > 2)
  const seen = new Set()
  const out = []
  lists.flat().forEach((it) => {
    if (seen.has(it.url)) return
    seen.add(it.url)
    const hay = (it.title + ' ' + it.snippet).toLowerCase()
    const score = words.reduce((n, w) => n + (hay.includes(w) ? 1 : 0), 0)
    out.push({ ...it, score })
  })
  return out.sort((a, b) => b.score - a.score).slice(0, 6)
}

async function webSearch(query) {
  const q = query
  const url = 'https://www.bing.com/search?setlang=en-US&cc=US&q=' + encodeURIComponent(q)
  const ctrl = new AbortController()
  const tm = setTimeout(() => ctrl.abort(), 6000)
  let html
  try {
    const r = await fetch(url, {
      method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36' },
      signal: ctrl.signal,
    })
    html = await r.text()
  } finally { clearTimeout(tm) }
  // 解析 Bing 自然结果 <li class="b_algo">
  const out = []
  const blocks = html.split(/<li[^>]*class="[^"]*\bb_algo\b[^"]*"/).slice(1)
  blocks.forEach((blk) => {
    const body = blk.slice(0, 4000)
    const am = body.match(/<h2[^>]*>\s*<a[^>]*href="(https?:[^"]+)"[^>]*>([\s\S]*?)<\/a>/)
    if (!am) return
    const link = decodeHTML(am[1])
    if (link.includes('bing.com/ck/')) return
    const title = stripTags(decodeHTML(am[2]))
    const pm = body.match(/<p[^>]*>([\s\S]*?)<\/p>/)
    const snippet = pm ? stripTags(decodeHTML(pm[1])) : ''
    if (title) out.push({ title, url: link, snippet: snippet.slice(0, 240) })
  })
  return out.slice(0, 8)
}

// ---------------- Prompts ----------------
const MUN_SYS = `You are a senior Model United Nations (MUN) coach, expert in both UNA-USA and THIMUN rules of procedure and in UN official sources (un.org, docs.un.org, undocs.org, UN Digital Library, ReliefWeb, UNHCR, WHO, World Bank, treaty bodies).
Rules:
- Reply in the user's language; provide document samples/drafts in formal English.
- Be precise, structured and practical. NEVER fabricate document symbols, statistics, quotes or dates; mark anything that must be verified.
- Always keep the delegate in character: align advice with the assigned country's real policy, alliances and interests.
- Cite the supplied search results when used.`

function ctxLine(ctx) {
  ctx = ctx || {}
  return `Delegate context — Committee: ${ctx.committee || 'N/A'}; Conference theme: ${ctx.conference || 'N/A'}; Country: ${ctx.country || 'N/A'}; Topic: ${ctx.topic || 'N/A'}.`
}
const REALTIME_RE = /最新|最近|近期|现在|current|latest|recent|today|news|2024|2025|2026|更新|进展|态势/

// ---------------- stages ----------------
async function stageChat(p) {
  const history = Array.isArray(p.history) ? p.history : []
  const lastUser = [...history].reverse().find((m) => m.role === 'user')?.content || ''
  let sources = []
  let evidence = ''
  // 每轮都联网：短寒暄式问题用议题补全检索词
  const bare = lastUser.replace(/请告诉|告诉我|我想知道|请问|最新|最近|近期|情况|进展|动态|please|tell me|latest|recent|news|update|about|know|the|of|和|与/g, ' ').trim()
  const term = (bare.length >= 10 ? lastUser : '') + (p.ctx?.topic ? ` ${p.ctx.topic}` : '')
  try {
    const [bing, news] = await Promise.all([
      webSearch(term.trim() || lastUser),
      unNewsSearch((p.ctx?.topic ? p.ctx.topic + ' ' : '') + lastUser),
    ])
    // UN News 置顶（权威+实时），再补 Bing
    sources = [...news, ...bing]
      .filter((s, k, arr) => arr.findIndex((x) => x.url === s.url) === k)
      .slice(0, 6)
    evidence = sources.length
      ? '\n\nLatest online sources (retrieved now; prefer UN sources, cite source names, ignore irrelevant ones):\n'
        + sources.map((s, k) => `[${k + 1}] ${s.title}\n${s.snippet.slice(0, 150)}\nURL: ${s.url}`).join('\n')
      : ''
  } catch { evidence = '' }
  const convo = history.map((m) => `${m.role === 'user' ? 'Delegate' : 'Coach'}: ${m.content}`).join('\n\n')
  const answer = await callAI(
    MUN_SYS + '\n' + ctxLine(p.ctx) + evidence
      + (evidence ? '\nUse the online sources where relevant and state which sources you used. For purely methodological questions, answer directly.' : ''),
    convo,
    0.6,
  )
  return { ok: true, answer, sources }
}

const SECTION_PROMPTS = {
  bgData: {
    label: '现状背景（含数据+来源）',
    ask: 'Write ONE English paragraph (60-90 words) for the "current situation / background" part of a Position Paper on the given topic: open with the scale of the problem, include 2-3 concrete statistics in [brackets with the suggested source and year for the delegate to verify], and name the main affected groups and regions. Formal MUN style.',
  },
  pastActions: {
    label: '既往国际行动（决议/宪章）',
    ask: 'Write ONE English paragraph (50-80 words) summarizing PAST INTERNATIONAL ACTION relevant to the topic: Charter basis, key treaties and landmark General Assembly / Security Council / ECOSOC resolutions. Use phrases like "Recalling", "Reaffirming". Put every document symbol in [brackets] for verification and note clearly if the delegate must confirm the exact symbol. Do not invent symbols.',
  },
  countryPolicy: {
    label: '本国政策 / 立法',
    ask: 'Write ONE English paragraph (60-90 words) describing the assigned country\'s domestic policy, legislation and diplomatic positions on the topic, in character. Reference real national laws, national plans, ratified treaties and membership in relevant blocs. Mark every specific law name / statistic in [brackets to verify]. If the country has no direct record, infer cautiously from its voting record and alliances, and say so.',
  },
  officialQuote: {
    label: '官方原话引用',
    ask: 'Draft 1-2 short formal English sentences that the country\'s official could plausibly say on this topic in a UN speech (in character). Mark it clearly as a DRAFT quote that the delegate must verify or replace with a real quote from UN Member States on the Record / ministry statements. Provide a real, verifiable source location where similar quotes can be found.',
  },
  solution: {
    label: '建议方案',
    ask: 'Write ONE concrete English proposal sentence for a Position Paper "Proposed Solutions" item: it must answer WHO acts, WHAT they do and HOW (funding/mechanism/timeline). Make it realistic for the assigned country to sponsor, specific and verifiable. One sentence only.',
  },
}

async function stagePPSection(p) {
  const cfg = SECTION_PROMPTS[p.section]
  if (!cfg) throw new Error('unknown section')
  const user = `${ctxLine(p.ctx)}\n\nTask: ${cfg.ask}\n\nOutput the draft only.`
  const text = await callAI(
    `${MUN_SYS}\nYou are drafting a single Position Paper field. Output only the requested English draft, no commentary.`,
    user,
    0.7,
  )
  return { ok: true, text: text.trim() }
}

async function stageContentDirection(p) {
  const sys = `You are a MUN strategy advisor. Given the committee, the conference theme, the assigned country and the topic, produce CONTENT DIRECTIONS the delegate can develop across Position Paper, speeches and draft resolution.
Output in simplified Chinese Markdown: a short overall judgement, then 4 directions each with: ① 方向名称 ② 为什么契合（委员会职能/会议主题/国家利益 三重契合点）③ 可用论据与权威来源 ④ 潜在风险（对手国可能如何反驳）. Be concrete and specific; mark facts to verify.`
  const user = ctxLine(p.ctx)
  const text = await callAI(sys, user, 0.7)
  return { ok: true, text }
}

async function stageNotesToResolution(p) {
  const notes = String(p.notes || '').trim()
  if (notes.length < 10) throw new Error('请先写下决议核心内容')
  const sys = `You convert a delegate's rough notes into a formally structured MUN Draft Resolution (UNA-USA style).
Return STRICT JSON only, no markdown fences, with this shape:
{
 "title": "short resolution title",
 "preamb": [{"phrase": "<standard preambulatory opening, e.g. Recalling/Recognizing/Alarmed by/Bearing in mind>", "text": "..."}],
 "oper": [{"phrase": "<standard operative verb, e.g. Calls upon/Urges/Requests/Encourages/Decides>", "text": "...", "children": [{"phrase":"including","text":"..."}]}]
}
Rules:
- 3-5 preambulatory clauses (legal basis, past resolutions, current concern); 4-7 operative clauses, concrete and actionable (who/what/how/when).
- Use ONLY standard MUN opening phrases. Split vague notes into specific clauses.
- Put uncertain document symbols/statistics in square brackets inside text for verification; never invent them.
- Keep clauses aligned with the assigned country's policy and the committee's mandate.`
  const raw = await callAI(sys, `${ctxLine(p.ctx)}\n\nRough notes:\n${notes}`, 0.5)
  let json
  try {
    const cleaned = raw.replace(/^[\s\S]*?\{/, '{').replace(/\}\s*$/, '}')
    json = JSON.parse(cleaned.match(/\{[\s\S]*\}/)[0])
  } catch {
    throw new Error('AI 返回解析失败，请重试')
  }
  if (!Array.isArray(json.preamb) || !Array.isArray(json.oper)) throw new Error('AI 返回结构不完整，请重试')
  return { ok: true, data: json }
}

// AI 全文生成/优化已有决议草案（可带修改要求）
async function stageRefineResolution(p) {
  const current = String(p.current || '').trim()
  if (!current) throw new Error('当前草案为空，请先填写或生成内容')
  const instruction = String(p.instruction || '').trim()
  const sys = `You are editing a Model UN Draft Resolution (UNA-USA style). Improve the delegate's draft into a complete, formal, well-ordered resolution.
Requirements:
- Preserve the delegate's intent; keep the heading fields (Committee/Conference/Sponsors/Signatories/Topic) as given.
- Ensure 3-5 preambulatory clauses (Charter/treaty basis, past actions, present concern) and 4-7 operative clauses that are concrete and actionable (who/what/how/when); merge duplicates, split vague clauses, fix logical order.
- Use ONLY standard MUN opening phrases; apply the standard punctuation (PP comma, OP semicolon, final period).
- If the user gives an instruction, follow it as the priority.
- Keep document symbols/statistics the user provided; mark anything uncertain in square brackets for verification; NEVER invent symbols or numbers.
Return STRICT JSON only (no markdown fences) with this shape:
{"title":"...","preamb":[{"phrase":"...","text":"..."}],"oper":[{"phrase":"...","text":"...","children":[{"phrase":"...","text":"..."}]}]}`
  const user = `${ctxLine(p.ctx)}\n${instruction ? `Editing instruction: ${instruction}\n\n` : ''}Current draft:\n${current.slice(0, 12000)}`
  const raw = await callAI(sys, user, 0.5)
  try {
    const json = JSON.parse(raw.match(/\{[\s\S]*\}/)[0])
    if (!Array.isArray(json.preamb) || !Array.isArray(json.oper)) throw new Error('x')
    return { ok: true, data: json }
  } catch {
    throw new Error('AI 返回解析失败，请重试')
  }
}

// 按使用者自定义的发言方向，AI 重新生成讲稿论点
async function stageSpeechPoints(p) {
  const direction = String(p.direction || '').trim()
  if (direction.length < 4) throw new Error('请先填写你想讲的方向')
  const maxPoints = Math.min(Math.max(Number(p.maxPoints) || 3, 2), 6)
  const sys = `You are a senior Model UN speech coach. Given the delegate's context and the SPEECH DIRECTION the delegate wants to take, produce a set of speech talking points.
Return STRICT JSON only, no markdown fences, with this shape:
{"points":[{"claim":"...","evidence":"..."}]}
Rules:
- Produce exactly ${maxPoints} points; every "claim" is ONE assertive sentence in formal English WITHOUT a trailing period (it will be punctuated by the app), directly developing the delegate's requested direction while fitting the committee's mandate and the assigned country's real policy and interests.
- Order points as a persuasive arc: problem/scale -> why it matters to the country -> solution/action.
- "evidence" names 1-2 REAL, verifiable authoritative sources (UN bodies, treaty regimes, official reports/data) the delegate should consult; written like "IPCC Sixth Assessment Report; WMO data". NEVER fabricate report titles, document symbols or numbers; if unsure, name the institution and the dataset type.
- Do not include commentary outside the JSON.`
  const user = `${ctxLine(p.ctx)}\nOccasion: ${p.occasion || 'GSL'}.\n\nDelegate's desired speech direction:\n${direction}`
  const raw = await callAI(sys, user, 0.6)
  try {
    const json = JSON.parse(raw.match(/\{[\s\S]*\}/)[0])
    if (!Array.isArray(json.points) || !json.points.length) throw new Error('x')
    const points = json.points
      .filter((x) => x && typeof x.claim === 'string')
      .slice(0, maxPoints)
      .map((x) => ({
        claim: String(x.claim).trim().replace(/\.\s*$/, ''),
        evidence: String(x.evidence || '').trim() || '相关联合国官方文件与数据（请核实）',
      }))
    if (!points.length) throw new Error('x')
    return { ok: true, points }
  } catch {
    throw new Error('AI 返回解析失败，请重试')
  }
}

// ---------------- handler ----------------
async function handler(event) {
  try {
    const method = (event?.method || event?.httpMethod || 'POST').toUpperCase()
    if (method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders() })
    if (method !== 'POST') return respond(405, { ok: false, error: 'method not allowed' })
    const p = JSON.parse((await readBody(event)) || '{}')
    switch (p.stage) {
      case 'web_search': {
        const q = String(p.query || '')
        const [bing, news] = await Promise.all([webSearch(q), unNewsSearch(q)])
        const list = [...news, ...bing]
          .filter((s, k, arr) => arr.findIndex((x) => x.url === s.url) === k)
        return respond(200, { ok: true, list })
      }
      case 'chat': return respond(200, await stageChat(p))
      case 'pp_section': return respond(200, await stagePPSection(p))
      case 'content_direction': return respond(200, await stageContentDirection(p))
      case 'notes_to_resolution': return respond(200, await stageNotesToResolution(p))
      case 'refine_resolution': return respond(200, await stageRefineResolution(p))
      case 'speech_points': return respond(200, await stageSpeechPoints(p))
      default: return respond(400, { ok: false, error: 'unknown stage' })
    }
  } catch (e) {
    return respond(200, { ok: false, error: String(e?.message || e).slice(0, 200) })
  }
}

module.exports = { handler }
