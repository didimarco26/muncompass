import { useMemo, useRef, useState } from 'react'
import {
  Search, ExternalLink, Newspaper, Loader2, AlertCircle, Globe, Layers, LayoutGrid, Sparkles, Wifi,
  FileText, Target, GitBranch, Lightbulb, ShieldAlert, Flag,
} from 'lucide-react'
import { SOURCES_DOC, SOURCE_CATS, type Source } from '../data/sources'
import { ALL_SOURCES_EXTRA } from '../data/sources2'
import { ALL_COMMITTEES } from '../data/committees2'
import { LAYER_NAMES } from '../data/committees'
import { googleSiteLinks } from '../data/unSources'
import { HOT_TOPICS } from '../data/munData'
import { smartPickSources } from '../lib/smartSources'
import { api, type WebResult, type ResearchReport } from '../lib/api'
import { CATEGORY_LABEL } from '../lib/recommend'
import { CopyButton, DownloadButton } from '../components/IOButtons'

const ALL_SOURCES: Source[] = [...SOURCES_DOC, ...ALL_SOURCES_EXTRA]

// 右侧中文概述小块：桌面端固定在内容右侧，窄屏自动落到下方
function ZhNote({ text, label = '中文概述' }: { text?: string; label?: string }) {
  if (!text) return null
  return (
    <div className="shrink-0 rounded-lg border border-slate-100 bg-white/80 p-3 lg:w-[236px]">
      <p className="mb-1 flex items-center gap-1 text-[10px] font-bold tracking-wide text-slate-400">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-un-500" />
        {label}
      </p>
      <p className="text-[12px] leading-[20px] text-slate-600">{text}</p>
    </div>
  )
}

