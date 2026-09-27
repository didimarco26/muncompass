import { useEffect, useRef, useState } from 'react'
import {
  MessagesSquare, Send, Bot, User, Loader2, Wifi, ExternalLink,
} from 'lucide-react'
import Markdown from '../components/Markdown'
import { api, type WebResult } from '../lib/api'

export interface MunContext {
  topic: string
  country: string
  committee: string
}

const SUGGESTIONS = [
  '请告诉我这个议题的最新进展',
  '怎么查这个议题的资料？',
  '立场文件怎么写？',
  '决议草案格式是什么？',
  'GSL发言怎么安排结构？',
]

interface Msg {
  role: 'user' | 'assistant'
  content: string
  sources?: WebResult[]
}

export default function ChatPage({ ctx, setCtx }: { ctx: MunContext; setCtx: (c: MunContext) => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: 'assistant',
      content:
        '🕊️ 你好，我是你的 MUN 学术教练。先在上方告诉我「议题 + 代表国 + 委员会」，然后可以问我任何问题——**我会实时联网检索 UN News 与全网最新信息后回答**，并附上来源链接。',
    },
  ])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, busy])

  const send = async (text: string) => {
    const q = text.trim()
    if (!q || busy) return
    const nextMsgs = [...msgs, { role: 'user' as const, content: q }]
    setMsgs(nextMsgs)
    setInput('')
    setBusy(true)
    try {
      const { answer, sources } = await api.chat(
        nextMsgs.map((m) => ({ role: m.role, content: m.content })),
        ctx,
      )
      setMsgs([...nextMsgs, { role: 'assistant', content: answer, sources }])
    } catch (e) {
      setMsgs([
        ...nextMsgs,
        {
          role: 'assistant',
          content: `⚠️ ${String((e as Error).message)}。请稍后重试，或先到「议题材料检索」页查看权威信源。`,
        },
      ])
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10 md:py-14">
      <div className="flex items-center gap-2 text-un-700 text-sm font-medium mb-2">
        <Wifi size={15} /> 已接入实时联网检索 · UN News / 全网
      </div>
      <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">AI 学术教练</h1>
      <p className="mt-3 text-slate-500 max-w-2xl leading-7">
        每轮提问都会实时联网，结合你的议题、代表国与委员会给出有来源的建议。
      </p>

      {/* 上下文栏 */}
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <label className="block">
          <span className="text-xs font-semibold text-slate-500">议题 Topic</span>
          <input className="input mt-1" value={ctx.topic} onChange={(e) => setCtx({ ...ctx, topic: e.target.value })} placeholder="例如：climate change and security" />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-slate-500">代表国 Country</span>
          <input className="input mt-1" value={ctx.country} onChange={(e) => setCtx({ ...ctx, country: e.target.value })} placeholder="例如：Germany" />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-slate-500">委员会 Committee</span>
          <input className="input mt-1" value={ctx.committee} onChange={(e) => setCtx({ ...ctx, committee: e.target.value })} placeholder="例如：Security Council" />
        </label>
      </div>

      {/* 对话区 */}
      <div className="mt-6 card overflow-hidden">
        <div ref={scrollRef} className="max-h-[560px] min-h-[380px] overflow-y-auto bg-slate-50/60 p-5 space-y-5">
          {msgs.map((m, k) => (
            <div key={k} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${m.role === 'user' ? 'bg-un-600 text-white' : 'bg-white border border-slate-200 text-un-700'}`}>
                {m.role === 'user' ? <User size={16} /> : <Bot size={17} />}
              </div>
              <div className={`min-w-0 max-w-[85%] rounded-2xl px-4 py-3 ${m.role === 'user' ? 'bg-un-600 text-white' : 'bg-white border border-slate-200'}`}>
                <div className="text-sm leading-7 doc-preview">
                  <Markdown text={m.content} />
                </div>
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-3 border-t border-slate-100 pt-3">
                    <div className="text-[11px] font-bold text-slate-400 mb-1.5">📎 参考来源（实时联网）</div>
                    <div className="flex flex-wrap gap-1.5">
                      {m.sources.map((s) => (
                        <a key={s.url} href={s.url} target="_blank" className="inline-flex items-center gap-1 rounded-full bg-un-50 px-2.5 py-1 text-[11px] font-semibold text-un-700 hover:bg-un-100">
                          {s.title.slice(0, 34)} <ExternalLink size={10} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {busy && (
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white border border-slate-200 text-un-700">
                <Bot size={17} />
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <Loader2 size={15} className="animate-spin text-un-600" />
                  正在联网检索并组织答案，约需 30–90 秒…
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 输入区 */}
        <div className="border-t border-slate-100 bg-white p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} className="chip" onClick={() => send(s)} disabled={busy}>{s}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send(input)}
              placeholder="问我任何关于议题、文件、议事规则的问题…"
            />
            <button className="btn-primary px-5" onClick={() => send(input)} disabled={busy || !input.trim()}>
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
        <MessagesSquare size={13} /> AI 生成内容可能有误，关键文件号、数据与引述请对照官方源核实。
      </div>
    </div>
  )
}
