// 本地 MUN 教练规则引擎 + 可选 LLM 直连（OpenAI 兼容）

export interface ChatMsg {
  role: 'user' | 'assistant'
  content: string
  sources?: { label: string; url: string }[]
}

export interface MunContext {
  topic: string
  country: string
  committee: string
}

interface Rule {
  id: string
  keywords: string[]
  reply: (ctx: MunContext) => { text: string; sources?: { label: string; url: string }[] }
}

const has = (t: string, words: string[]) => words.some((w) => t.includes(w))

const RULES: Rule[] = [
  {
    id: 'research',
    keywords: ['资料', '材料', '检索', '查', 'research', '找', '背景', '调研'],
    reply: (ctx) => ({
      text: `研究一个 MUN 议题，建议按「背景→既往行动→本国立场→数据→方案」五步走${ctx.topic ? `，针对你的议题「${ctx.topic}」` : ''}：

1️⃣ **建背景**：先读 UN Global Issues 综述，搞清术语、关键时间线与主要利益方。
2️⃣ **找既往决议**：docs.un.org / UN Digital Library 检索关键词；Google 用 \`site:undocs.org <议题> resolution\` 直取决议全文（A/RES/... 大会、S/RES/... 安理会）。
3️⃣ **找SG报告**：Google \`site:digitallibrary.un.org "Secretary-General" <议题>\`，秘书长报告里通常有现状数据和建议。
4️⃣ **定本国立场**${ctx.country ? `（${ctx.country}）` : ''}：查本国是否签署相关公约（UN Treaty Collection）、官方近年发言（UN Member States on the Record）、国内立法；CIA World Factbook 补国情。
5️⃣ **取数据**：人道议题用 ReliefWeb，难民用 UNHCR，卫生用 WHO，经济指标用 World Bank（免 key API）。

⚠️ 数据可信度排序：UN机构 ＞ 政府统计 ＞ 智库 ＞ 媒体。每条数据标注来源+年份。`,
      sources: [
        { label: 'UN Global Issues', url: 'https://www.un.org/en/global-issues' },
        { label: 'docs.un.org 文件检索', url: 'https://docs.un.org' },
        { label: 'UN Digital Library', url: 'https://digitallibrary.un.org' },
        { label: 'UN Member States on the Record', url: 'https://www.un.org/en/library/member-states-on-the-record' },
        { label: 'CIA World Factbook', url: 'https://www.cia.gov/the-world-factbook/' },
      ],
    }),
  },
  {
    id: 'pp',
    keywords: ['立场文件', 'position paper', 'pp', '立场文'],
    reply: () => ({
      text: `**Position Paper 标准三段结构**（1页 / 250-500词）：

📌 **开头**：Committee / Country / Delegate / Topic
① **Background / Past International Actions** — 现状数据（注明来源）+ 既往相关决议与宪章依据。
② **Country Policy** — 本国立法/官方立场/领导人原话，用 "My delegation believes..."，全程 in character。
③ **Proposed Solutions** — 具体可执行建议，回答 who/what/how，分 (1)(2)(3) 列出。

禁忌：第一人称单数 "I think"、通用模板无国家特色、无出处数据、缩写口语（don't）、只批评不给方案。

👉 你可以直接切到「立场文件」页，我按你填的信息生成英文初稿。`,
    }),
  },
  {
    id: 'dr',
    keywords: ['决议草案', 'draft resolution', 'resolution', '草案', '条款', 'clause'],
    reply: () => ({
      text: `**Draft Resolution 结构**：

📌 **Heading**：Committee / Sponsors / Signatories / Topic，正文以 "The General Assembly," 开头。
📜 **Preambulatory Clauses（序言性）**：说明理由与依据，开头短语斜体（Recalling / Recognizing / Alarmed by...），每条以**逗号**结尾，不编号。
⚡ **Operative Clauses（执行性）**：提出具体行动，开头动词下划线（Requests / Calls upon / Urges / Demands...），编号 1,2,3 → 子条款 a),b) → 再下级 i),ii)，以**分号**结尾，最后一条用**句号**。

**语气梯度**：Requests（中性）< Calls upon < Urges < Demands（最强，罕用）。
**Sponsors** 是起草者（1-3国），friendly amendment 须其全体同意；**Signatories** 只支持草案进入讨论（常见门槛 1/5-1/4 参会国）。

👉 去「决议草案」页可交互添加条款，我内置了 80+ PP / 70+ OP 标准开头词，自动编号并导出。`,
    }),
  },
  {
    id: 'speech',
    keywords: ['讲稿', '演讲', '发言', 'speech', 'gsl', '发言稿'],
    reply: () => ({
      text: `**两类讲稿结构**：

🎤 **GSL 正式发言（60-90秒 / 130-200词）**：
Hook（Honorable Chair, distinguished delegates）→ 本国立场 → 3 个论点（问题-证据-方案）→ 号召 + "Thank you. I yield my time to the Chair."

💬 **Moderated Caucus（30-60秒）**：聚焦单一次主题，观点先行：
"Thank you, Honorable Chair. On <sub-topic>, <Country> proposes <measure>. I yield."

小技巧：第一句给一个数据或反问当 hook；每论点必配一个证据；结尾明确"呼吁本委员会做什么"。

👉 去「讲稿」页选类型即可生成。`,
    }),
  },
  {
    id: 'rules',
    keywords: ['议事规则', '规则', '动议', 'motion', 'point', 'caucus', '流程', '修正案', 'amendment'],
    reply: () => ({
      text: `**常用 Points（不需附议）**：
• Point of Order — 指出程序错误
• Point of Parliamentary Inquiry — 询问议事规则
• Point of Information — 向发言代表提问（THIM1UN 经主席转达）
• Point of Personal Privilege — 听不清/身体不适
• Right of Reply — 被侮辱时请求回应（须主席批准）

**常用 Motions（需附议+表决）**：
• Moderated Caucus：须报 purpose / total time / speaking time
• Unmoderated Caucus：同上
• Introduce Draft Resolution / Open or Close Speakers' List / Close Debate / Divide the Question

**修正案**：Friendly — 全体 sponsors 接受，直接并入不表决；Unfriendly — 不接受，达联署门槛后辩论，简单多数通过。

**UNA-USA（美式）** 会中写决议、动议驱动；**THIMUN（欧式）** 会前提交、正式辩论为主、文件强制 TNR12+行号。参赛前先确认会议用哪套。`,
    }),
  },
  {
    id: 'country',
    keywords: ['国家立场', '代表', '国家', 'country', '怎么知道'],
    reply: (ctx) => ({
      text: `确定国家立场${ctx.country ? `（${ctx.country}）` : ''}的四个来源：

1. **UN Member States on the Record** — 查该国历任代表在 UN 的发言与投票。
2. **UN Digital Library 投票记录** — 看相关决议该国投了赞成/反对/弃权，立场一目了然。
3. **UN Treaty Collection** — 该国是否签署/批准相关公约，有无保留条款。
4. **本国外交部官网 + CIA World Factbook** — 官方政策声明与国情数据。

原则：立场必须"像这个国家"——大国博弈、地缘盟友、经济依赖、宗教文化都要考虑。找不到直接表态时，从其投票记录和同盟国立场推断。`,
      sources: [
        { label: 'UN Member States on the Record', url: 'https://www.un.org/en/library/member-states-on-the-record' },
        { label: 'UN Digital Library', url: 'https://digitallibrary.un.org' },
        { label: 'UN Treaty Collection', url: 'https://treaties.un.org' },
        { label: 'CIA World Factbook', url: 'https://www.cia.gov/the-world-factbook/' },
      ],
    }),
  },
  {
    id: 'hello',
    keywords: ['你好', 'hello', 'hi', '在吗', '嗨'],
    reply: () => ({
      text: '你好！我是你的 MUN 学术教练 🕊️ 可以问我：议题资料怎么查、立场文件/决议草案/讲稿怎么写、议事规则细节，或直接告诉我你的「议题+国家+委员会」，我给你定制研究路径。',
    }),
  },
]

