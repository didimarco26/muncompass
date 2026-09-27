import { useMemo, useState, type ReactNode } from 'react'
import {
  ScrollText, Plus, Trash2, AlertTriangle, ChevronDown, CornerDownRight, Info, Sparkles, Wand2, Loader2, ClipboardList, CheckCircle2,
} from 'lucide-react'
import {
  renderResolutionText, lintResolution, newClause,
  type ResDoc, type ResClause,
} from '../lib/gen'
import { PREAMBULATORY_PHRASES, OPERATIVE_PHRASES, OP_TONE } from '../data/munData'
import { ALL_COMMITTEES } from '../data/committees2'
import { CopyButton, DownloadButton } from '../components/IOButtons'
import { categorizeTopic, recommendResolution, CATEGORY_LABEL } from '../lib/recommend'
import { api, type ResolutionJSON } from '../lib/api'

const INIT: ResDoc = {
  body: 'The General Assembly',
  committee: 'General Assembly Third Committee (SOCHUM)',
  conference: '',
  sponsors: '', signatories: '', topic: '',
  preamb: [newClause('Recalling'), newClause('Recognizing')],
  oper: [newClause('Requests')],
}

function jsonToClauses(data: ResolutionJSON): { preamb: ResClause[]; oper: ResClause[] } {
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
  return { preamb, oper }
}

