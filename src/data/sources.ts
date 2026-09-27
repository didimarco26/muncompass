// MUN 权威信源大全（102 个：82 官方/权威 + 20 教学比赛）
// 每个源含可拼装搜索 URL；固定页类 search 返回固定地址

const qs = (s: string) => encodeURIComponent(s.trim())
const gsite = (dom: string) => (q: string) => `https://www.google.com/search?q=${qs(`site:${dom} ${q}`)}`

export type SourceKind = 'official' | 'teaching'
export interface Source {
  id: string
  cat: string
  name: string
  en?: string
  desc: string
  search: (q: string) => string
  rss?: string
  kind?: SourceKind
}

export const SOURCE_CATS: Record<string, string> = {
  doc: '联合国核心文献与新闻',
  law: '国际法与司法',
  agency: '专门机构',
  fund: '基金计划署',
  data: '数据与统计',
  news: '新闻与情报',
  country: '国家研究',
  mun: 'MUN教学与比赛',
}

// ---------- 核心文献与新闻 ----------
const DOC: Source[] = [
  { id: 'un_issues', cat: 'doc', name: '联合国全球议题', en: 'UN Global Issues', desc: '议题综述、术语背景第一站', search: () => 'https://www.un.org/en/global-issues' },
  { id: 'docs_un', cat: 'doc', name: '联合国文件检索', en: 'docs.un.org', desc: '决议、报告、会议记录全文', search: (q) => `https://docs.un.org/en/search?q=${qs(q)}` },
  { id: 'un_dl', cat: 'doc', name: '联合国数字图书馆', en: 'UN Digital Library', desc: '1979起决议、表决记录、SG报告', search: (q) => `https://digitallibrary.un.org/search?ln=en&p=${qs(q)}` },
  { id: 'undocs', cat: 'doc', name: 'UNDocs 文件直取', desc: '凭文号直取原件', search: (q) => `https://undocs.org/${qs(q)}` },
  { id: 'ods', cat: 'doc', name: '正式文件系统', en: 'Official Document System', desc: '1993起六语种PDF全文', search: (q) => `https://ods.un.org/en/search?q=${qs(q)}` },
  { id: 'un_journal', cat: 'doc', name: '联合国日刊', en: 'UN Journal', desc: '每日会议议程与文件清单', search: (q) => `https://docs.un.org/en/journal?q=${qs(q)}` },
  { id: 'un_press', cat: 'doc', name: '联合国新闻稿', en: 'UN Press Releases', desc: '各机构每日新闻稿', search: (q) => `https://www.un.org/press/en/content/search?search=${qs(q)}` },
  { id: 'un_tv', cat: 'doc', name: '联合国网络电视', en: 'UN Web TV', desc: '会议直播与历史录像', search: (q) => `https://webtv.un.org/en/asset/search?search=${qs(q)}` },
  { id: 'un_avlib', cat: 'doc', name: '联合国视听图书馆', en: 'UN Audiovisual Library', desc: '历史影像录音', search: () => 'https://av.lib.un.org' },
  { id: 'un_ilibrary', cat: 'doc', name: '联合国iLibrary', en: 'UN iLibrary', desc: '电子书、期刊、数据集', search: (q) => `https://www.un-ilibrary.org/search?q=${qs(q)}` },
  { id: 'un_repo', cat: 'doc', name: '联合国知识仓储', desc: '政策出版物仓储', search: gsite('knowledge.un.org') },
  { id: 'askdag', cat: 'doc', name: 'Ask Dag 检索', desc: '达格·哈马舍尔德图书馆问答', search: (q) => `https://ask.un.org/faq?q=${qs(q)}` },
  { id: 'un_news', cat: 'doc', name: '联合国新闻', en: 'UN News', desc: '最新动态、多语种', search: (q) => `https://news.un.org/en/search/${qs(q)}`, rss: 'https://news.un.org/feed/subscribe/en/news/all/rss.xml' },
  { id: 'un_chronicle', cat: 'doc', name: '联合国纪事', en: 'UN Chronicle', desc: '深度议题长文', search: gsite('un.org/en/un-chronicle') },
  { id: 'dag_discovery', cat: 'doc', name: 'DAG Discovery', desc: 'UNBIS退役后新检索入口', search: (q) => `https://ask.un.org/permalink/search?q=${qs(q)}` },
  { id: 'un_thesaurus', cat: 'doc', name: 'UN叙词表', desc: '官方主题词规范', search: (q) => `https://lib-thesaurus.un.org/lib-thesaurus/thesaurus/en?subject=${qs(q)}` },

  // 条约
  { id: 'un_treaty', cat: 'law', name: '联合国条约集', en: 'UN Treaty Collection', desc: '公约全文、缔约状态', search: (q) => `https://treaties.un.org/Pages/DB.aspx?path=DB/studies/page2_en.xml&clause=_${qs(q)}` },
  { id: 'icj_db', cat: 'law', name: '国际法院案件库', en: 'ICJ Cases', desc: '诉状、命令、判决书', search: (q) => `https://www.icj-cij.org/search?keys=${qs(q)}` },
  { id: 'icc_db', cat: 'law', name: '国际刑事法院', en: 'ICC', desc: '案件、情势、文书', search: (q) => `https://www.icc-cpi.int/search?search=${qs(q)}` },
  { id: 'ilc_db', cat: 'law', name: '国际法委员会', en: 'ILC', desc: '条款草案与评注', search: (q) => `https://legal.un.org/ilc/search?q=${qs(q)}` },
  { id: 'uncitral_db', cat: 'law', name: '国际贸易法委员会', en: 'UNCITRAL', desc: '示范法、公约、判例', search: (q) => `https://uncitral.un.org/en/search?query=${qs(q)}` },
  { id: 'avl_intlaw', cat: 'law', name: '国际法视听图书馆', desc: '专题讲座与条约原文', search: () => 'https://legal.un.org/avl/' },
  { id: 'ilo_normlex', cat: 'law', name: 'ILO NORMLEX', desc: '国际劳工公约与建议', search: (q) => `https://normlex.ilo.org/dyn/nrmlx_en/f?p=14100:1:::NO:::&search=${qs(q)}` },
  { id: 'icrc_ihl', cat: 'law', name: '红十字国际人道法数据库', en: 'ICRC IHL', desc: '日内瓦公约、习惯法', search: (q) => `https://ihl-databases.icrc.org/en/search?query=${qs(q)}` },
  { id: 'itlos_db', cat: 'law', name: '国际海洋法法庭', en: 'ITLOS', desc: '海洋案件', search: gsite('itlos.org') },
  { id: 'pca_db', cat: 'law', name: '常设仲裁法院', en: 'PCA', desc: '仲裁裁决与条约', search: (q) => `https://pca-cpa.org/en/search/?q=${qs(q)}` },
  { id: 'un_droit', cat: 'law', name: '联合国国际法数据库', desc: '条约与文件汇编', search: () => 'https://legal.un.org' },
]
export const SOURCES_DOC = DOC