export default function Research() {
  const [query, setQuery] = useState('sustainability')
  const [applied, setApplied] = useState('sustainability')
  const [view, setView] = useState<'sources' | 'committees' | 'briefing'>(
    new URLSearchParams(location.search).get('v') === 'committees'
      ? 'committees'
      : new URLSearchParams(location.search).get('v') === 'briefing' ? 'briefing' : 'sources',
  )
  const [openLayers, setOpenLayers] = useState<Record<number, boolean>>({ 1: true })
  const [showAll, setShowAll] = useState(false)
  const [cat, setCat] = useState('all')

  // 实时网络结果
  const [live, setLive] = useState<WebResult[] | null>(null)
  const [liveLoading, setLiveLoading] = useState(false)
  const [liveErr, setLiveErr] = useState('')

  // 新闻动态
  const [news, setNews] = useState<WebResult[] | null>(null)
  const [newsLoading, setNewsLoading] = useState(false)
  const [newsErr, setNewsErr] = useState('')

  const resultRef = useRef<HTMLDivElement>(null)

  const smart = useMemo(
    () => (applied ? smartPickSources(applied) : null),
    [applied],
  )

  // ===== 升级版深度研究（thesis 式研究报告） =====
  const [brief, setBrief] = useState({
    country: '', topic: '', committee: '', conference: '', focus: '',
  })
  const [briefing, setBriefing] = useState<{ report: ResearchReport; sources: { title: string; url: string; snippet: string }[] } | null>(null)
  const [briefBusy, setBriefBusy] = useState(false)
  const [briefErr, setBriefErr] = useState('')
  const setBriefField = (k: keyof typeof brief, v: string) => setBrief({ ...brief, [k]: v })

  const genBriefing = async () => {
    if (briefBusy) return
    if (!brief.country.trim()) { setBriefErr('请填写代表国家（P1 最高优先级）'); return }
    if (!brief.topic.trim()) { setBriefErr('请填写议题（P2）'); return }
    setBriefBusy(true)
    setBriefErr('')
    try {
      const r = await api.researchReport({
        country: brief.country.trim(),
        topic: brief.topic.trim(),
        committee: brief.committee.trim(),
        conference: brief.conference.trim(),
        focus: brief.focus.trim(),
      })
      setBriefing(r)
    } catch (e) {
      setBriefErr(String((e as Error).message))
    } finally {
      setBriefBusy(false)
    }
  }

  const briefingText = () => {
    if (!briefing) return ''
    const { report: r, sources: s } = briefing
    const lines: string[] = []
    lines.push(`RESEARCH BRIEFING — ${brief.country} / ${brief.topic}`)
    if (brief.committee) lines.push(`Committee: ${brief.committee}`)
    lines.push('', 'CENTRAL THESIS', r.thesis)
    if (r.thesisZh) lines.push(`中文概述：${r.thesisZh}`)
    lines.push('', 'COUNTRY CONTEXT', r.countryContext)
    if (r.countryContextZh) lines.push(`中文概述：${r.countryContextZh}`)
    r.arguments.forEach((a, i) => {
      lines.push('', `ARGUMENT ${i + 1}: ${a.claim}`, a.evidence)
      if (a.zh) lines.push(`中文概述：${a.zh}`)
      if (a.sources.length) lines.push(`Sources: ${a.sources.map((k) => s[k]?.url).filter(Boolean).join(' ; ')}`)
    })
    r.counterarguments.forEach((c, i) => {
      lines.push('', `COUNTERARGUMENT ${i + 1}: ${c.view}`)
      if (c.holders) lines.push(`Holders: ${c.holders}`)
      lines.push(`Response: ${c.response}`)
      if (c.zh) lines.push(`中文概述：${c.zh}`)
      if (c.sources.length) lines.push(`Sources: ${c.sources.map((k) => s[k]?.url).filter(Boolean).join(' ; ')}`)
    })
    if (r.resultsChain?.length) lines.push('', 'RESULTS CHAIN (Output -> Outcome -> Impact)')
    r.resultsChain?.forEach((x, i) => {
      lines.push(`${i + 1}. Output: ${x.action}`)
      if (x.outcome) lines.push(`   Outcome: ${x.outcome}`)
      if (x.impact) lines.push(`   Impact: ${x.impact}`)
      if (x.zh) lines.push(`   中文概述：${x.zh}`)
      if (x.sources.length) lines.push(`   Sources: ${x.sources.map((k) => s[k]?.url).filter(Boolean).join(' ; ')}`)
    })
    r.gaps.length ? lines.push('', 'GAPS TO VERIFY', ...r.gaps.map((x, i) => `${i + 1}. ${x}`)) : null
    lines.push('', 'SOURCES', ...s.map((x, i) => `[${i}] ${x.title} — ${x.url}`))
    return lines.join('\n')
  }

  const runSearch = (override?: string) => {
    const q = (override ?? query).trim()
    if (!q) return
    setQuery(q)
    setApplied(q)
    setLive(null)
    setLiveErr('')
    requestAnimationFrame(() =>
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60),
    )
  }

  const loadLive = async () => {
    setLiveLoading(true)
    setLiveErr('')
    try {
      const { list } = await api.webSearch(applied)
      setLive(list)
    } catch (e) {
      setLiveErr(String((e as Error).message))
    } finally {
      setLiveLoading(false)
    }
  }

  const loadNews = async () => {
    setNewsLoading(true)
    setNewsErr('')
    try {
      const { list } = await api.webSearch(applied ? `${applied} United Nations` : 'United Nations')
      setNews(list)
    } catch (e) {
      setNewsErr(String((e as Error).message))
    } finally {
      setNewsLoading(false)
    }
  }

  const catCounts = useMemo(() => {
    const m: Record<string, number> = {}
    ALL_SOURCES.forEach((s) => { m[s.cat] = (m[s.cat] || 0) + 1 })
    return m
  }, [])

  const shownAll = useMemo(
    () => (cat === 'all' ? ALL_SOURCES : ALL_SOURCES.filter((s) => s.cat === cat)),
    [cat],
  )

  const google = applied ? googleSiteLinks(applied) : []

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10 md:py-14">
      <div className="flex items-center gap-2 text-un-700 text-sm font-medium mb-2">
        <Globe size={15} /> 官方信源研究室 · {ALL_SOURCES.length} 信源 / {ALL_COMMITTEES.length} 委员会
      </div>
      <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">议题材料检索</h1>
      <p className="mt-3 text-slate-500 max-w-2xl leading-7">
        输入议题（建议英文），AI 先精选最贴切的权威信源，并可实时联网抓取最新网页；也可在「委员会大全」浏览 7 层 {ALL_COMMITTEES.length} 个机构。
      </p>

      <div className="mt-6 inline-flex rounded-xl border border-slate-200 bg-white p-1">
        <button onClick={() => setView('sources')} className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition ${view === 'sources' ? 'bg-un-600 text-white' : 'text-slate-600'}`}>
          <LayoutGrid size={15} /> 信源检索
        </button>
        <button onClick={() => setView('committees')} className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition ${view === 'committees' ? 'bg-un-600 text-white' : 'text-slate-600'}`}>
          <Layers size={15} /> 委员会大全
        </button>
        <button onClick={() => setView('briefing')} className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition ${view === 'briefing' ? 'bg-un-600 text-white' : 'text-slate-600'}`}>
          <FileText size={15} /> 深度研究
        </button>
      </div>

      {view === 'briefing' && (
        <div className="mt-6">
          {/* 研究方法：维度优先级 */}
          <div className="card p-5 mb-5">
            <h2 className="font-bold text-slate-900 flex items-center gap-2 mb-1">
              <GitBranch size={16} className="text-un-700" /> 研究路径：按代表备料优先级检索
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              依据联合国官方《代表准备》指引与真实代表团备料流程：先锁定国家立场（投票记录最可靠），再查议题事实与法律框架，后结合委员会职权，最后进入辩证。
            </p>
            <div className="grid gap-2.5 md:grid-cols-4">
              {[
                { p: 'P1', t: '国家立场', d: '常驻联合国代表团/外交部表态、历届决议投票记录、条约参与、阵营归属', icon: Flag },
                { p: 'P2', t: '议题事实与框架', d: '联合国机构数据、相关条约与决议、政策选项', icon: Target },
                { p: 'P3', t: '委员会职权', d: '委员会授权范围、既往行动、可落地的措施', icon: ShieldAlert },
                { p: 'P4', t: '辩证与会议主题', d: '对立阵营观点、妥协空间、会议主题框定', icon: Lightbulb },
              ].map((x) => (
                <div key={x.p} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="rounded bg-un-600 px-1.5 py-0.5 text-[10px] font-bold text-white">{x.p}</span>
                    <x.icon size={13} className="text-un-700" />
                    <span className="text-xs font-bold text-slate-800">{x.t}</span>
                  </div>
                  <p className="text-[11px] leading-[18px] text-slate-500">{x.d}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 输入表单 */}
          <div className="card p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="label">代表国家 <span className="ml-1 rounded bg-un-600 px-1 text-[10px] text-white">P1 必填</span></label>
                <input className="input" value={brief.country} onChange={(e) => setBriefField('country', e.target.value)} placeholder="例如：Bangladesh" />
              </div>
              <div>
                <label className="label">议题 <span className="ml-1 rounded bg-un-600 px-1 text-[10px] text-white">P2 必填</span></label>
                <input className="input" value={brief.topic} onChange={(e) => setBriefField('topic', e.target.value)} placeholder="例如：protection of climate displaced persons" />
              </div>
              <div>
                <label className="label">委员会 <span className="ml-1 rounded bg-slate-300 px-1 text-[10px] text-white">P3 选填</span></label>
                <input className="input" list="briefing-committees" value={brief.committee} onChange={(e) => setBriefField('committee', e.target.value)} placeholder="例如：SOCHUM（可从下拉列表选择）" />
                <datalist id="briefing-committees">
                  {ALL_COMMITTEES.map((c) => <option key={c.id} value={c.en} />)}
                </datalist>
              </div>
              <div>
                <label className="label">会议主题 <span className="ml-1 rounded bg-slate-300 px-1 text-[10px] text-white">P4 选填</span></label>
                <input className="input" value={brief.conference} onChange={(e) => setBriefField('conference', e.target.value)} placeholder="例如：Multilateralism at a Crossroads" />
              </div>
            </div>
            <div className="mt-4">
              <label className="label">想重点论证的角度（选填）</label>
              <input className="input" value={brief.focus} onChange={(e) => setBriefField('focus', e.target.value)} placeholder="例如：重点论证气候流离失所者应获得有约束力的法律保护地位" />
            </div>
            {briefErr && <p className="mt-3 text-sm text-rose-500">{briefErr}</p>}
            <button
              className="btn-primary mt-4 w-full !py-3 md:w-auto md:px-8"
              disabled={briefBusy}
              onClick={genBriefing}>
              {briefBusy
                ? <span className="flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> 多维度检索与撰写中，约需 20-40 秒…</span>
                : <span className="flex items-center gap-2"><Sparkles size={16} /> 生成 Thesis 式研究报告</span>}
            </button>
          </div>

          {/* 研究报告结果 */}
          {briefing && (
            <section className="mt-6 card overflow-hidden animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-3.5">
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    Research Briefing · {brief.country} / {brief.topic}
                  </div>
                  <div className="text-[11px] text-slate-400">基于 {briefing.sources.length} 条实时检索来源综合，含论点 · 论据 · 辩证</div>
                </div>
                <div className="flex gap-2">
                  <CopyButton text={briefingText()} />
                  <DownloadButton text={briefingText()} filename={`Research-${brief.country}-${brief.topic.slice(0, 24)}.txt`} label="下载" />
                </div>
              </div>

              <div className="px-5 md:px-7 py-6 space-y-7">
                {/* 核心 thesis 与国家背景 */}
                <div className="rounded-xl border border-un-200 bg-un-50/60 p-5">
                  <div className="flex flex-col gap-4 lg:flex-row">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-un-700 mb-1.5">Central Thesis</p>
                      <p className="text-sm font-semibold leading-[26px] text-slate-900">{briefing.report.thesis}</p>
                      <p className="mt-3 text-[13px] leading-6 text-slate-600">
                        <span className="font-bold text-un-700">国家背景：</span>{briefing.report.countryContext}
                      </p>
                    </div>
                    {(briefing.report.thesisZh || briefing.report.countryContextZh) && (
                      <div className="flex shrink-0 flex-col gap-3">
                        <ZhNote text={briefing.report.thesisZh} label="核心论点 · 中文" />
                        <ZhNote text={briefing.report.countryContextZh} label="国家背景 · 中文" />
                      </div>
                    )}
                  </div>
                </div>

                {/* 核心论点与论据 */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Target size={16} className="text-rose-500" /> 核心论点与论据
                  </h3>
                  <div className="space-y-4">
                    {briefing.report.arguments.map((a, i) => (
                      <div key={i} className="rounded-xl border border-slate-150 p-4">
                        <div className="flex flex-col gap-3 lg:flex-row">
                          <div className="min-w-0 flex-1">
                            <div className="flex gap-2.5">
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-rose-500 text-xs font-bold text-white">{i + 1}</span>
                              <p className="text-sm font-bold leading-6 text-slate-900">{a.claim}.</p>
                            </div>
                            <p className="mt-2 text-[13px] leading-6 text-slate-600 pl-[34px]">{a.evidence}</p>
                            {a.sources.length > 0 && (
                              <div className="mt-2.5 flex flex-wrap gap-1.5 pl-[34px]">
                                {a.sources.map((k) => (
                                  <a key={k} href={briefing.sources[k].url} target="_blank"
                                    className="inline-flex items-center gap-1 rounded-full bg-un-50 px-2.5 py-1 text-[10.5px] font-semibold text-un-800 hover:bg-un-100">
                                    [{k}] {briefing.sources[k].title.slice(0, 48)}{briefing.sources[k].title.length > 48 ? '…' : ''}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                          <ZhNote text={a.zh} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 辩证 */}
                {briefing.report.counterarguments.length > 0 && (
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <GitBranch size={16} className="text-un-700" /> 辩证表达：对立观点与我方回应
                    </h3>
                    <div className="grid gap-3.5 md:grid-cols-2">
                      {briefing.report.counterarguments.map((c, i) => (
                        <div key={i} className="rounded-xl border border-slate-150 p-4">
                          <div className="flex flex-col gap-3 lg:flex-row">
                            <div className="min-w-0 flex-1">
                              <div className="rounded-lg bg-slate-50 p-2.5">
                                <p className="text-[12.5px] font-semibold leading-5 text-slate-700">对立：{c.view}.</p>
                                {c.holders && <p className="mt-1 text-[11px] text-slate-400">持方：{c.holders}</p>}
                              </div>
                              <p className="mt-2.5 text-[12.5px] leading-[22px] text-slate-600">
                                <span className="font-bold text-un-700">回应：</span>{c.response}
                              </p>
                              {c.sources.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {c.sources.map((k) => (
                                    <a key={k} href={briefing.sources[k].url} target="_blank"
                                      className="rounded-full bg-un-50 px-2 py-0.5 text-[10px] font-semibold text-un-800 hover:bg-un-100">
                                      [{k}] 来源
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                            <ZhNote text={c.zh} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 结果链 results chain */}
                {briefing.report.resultsChain.length > 0 && (
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-1.5 flex items-center gap-2">
                      <Lightbulb size={16} className="text-gold-500" /> 结果链：行动产出 → 中期成效 → 长期影响
                    </h3>
                    <p className="mb-3 text-[11.5px] text-slate-400">
                      参照结果导向管理（RBM）逻辑模型：每项主张都应能从委员会的具体产出，推导到中期改变与长期影响。
                    </p>
                    <div className="space-y-3">
                      {briefing.report.resultsChain.map((x, i) => (
                        <div key={i} className="rounded-xl border border-slate-150 p-4">
                          <div className="flex flex-col gap-3 lg:flex-row">
                            <div className="min-w-0 flex-1">
                              <div className="mb-2 flex items-center gap-1.5">
                                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-gold-500 text-[10px] font-bold text-white">{i + 1}</span>
                                <span className="text-[11px] font-bold uppercase tracking-wide text-gold-700">Results Path</span>
                              </div>
                              <div className="grid gap-2.5 md:grid-cols-3">
                                {[
                                  { tag: '产出 Output', val: x.action, color: 'text-rose-600' },
                                  { tag: '成效 Outcome', val: x.outcome, color: 'text-un-700' },
                                  { tag: '影响 Impact', val: x.impact, color: 'text-emerald-600' },
                                ].map((b) => (
                                  <div key={b.tag} className="rounded-lg bg-slate-50 p-2.5">
                                    <p className={`text-[10px] font-bold ${b.color}`}>{b.tag}</p>
                                    <p className="mt-1 text-[12px] leading-[18px] text-slate-600">{b.val || '—'}</p>
                                  </div>
                                ))}
                              </div>
                              {x.sources.length > 0 && (
                                <div className="mt-2.5 flex flex-wrap gap-1">
                                  {x.sources.map((k) => (
                                    <a key={k} href={briefing.sources[k].url} target="_blank"
                                      className="rounded-full bg-un-50 px-2 py-0.5 text-[10px] font-semibold text-un-800 hover:bg-un-100">
                                      [{k}] 来源
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                            <ZhNote text={x.zh} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 待核实缺口 */}
                {briefing.report.gaps.length > 0 && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
                    <p className="text-xs font-bold text-amber-800 mb-1.5">📌 需进一步核实的信息缺口</p>
                    <ul className="space-y-1">
                      {briefing.report.gaps.map((x, i) => (
                        <li key={i} className="text-[12px] leading-5 text-amber-900/80">· {x}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 全部来源 */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Globe size={16} className="text-un-700" /> 全部来源（{briefing.sources.length}）
                  </h3>
                  <ol className="space-y-1.5">
                    {briefing.sources.map((s, i) => (
                      <li key={i} className="flex gap-2 text-[12.5px] leading-[22px]">
                        <span className="shrink-0 font-bold text-slate-400">[{i}]</span>
                        <a href={s.url} target="_blank" className="text-un-800 hover:underline">
                          {s.title}
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </section>
          )}
        </div>
      )}

      {view === 'sources' && (
        <>
          <div className="mt-5 card p-4 md:p-5">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input className="input !pl-10 !py-3" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && runSearch()} placeholder="例如：climate change and international security" />
              </div>
              <button className="btn-primary !py-3" disabled={!query.trim()} onClick={() => runSearch()}>智能检索</button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {HOT_TOPICS.slice(0, 8).map((t) => (
                <button key={t.en} className="chip" onClick={() => runSearch(t.en)}>{t.zh}</button>
              ))}
            </div>
          </div>

          {applied && smart && (
            <section ref={resultRef} className="mt-8 scroll-mt-20 animate-fade-in">
              {/* ① AI 主题智能推荐信源 */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-un-600 px-3 py-1 text-xs font-bold text-white">
                  <Sparkles size={12} /> AI 智能精选
                </span>
                <span className="text-sm text-slate-500">
                  议题归类：<b className="text-slate-700">{CATEGORY_LABEL[smart.category]}</b> · 共 {smart.sources.length} 个最贴切信源
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mb-4">「{applied}」· 最贴切的检索网页</h2>
              <div className="grid gap-3.5 md:grid-cols-2 lg:grid-cols-3">
                {smart.sources.map((s, k) => (
                  <a key={s.id} href={s.search(applied)} target="_blank" className="card group relative p-5 transition hover:-translate-y-0.5 hover:shadow-md hover:border-un-200">
                    {k < 3 && <span className="absolute right-3 top-3 rounded bg-gold-50 px-1.5 py-0.5 text-[10px] font-bold text-gold-700">高相关</span>}
                    <div className="font-bold text-[14.5px] text-slate-900 pr-14">{s.name}</div>
                    {s.en && <div className="text-[11px] text-slate-400">{s.en}</div>}
                    <p className="mt-2 text-xs text-slate-500 leading-5">{s.desc}</p>
                    <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-un-700 opacity-0 transition group-hover:opacity-100">
                      打开检索结果 <ExternalLink size={12} />
                    </div>
                  </a>
                ))}
              </div>

              {/* ② 实时联网结果 */}
              <div className="mt-8 card p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2"><Wifi size={17} className="text-un-600" /> 实时网络精选</h3>
                  <button className="btn-primary !py-2" onClick={loadLive} disabled={liveLoading}>
                    {liveLoading ? <Loader2 size={14} className="animate-spin" /> : <Wifi size={14} />}
                    {liveLoading ? '联网检索中…' : live ? '重新联网检索' : '点击联网检索最新网页'}
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-slate-400">由后端实时检索 UN News 与全网，返回与「{applied}」最相关的网页链接。</p>
                {liveErr && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-gold-50 px-3 py-2 text-xs text-gold-700">
                    <AlertCircle size={14} /> {liveErr}
                  </div>
                )}
                {live && (
                  <div className="mt-4 divide-y divide-slate-100">
                    {live.map((r) => (
                      <a key={r.url} href={r.url} target="_blank" className="flex items-start gap-3 py-3 hover:bg-slate-50/60 px-2">
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-slate-900">{r.title}</div>
                          {r.snippet && <p className="mt-1 text-xs text-slate-500 leading-5 line-clamp-2">{r.snippet}</p>}
                          <div className="mt-1 text-[11px] text-un-600/70 truncate">{r.url}</div>
                        </div>
                        <ExternalLink size={14} className="mt-1 shrink-0 text-slate-300" />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* ③ 高阶检索语法 */}
              <div className="mt-6 card p-5">
                <h3 className="font-bold text-slate-900">🔎 高阶检索语法</h3>
                <div className="mt-3 grid gap-2.5 md:grid-cols-2 lg:grid-cols-4">
                  {google.map((g) => (
                    <a key={g.label} href={g.url} target="_blank" className="btn-ghost justify-between !py-3">
                      {g.label} <ExternalLink size={14} />
                    </a>
                  ))}
                </div>
              </div>

              {/* ④ 全部信源（折叠） */}
              <div className="mt-6">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 hover:bg-slate-50"
                >
                  <span className="font-bold text-slate-900">全部信源（{ALL_SOURCES.length} 个，按类别筛选）</span>
                  <span className="text-sm text-slate-400">{showAll ? '收起 ▲' : '展开 ▼'}</span>
                </button>
                {showAll && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <button onClick={() => setCat('all')} className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${cat === 'all' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
                        全部 ({ALL_SOURCES.length})
                      </button>
                      {Object.entries(SOURCE_CATS).map(([k, label]) => (
                        <button key={k} onClick={() => setCat(k)} className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${cat === k ? 'bg-un-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-un-300'}`}>
                          {label} ({catCounts[k] || 0})
                        </button>
                      ))}
                    </div>
                    <div className="grid gap-3.5 md:grid-cols-2 lg:grid-cols-3">
                      {shownAll.map((s) => (
                        <a key={s.id} href={s.search(applied)} target="_blank" className="card group p-5 transition hover:-translate-y-0.5 hover:shadow-md hover:border-un-200">
                          <div className="flex items-start justify-between gap-2">
                            <div className="font-bold text-[14.5px] text-slate-900">{s.name}</div>
                            <ExternalLink size={14} className="text-slate-300 group-hover:text-un-600 shrink-0" />
                          </div>
                          {s.en && <div className="text-[11px] text-slate-400">{s.en}</div>}
                          <p className="mt-2 text-xs text-slate-500 leading-5">{s.desc}</p>
                          {s.kind === 'teaching' && <span className="mt-2 inline-block rounded bg-violet-50 px-1.5 py-0.5 text-[10px] font-semibold text-violet-600">教学/比赛</span>}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
        </>
      )}

      {view === 'committees' && (
        <section className="mt-6 space-y-3 animate-fade-in">
          {[1, 2, 3, 4, 5, 6, 7].map((layer) => {
            const list = ALL_COMMITTEES.filter((c) => c.layer === layer)
            const open = openLayers[layer]
            return (
              <div key={layer} className="card overflow-hidden">
                <button
                  onClick={() => setOpenLayers({ ...openLayers, [layer]: !open })}
                  className="flex w-full items-center justify-between px-5 py-4 hover:bg-slate-50"
                >
                  <span className="font-bold text-slate-900">{LAYER_NAMES[layer]}</span>
                  <span className="flex items-center gap-3 text-sm text-slate-400">
                    {list.length} 个
                    {open ? '−' : '+'}
                  </span>
                </button>
                {open && (
                  <div className="grid gap-px bg-slate-100 md:grid-cols-2">
                    {list.map((c) => (
                      <a key={c.id} href={c.url} target="_blank" className="flex items-start gap-3 bg-white px-5 py-3.5 hover:bg-un-50/50">
                        <span className="mt-0.5 shrink-0 rounded bg-un-50 px-1.5 py-0.5 text-[10px] font-bold text-un-700">{c.abbr}</span>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-slate-800">{c.name}</div>
                          <div className="text-[11px] text-slate-400 truncate">{c.en} · {c.desc}</div>
                        </div>
                        {!c.real && <span className="shrink-0 rounded bg-gold-50 px-1.5 py-0.5 text-[10px] font-semibold text-gold-700">MUN形式</span>}
                        <ExternalLink size={13} className="mt-1 shrink-0 text-slate-300" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </section>
      )}

      <section className="mt-12">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
          <Newspaper size={18} className="text-un-600" />联合国新闻动态
        </h2>
        <div className="card divide-y divide-slate-100">
          {!news && !newsLoading && !newsErr && (
            <div className="px-6 py-12 text-center">
              <Newspaper size={24} className="mx-auto text-un-300 mb-3" />
              <p className="text-sm text-slate-600">点击按钮，通过后端实时获取与议题相关的最新联合国新闻。</p>
              <button className="btn-primary mt-4" onClick={loadNews}>
                <Newspaper size={15} /> 获取最新动态
              </button>
            </div>
          )}
          {newsLoading && <div className="flex items-center justify-center gap-2 py-12 text-sm text-slate-400"><Loader2 size={16} className="animate-spin" /> 正在联网获取…</div>}
          {newsErr && !newsLoading && (
            <div className="px-6 py-10 text-center">
              <AlertCircle size={22} className="mx-auto text-gold-500 mb-2" />
              <p className="text-sm text-slate-600">{newsErr}</p>
              <button className="btn-primary mt-4" onClick={loadNews}>重试</button>
            </div>
          )}
          {news && !newsLoading && (
            <>
              {news.map((it) => (
                <a key={it.url} href={it.url} target="_blank" className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900">{it.title}</h4>
                    {it.snippet && <p className="mt-1 text-xs text-slate-500 leading-5 line-clamp-2">{it.snippet}</p>}
                  </div>
                  <ExternalLink size={14} className="mt-1 shrink-0 text-slate-300" />
                </a>
              ))}
              <div className="px-5 py-3 text-right">
                <button className="text-xs font-semibold text-un-700 hover:underline inline-flex items-center gap-1" onClick={loadNews}>
                  刷新为最新 <Newspaper size={12} />
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
