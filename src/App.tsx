import { useState } from 'react'
import {
  Search, MessagesSquare, FileText, ScrollText, Mic, Globe2, Menu, X,
} from 'lucide-react'
import Home from './pages/Home'
import Research from './pages/Research'
import ChatPage from './pages/ChatPage'
import PositionPaperPage from './pages/PositionPaper'
import DraftResolutionPage from './pages/DraftResolution'
import SpeechPage from './pages/Speech'
import type { MunContext } from './pages/ChatPage'

export type PageId = 'home' | 'research' | 'chat' | 'pp' | 'dr' | 'speech'

const NAV: { id: PageId; label: string; icon: typeof Search }[] = [
  { id: 'research', label: '资料检索', icon: Search },
  { id: 'chat', label: 'AI对话', icon: MessagesSquare },
  { id: 'pp', label: '立场文件', icon: FileText },
  { id: 'dr', label: '决议草案', icon: ScrollText },
  { id: 'speech', label: '讲稿', icon: Mic },
]

export default function App() {
  const validPages: PageId[] = ['home', 'research', 'chat', 'pp', 'dr', 'speech']
  const hashPage = () => {
    const h = location.hash.replace(/^#\/?/, '') as PageId
    return validPages.includes(h) ? h : 'home'
  }
  const [page, setPage] = useState<PageId>(hashPage)
  const [menuOpen, setMenuOpen] = useState(false)
  const [ctx, setCtx] = useState<MunContext>({ topic: '', country: '', committee: '' })

  const go = (p: PageId) => {
    setPage(p)
    setMenuOpen(false)
    history.replaceState(null, '', p === 'home' ? '/' : `#/${p}`)
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <button onClick={() => go('home')} className="flex items-center gap-2.5 group">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-un-500 to-un-800 text-white shadow-md shadow-un-200 transition group-hover:scale-105">
              <Globe2 size={19} />
            </span>
            <span className="text-left leading-tight">
              <span className="block text-[15px] font-bold text-slate-900">MUN Compass</span>
              <span className="block text-[11px] text-slate-500">模拟联合国 AI指南针</span>
            </span>
          </button>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => go(n.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                  page === n.id ? 'bg-un-50 text-un-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <n.icon size={15} />
                {n.label}
              </button>
            ))}
          </nav>

          <button className="lg:hidden btn-ghost !p-2.5" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        {menuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 animate-fade-in">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => go(n.id)}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                <n.icon size={16} />
                {n.label}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1">
        {page === 'home' && <Home go={go} setCtx={setCtx} ctx={ctx} />}
        {page === 'research' && <Research />}
        {page === 'chat' && <ChatPage ctx={ctx} setCtx={setCtx} />}
        {page === 'pp' && <PositionPaperPage />}
        {page === 'dr' && <DraftResolutionPage />}
        {page === 'speech' && <SpeechPage />}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-10 grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-un-500 to-un-800 text-white">
                <Globe2 size={16} />
              </span>
              <span className="font-bold text-slate-900">MUN Compass</span>
            </div>
            <p className="text-sm text-slate-500 leading-6">
              让每一位代表在会场内外都运筹帷幄——从资料检索到文件落笔，AI 全程陪练。
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3">核心工具</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-slate-500">
              {NAV.map((n) => (
                <button key={n.id} onClick={() => go(n.id)} className="text-left hover:text-un-700 transition">
                  {n.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3">权威信源</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a className="hover:text-un-700" href="https://www.un.org/en/global-issues" target="_blank">UN Global Issues</a></li>
              <li><a className="hover:text-un-700" href="https://docs.un.org" target="_blank">docs.un.org</a></li>
              <li><a className="hover:text-un-700" href="https://digitallibrary.un.org" target="_blank">UN Digital Library</a></li>
              <li><a className="hover:text-un-700" href="https://reliefweb.int" target="_blank">ReliefWeb</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
          © 2026 MUN Compass · 模拟联合国 AI指南针 · AI 生成内容请核实后使用 · 非联合国官方产品
        </div>
      </footer>
    </div>
  )
}
