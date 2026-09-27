import { useMemo, useState } from 'react'
import {
  ScrollText, Plus, Trash2, AlertTriangle, ChevronDown, ChevronRight, CornerDownRight, Info, Sparkles, Wand2, Loader2, ClipboardList,
} from 'lucide-react'
import {
  renderResolutionText, lintResolution, newClause,
  type ResDoc, type ResClause,
} from '../lib/gen'
import { PREAMBULATORY_PHRASES, OPERATIVE_PHRASES, OP_TONE, COMMITTEES } from '../data/munData'
import { ALL_COMMITTEES } from '../data/committees2'
import { CopyButton, DownloadButton } from '../components/IOButtons'
import { categorizeTopic, recommendResolution, CATEGORY_LABEL } from '../lib/recommend'
import { api } from '../lib/api'

const BODY_MAP: Record<string, string> = {
  'General Assembly': 'The General Assembly',
  DISEC: 'The General Assembly',
  ECOFIN: 'The General Assembly',
  SOCHUM: 'The General Assembly',
  SPECPOL: 'The General Assembly',
  ADMIN: 'The General Assembly',
  LEGAL: 'The General Assembly',
  UNSC: 'The Security Council',
  ECOSOC: 'The Economic and Social Council',
  HRC: 'The Human Rights Council',
  WHA: 'The World Health Assembly',
  UNEA: 'The United Nations Environment Assembly',
  CSW: 'The Commission on the Status of Women',
}

const INIT: ResDoc = {
  body: 'The General Assembly',
  committee: 'General Assembly Third Committee (SOCHUM)',
  conference: '',
  sponsors: '', signatories: '', topic: '',
  preamb: [newClause('Recalling'), newClause('Recognizing')],
  oper: [newClause('Requests')],
}

