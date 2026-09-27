import { useMemo, type ReactNode } from 'react'

// 极简 Markdown 渲染（支持 **bold**、`code`、段落、列表）
export default function Markdown({ text }: { text: string }) {
  const blocks = useMemo(() => parseBlocks(text), [text])
  return <div className="space-y-2.5">{blocks}</div>
}

function parseBlocks(text: string): ReactNode[] {
  const lines = text.split('\n')
  const out: ReactNode[] = []
  let list: { ordered: boolean; items: string[] } | null = null
  const flush = () => {
    if (!list) return
    const items = list.items
    out.push(
      list.ordered ? (
        <ol key={out.length} className="list-decimal pl-5 space-y-1 marker:text-slate-400">
          {items.map((it, k) => <li key={k}>{renderInline(it)}</li>)}
        </ol>
      ) : (
        <ul key={out.length} className="list-disc pl-5 space-y-1 marker:text-un-400">
          {items.map((it, k) => <li key={k}>{renderInline(it)}</li>)}
        </ul>
      ),
    )
    list = null
  }
  for (const raw of lines) {
    const line = raw.trim()
    // ATX 标题 # / ## / ### / ####
    const h = /^(#{1,4})\s+(.*?)\s*#*$/.exec(line)
    // 分隔线 --- / *** / ___
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) {
      flush()
      out.push(<hr key={out.length} className="border-t border-slate-200 my-1" />)
      continue
    }
    if (h) {
      flush()
      const content = renderInline(h[2])
      const cls = 'font-bold text-slate-900 tracking-tight'
      const n = h[1].length
      out.push(
        n === 1 ? <h2 key={out.length} className={`${cls} text-lg mt-2`}>{content}</h2>
          : n === 2 ? <h3 key={out.length} className={`${cls} text-[15px] mt-1`}>{content}</h3>
            : <h4 key={out.length} className={`${cls} text-sm`}>{content}</h4>,
      )
      continue
    }
    const ul = /^[-•]\s+(.*)/.exec(line)
    const ol = /^\d+[.)]\s+(.*)/.exec(line)
    if (ul) {
      if (!list || list.ordered) flush()
      list = list || { ordered: false, items: [] }
      list.items.push(ul[1])
    } else if (ol) {
      if (!list || !list.ordered) flush()
      list = list || { ordered: true, items: [] }
      list.items.push(ol[1])
    } else {
      flush()
      if (line) out.push(<p key={out.length} className="leading-7">{renderInline(line)}</p>)
    }
  }
  flush()
  return out
}

function renderInline(s: string): ReactNode {
  const parts = s.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  return parts.map((p, k) => {
    if (/^\*\*[^*]+\*\*$/.test(p)) return <strong key={k} className="font-semibold text-slate-900">{p.slice(2, -2)}</strong>
    if (/^`[^`]+`$/.test(p)) return <code key={k} className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-un-700">{p.slice(1, -1)}</code>
    return <span key={k}>{p}</span>
  })
}
