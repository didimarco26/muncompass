import { useEffect, useMemo, useState } from 'react'
import {
  Mic, Wand2, Clock, Sparkles, Plus, Trash2, Check, MessageSquareText,
  RefreshCw, Loader2,
} from 'lucide-react'
import { genSpeechV2, countWords, type SpeechV2Input } from '../lib/gen'
import {
  categorizeTopic, recommendPoints, CATEGORY_LABEL,
  DURATIONS, TONES, type PointSuggestion,
} from '../lib/recommend'
import { api } from '../lib/api'
import { CopyButton, DownloadButton } from '../components/IOButtons'
import { ALL_COMMITTEES } from '../data/committees2'

const OCCASIONS = [
  { id: 'GSL 正式发言', label: 'GSL 正式发言', needSub: false },
  { id: 'Moderated Caucus 有主持核心磋商', label: 'Moderated Caucus', needSub: true },
  { id: '开幕/欢迎致辞', label: '开幕致辞', needSub: false },
  { id: 'Right of Reply 答辩', label: 'Right of Reply', needSub: false },
  { id: '决议介绍性发言', label: '决议介绍发言', needSub: false },
]

export default function SpeechPage() {
  const [brief, setBrief] = useState({
    committee: '', country: '', topic: '', occasion: OCCASIONS[0].id, subtopic: '',
  })
  const [duration, setDuration] = useState<SpeechV2Input['duration']>(1)
  const [tone, setTone] = useState<SpeechV2Input['tone']>('advisory')
  const [position, setPosition] = useState('')
  const [callToAction, setCallToAction] = useState('')
  const [points, setPoints] = useState<PointSuggestion[]>([])
  const [out, setOut] = useState('')

  const cat = useMemo(
    () => categorizeTopic(brief.topic, brief.committee),
    [brief.topic, brief.committee],
  )
  const baseSuggestions = useMemo(() => recommendPoints(cat), [cat])
  const [aiPts, setAiPts] = useState<PointSuggestion[] | null>(null)
  const [dirOpen, setDirOpen] = useState(false)
  const [direction, setDirection] = useState('')
  const [ptsLoading, setPtsLoading] = useState(false)
  const [ptsErr, setPtsErr] = useState('')
  // 议题/委员会变化后，AI 定制论点失效，回到本地推荐
  useEffect(() => setAiPts(null), [brief.topic, brief.committee])
  const suggestions = aiPts ?? baseSuggestions
  const durCfg = DURATIONS.find((d) => d.id === duration)!
  const needSub = OCCASIONS.find((o) => o.id === brief.occasion)?.needSub

  const genByDirection = async () => {
    if (ptsLoading) return
    if (!direction.trim()) { setPtsErr('请先填写你想讲的方向'); return }
    if (!brief.topic.trim()) { setPtsErr('请先在上方填写议题'); return }
    setPtsLoading(true)
    setPtsErr('')
    try {
      const r = await api.speechPoints(
        direction,
        durCfg.maxPoints,
        { committee: brief.committee, country: brief.country, topic: brief.topic },
        brief.occasion,
        position,
        callToAction,
      )
      setAiPts(r.points)
      setDirOpen(false)
    } catch (e) {
      setPtsErr(String((e as Error).message))
    } finally {
      setPtsLoading(false)
    }
  }

  // AI 生成核心立场 / 结尾号召
  const [keynoteBusy, setKeynoteBusy] = useState<'position' | 'cta' | ''>('')
  const [keynoteErr, setKeynoteErr] = useState('')
  const genKeynote = async (field: 'position' | 'cta') => {
    if (keynoteBusy) return
    if (!brief.topic.trim()) { setKeynoteErr('请先在上方填写议题'); return }
    if (!brief.country.trim()) { setKeynoteErr('请先在上方填写代表国家'); return }
    setKeynoteBusy(field)
    setKeynoteErr('')
    try {
      const r = await api.speechKeynote(
        field,
        { committee: brief.committee, country: brief.country, topic: brief.topic },
        brief.occasion,
      )
      if (field === 'position') setPosition(r.text)
      else setCallToAction(r.text)
    } catch (e) {
      setKeynoteErr(String((e as Error).message))
    } finally {
      setKeynoteBusy('')
    }
  }

  const adopt = (s: PointSuggestion) => {
    if (points.length >= durCfg.maxPoints) return
    if (points.some((p) => p.claim === s.claim)) return
    setPoints([...points, s])
  }
  const adoptAll = () => setPoints(suggestions.slice(0, durCfg.maxPoints))
  const editPoint = (k: number, key: keyof PointSuggestion, v: string) =>
    setPoints(points.map((p, i) => (i === k ? { ...p, [key]: v } : p)))
  const setField = (k: keyof typeof brief, v: string) => setBrief({ ...brief, [k]: v })

  const words = out ? countWords(out.split('---')[0]) : 0
  const inRange = words >= durCfg.words[0] && words <= durCfg.words[1]
  const seconds = Math.round((words / 140) * 60)

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10 md:py-14">
      <h1 className="text-3xl md:text-4xl font-black text-slate-900 flex items-center gap-2.5">
        <Mic className="text-rose-500" size={30} /> 讲稿生成器
      </h1>
      <p className="mt-3 text-slate-500 max-w-2xl leading-7">
        先填写会议基本信息、选择时长与语气；系统据此推荐论点框架，确认后一键生成英文讲稿。
      </p>

      {/* ===== 大信息框 ===== */}
      <div className="mt-7 card p-5 md:p-7">
        <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-rose-50 text-rose-500"><MessageSquareText size={15} /></span>
          会议基本信息
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">委员会</label>
            <input className="input" list="sp-cm" value={brief.committee} onChange={(e) => setField('committee', e.target.value)} placeholder="如 SOCHUM / Security Council" />
            <datalist id="sp-cm">{ALL_COMMITTEES.map((c) => <option key={c.id} value={c.en}>{c.name}</option>)}</datalist>
          </div>
          <div>
            <label className="label">代表国家</label>
            <input className="input" value={brief.country} onChange={(e) => setField('country', e.target.value)} placeholder="如 Bangladesh" />
          </div>
          <div>
            <label className="label">议题</label>
            <input className="input" value={brief.topic} onChange={(e) => setField('topic', e.target.value)} placeholder="如 climate refugees" />
          </div>
          <div>
            <label className="label">发言场合</label>
            <select className="input" value={brief.occasion} onChange={(e) => setField('occasion', e.target.value)}>
              {OCCASIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
          </div>
          {needSub && (
            <div className="md:col-span-2">
              <label className="label">磋商次主题 Sub-topic</label>
              <input className="input" value={brief.subtopic} onChange={(e) => setField('subtopic', e.target.value)} placeholder="如 funding mechanisms / legal status" />
            </div>
          )}
        </div>

        {/* 时长 */}
        <div className="mt-6">
          <label className="label flex items-center gap-1.5"><Clock size={14} /> 讲稿时长（决定篇幅与论点数量）</label>
          <div className="flex flex-wrap gap-2">
            {DURATIONS.map((d) => (
              <button key={d.id} onClick={() => setDuration(d.id)}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${duration === d.id ? 'bg-rose-500 text-white shadow-md shadow-rose-200' : 'border border-slate-200 bg-white text-slate-600 hover:border-rose-300'}`}>
                {d.label}
                <span className={`ml-1.5 text-[11px] font-normal ${duration === d.id ? 'text-rose-100' : 'text-slate-400'}`}>
                  {d.words[0]}-{d.words[1]}词 · ≤{d.maxPoints}论点
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 语气 */}
        <div className="mt-5">
          <label className="label">语气类型（参考联合国发言风格）</label>
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => (
              <button key={t.id} onClick={() => setTone(t.id)} title={t.desc}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${tone === t.id ? 'bg-slate-900 text-white shadow-md' : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-400'}`}>
                {t.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-400">{TONES.find((t) => t.id === tone)?.desc}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        {/* ===== 定基调 + AI推荐 + 已选论点 ===== */}
        <div className="lg:col-span-3 space-y-5">
          {/* 定基调：核心立场 / 结尾号召 */}
          <div className="card p-5">
            <h2 className="font-bold text-slate-900 flex items-center gap-2 mb-1">
              <Mic size={16} className="text-rose-500" /> 定基调：核心立场与结尾号召
            </h2>
            <p className="text-xs text-slate-400 mb-4">先定立场与号召，再据此挑选下方论点的具体方向。</p>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <label className="label !mb-0">核心立场（一句话）</label>
                  <button
                    className="btn-ghost !py-1 !text-xs"
                    disabled={keynoteBusy !== ''}
                    onClick={() => genKeynote('position')}>
                    {keynoteBusy === 'position'
                      ? <span className="flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> 生成中…</span>
                      : <span className="flex items-center gap-1"><Sparkles size={12} /> AI生成</span>}
                  </button>
                </div>
                <input
                  className="input"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="climate displaced persons deserve a binding legal protection status"
                />
              </div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <label className="label !mb-0">结尾号召（呼吁委员会做什么）</label>
                  <button
                    className="btn-ghost !py-1 !text-xs"
                    disabled={keynoteBusy !== ''}
                    onClick={() => genKeynote('cta')}>
                    {keynoteBusy === 'cta'
                      ? <span className="flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> 生成中…</span>
                      : <span className="flex items-center gap-1"><Sparkles size={12} /> AI生成</span>}
                  </button>
                </div>
                <input
                  className="input"
                  value={callToAction}
                  onChange={(e) => setCallToAction(e.target.value)}
                  placeholder="establish a dedicated response fund this session"
                />
              </div>

              {keynoteErr && <p className="text-xs text-rose-500">{keynoteErr}</p>}
            </div>
          </div>

          <div className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                <Sparkles size={16} className="text-gold-500" /> AI 论点推荐
              </h2>
              <div className="flex items-center gap-2">
                <button
                  className="btn-ghost !py-1.5 !text-xs"
                  onClick={() => { setDirOpen(!dirOpen); setPtsErr('') }}>
                  <RefreshCw size={12} /> 优化更新
                </button>
                <button className="btn-ghost !py-1.5 !text-xs" onClick={adoptAll} disabled={points.length >= durCfg.maxPoints}>
                  全部采用
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              {aiPts
                ? `已按你的方向定制 · ${suggestions.length} 条，当前时长最多 ${durCfg.maxPoints} 条`
                : `识别为「${CATEGORY_LABEL[cat]}」· 推荐 ${suggestions.length} 条，当前时长最多 ${durCfg.maxPoints} 条`}
            </p>

            {dirOpen && (
              <div className="mb-4 rounded-xl border border-gold-200 bg-gold-50/50 p-3.5">
                <p className="text-xs font-semibold text-slate-700 mb-2">
                  输入你想讲的方向，AI 将结合委员会、代表国家与议题重新生成论点
                </p>
                <textarea
                  className="input min-h-[68px] resize-y leading-6"
                  value={direction}
                  onChange={(e) => setDirection(e.target.value)}
                  placeholder="例如：强调我国作为低地国家受海平面上升的生存威胁，聚焦呼吁建立强制性气候移民安置基金"
                />
                {ptsErr && <p className="mt-1.5 text-xs text-rose-500">{ptsErr}</p>}
                <div className="mt-2.5 flex items-center gap-2">
                  <button
                    className="btn-primary !py-2 !text-xs"
                    disabled={ptsLoading}
                    onClick={genByDirection}>
                    {ptsLoading
                      ? <span className="flex items-center gap-1.5"><Loader2 size={13} className="animate-spin" /> 生成中…</span>
                      : <span className="flex items-center gap-1.5"><Sparkles size={13} /> AI 生成论点</span>}
                  </button>
                  <button className="btn-ghost !py-2 !text-xs" onClick={() => setDirOpen(false)}>
                    取消
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2.5">
              {suggestions.map((s, k) => {
                const adopted = points.some((p) => p.claim === s.claim)
                const full = points.length >= durCfg.maxPoints
                return (
                  <div key={k} className={`flex items-start gap-3 rounded-xl border p-3.5 transition ${adopted ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-200'}`}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 leading-6">{s.claim}.</p>
                      <p className="mt-0.5 text-[11px] text-slate-400">建议来源：{s.evidence}</p>
                    </div>
                    <button
                      onClick={() => adopt(s)}
                      disabled={adopted || full}
                      className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${adopted ? 'bg-emerald-100 text-emerald-600' : full ? 'bg-slate-100 text-slate-300' : 'bg-un-600 text-white hover:bg-un-700'}`}>
                      {adopted ? <span className="flex items-center gap-1"><Check size={12} />已采用</span> : '采用'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 已选论点可编辑 */}
          {points.length > 0 && (
            <div className="card p-5">
              <h2 className="font-bold text-slate-900 mb-3">已选论点（可修改，将直接用于生成）</h2>
              <div className="space-y-3">
                {points.map((p, k) => (
                  <div key={k} className="rounded-xl border border-slate-200 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="grid h-5 w-5 place-items-center rounded bg-rose-100 text-[11px] font-bold text-rose-600">{k + 1}</span>
                      <button onClick={() => setPoints(points.filter((_, i) => i !== k))} className="ml-auto text-slate-300 hover:text-rose-500">
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <input className="input mb-2" value={p.claim} onChange={(e) => editPoint(k, 'claim', e.target.value)} />
                    <input className="input" value={p.evidence} onChange={(e) => editPoint(k, 'evidence', e.target.value)} placeholder="证据来源" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card p-5">
            <button
              className="btn-primary w-full !py-3"
              disabled={!brief.country.trim() || points.length === 0}
              onClick={() =>
                setOut(genSpeechV2({ ...brief, duration, tone, position, callToAction, points }))
              }>
              <Wand2 size={16} /> 生成讲稿
            </button>
            {(!brief.country.trim() || points.length === 0) && (
              <p className="mt-2 text-center text-xs text-slate-400">
                填好代表国家并至少采用 1 条论点后可生成
              </p>
            )}
          </div>
        </div>

        {/* ===== 输出 ===== */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-24 card overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-3">
              {out ? (
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-semibold ${inRange ? 'text-emerald-600' : 'text-gold-600'}`}>
                    {words} 词 / 约 {seconds} 秒
                    <span className="ml-1.5 text-[11px] font-normal text-slate-400">
                      目标 {durCfg.words[0]}-{durCfg.words[1]}
                    </span>
                  </span>
                  <div className="flex gap-2">
                    <CopyButton text={out} />
                    <DownloadButton text={out} filename={`Speech-${brief.country || 'draft'}.txt`} label="下载" />
                  </div>
                </div>
              ) : (
                <span className="text-sm font-semibold text-slate-500">预览</span>
              )}
            </div>
            {out ? (
              <pre className="doc-preview max-h-[70vh] overflow-y-auto px-6 py-5 font-serif">{out}</pre>
            ) : (
              <div className="px-6 py-14 text-center text-sm text-slate-400 leading-6">
                <Plus size={24} className="mx-auto mb-3 text-rose-200" />
                填好信息、采用推荐论点后<br />点击生成
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
