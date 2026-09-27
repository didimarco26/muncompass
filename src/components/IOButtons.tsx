import { useState } from 'react'
import { Check, Copy, Download } from 'lucide-react'

export function CopyButton({ text, label = '复制' }: { text: string; label?: string }) {
  const [ok, setOk] = useState(false)
  return (
    <button
      className="btn-ghost !py-2 !px-3.5"
      onClick={async () => {
        await navigator.clipboard.writeText(text)
        setOk(true)
        setTimeout(() => setOk(false), 1600)
      }}
    >
      {ok ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
      {ok ? '已复制' : label}
    </button>
  )
}

export function DownloadButton({ text, filename, label = '下载' }: { text: string; filename: string; label?: string }) {
  return (
    <button
      className="btn-primary !py-2 !px-3.5"
      onClick={() => {
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.click()
        URL.revokeObjectURL(url)
      }}
    >
      <Download size={15} />
      {label}
    </button>
  )
}