export default function DraftResolutionPage() {
  const [d, setD] = useState<ResDoc>(INIT)
  const update = (patch: Partial<ResDoc>) => setD({ ...d, ...patch })
  const errs = lintResolution(d)

  const setPP = (arr: ResClause[]) => update({ preamb: arr })
  const setOP = (arr: ResClause[]) => update({ oper: arr })

  // 议题归类 → 推荐条款
  const cat = useMemo(() => categorizeTopic(d.topic, d.committee), [d.topic, d.committee])
  const rec = useMemo(() => recommendResolution(cat), [cat])

  const mergeClauses = (existing: ResClause[], suggestions: { phrase: string; text: string }[]) => {
    const out = [...existing]
    for (const s of suggestions) {
      if (!out.some((c) => c.text.trim() === s.text.trim())) {
        const c = newClause(s.phrase)
        c.text = s.text
        out.push(c)
      }
    }
    return out
  }

  // AI 状态
  const [notes, setNotes] = useState('')
  const [instruction, setInstruction] = useState('')
  const [busy, setBusy] = useState<'' | 'gen' | 'refine' | 'recpp' | 'recop'>('')
  const [tip, setTip] = useState<{ kind: 'ok' | 'warn'; text: string } | null>(null)
  const [tab, setTab] = useState<'preview' | 'text'>('preview')

  const applyAI = async (
    kind: 'gen' | 'refine',
    fn: () => Promise<ResolutionJSON>,
    okText: string,
  ) => {
    if (busy) return
    setBusy(kind)
    setTip(null)
    try {
      const data = (await fn())
      const { preamb, oper } = jsonToClauses(data)
      setD((cur) => ({ ...cur, preamb, oper, topic: cur.topic || data.title }))
      setTip({ kind: 'ok', text: okText })
    } catch (e) {
      setTip({ kind: 'warn', text: String((e as Error).message) })
    } finally {
      setBusy('')
    }
  }

  const ctx = {
    committee: d.committee, conference: d.conference, country: d.sponsors, topic: d.topic,
  }

  const addRecommended = (which: 'recpp' | 'recop') => {
    if (which === 'recpp') setPP(mergeClauses(d.preamb, rec.preamb))
    else setOP(mergeClauses(d.oper, rec.oper))
  }

  return (
    <div className="mx-auto max-w-4xl px-4 md:px-6 py-10 md:py-14">
      <h1 className="text-3xl md:text-4xl font-black text-slate-900 flex items-center gap-2.5">
        <ScrollText className="text-sky-600" size={30} /> Draft Resolution 构建器
      </h1>
      <p className="mt-3 text-slate-500 leading-7">
        按顺序完成五步：写抬头 → 编序言性条款 → 编执行性条款 → AI 全文生成/优化 → 查看生成效果。
      </p>

      {/* ===== 第 1 步：文件抬头 ===== */}
      <Step n={1} title="文件抬头 Heading" desc="确定议事机构、起草国与议题" className="mt-8">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="label">委员会 Committee</label>
            <input className="input" list="cm-list" value={d.committee}
              onChange={(e) => {
                const v = e.target.value
                update({ committee: v })
              }} />
            <datalist id="cm-list">
              {ALL_COMMITTEES.map((c) => <option key={c.id} value={c.en}>{c.name}</option>)}
            </datalist>
          </div>
          <div>
            <label className="label">会议主题（大会主题，可选）</label>
            <input className="input" value={d.conference} onChange={(e) => update({ conference: e.target.value })} placeholder="Multilateralism and Sustainable Development" />
          </div>
          <div>
            <label className="label">Sponsors 起草国</label>
            <input className="input" value={d.sponsors} onChange={(e) => update({ sponsors: e.target.value })} placeholder="Germany, France..." />
          </div>
          <div>
            <label className="label">Signatories 附议国</label>
            <input className="input" value={d.signatories} onChange={(e) => update({ signatories: e.target.value })} placeholder="Brazil, Japan..." />
          </div>
          <div className="md:col-span-2">
            <label className="label">议题 Topic</label>
            <input className="input" value={d.topic} onChange={(e) => update({ topic: e.target.value })} placeholder="The protection of climate displaced persons" />
          </div>
        </div>
      </Step>

      {/* ===== 第 2 步：序言性条款 ===== */}
      <Step n={2} title="序言性条款 Preambulatory Clauses" desc="说明「为什么」：依据、既往行动、现状关切；斜体 · 逗号结尾 · 不编号">
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg bg-sky-50 px-3 py-2.5">
          <Sparkles size={14} className="text-sky-600" />
          <span className="text-xs text-sky-800">
            AI 按议题「{CATEGORY_LABEL[cat]}」推荐了 {rec.preamb.length} 条序言性条款
          </span>
          <button className="ml-auto rounded-full bg-sky-600 px-3 py-1 text-[11px] font-bold text-white hover:bg-sky-700 disabled:opacity-50"
            onClick={() => addRecommended('recpp')} disabled={!!busy}>
            添加推荐条款
          </button>
        </div>
        <div className="space-y-3">
          {d.preamb.map((c, k) => (
            <ClauseRow key={c.id} clause={c} phrases={PREAMBULATORY_PHRASES}
              onPhrase={(p) => { const a = [...d.preamb]; a[k] = { ...c, phrase: p }; setPP(a) }}
              onText={(t) => { const a = [...d.preamb]; a[k] = { ...c, text: t }; setPP(a) }}
              onDel={() => setPP(d.preamb.filter((_, i) => i !== k))} />
          ))}
        </div>
        <button className="btn-ghost mt-3 w-full" onClick={() => setPP([...d.preamb, newClause('Noting')])}>
          <Plus size={15} /> 添加序言条款
        </button>
      </Step>

      {/* ===== 第 3 步：执行性条款 ===== */}
      <Step n={3} title="执行性条款 Operative Clauses" desc="提出「做什么」：具体可执行、含 5W1H；下划线 · 分号结尾 · 自动编号">
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg bg-sky-50 px-3 py-2.5">
          <Sparkles size={14} className="text-sky-600" />
          <span className="text-xs text-sky-800">
            AI 按议题「{CATEGORY_LABEL[cat]}」推荐了 {rec.oper.length} 条执行性条款
          </span>
          <button className="ml-auto rounded-full bg-sky-600 px-3 py-1 text-[11px] font-bold text-white hover:bg-sky-700 disabled:opacity-50"
            onClick={() => addRecommended('recop')} disabled={!!busy}>
            添加推荐条款
          </button>
        </div>
        <OperEditor clauses={d.oper} onChange={setOP} depth={0} />
        <button className="btn-ghost mt-3 w-full" onClick={() => setOP([...d.oper, newClause('Urges')])}>
          <Plus size={15} /> 添加执行条款
        </button>
      </Step>

      {/* ===== 第 4 步：AI 全文生成 / 优化 ===== */}
      <Step n={4} title="AI 全文生成 / 优化" desc="把核心想法交给 AI 成文，或让 AI 润色当前草案">
        {/* 4a 核心概括 → 全文 */}
        <div className="rounded-xl border border-sky-200 bg-sky-50/40 p-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList size={15} className="text-sky-600" /> 核心内容概括 → AI 生成全文
          </h3>
          <p className="mt-1 text-xs text-slate-500 leading-5">
            用大白话写下决议要涵盖的内容（背景、依据、要谁做什么、资金/机制等），AI 将其整理为完整规范的决议草案（会替换第 2、3 步的条款）。
          </p>
          <textarea className="input mt-2.5 min-h-[110px]" value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder={'例如：小岛屿国家因海平面上升面临生存威胁；依据《宪章》和安理会决议；\n1. 建立气候流离失所者保护基金，发达国家出资、UNHCR管理；\n2. 请秘书长每年报告；3. 鼓励各国完善国内立法……'} />
          <button className="btn-primary w-full mt-3 !py-2.5"
            disabled={!!busy || notes.trim().length < 10}
            onClick={() => applyAI('gen',
              () => api.notesToResolution(notes, ctx).then((r) => r.data),
              '✅ 已根据核心概括生成完整决议草案，可回到第 2、3 步微调。')}>
            {busy === 'gen' ? <Loader2 size={15} className="animate-spin" /> : <Wand2 size={15} />}
            {busy === 'gen' ? 'AI 正在生成全文…' : 'AI 生成决议全文'}
          </button>
        </div>

        {/* 4b 优化当前草案 */}
        <div className="mt-4 rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles size={15} className="text-sky-600" /> AI 优化当前草案
          </h3>
          <p className="mt-1 text-xs text-slate-500 leading-5">
            AI 会补全条款、理顺逻辑、统一格式与措辞，保留你的核心意图。也可以填写具体修改要求。
          </p>
          <input className="input mt-2.5" value={instruction} onChange={(e) => setInstruction(e.target.value)}
            placeholder="修改要求（可选），例如：增加对小岛屿国家的资金援助条款，语气更强硬" />
          <button className="btn-primary w-full mt-3 !py-2.5"
            disabled={!!busy}
            onClick={() => applyAI('refine',
              () => api.refineResolution(renderResolutionText(d), instruction, ctx).then((r) => r.data),
              '✅ AI 已优化全文，可在第 2、3 步查看优化结果。')}>
            {busy === 'refine' ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
            {busy === 'refine' ? 'AI 正在优化…' : 'AI 一键优化当前草案'}
          </button>
        </div>
      </Step>

      {/* ===== 第 5 步：生成效果 ===== */}
      <Step n={5} title="生成效果 Result" desc="排版预览、复制与导出">
        {errs.length > 0 && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <h3 className="text-sm font-bold text-amber-800 flex items-center gap-1.5 mb-2">
              <AlertTriangle size={15} /> 待完善（{errs.length}）
            </h3>
            <ul className="space-y-1 text-xs text-amber-800">
              {errs.map((e, k) => <li key={k}>• {e}</li>)}
            </ul>
          </div>
        )}
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
            <div className="flex gap-1">
              {(['preview', 'text'] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${tab === t ? 'bg-sky-50 text-sky-700' : 'text-slate-500 hover:bg-slate-100'}`}>
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
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-sky-50 px-4 py-3 text-xs text-sky-800 leading-5">
          <Info size={14} className="mt-0.5 shrink-0" />
          语气梯度：Requests（中性）&lt; Calls upon &lt; Urges &lt; Demands（安理会级罕用）；谴责：Deplores → Condemns → Strongly condemns。
        </div>
      </Step>

      {tip && (
        <div className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-lg ${
          tip.kind === 'ok' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'}`}>
          {tip.text}
        </div>
      )}
    </div>
  )
}

// ============ 步骤容器 ============
function Step({
  n, title, desc, children, className,
}: {
  n: number
  title: string
  desc: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`card mt-6 p-5 md:p-6 ${className || ''}`}>
      <div className="flex items-start gap-3 mb-5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sky-600 text-sm font-black text-white">
          {n}
        </span>
        <div>
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
        </div>
      </div>
      {children}
    </section>
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
                    className="block w-full rounded px-2 py-1.5 text-left text-sm hover:bg-sky-50 hover:text-sky-700"
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
                  className="mt-1.5 text-[11px] font-medium text-sky-600 flex items-center gap-1 hover:gap-2 transition-all"
                  onClick={() =>
                    updateOne(k, { children: [...c.children, newClause(depth === 0 ? 'Further requests' : 'including')] })
                  }
                >
                  <Plus size={12} /> 添加子条款 ({depth === 0 ? 'a/b' : 'i/ii'})
                </button>
              )}
              {c.children.length > 0 && (
                <OperEditor
                  clauses={c.children} depth={depth + 1}
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
