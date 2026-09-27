import {
  Search, MessagesSquare, FileText, ScrollText, Mic, ArrowRight, Sparkles,
  ShieldCheck, BookOpen, Landmark, ChevronRight,
} from 'lucide-react'
import type { PageId } from '../App'
import { HOT_TOPICS, COMMITTEES } from '../data/munData'
import type { MunContext } from '../lib/chat'

interface Props {
  go: (p: PageId) => void
  ctx: MunContext
  setCtx: (c: MunContext) => void
}

const FEATURES = [
  { icon: Search, title: '议题资料一键检索', desc: '14 个联合国官方信源按议题动态生成检索入口，实时抓取 UN News，附 Google 文号语法。', page: 'research' as PageId, color: 'from-un-500 to-un-700' },
  { icon: MessagesSquare, title: 'AI代表对话陪练', desc: '随时提问研究路径、文件写法、议事规则；可接入你自己的大模型 Key 深度对话。', page: 'chat' as PageId, color: 'from-violet-500 to-indigo-600' },
  { icon: FileText, title: '立场文件生成', desc: '按背景—国家立场—解决方案三段结构，填入信息即生成规范英文 Position Paper。', page: 'pp' as PageId, color: 'from-emerald-500 to-teal-600' },
  { icon: ScrollText, title: '决议草案构建器', desc: '80+ 序言短语、70+ 执行动词，交互添加条款与子条款，自动编号、自动排版。', page: 'dr' as PageId, color: 'from-gold-400 to-gold-600' },
  { icon: Mic, title: '讲稿智能撰写', desc: 'GSL 正式发言与 Caucus 即兴发言两套模板，字数与时长实时估算。', page: 'speech' as PageId, color: 'from-rose-500 to-pink-600' },
]

const STATS = [
  { value: '14', label: 'UN权威信源' },
  { value: '150+', label: '标准条款开头词' },
  { value: '12', label: '常见委员会' },
  { value: '2', label: '议事规则体系' },
]

const STEPS = [
  { icon: BookOpen, title: '选议题', desc: '输入或选择你比赛的议题与代表国家' },
  { icon: Search, title: '做研究', desc: '沿着官方信源链路检索决议、报告与数据' },
  { icon: FileText, title: '写文件', desc: 'AI 辅助生成立场文件、决议草案与讲稿' },
  { icon: Landmark, title: '上会场', desc: '熟悉规则与话术，从容发言、斡旋磋商' },
]

export default function Home({ go, setCtx }: Props) {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-glow">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-6 pt-16 pb-20 md:pt-24 md:pb-28 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-un-200 bg-white/70 px-4 py-1.5 text-xs font-medium text-un-700 shadow-sm animate-slide-up">
            <Sparkles size={13} />
            从资料检索到文件落笔 · 一站式模拟联合国作战室
          </div>
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl md:text-6xl font-black tracking-tight text-slate-900 animate-slide-up">
            让每一位代表
            <span className="bg-gradient-to-r from-un-600 via-un-500 to-gold-500 bg-clip-text text-transparent"> 运筹帷幄</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base md:text-lg text-slate-600 leading-8 animate-slide-up">
            输入你的议题，自动检索联合国官网材料；AI 对话全程陪练；一键生成立场文件、决议草案与会场讲稿。
            新手不慌，老手更强。
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3 animate-slide-up">
            <button onClick={() => go('research')} className="btn-primary !px-6 !py-3 !text-base">
              <Search size={17} />
              立即检索议题材料
            </button>
            <button onClick={() => go('chat')} className="btn-ghost !px-6 !py-3 !text-base">
              <MessagesSquare size={17} />
              和AI教练聊聊
            </button>
          </div>

          <div className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="card px-4 py-5">
                <div className="text-2xl md:text-3xl font-black text-un-700">{s.value}</div>
                <div className="mt-1 text-xs text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="section-title">五大核心能力</h2>
          <p className="mt-3 text-slate-500">覆盖 MUN 赛前研究与会场作战的完整链路</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, k) => (
            <button
              key={f.title}
              onClick={() => go(f.page)}
              className={`card group p-6 text-left transition hover:-translate-y-1 hover:shadow-lg hover:border-un-200 ${k === 0 ? 'lg:col-span-1' : ''}`}
            >
              <span className={`mb-4 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${f.color} text-white shadow-md`}>
                <f.icon size={22} />
              </span>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                {f.title}
                <ArrowRight size={16} className="opacity-0 -translate-x-1 transition group-hover:opacity-100 group-hover:translate-x-0" />
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{f.desc}</p>
            </button>
          ))}
          <div className="card p-6 bg-gradient-to-br from-un-950 to-un-800 text-white border-0">
            <ShieldCheck size={26} className="mb-4 text-gold-300" />
            <h3 className="text-lg font-bold">权威 · 规范 · 可核实</h3>
            <p className="mt-2 text-sm leading-6 text-un-100">
              所有信源直连联合国体系；文件格式对标 UNA-USA 与 THIMUN 通行标准；AI 生成内容均带标识，请核实事实后使用。
            </p>
          </div>
        </div>
      </section>

      {/* Hot topics */}
      <section className="bg-white border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-8">
            <div>
              <h2 className="section-title">热门议题速查</h2>
              <p className="mt-2 text-sm text-slate-500">点击任一议题，直接进入材料检索</p>
            </div>
            <button onClick={() => go('research')} className="text-sm font-medium text-un-700 flex items-center gap-1 hover:gap-2 transition-all">
              自定义议题 <ChevronRight size={15} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {HOT_TOPICS.map((t) => (
              <button
                key={t.zh}
                className="chip !px-4 !py-2 !text-sm"
                onClick={() => {
                  const c = COMMITTEES.find((x) => x.id === t.committee)
                  setCtx({ topic: t.en, country: '', committee: c?.name || '' })
                  go('research')
                }}
              >
                {t.zh}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="section-title">四步成为强势代表</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-4">
          {STEPS.map((s, k) => (
            <div key={s.title} className="relative card p-6">
              <span className="absolute right-5 top-5 text-4xl font-black text-slate-100">{k + 1}</span>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-un-50 text-un-700">
                <s.icon size={20} />
              </span>
              <h3 className="mt-4 font-bold text-slate-900">{s.title}</h3>
              <p className="mt-1.5 text-sm text-slate-500 leading-6">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <button onClick={() => go('research')} className="btn-primary !px-6 !py-3">
            免费开始使用
            <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  )
}
