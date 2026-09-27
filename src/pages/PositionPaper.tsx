import { useState } from 'react'
import { FileText, Wand2, Lightbulb, Sparkles, Loader2, Compass } from 'lucide-react'
import { genPositionPaper, countWords, type PPInput } from '../lib/gen'
import { CopyButton, DownloadButton } from '../components/IOButtons'
import { ALL_COMMITTEES } from '../data/committees2'
import { api } from '../lib/api'
import Markdown from '../components/Markdown'

const EMPTY: PPInput = {
  committee: '', conference: '', country: '', delegate: '', school: '', topic: '',
  bgData: '', pastActions: '', countryPolicy: '', officialQuote: '',
  solutions: ['', '', ''],
}

type SectionId = 'bgData' | 'pastActions' | 'countryPolicy' | 'officialQuote' | 'solution'

export default function PositionPaperPage() {
  const [f, setF] = useState<PPInput>(EMPTY)
  const [out, setOut] = useState('')
  const [loadingSec, setLoadingSec] = useState<SectionId | ''>('')
  const [tip, setTip] = useState('')
  const [direction, setDirection] = useState('')
  const [dirBusy, setDirBusy] = useState(false)
  const set = (k: keyof PPInput, v: string) => setF({ ...f, [k]: v })

  const genDirection = async () => {
    if (dirBusy) return
    setDirBusy(true)
    try {
      const { text } = await api.contentDirection({
        committee: f.committee, conference: f.conference, country: f.country, topic: f.topic,
      })
      setDirection(text)
    } catch (e) {
      setTip(String((e as Error).message))
    } finally {
      setDirBusy(false)
    }
  }

  const genSection = async (section: SectionId) => {
    if (loadingSec) return
    setTip('')
    setLoadingSec(section)
    try {
      const { text } = await api.ppSection(section, {
        committee: f.committee, conference: f.conference, country: f.country, topic: f.topic,
      })
      if (section === 'solution') {
        const arr = [...f.solutions]
        const idx = arr.findIndex((s) => !s.trim())
        if (idx >= 0) arr[idx] = text
        else arr.push(text)
        setF({ ...f, solutions: arr })
      } else {
        setF({ ...f, [section]: text })
      }
    } catch (e) {
      setTip(String((e as Error).message))
    } finally {
      setLoadingSec('')
    }
  }

  const SectionAI = ({ section }: { section: SectionId }) => (
    <button
      type="button"
      onClick={() => genSection(section)}
      disabled={!!loadingSec}
      className="inline-flex items-center gap-1 rounded-full bg-un-50 px-2.5 py-1 text-[11px] font-bold text-un-700 hover:bg-un-100 disabled:opacity-50"
      title="根据委员会、会议主题、代表国、议题一键生成"
    >
      {loadingSec === section ? <Loader2 size={11} className="animate-spin" /> : <Sparkles size={11} />}
      AI生成
    </button>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10 md:py-14">
      <h1 className="text-3xl md:text-4xl font-black text-slate-900 flex items-center gap-2.5">
        <FileText className="text-emerald-600" size={30} /> Position Paper 生成器
      </h1>
      <p className="mt-3 text-slate-500 max-w-2xl leading-7">
        填写会议与代表信息后，每个分区都可点「AI生成」一键产出，或自行填写——正文输出为符合三段式标准结构的英文立场文件。
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <div className="card p-5 md:p-6 space-y-4 h-fit">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">委员会</label>
              <input className="input" list="cm-list" value={f.committee} onChange={(e) => set('committee', e.target.value)} placeholder="SOCHUM" />
              <datalist id="cm-list">{ALL_COMMITTEES.map((c) => <option key={c.id} value={c.en}>{c.name}</option>)}</datalist>
            </div>
            <div>
              <label className="label">代表国家</label>
              <input className="input" value={f.country} onChange={(e) => set('country', e.target.value)} placeholder="Bangladesh" />
            </div>
            <div>
              <label className="label">代表姓名</label>
              <input className="input" value={f.delegate} onChange={(e) => set('delegate', e.target.value)} />
            </div>
            <div>
              <label className="label">学校（可选）</label>
              <input className="input" value={f.school} onChange={(e) => set('school', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label">会议主题（大会主题，可选）</label>
            <input className="input" value={f.conference} onChange={(e) => set('conference', e.target.value)} placeholder="例如：Multilateralism, Peace and Sustainable Development" />
          </div>
          <div>
            <label className="label">议题</label>
            <input className="input" value={f.topic} onChange={(e) => set('topic', e.target.value)} placeholder="The rights of climate refugees" />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="label !mb-0">① 现状背景（含数据+来源）</label>
              <SectionAI section="bgData" />
            </div>
            <textarea className="input min-h-[88px]" value={f.bgData} onChange={(e) => set('bgData', e.target.value)}
              placeholder="The UNHCR estimates that 21.5 million people are displaced by climate-related disasters each year (UNHCR, 2024)." />
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="label !mb-0">既往国际行动（决议/宪章）</label>
              <SectionAI section="pastActions" />
            </div>
            <textarea className="input min-h-[70px]" value={f.pastActions} onChange={(e) => set('pastActions', e.target.value)}
              placeholder="Recalling General Assembly resolution 46/182 and the Global Compact on Refugees..." />
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="label !mb-0">② 本国政策 / 立法</label>
              <SectionAI section="countryPolicy" />
            </div>
            <textarea className="input min-h-[70px]" value={f.countryPolicy} onChange={(e) => set('countryPolicy', e.target.value)}
              placeholder="Bangladesh enacted the Climate Change Trust Fund Act and leads the Climate Vulnerable Forum." />
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="label !mb-0">官方原话引用（可选）</label>
              <SectionAI section="officialQuote" />
            </div>
            <input className="input" value={f.officialQuote} onChange={(e) => set('officialQuote', e.target.value)}
              placeholder="We demand legally binding protection for climate displaced persons." />
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="label !mb-0">③ 建议方案（who/what/how）</label>
              <SectionAI section="solution" />
            </div>
            {f.solutions.map((s, k) => (
              <div key={k} className="mb-2 flex gap-2">
                <span className="mt-2.5 text-xs font-bold text-slate-400">{k + 1}.</span>
                <input className="input" value={s} onChange={(e) => {
                  const arr = [...f.solutions]
                  arr[k] = e.target.value
                  setF({ ...f, solutions: arr })
                }} placeholder="Establish a UN-administered climate displacement protection fund." />
              </div>
            ))}
          </div>

          {tip && <p className="text-xs text-gold-700 bg-gold-50 rounded px-3 py-2">⚠️ {tip}</p>}

          <button className="btn-primary w-full !py-3" onClick={() => setOut(genPositionPaper(f))}>
            <Wand2 size={16} /> 生成立场文件
          </button>
        </div>

        {/* Output */}
        <div className="lg:sticky lg:top-24 h-fit">
          {out ? (
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
                <span className="text-sm font-semibold text-slate-700">预览 · {countWords(out)} 词</span>
                <div className="flex gap-2">
                  <CopyButton text={out} />
                  <DownloadButton text={out} filename={`Position-Paper-${f.country || 'draft'}.txt`} label="下载TXT" />
                </div>
              </div>
              <pre className="doc-preview max-h-[70vh] overflow-y-auto px-6 py-5 font-serif">{out}</pre>
            </div>
          ) : (
            <div className="card p-10 text-center text-slate-400">
              <Lightbulb size={30} className="mx-auto mb-3 text-gold-400" />
              <p className="text-sm leading-6">填好会议信息，点击各分区的「AI生成」<br />最后一键生成完整立场文件</p>
            </div>
          )}
        </div>
      </div>

      {/* AI 内容方向：必须先填好委员会/代表国/会议主题/议题 */}
      {(() => {
        const missing = [
          !f.committee.trim() && '委员会',
          !f.country.trim() && '代表国家',
          !f.conference.trim() && '会议主题',
          !f.topic.trim() && '议题',
        ].filter(Boolean) as string[]
        const ready = missing.length === 0
        return (
          <div className="mt-8 card border-un-200 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                <Compass size={17} className="text-un-600" /> AI 内容方向
                <span className="text-[11px] font-normal text-slate-400">结合委员会职能 · 会议主题 · 代表国利益</span>
              </h2>
              <button
                className="btn-primary !py-2 disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={genDirection}
                disabled={dirBusy || !ready}
                title={ready ? '' : `请先填写：${missing.join('、')}`}
              >
                {dirBusy ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                {dirBusy ? '正在生成内容方向…' : direction ? '重新生成内容方向' : '一键生成内容方向'}
              </button>
            </div>
            {!ready && (
              <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
                🔒 请先在上方填好 <b className="text-slate-700">{missing.join('、')}</b>，才能生成贴切的内容方向。
              </p>
            )}
            {ready && direction && (
              <div className="doc-preview mt-4 rounded-xl bg-slate-50/70 px-5 py-4 text-sm leading-7">
                <Markdown text={direction} />
              </div>
            )}
          </div>
        )
      })()}
    </div>
  )
}