export default function DraftResolutionPage() {
  const [d, setD] = useState<ResDoc>(INIT)
  const [notes, setNotes] = useState('')
  const [notesBusy, setNotesBusy] = useState(false)
  const [notesTip, setNotesTip] = useState('')
  const [tab, setTab] = useState<'preview' | 'text'>('preview')
  const update = (patch: Partial<ResDoc>) => setD({ ...d, ...patch })

  const errs = lintResolution(d)

  // PP helpers
  const setPP = (arr: ResClause[]) => update({ preamb: arr })
  // OP helpers（递归更新）
  const setOP = (arr: ResClause[]) => update({ oper: arr })

  // ===== 智能推荐：根据委员会/议题/起草国 =====
  const cat = useMemo(() => categorizeTopic(d.topic, d.committee), [d.topic, d.committee])
  const rec = useMemo(() => recommendResolution(cat), [cat])

  const mergeClauses = (
    existing: ResClause[],
    suggestions: { phrase: string; text: string }[],
  ): ResClause[] => {
    const out = [...existing]
    for (const s of suggestions) {
      const dup = out.some((c) => c.phrase === s.phrase && c.text === s.text)
      if (!dup) {
        const c = newClause(s.phrase)
        c.text = s.text
        out.push(c)
      }
    }
    return out
  }
  const applyPPRec = () => setPP(mergeClauses(d.preamb, rec.preamb))
  const applyOPRec = () => setOP(mergeClauses(d.oper, rec.oper))
  const applyAllRec = () => {
    setD({
      ...d,
      preamb: mergeClauses(d.preamb, rec.preamb),
      oper: mergeClauses(d.oper, rec.oper),
    })
  }

  // ===== 核心概括 → AI 整理为完整决议草案 =====
  const notesToResolution = async () => {
    if (notesBusy) return
    if (notes.trim().length < 10) {
      setNotesTip('请先写下决议草案的核心内容概括（至少 10 个字）。')
      return
    }
    setNotesBusy(true)
    setNotesTip('')
    try {
      const { data } = await api.notesToResolution(notes, {
        committee: d.committee, conference: d.conference, country: d.sponsors, topic: d.topic,
      })
      const preamb = data.preamb.map((p) => {
        const c = newClause(p.phrase)
        c.text = p.text
        return c
      })
      const oper = data.oper.map((p) => {
        const c = newClause(p.phrase)
        c.text = p.text
        c.children = (p.children || []).map((ch) => {
          const cc = newClause(ch.phrase)
          cc.text = ch.text
          return cc
        })
        return c
      })
      setD({
        ...d,
        topic: d.topic || data.title,
        preamb,
        oper,
      })
      setNotesTip('✅ 已整理生成完整草案，可在下方继续逐条编辑。')
    } catch (e) {
      setNotesTip(String((e as Error).message))
    } finally {
      setNotesBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10 md:py-14">
      <h1 className="text-3xl md:text-4xl font-black text-slate-900 flex items-center gap-2.5">
        <ScrollText className="text-gold-500" size={30} /> Draft Resolution 构建器
      </h1>
      <p className="mt-3 text-slate-500 max-w-2xl leading-7">
        交互式添加序言性 / 执行性条款与子条款，自动编号排版（PP 短语斜体、OP 动词下划线），一键导出符合 UNA-USA 格式的文本。
      </p>

      {/* Heading */}
      <div className="mt-8 card p-5 md:p-6">
        <h2 className="font-bold text-slate-900 mb-4">文件抬头 Heading</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">委员会</label>
            <input
              className="input" list="dr-cm" value={d.committee}
              onChange={(e) => update({ committee: e.target.value })}
            />
            <datalist id="dr-cm">
              {ALL_COMMITTEES.map((c) => (
                <option key={c.id} value={c.en}>
                  {c.name}
                </option>
              ))}
            </datalist>
          </div>
          <div>
            <label className="label">开场机构（正文首行）</label>
            <input className="input" value={d.body} onChange={(e) => update({ body: e.target.value })} />
          </div>
          <div>
            <label className="label">Sponsors 起草国（逗号分隔）</label>
            <input className="input" value={d.sponsors} onChange={(e) => update({ sponsors: e.target.value })} placeholder="Bangladesh, Senegal" />
          </div>
          <div>
            <label className="label">Signatories 附议国</label>
            <input className="input" value={d.signatories} onChange={(e) => update({ signatories: e.target.value })} placeholder="Germany, Brazil, Japan..." />
          </div>
          <div className="md:col-span-2">
            <label className="label">会议主题（大会主题，可选）</label>
            <input className="input" value={d.conference} onChange={(e) => update({ conference: e.target.value })} placeholder="Multilateralism, Peace and Sustainable Development" />
          </div>
          <div className="md:col-span-2">
            <label className="label">议题 Topic</label>
            <input className="input" value={d.topic} onChange={(e) => update({ topic: e.target.value })} placeholder="The protection of climate displaced persons" />
          </div>
        </div>
      </div>

      {/* ===== AI 条款推荐 ===== */}
      <div className="mt-6 rounded-2xl border border-gold-200 bg-gradient-to-br from-gold-50 to-white p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <h2 className="font-bold text-slate-900 flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gold-100 text-gold-700"><Sparkles size={16} /></span>
            AI 条款推荐 · {CATEGORY_LABEL[cat]}
          </h2>
          <button className="btn-primary !bg-gold-600 hover:!bg-gold-700 !py-2.5" onClick={applyAllRec}>
            <Wand2 size={15} /> 一键套用全部推荐
          </button>
        </div>
        <p className="text-sm text-slate-600 leading-6 max-w-3xl">{rec.rationale}</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900">推荐序言条款（{rec.preamb.length}）</h3>
              <button className="text-xs font-semibold text-un-700 hover:underline" onClick={applyPPRec}>添加到下方</button>
            </div>
            <ul className="space-y-2">
              {rec.preamb.map((p, k) => (
                <li key={k} className="text-xs leading-5 text-slate-600">
                  <em className="italic font-semibold text-slate-800">{p.phrase}</em> {p.text}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900">推荐执行条款（{rec.oper.length}）</h3>
              <button className="text-xs font-semibold text-un-700 hover:underline" onClick={applyOPRec}>添加到下方</button>
            </div>
            <ul className="space-y-2">
              {rec.oper.map((p, k) => (
                <li key={k} className="text-xs leading-5 text-slate-600">
                  <u className="underline font-semibold text-slate-800">{p.phrase}</u> {p.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Editors */}
        <div className="space-y-6">
          {/* 核心内容概括 → AI 整理为完整决议 */}
          <div className="card border-un-200 p-5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                <ClipboardList size={17} className="text-un-600" /> 核心内容概括
              </h2>
              <span className="text-[11px] text-slate-400">用大白话写即可</span>
            </div>
            <p className="text-xs text-slate-500 mb-3 leading-5">
              写下你希望决议涵盖的核心内容：背景关切、依据、要谁做什么、资金/机制等。AI 会整理为规范的序言性条款与执行性条款，生成完整草案（将替换下方条款）。
            </p>
            <textarea
              className="input min-h-[130px]"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                '例如：小岛屿国家因海平面上升面临生存威胁；依据《联合国宪章》和安理会相关决议；\n1. 要求建立气候流离失所者保护基金，由发达国家出资、UNHCR管理；\n2. 请秘书长每年向大会报告；3. 鼓励各国完善国内立法……'
              }
            />
            <button className="btn-primary w-full mt-3 !py-3" onClick={notesToResolution} disabled={notesBusy}>
              {notesBusy
                ? <><Loader2 size={15} className="animate-spin" /> AI 正在整理为决议草案…</>
                : <><Wand2 size={15} /> AI 整理成决议草案</>}
            </button>
            {notesTip && (
              <p className={`mt-2.5 rounded px-3 py-2 text-xs ${notesTip.startsWith('✅') ? 'bg-emerald-50 text-emerald-700' : 'bg-gold-50 text-gold-700'}`}>
                {notesTip}
              </p>
            )}
          </div>

          {/* Preambulatory */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-bold text-slate-900">序言性条款 Preambulatory</h2>
              <span className="text-xs text-slate-400">斜体 · 逗号结尾 · 不编号</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">说明「为什么」：宪章依据、既往决议、现状关切</p>
            <div className="space-y-3">
              {d.preamb.map((c, k) => (
                <ClauseRow
                  key={c.id} clause={c} phrases={PREAMBULATORY_PHRASES}
                  onPhrase={(p) => { const a = [...d.preamb]; a[k] = { ...c, phrase: p }; setPP(a) }}
                  onText={(t) => { const a = [...d.preamb]; a[k] = { ...c, text: t }; setPP(a) }}
                  onDel={() => setPP(d.preamb.filter((_, i) => i !== k))}
                />
              ))}
            </div>
            <button className="btn-ghost mt-3 w-full" onClick={() => setPP([...d.preamb, newClause('Noting')])}>
              <Plus size={15} /> 添加序言条款
            </button>
          </div>

          {/* Operative */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-bold text-slate-900">执行性条款 Operative</h2>
              <span className="text-xs text-slate-400">下划线 · 分号结尾 · 自动编号</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">提出「做什么」：具体、可执行、含 5W1H</p>
            <OperEditor clauses={d.oper} onChange={setOP} depth={0} path={[]} />
            <button className="btn-ghost mt-3 w-full" onClick={() => setOP([...d.oper, newClause('Urges')])}>
              <Plus size={15} /> 添加执行条款
            </button>
          </div>

          {errs.length > 0 && (
            <div className="card border-gold-200 bg-gold-50 p-4">
              <h3 className="text-sm font-bold text-gold-800 flex items-center gap-1.5 mb-2">
                <AlertTriangle size={15} /> 待完善（{errs.length}）
              </h3>
              <ul className="space-y-1 text-xs text-gold-800">
                {errs.map((e, k) => <li key={k}>• {e}</li>)}
              </ul>
            </div>
          )}
        </div>

        {/* Live render */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
              <div className="flex gap-1">
                {(['preview', 'text'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${tab === t ? 'bg-un-50 text-un-700' : 'text-slate-500 hover:bg-slate-100'}`}
                  >
                    {t === 'preview' ? '排版预览' : '纯文本'}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <CopyButton text={renderResolutionText(d)} />
                <DownloadButton text={renderResolutionText(d)} filename="Draft-Resolution.txt" label="导出" />
              </div>
            </div>
            {tab === 'preview' ? (
              <div className="max-h-[72vh] overflow-y-auto px-7 py-6 doc-preview font-serif">
                <p className="text-center"><b>Committee:</b> {d.committee}</p>
                {d.conference && <p className="text-center"><b>Conference:</b> {d.conference}</p>}
                <p className="text-center"><b>Sponsors:</b> {d.sponsors}</p>
                <p className="text-center"><b>Signatories:</b> {d.signatories}</p>
                <p className="text-center"><b>Topic:</b> {d.topic}</p>
                <p className="mt-4">{d.body},</p>
                {d.preamb.map((p) => (
                  <p key={p.id} className="!my-1 pl-12">
                    <em className="italic">{p.phrase}</em>{p.text ? ` ${p.text}` : <span className="text-slate-300"> [内容]</span>},
                  </p>
                ))}
                <div className="mt-3">
                  <OperRender clauses={d.oper} depth={0} />
                </div>
              </div>
            ) : (
              <pre className="doc-preview max-h-[72vh] overflow-y-auto px-6 py-5">{renderResolutionText(d)}</pre>
            )}
          </div>
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-un-50 px-4 py-3 text-xs text-un-800 leading-5">
            <Info size={14} className="mt-0.5 shrink-0" />
            语气梯度：Requests（中性）&lt; Calls upon &lt; Urges &lt; Demands（安理会级罕用）；
            谴责：Deplores → Condemns → Strongly condemns。
          </div>
        </div>
      </div>
    </div>
  )
}

// ============ 短语选择行 ============
function ClauseRow({
  clause, phrases, onPhrase, onText, onDel,
}: {
  clause: ResClause
  phrases: string[]
  onPhrase: (p: string) => void
  onText: (t: string) => void
  onDel: () => void
}) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const filtered = phrases.filter((p) => p.toLowerCase().includes(q.toLowerCase()))
  const tone = OP_TONE[clause.phrase]
  return (
    <div className="rounded-xl border border-slate-200 p-3">
      <div className="flex items-center gap-2">
        <div className="relative w-48 shrink-0">
          <button
            onClick={() => setOpen(!open)}
            className="flex w-full items-center justify-between rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-200"
          >
            {clause.phrase}
            <ChevronDown size={14} className="text-slate-400" />
          </button>
          {open && (
            <div className="absolute z-30 mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
              <input autoFocus className="input !py-1.5 mb-1.5" placeholder="搜索…" value={q} onChange={(e) => setQ(e.target.value)} />
              <div className="max-h-44 overflow-y-auto">
                {filtered.map((p) => (
                  <button
                    key={p}
                    onClick={() => { onPhrase(p); setOpen(false); setQ('') }}
                    className="block w-full rounded px-2 py-1.5 text-left text-sm hover:bg-un-50 hover:text-un-700"
                  >
                    {p}
                  </button>
                ))}
                {!filtered.length && <p className="px-2 py-2 text-xs text-slate-400">无匹配</p>}
              </div>
            </div>
          )}
        </div>
        <button onClick={onDel} className="ml-auto text-slate-300 hover:text-rose-500 transition">
          <Trash2 size={16} />
        </button>
      </div>
      <input
        className="input mt-2" value={clause.text}
        onChange={(e) => onText(e.target.value)}
        placeholder="条款内容（具体、完整成句）"
      />
      {tone && <p className="mt-1 text-[11px] text-slate-400">语气：{tone}</p>}
    </div>
  )
}

// ============ OP 递归编辑器 ============
function OperEditor({
  clauses, onChange, depth,
}: {
  clauses: ResClause[]
  onChange: (c: ResClause[]) => void
  depth: number
  path: number[]
}) {
  const updateOne = (k: number, patch: Partial<ResClause>) =>
    onChange(clauses.map((c, i) => (i === k ? { ...c, ...patch } : c)))

  return (
    <div className={depth === 0 ? '' : 'ml-5 border-l border-slate-200 pl-3'}>
      {clauses.map((c, k) => (
        <div key={c.id} className="mb-3">
          <div className="flex items-start gap-2">
            {depth > 0 && <CornerDownRight size={14} className="mt-3 text-slate-300" />}
            <div className="flex-1">
              <ClauseRow
                clause={c} phrases={OPERATIVE_PHRASES}
                onPhrase={(p) => updateOne(k, { phrase: p })}
                onText={(t) => updateOne(k, { text: t })}
                onDel={() => onChange(clauses.filter((_, i) => i !== k))}
              />
              {depth < 2 && (
                <button
                  className="mt-1.5 text-[11px] font-medium text-un-600 flex items-center gap-1 hover:gap-2 transition-all"
                  onClick={() =>
                    updateOne(k, { children: [...c.children, newClause(depth === 0 ? 'Further requests' : 'including')] })
                  }
                >
                  <Plus size={12} /> 添加子条款 ({depth === 0 ? 'a/b' : 'i/ii'})
                </button>
              )}
              {c.children.length > 0 && (
                <OperEditor
                  clauses={c.children} depth={depth + 1} path={[]}
                  onChange={(ch) => updateOne(k, { children: ch })}
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ============ OP HTML 渲染 ============
const LETTER = (n: number) => `${String.fromCharCode(97 + n)})`
const ROMAN = (n: number) => `${['i','ii','iii','iv','v','vi'][n] || n + 1})`

function OperRender({ clauses, depth }: { clauses: ResClause[]; depth: number }) {
  return (
    <div>
      {clauses.map((c, k) => {
        const num = depth === 0 ? `${k + 1}.` : depth === 1 ? LETTER(k) : ROMAN(k)
        return (
          <div key={c.id}>
            <p className="!my-1 flex gap-2" style={{ paddingLeft: depth === 0 ? 0 : depth === 1 ? 28 : 56 }}>
              <span className="shrink-0">{num}</span>
              <span>
                <u className="underline">{c.phrase}</u>{c.text ? ` ${c.text}` : <span className="text-slate-300"> [内容]</span>}
                {c.children.length === 0 && (depth === 0 ? (k === clauses.length - 1 ? '.' : ';') : ';')}
              </span>
            </p>
            {c.children.length > 0 && <OperRender clauses={c.children} depth={depth + 1} />}
          </div>
        )
      })}
    </div>
  )
}

// 消除未使用导入警告
void ChevronRight
