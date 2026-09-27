import type { Source } from './sources'
const qs = (s: string) => encodeURIComponent(s.trim())

// ---------- 专门机构 ----------
const AGENCY: Source[] = [
  { id: 'ilo', cat: 'agency', name: '国际劳工组织', en: 'ILO', desc: '劳工标准、统计、报告', search: (q) => `https://www.ilo.org/global/search/lang--en/index.htm?q=${qs(q)}` },
  { id: 'fao', cat: 'agency', name: '粮农组织', en: 'FAO', desc: '粮食、农业、FAOSTAT', search: (q) => `https://www.fao.org/search/en/?q=${qs(q)}` },
  { id: 'fao_stat', cat: 'agency', name: 'FAOSTAT 数据', desc: '农林渔业统计', search: (q) => `https://www.fao.org/faostat/en/#search/${qs(q)}` },
  { id: 'unesco', cat: 'agency', name: '教科文组织', en: 'UNESCO', desc: '教育、世遗、科学', search: (q) => `https://www.unesco.org/en/search?q=${qs(q)}` },
  { id: 'who', cat: 'agency', name: '世界卫生组织', en: 'WHO', desc: '卫生决议、技术指南', search: (q) => `https://www.who.int/home/search?searchQuery=${qs(q)}` },
  { id: 'imf', cat: 'agency', name: '国际货币基金组织', en: 'IMF', desc: 'SDMX Central 数据（2025更新）', search: (q) => `https://www.imf.org/en/Search?q=${qs(q)}` },
  { id: 'icao', cat: 'agency', name: '国际民航组织', en: 'ICAO', desc: '航空标准与数据', search: (q) => `https://www.icao.int/Search/Pages/default.aspx?k=${qs(q)}` },
  { id: 'upu', cat: 'agency', name: '万国邮政联盟', en: 'UPU', desc: '邮政发展与标准', search: (q) => `https://www.upu.int/en/Search?keywords=${qs(q)}` },
  { id: 'itu', cat: 'agency', name: '国际电信联盟', en: 'ITU', desc: 'ICT数据与频谱', search: (q) => `https://www.itu.int/en/Search/Pages/results.aspx?k=${qs(q)}` },
  { id: 'wmo', cat: 'agency', name: '世界气象组织', en: 'WMO', desc: '气候气象公报', search: (q) => `https://wmo.int/search?query=${qs(q)}` },
  { id: 'imo', cat: 'agency', name: '国际海事组织', en: 'IMO', desc: '航运、海洋防污染', search: (q) => `https://www.imo.org/en/Search?q=${qs(q)}` },
  { id: 'wipo', cat: 'agency', name: '世界知识产权组织', en: 'WIPO', desc: '专利、商标、版权', search: (q) => `https://www.wipo.int/search/en/search.jsf?query=${qs(q)}` },
  { id: 'ifad', cat: 'agency', name: '国际农业发展基金', en: 'IFAD', desc: '农村金融与发展', search: (q) => `https://www.ifad.org/en/Search?search=${qs(q)}` },
  { id: 'unido', cat: 'agency', name: '联合国工业发展组织', en: 'UNIDO', desc: '工业统计、可持续工业', search: (q) => `https://www.unido.org/search?keyword=${qs(q)}` },
  { id: 'untourism', cat: 'agency', name: 'UN Tourism', desc: '旅游数据与政策（2024更名）', search: (q) => `https://www.untourism.int/search?q=${qs(q)}` },
  { id: 'wbank', cat: 'agency', name: '世界银行', en: 'World Bank', desc: '报告、项目、开放数据', search: (q) => `https://www.worldbank.org/en/search?q=${qs(q)}` },
  { id: 'wbank_api', cat: 'agency', name: '世行开放数据API', desc: '免key指标接口', search: (q) => `https://data.worldbank.org/?search=${qs(q)}` },
  { id: 'ifc_s', cat: 'agency', name: '国际金融公司', en: 'IFC', desc: '私营部门发展', search: gsite('ifc.org') },
  { id: 'icsid_s', cat: 'agency', name: '国际投资争端解决中心', en: 'ICSID', desc: '投资仲裁案例', search: gsite('icsid.worldbank.org') },
]