export function localReply(input: string, ctx: MunContext): ChatMsg {
  const t = input.toLowerCase()
  const scored = RULES.map((r) => ({ r, s: r.keywords.reduce((n, k) => n + (t.includes(k.toLowerCase()) ? 1 : 0), 0) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
  if (scored.length) {
    const a = scored[0].r.reply(ctx)
    return { role: 'assistant', content: a.text, sources: a.sources }
  }

  // 实质问题：坦诚说明本地模式无法实时作答，给出"找到最新答案"的直达路径
  const term = ctx.topic.trim()
  if (term) {
    const e = encodeURIComponent(term)
    return {
      role: 'assistant',
      content: `关于「${input.trim()}」：内置知识库无法实时联网，所以不能直接告诉你此刻的最新进展；但下面 4 个入口能让你在 1 分钟内拿到权威最新信息${ctx.country ? `（代表国：${ctx.country}）` : ''}：

1. **UN News 检索** — 联合国官方最新表态与动态
2. **ReliefWeb** — 如涉及人道/冲突，局势报告更新最快
3. **Security Council Report** — 如涉及安理会，看月度议程与表决跟踪
4. **Google 精确检索** — 限定 UN 域名找决议/报告

💡 想要我直接回答这类问题（含中文提问、自动检索与总结），可在右上角「模型设置」接入你自己的大模型 Key。`,
      sources: [
        { label: `UN News: ${term}`, url: `https://news.un.org/en/search/${e}` },
        { label: `ReliefWeb: ${term}`, url: `https://reliefweb.int/search?search=${e}` },
        { label: 'Security Council Report', url: `https://www.securitycouncilreport.org/?s=${e}` },
        { label: 'Google UN 站内检索', url: `https://www.google.com/search?q=${encodeURIComponent(`site:un.org OR site:undocs.org ${term}`)}` },
      ],
    }
  }

  return {
    role: 'assistant',
    content: `我可以在以下方面帮你：

• 🔍 **资料检索**：问"怎么查资料"，我给你官方源和 Google 检索语法
• 📄 **立场文件**：问"立场文件怎么写"
• 📜 **决议草案**：问"决议草案格式/条款怎么写"
• 🎤 **讲稿**：问"GSL发言怎么写"
• ⚖️ **议事规则**：问"动议/Point/修正案"

💡 最好先在上方填好「议题 + 代表国 + 委员会」，我就能给出定制化的研究路径与直达链接。`,
  }
}

// ============ LLM 直连（OpenAI 兼容；用户自配 key，仅存浏览器本地） ============
export interface LLMConfig {
  baseUrl: string
  apiKey: string
  model: string
}

const LLM_KEY = 'mun-llm-config'

export function loadLLM(): LLMConfig | null {
  try {
    const raw = localStorage.getItem(LLM_KEY)
    return raw ? (JSON.parse(raw) as LLMConfig) : null
  } catch {
    return null
  }
}
export function saveLLM(c: LLMConfig | null) {
  if (c) localStorage.setItem(LLM_KEY, JSON.stringify(c))
  else localStorage.removeItem(LLM_KEY)
}

const SYSTEM_PROMPT = `You are a senior Model United Nations (MUN) coach who is expert in both UNA-USA and THIMUN rules of procedure.
Answer in the user's language (use English for document templates/samples). Be precise, structured and practical.
You help delegates: (1) research topics using authoritative UN sources (UN Global Issues, docs.un.org, UN Digital Library, undocs.org, ReliefWeb, UNHCR, WHO, World Bank, treaty bodies);
(2) write Position Papers (3-part structure), Draft Resolutions (preambulatory/operative clauses, standard opening phrases, numbering 1/a/i), and speeches (GSL 60-90s / moderated caucus 30-60s);
(3) understand procedure (points, motions, amendments).
Always remind users to verify facts/data and to stay in character. Never fabricate document numbers or statistics.`

export async function llmReply(history: ChatMsg[], cfg: LLMConfig, ctx: MunContext): Promise<string> {
  const ctxLine = `Current delegate context — Topic: ${ctx.topic || 'N/A'}; Country: ${ctx.country || 'N/A'}; Committee: ${ctx.committee || 'N/A'}.`
  const resp = await fetch(`${cfg.baseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.apiKey}` },
    body: JSON.stringify({
      model: cfg.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT + '\n' + ctxLine },
        ...history.map((m) => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.6,
    }),
  })
  if (!resp.ok) {
    const txt = await resp.text().catch(() => '')
    throw new Error(`LLM请求失败 ${resp.status}：${txt.slice(0, 200)}`)
  }
  const data = await resp.json()
  return data?.choices?.[0]?.message?.content || '（模型未返回内容）'
}
