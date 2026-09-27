// 联合国官方信源库（2026-09 核实）
// 所有检索链接按用户议题动态构造

export interface UnSource {
  id: string
  name: string
  nameEn: string
  desc: string
  official: boolean
  url: (q: string) => string
  tags: string[]
}

const qs = (s: string) => encodeURIComponent(s.trim())

export const UN_SOURCES: UnSource[] = [
  {
    id: 'un_issues',
    name: '联合国全球议题',
    nameEn: 'UN Global Issues',
    desc: '议题综述、术语与背景脉络，建立全局认知的第一站',
    official: true,
    url: () => 'https://www.un.org/en/global-issues',
    tags: ['背景综述'],
  },
  {
    id: 'un_docs',
    name: '联合国文件检索',
    nameEn: 'docs.un.org',
    desc: '官方文件主入口：决议、秘书长报告、会议记录全文',
    official: true,
    url: (q) => `https://docs.un.org/en/search?q=${qs(q)}`,
    tags: ['决议', '报告'],
  },
  {
    id: 'un_dl',
    name: '联合国数字图书馆',
    nameEn: 'UN Digital Library',
    desc: '1979年起决议全文、表决记录、SG报告，含 MARCXML 接口',
    official: true,
    url: (q) => `https://digitallibrary.un.org/search?ln=en&p=${qs(q)}`,
    tags: ['决议', '投票', '历史文件'],
  },
  {
    id: 'undocs',
    name: 'UNDocs 文件直取',
    nameEn: 'undocs.org',
    desc: '知道文号（如 A/RES/79/1、S/RES/2729）直接打开原件',
    official: false,
    url: (q) => `https://undocs.org/${qs(q)}`,
    tags: ['文号直取'],
  },
  {
    id: 'un_news',
    name: '联合国新闻',
    nameEn: 'UN News',
    desc: '最新动态、秘书长表态，多语种，支持高级检索',
    official: true,
    url: (q) => `https://news.un.org/en/search/${qs(q)}`,
    tags: ['最新动态'],
  },
  {
    id: 'un_treaty',
    name: '联合国条约集',
    nameEn: 'UN Treaty Collection',
    desc: '公约条款全文、签署与缔约状态（查"本国是否批准"必用）',
    official: true,
    url: (q) => `https://treaties.un.org/Pages/DB.aspx?path=DB/studies/page2_en.xml&clause=_${qs(q)}`,
    tags: ['公约'],
  },
  {
    id: 'reliefweb',
    name: 'ReliefWeb 人道情报',
    nameEn: 'ReliefWeb',
    desc: '人道危机议题最强：局势报告、形势地图、数据，带 API',
    official: false,
    url: (q) => `https://reliefweb.int/search?search=${qs(q)}`,
    tags: ['人道危机', '难民'],
  },
  {
    id: 'scr',
    name: '安理会报告',
    nameEn: 'Security Council Report',
    desc: '月度议程预测、背景与表决跟踪（独立 NGO，非官方）',
    official: false,
    url: () => 'https://www.securitycouncilreport.org',
    tags: ['安理会', '预判'],
  },
  {
    id: 'unhcr',
    name: '联合国难民署',
    nameEn: 'UNHCR',
    desc: '难民/流离失所数据、全球趋势报告、各国立场',
    official: true,
    url: (q) => `https://www.unhcr.org/search?keywords=${qs(q)}`,
    tags: ['难民'],
  },
  {
    id: 'who',
    name: '世界卫生组织',
    nameEn: 'WHO',
    desc: '公共卫生议题：疫情通报、决议、技术指南',
    official: true,
    url: (q) => `https://www.who.int/home/search?indexCatalogue=genericsearch&searchQuery=${qs(q)}`,
    tags: ['卫生'],
  },
  {
    id: 'worldbank',
    name: '世界银行开放数据',
    nameEn: 'World Bank Open Data',
    desc: '免 key 经济社会指标 API：人口、GDP、贫困率等量化弹药',
    official: true,
    url: (q) => `https://data.worldbank.org/?search=${qs(q)}`,
    tags: ['数据'],
  },
  {
    id: 'ohchr',
    name: '联合国人权高专办',
    nameEn: 'OHCHR',
    desc: '人权议题：特别程序报告、条约机构意见、国家审议',
    official: true,
    url: (q) => `https://www.ohchr.org/en/search?keywords=${qs(q)}`,
    tags: ['人权'],
  },
  {
    id: 'iaea',
    name: '国际原子能机构',
    nameEn: 'IAEA',
    desc: '核安全、核不扩散、核查报告',
    official: true,
    url: (q) => `https://www.iaea.org/search?keyword=${qs(q)}`,
    tags: ['核'],
  },
  {
    id: 'un_chronicle',
    name: '联合国纪事',
    nameEn: 'UN Chronicle',
    desc: '深度议题长文与政策脉络',
    official: true,
    url: (q) => `https://www.un.org/en/un-chronicle?search=${qs(q)}`,
    tags: ['深度分析'],
  },
]

// UN News 主题 RSS（实测可访问）
export interface NewsFeed {
  id: string
  label: string
  url: string
}
export const UN_NEWS_FEEDS: NewsFeed[] = [
  { id: 'all', label: '全部', url: 'https://news.un.org/feed/subscribe/en/news/all/rss.xml' },
  { id: 'peace', label: '和平与安全', url: 'https://news.un.org/feed/subscribe/en/news/topic/peace-and-security/rss.xml' },
  { id: 'climate', label: '气候变化', url: 'https://news.un.org/feed/subscribe/en/news/topic/climate-change/rss.xml' },
  { id: 'rights', label: '人权', url: 'https://news.un.org/feed/subscribe/en/news/topic/human-rights/rss.xml' },
  { id: 'migrants', label: '移民与难民', url: 'https://news.un.org/feed/subscribe/en/news/topic/migrants-and-refugees/rss.xml' },
  { id: 'health', label: '卫生', url: 'https://news.un.org/feed/subscribe/en/news/topic/health/rss.xml' },
  { id: 'dev', label: '发展', url: 'https://news.un.org/feed/subscribe/en/news/topic/sustainable-development-goals/rss.xml' },
  { id: 'women', label: '妇女', url: 'https://news.un.org/feed/subscribe/en/news/topic/women/rss.xml' },
]

// 公共 CORS 代理（用于浏览器读取 RSS；失败自动轮换/降级）
export const CORS_PROXIES: ((u: string) => string)[] = [
  (u) => `https://api.allorigins.win/raw?url=${qs(u)}`,
  (u) => `https://corsproxy.io/?url=${qs(u)}`,
  (u) => `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(u)}`,
]

// Google 检索语法快捷链接
export function googleSiteLinks(query: string) {
  return [
    { label: '决议文本', url: `https://www.google.com/search?q=${qs(`site:undocs.org ${query} resolution`)}` },
    { label: '秘书长报告', url: `https://www.google.com/search?q=${qs(`site:digitallibrary.un.org "Secretary-General" ${query}`)}` },
    { label: 'PDF原件', url: `https://www.google.com/search?q=${qs(`${query} united nations filetype:pdf`)}` },
    { label: '精确词组', url: `https://www.google.com/search?q=${qs(`"${query}" united nations`)}` },
  ]
}