// ---------- 基金计划署 ----------
const FUND: Source[] = [
  { id: 'undp', cat: 'fund', name: '开发计划署', en: 'UNDP', desc: '人类发展、治理', search: (q) => `https://www.undp.org/search?query=${qs(q)}` },
  { id: 'hdr', cat: 'fund', name: '人类发展报告', en: 'Human Development Reports', desc: 'HDI及多维数据', search: (q) => `https://hdr.undp.org/search?query=${qs(q)}` },
  { id: 'unicef', cat: 'fund', name: '儿童基金会', en: 'UNICEF', desc: '儿童项目与倡导', search: (q) => `https://www.unicef.org/search?query=${qs(q)}` },
  { id: 'unicef_data', cat: 'fund', name: 'UNICEF Data', desc: '儿童指标数据库', search: (q) => `https://data.unicef.org/?s=${qs(q)}` },
  { id: 'unhcr', cat: 'fund', name: '难民署', en: 'UNHCR', desc: '难民保护与数据', search: (q) => `https://www.unhcr.org/search?keywords=${qs(q)}` },
  { id: 'wfp', cat: 'fund', name: '世界粮食计划署', en: 'WFP', desc: '粮食援助、VAM', search: (q) => `https://www.wfp.org/search?query=${qs(q)}` },
  { id: 'hungermap', cat: 'fund', name: 'Hunger Map Live', desc: '实时粮食不安全地图', search: () => 'https://hungermap.wfp.org' },
  { id: 'unfpa', cat: 'fund', name: '人口基金', en: 'UNFPA', desc: '人口、生殖健康', search: (q) => `https://www.unfpa.org/search?query=${qs(q)}` },
  { id: 'unctad', cat: 'fund', name: '贸易和发展会议', en: 'UNCTAD', desc: '贸易投资报告', search: (q) => `https://unctad.org/search?query=${qs(q)}` },
  { id: 'unep', cat: 'fund', name: '环境规划署', en: 'UNEP', desc: '环境评估、数据', search: (q) => `https://www.unep.org/search?query=${qs(q)}` },
  { id: 'unhabitat', cat: 'fund', name: '人居署', en: 'UN-Habitat', desc: '城市化数据', search: (q) => `https://unhabitat.org/search?query=${qs(q)}` },
  { id: 'unwomen', cat: 'fund', name: '妇女署', en: 'UN Women', desc: '性别平等数据', search: (q) => `https://www.unwomen.org/en/search?query=${qs(q)}` },
  { id: 'unrwa', cat: 'fund', name: '近东救济工程处', en: 'UNRWA', desc: '巴难民服务', search: gsite('unrwa.org') },
  { id: 'unaids', cat: 'fund', name: '艾滋病规划署', en: 'UNAIDS', desc: 'HIV数据与报告', search: (q) => `https://www.unaids.org/en/search?query=${qs(q)}` },
  { id: 'ocha', cat: 'fund', name: '人道协调厅', en: 'OCHA', desc: '人道形势、FTS', search: (q) => `https://www.unocha.org/search?query=${qs(q)}` },
  { id: 'fts', cat: 'fund', name: '金融追踪服务FTS', desc: '人道资金流向', search: (q) => `https://fts.unocha.org/search?query=${qs(q)}` },
  { id: 'unodc', cat: 'fund', name: '毒品和犯罪问题办公室', en: 'UNODC', desc: '毒品犯罪数据', search: (q) => `https://www.unodc.org/unodc/en/search.html?query=${qs(q)}` },
  { id: 'reliefweb', cat: 'fund', name: 'ReliefWeb', desc: '人道情报、报告、API', search: (q) => `https://reliefweb.int/search?search=${qs(q)}` },
  { id: 'reliefweb_api', cat: 'fund', name: 'ReliefWeb API', desc: '结构化人道数据接口', search: (q) => `https://reliefweb.int/report?search=${qs(q)}` },
  { id: 'iaea', cat: 'fund', name: '国际原子能机构', en: 'IAEA', desc: '核安全、保障监督', search: (q) => `https://www.iaea.org/search?keyword=${qs(q)}` },
  { id: 'iom', cat: 'fund', name: '国际移民组织', en: 'IOM', desc: '移民数据', search: (q) => `https://www.iom.int/search?query=${qs(q)}` },
  { id: 'unitar', cat: 'fund', name: '训练研究所', en: 'UNITAR', desc: '能力建设', search: gsite('unitar.org') },
  { id: 'unfccc', cat: 'fund', name: '气候公约/COP', en: 'UNFCCC', desc: '气候谈判文件', search: (q) => `https://unfccc.int/zh/search?query=${qs(q)}` },
  { id: 'cbd', cat: 'fund', name: '生物多样性公约', en: 'CBD', desc: '昆蒙框架', search: (q) => `https://www.cbd.int/search/?q=${qs(q)}` },
  { id: 'unccd', cat: 'fund', name: '防治荒漠化公约', en: 'UNCCD', desc: '土地治理', search: (q) => `https://www.unccd.int/search?query=${qs(q)}` },
  { id: 'opcw', cat: 'fund', name: '禁化武组织', en: 'OPCW', desc: '化武核查', search: gsite('opcw.org') },
]

