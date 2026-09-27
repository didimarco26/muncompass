import {
  Sparkles, Megaphone, Gem, Rocket, Scale, Route, ExternalLink,
} from 'lucide-react'

export default function Monetization() {
  return (
    <div className="mx-auto max-w-5xl px-4 md:px-6 py-10 md:py-14">
      <h1 className="text-3xl md:text-4xl font-black text-slate-900 flex items-center gap-2.5">
        <Sparkles className="text-gold-500" size={30} /> 商业化变现思路
      </h1>
      <p className="mt-3 text-slate-500 leading-7">
        面向中学生/大学生、指导老师与 MUN 培训机构的垂直工具，建议遵循「先流量、再会员、再广告与 B 端」的节奏。
      </p>

      <div className="mt-6 rounded-2xl bg-gradient-to-r from-un-950 to-un-700 p-6 text-white">
        <p className="font-bold text-lg">🎯 一句话策略</p>
        <p className="mt-2 text-un-100 leading-7 text-sm">
          免费检索 + 资料页吃搜索流量；垂直模板与真人服务收 C 端钱；广告联盟兜底、<b>教育直客为主</b>做增量；B 端放最后，但毛利最高。
        </p>
      </div>

      {/* 广告变现 */}
      <Section icon={Megaphone} color="text-un-600 bg-un-50" title="一、广告变现（重点：教育类）">
        <h3 className="font-bold text-slate-900 mt-2">Google AdSense</h3>
        <ul className="mt-2 space-y-1.5 text-sm text-slate-600 leading-6">
          <li>• <b>准入</b>：自有顶级域名 + HTTPS；8-15 篇 800 字以上原创文章；关于/联系/隐私政策页齐全（披露 Cookie 与第三方广告）。批量低质 AI 内容是当前拒审首因。</li>
          <li>• <b>大陆主体收款</b>：个人身份证即可，绑大陆银行美元电汇（招行常用）；年结汇额度 5 万美元；满 $10 触发 PIN+身份验证，满 $100 起付。</li>
          <li>• <b>量级（参考）</b>：中文站 RPM 约 ¥2-5/千曝光；英文工具站 $8-25；教育类欧美流量 $6-15。早期广告属"补贴型"收入。</li>
          <li>• <b>不利因素</b>：平台对 18 岁以下用户关闭个性化广告，而本站未成年流量占比高，RPM 会被压低。</li>
        </ul>

        <h3 className="font-bold text-slate-900 mt-5">广告位策略</h3>
        <p className="mt-1.5 text-sm text-slate-600 leading-6">
          资料长文放中段+文末（教育广告匹配最好）；工具结果页放侧边/底部，不打断写作流；付费/注册页不放。先开自动广告，3 个月后手动优化，移动端严控密度。
        </p>

        <h3 className="font-bold text-slate-900 mt-5">教育直客方向（单价远高于联盟）</h3>
        <p className="mt-1.5 text-sm text-slate-600 leading-6">
          优先级：MUN 培训/冬夏令营 ≈ 背景提升竞赛（WSC/WYEF）＞ 留学中介 ＞ 语培（托福/雅思/多邻国）＞ 国际学校 AP·IB ＞ 口语 App / 研学。客群与"留学背景提升"高度重合。
        </p>

        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs text-slate-500">
              <tr><th className="px-4 py-2.5">联盟</th><th className="px-4 py-2.5">门槛</th><th className="px-4 py-2.5">特点</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr><td className="px-4 py-2.5 font-medium">百度联盟</td><td className="px-4 py-2.5">日IP 100+</td><td className="px-4 py-2.5">填充稳、门槛低，适合冷启动</td></tr>
              <tr><td className="px-4 py-2.5 font-medium">穿山甲（字节）</td><td className="px-4 py-2.5">重内容质量</td><td className="px-4 py-2.5">CPM 较高，封号严格</td></tr>
              <tr><td className="px-4 py-2.5 font-medium">腾讯广告联盟</td><td className="px-4 py-2.5">建议日UV 3000+</td><td className="px-4 py-2.5">教育类表现较好（口径谨慎参考）</td></tr>
            </tbody>
          </table>
        </div>

        <h3 className="font-bold text-slate-900 mt-5">Affiliate 分销（优先落地）</h3>
        <ul className="mt-2 space-y-1.5 text-sm text-slate-600 leading-6">
          <li>• 语培机构：课程客单约 5000 元，CPS 28-30%（单笔佣金约 1400 元）或 CPA 150-200 元/有效线索（留资/加企微/约试听）。</li>
          <li>• 留学中介：线索费 100-300 元或签约分成；竞赛营 CPS 10-20%。</li>
          <li>• 落点：资料页「备考推荐」位 + AI 报告「下一步」卡片。</li>
        </ul>
      </Section>

      {/* 增值服务 */}
      <Section icon={Gem} color="text-emerald-600 bg-emerald-50" title="二、增值服务">
        <div className="grid gap-3 md:grid-cols-2 mt-2">
          <div className="rounded-xl border border-slate-200 p-4">
            <h4 className="font-bold text-slate-900 text-sm">Freemium 会员</h4>
            <p className="mt-1.5 text-xs text-slate-500 leading-5">
              免费层：每月 AI 生成 3-5 次 + 基础模板，检索全开放（SEO 入口）。<br />
              学生会员：<b>19-29 元/月</b>、<b>98-168 元/年</b>；按次深度文件 9.9-19.9 元/篇。
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <h4 className="font-bold text-slate-900 text-sm">高毛利层</h4>
            <p className="mt-1.5 text-xs text-slate-500 leading-5">
              真人批改 49-99 元/篇；导师辅导时包 199-499 元；高级模板与往届文件库（须解决授权）。
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <h4 className="font-bold text-slate-900 text-sm">B 端 SaaS</h4>
            <p className="mt-1.5 text-xs text-slate-500 leading-5">
              社团/培训机构（教师后台、席位管理）1980-9800 元/年；国际学校 1-5 万元/年；为会议主席团提供文件互评工具换官方推荐位。
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <h4 className="font-bold text-slate-900 text-sm">轻导流电商</h4>
            <p className="mt-1.5 text-xs text-slate-500 leading-5">
              教辅书京东/当当联盟、培训营与背景提升项目佣金，不自营。
            </p>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-400 leading-5">
          ⚠️ 差异化关键：夸克/千问等通用工具持续免费，护城河只能靠「模联专属数据 + 议事规则模板 + 真人服务」。
        </p>
      </Section>

      {/* 冷启动 */}
      <Section icon={Rocket} color="text-violet-600 bg-violet-50" title="三、冷启动与增长">
        <ul className="mt-2 space-y-1.5 text-sm text-slate-600 leading-6">
          <li>• <b>SEO</b>：中文词「模拟联合国 立场文件/范文/决议草案/议题/发言稿/议事规则/新手入门」；英文词「position paper examples/template、MUN topics、draft resolution、best delegate」。</li>
          <li>• <b>内容矩阵</b>：小红书发模板/会议 vlog 引流，B站做规则长视频，公众号沉淀范文；向社团长提供免费席位+招新素材包换推广。</li>
          <li>• <b>季节性</b>：9-10月招新拉新高峰；11月-次年2月会议季+寒假营（耶鲁/哈佛MUN、THIMUN 多在1-2月）为付费高峰；3-5月春季会；7-8月夏令营。内容/投放提前 4-6 周。</li>
          <li>• <b>竞品参照</b>：Best Delegate（老牌资源站）等，差异化做「工具+生成」而非纯内容。</li>
        </ul>
      </Section>

      {/* 合规 */}
      <Section icon={Scale} color="text-rose-600 bg-rose-50" title="四、合规风险（务必重视）">
        <ul className="mt-2 space-y-1.5 text-sm text-slate-600 leading-6">
          <li>• <b>双减/广告法</b>：面向中小学生的校外培训广告受限（多地口径含非学科类）。建议联盟广告以大学生/语培留学类为主；中小学培训以"会议合作/信息服务"而非硬广呈现。禁用保分/保录取/名校直通车/极限词/受益者推荐/焦虑话术，广告须标「广告」。</li>
          <li>• <b>AI标识</b>：《人工智能生成合成内容标识办法》2025-09-01 施行，生成结果须加显式标识，导出文件保留标识（本站文件页脚已内置）。</li>
          <li>• <b>隐私</b>：遵 PIPL 与未保法，不满 14 周岁信息处理须监护人同意；最小化收集年龄/学校信息；支付走第三方。</li>
        </ul>
      </Section>

      {/* 路线图 */}
      <Section icon={Route} color="text-gold-600 bg-gold-50" title="五、0-6个月路线图">
        <div className="mt-4 space-y-0">
          {[
            ['M1-2', '30-50 个议题/范文/规则页（SEO）+ 立场文件 MVP；补条款页与 AI 标识；签约 10 个种子社团', '不上广告，攒内容备审'],
            ['M3', '申请 AdSense + 百度联盟；小红书/公众号开更；招新季素材包', '仅自动广告，跑通结算'],
            ['M4', '上线 Freemium（月卡/年卡/按次付费）', '验证付费，目标 2-5% 付费率'],
            ['M5', '谈 2-3 家语培/背景提升 CPA·CPS；接 MUN 冬令营直客', '佣金+直客，会议季前卡位'],
            ['M6', '教师后台试点 3-5 家机构、会议官方工具合作；推真人批改包', '首单 SaaS 年费，跑通 B 端'],
          ].map(([m, action, money], k) => (
            <div key={k} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="grid h-9 w-16 shrink-0 place-items-center rounded-full bg-un-600 text-xs font-bold text-white">{m}</span>
                {k < 4 && <span className="w-px flex-1 bg-slate-200 my-1" />}
              </div>
              <div className="pb-6">
                <p className="text-sm font-semibold text-slate-800 leading-6">{action}</p>
                <p className="mt-1 text-xs text-gold-700 font-medium">💰 {money}</p>
              </div>
            </div>
          ))}
        </div>
        <a className="btn-ghost mt-2" href="https://www.google.com/adsense/start" target="_blank">
          AdSense 申请入口 <ExternalLink size={14} />
        </a>
      </Section>
    </div>
  )
}

function Section({
  icon: Icon, color, title, children,
}: {
  icon: typeof Megaphone
  color: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-8 card p-5 md:p-7">
      <h2 className="flex items-center gap-2.5 text-lg font-bold text-slate-900">
        <span className={`grid h-9 w-9 place-items-center rounded-lg ${color}`}><Icon size={18} /></span>
        {title}
      </h2>
      {children}
    </section>
  )
}