// ---------- 综合数据 ----------
const DATA: Source[] = [
  { id: 'un_data', cat: 'data', name: 'UN Data', desc: '联合国综合统计门户', search: (q) => `https://data.un.org/Search.aspx?q=${qs(q)}` },
  { id: 'unstats', cat: 'data', name: '联合国统计司', en: 'UNSD', desc: '官方统计标准', search: (q) => `https://unstats.un.org/home/search/?search=${qs(q)}` },
  { id: 'sdg_data', cat: 'data', name: 'SDG Indicators', desc: '可持续发展目标指标库', search: () => 'https://unstats.un.org/sdgs/dataportal' },
  { id: 'oecd_data', cat: 'data', name: 'OECD Data', desc: '发达国家指标', search: (q) => `https://data.oecd.org/searchresults/?q=${qs(q)}` },
  { id: 'owid', cat: 'data', name: 'Our World in Data', desc: '可视化研究与图表', search: (q) => `https://ourworldindata.org/search?q=${qs(q)}` },
  { id: 'gapminder', cat: 'data', name: 'Gapminder', desc: '发展趋势气泡图', search: (q) => `https://www.gapminder.org/?s=${qs(q)}` },
  { id: 'hdx', cat: 'data', name: '人道数据交换HDX', desc: '危机数据集下载', search: (q) => `https://data.humdata.org/search?q=${qs(q)}` },
  { id: 'imf_data', cat: 'data', name: 'IMF SDMX数据', desc: '宏观经济时序（2025新版）', search: (q) => `https://data.imf.org/?search=${qs(q)}` },
  { id: 'sdmx_central', cat: 'data', name: 'SDMX Central', desc: '国际组织数据交换面', search: (q) => `https://sdmxcentral.imf.org/vis?search=${qs(q)}` },
  { id: 'knoema', cat: 'data', name: 'Knoema', desc: '综合数据平台', search: (q) => `https://knoema.com/search?query=${qs(q)}` },
]

// ---------- 新闻情报 ----------
const NEWS: Source[] = [
  { id: 'scr', cat: 'news', name: '安理会报告', en: 'Security Council Report', desc: '议程预测、表决跟踪', search: (q) => `https://www.securitycouncilreport.org/?s=${qs(q)}` },
  { id: 'newhum', cat: 'news', name: 'The New Humanitarian', desc: '人道危机深度报道', search: (q) => `https://www.thenewhumanitarian.org/search?query=${qs(q)}` },
  { id: 'passblue', cat: 'news', name: 'PassBlue', desc: 'UN独立新闻', search: (q) => `https://www.passblue.org/?s=${qs(q)}` },
  { id: 'devex', cat: 'news', name: 'Devex', desc: '全球发展行业新闻', search: (q) => `https://www.devex.org/search?q=${qs(q)}` },
  { id: 'ipsnews', cat: 'news', name: 'Inter Press Service', desc: '发展中国家视角通讯', search: (q) => `https://www.ipsnews.net/?s=${qs(q)}` },
  { id: 'guardian_global', cat: 'news', name: 'Guardian Global Development', desc: '全球发展报道', search: gsite('theguardian.com/global-development') },
  { id: 'reuters_un', cat: 'news', name: 'Reuters UN', desc: '通讯社UN报道', search: gsite('reuters.com') },
]

// ---------- 国家研究 ----------
const COUNTRY: Source[] = [
  { id: 'cia_fb', cat: 'country', name: 'CIA World Factbook', desc: '国情全貌', search: (q) => `https://www.cia.gov/the-world-factbook/search/?search=${qs(q)}` },
  { id: 'msr', cat: 'country', name: 'Member States on the Record', desc: '各国UN发言记录', search: (q) => `https://www.un.org/en/library/member-states-record?q=${qs(q)}` },
  { id: 'mfa_dir', cat: 'country', name: '各国外交部', desc: '官方立场声明', search: (q) => `https://www.google.com/search?q=${qs(`ministry of foreign affairs ${q}`)}` },
  { id: 'permanent_missions', cat: 'country', name: '常驻UN代表团名录', desc: '各国代表团官网', search: () => 'https://www.un.org/en/member-states' },
  { id: 'gov_archive', cat: 'country', name: '政府档案/国会记录', desc: '立法与官方文件', search: (q) => `https://www.google.com/search?q=${qs(`government ${q} official statement`)}` },
]

// ---------- MUN 教学与比赛 ----------
const MUN: Source[] = [
  { id: 'bestdelegate', cat: 'mun', name: 'Best Delegate', desc: 'MUN资源/教程老牌站', search: (q) => `https://bestdelegate.com/?s=${qs(q)}`, kind: 'teaching' },
  { id: 'unausa', cat: 'mun', name: 'UNA-USA', desc: '美式规则与资源', search: () => 'https://unausa.org/programs/model-un/', kind: 'teaching' },
  { id: 'thimun', cat: 'mun', name: 'THIMUN 海牙', desc: '欧式规则与会议', search: () => 'https://thehague.thimun.org/', kind: 'teaching' },
  { id: 'nmun', cat: 'mun', name: 'NMUN', desc: '全美模拟联合国', search: () => 'https://www.nmun.org', kind: 'teaching' },
  { id: 'hmun', cat: 'mun', name: '哈佛 HMUN', desc: '背景指南', search: () => 'https://www.harvardmun.org', kind: 'teaching' },
  { id: 'munuc', cat: 'mun', name: 'MUNUC 芝加哥', desc: '背景指南', search: () => 'https://munuc.org', kind: 'teaching' },
  { id: 'ymun', cat: 'mun', name: '耶鲁 YMUN', desc: '背景指南', search: () => 'https://ymun.yira.org', kind: 'teaching' },
  { id: 'naimun', cat: 'mun', name: 'NAIMUN 乔治城', desc: '背景指南', search: () => 'https://naimun.modelun.org', kind: 'teaching' },
  { id: 'wimun', cat: 'mun', name: 'WFUNA WIMUN', desc: 'WFUNA规则', search: () => 'https://www.wfuna.org/wimun', kind: 'teaching' },
  { id: 'muninstitute', cat: 'mun', name: 'MUN Institute', desc: '培训课程', search: () => 'https://muninstitute.com', kind: 'teaching' },
  { id: 'wise_mun', cat: 'mun', name: 'WiseMee MUN', desc: '决议词库工具', search: (q) => `https://wisemee.com/?q=${qs(q)}`, kind: 'teaching' },
  { id: 'reddit_mun', cat: 'mun', name: 'Reddit r/MUN', desc: '社区问答', search: (q) => `https://www.reddit.com/r/MUN/search/?q=${qs(q)}`, kind: 'teaching' },
  { id: 'mun_guide_pdf', cat: 'mun', name: 'MUN入门手册合集', desc: '各会规则PDF', search: (q) => `https://www.google.com/search?q=${qs(`model united nations delegate preparation guide ${q} filetype:pdf`)}`, kind: 'teaching' },
  { id: 'youtube_mun', cat: 'mun', name: 'YouTube MUN教学', desc: '规则与发言示范', search: (q) => `https://www.youtube.com/results?search_query=${qs(`model united nations ${q}`)}`, kind: 'teaching' },
  { id: 'qmun_guide', cat: 'mun', name: 'QMUN/国内模联资料', desc: '国内会议背景指南', search: (q) => `https://www.google.com/search?q=${qs(`模拟联合国 ${q} 背景文件`)}`, kind: 'teaching' },
  { id: 'un_cyberschool', cat: 'mun', name: 'UN CyberSchoolbus', desc: '联合国官方MUN教学', search: () => 'https://www.un.org/en/model-united-nations', kind: 'teaching' },
  { id: 'mun_rules_compare', cat: 'mun', name: '议事规则对比资料', desc: 'UNA-USA vs THIMUN', search: (q) => `https://www.google.com/search?q=${qs(`UNA-USA THIMUN rules difference ${q}`)}`, kind: 'teaching' },
  { id: 'delegate_tips', cat: 'mun', name: '获奖代表技巧', desc: '发言/斡旋攻略', search: (q) => `https://bestdelegate.com/?s=${qs(`award ${q}`)}`, kind: 'teaching' },
  { id: 'mun_conferences', cat: 'mun', name: '全球MUN会议日历', desc: '会议检索', search: () => 'https://www.mymun.net', kind: 'teaching' },
  { id: 'mymun', cat: 'mun', name: 'myMUN', desc: '会议申请平台', search: (q) => `https://mymun.com/?q=${qs(q)}`, kind: 'teaching' },
]

export const ALL_SOURCES_EXTRA: Source[] = [...AGENCY, ...FUND, ...DATA, ...NEWS, ...COUNTRY, ...MUN]

function gsite(dom: string) {
  return (q: string) => `https://www.google.com/search?q=${encodeURIComponent(`site:${dom} ${q}`)}`
}
