// MUN 核心知识库：委员会、议题、条款词库
// 依据 UNA-USA / THIMUN 通行格式整理

export interface Committee {
  id: string
  name: string
  en: string
  abbr: string
  desc: string
  scope: string
  unUrl: string
}

export const COMMITTEES: Committee[] = [
  { id: 'ga1', name: '联合国大会第一委员会', en: 'First Committee (DISEC)', abbr: 'DISEC', desc: '裁军与国际安全', scope: '军控、裁军、核不扩散、常规武器、太空安全、网络安全', unUrl: 'https://www.un.org/en/ga/first' },
  { id: 'ga2', name: '联合国大会第二委员会', en: 'Second Committee (ECOFIN)', abbr: 'ECOFIN', desc: '经济与金融', scope: '发展、贸易、债务、可持续发展目标、全球经济治理', unUrl: 'https://www.un.org/en/ga/second' },
  { id: 'ga3', name: '联合国大会第三委员会', en: 'Third Committee (SOCHUM)', abbr: 'SOCHUM', desc: '社会、人道主义和文化', scope: '人权、难民、妇女儿童、社会发展、人道援助', unUrl: 'https://www.un.org/en/ga/third' },
  { id: 'ga4', name: '联合国大会第四委员会', en: 'Fourth Committee (SPECPOL)', abbr: 'SPECPOL', desc: '特别政治和非殖民化', scope: '维和、非殖民化、巴勒斯坦、难民援助、新闻', unUrl: 'https://www.un.org/en/ga/fourth' },
  { id: 'ga5', name: '联合国大会第五委员会', en: 'Fifth Committee', abbr: 'ADMIN', desc: '行政和预算', scope: '联合国预算、会费、人力资源、行政改革', unUrl: 'https://www.un.org/en/ga/fifth' },
  { id: 'ga6', name: '联合国大会第六委员会', en: 'Sixth Committee (LEGAL)', abbr: 'LEGAL', desc: '法律', scope: '国际法、反恐立法、国际刑事法院、国家责任', unUrl: 'https://www.un.org/en/ga/sixth' },
  { id: 'sc', name: '安全理事会', en: 'Security Council', abbr: 'UNSC', desc: '国际和平与安全', scope: '冲突解决、制裁、维和授权、强制行动、核不扩散', unUrl: 'https://www.un.org/securitycouncil/' },
  { id: 'ecosoc', name: '经济及社会理事会', en: 'Economic and Social Council', abbr: 'ECOSOC', desc: '经济、社会、环境', scope: '可持续发展、人道协调、专门机构协调、教育文化', unUrl: 'https://www.un.org/ecosoc/' },
  { id: 'hrc', name: '人权理事会', en: 'Human Rights Council', abbr: 'HRC', desc: '促进与保护人权', scope: '人权状况、 Universal Periodic Review、特殊程序', unUrl: 'https://www.ohchr.org/en/hrbodies/hrc/pages/home.aspx' },
  { id: 'who', name: '世界卫生大会', en: 'World Health Assembly', abbr: 'WHA', desc: '全球公共卫生', scope: '流行病、药品可及、精神卫生、卫生体系、跨境卫生', unUrl: 'https://www.who.int/about/governance/world-health-assembly' },
  { id: 'unep', name: '联合国环境大会', en: 'UN Environment Assembly', abbr: 'UNEA', desc: '环境事务', scope: '气候、污染、生物多样性、海洋环境、化学品管理', unUrl: 'https://www.unep.org/about-un-environment/governance' },
  { id: 'csw', name: '妇女地位委员会', en: 'Commission on the Status of Women', abbr: 'CSW', desc: '性别平等', scope: '妇女权益、性别暴力、经济赋权、教育平等', unUrl: 'https://www.un.org/womenwatch/daw/csw/' },
]

// 热门议题（含英文检索词 + 推荐机构）
export interface HotTopic {
  zh: string
  en: string
  committee: string
}
export const HOT_TOPICS: HotTopic[] = [
  { zh: '人工智能治理', en: 'artificial intelligence governance', committee: 'ga6' },
  { zh: '气候难民', en: 'climate refugees displacement', committee: 'ga3' },
  { zh: '网络安全', en: 'cybersecurity international security', committee: 'ga1' },
  { zh: '也门人道危机', en: 'Yemen humanitarian crisis', committee: 'sc' },
  { zh: '核不扩散', en: 'nuclear non-proliferation disarmament', committee: 'ga1' },
  { zh: '妇女与儿童权益保护', en: 'protection of women and children rights', committee: 'ga3' },
  { zh: '全球粮食安全', en: 'global food security', committee: 'ecosoc' },
  { zh: '深海资源保护', en: 'deep sea marine biodiversity protection', committee: 'unep' },
  { zh: '大流行病防范', en: 'pandemic preparedness', committee: 'who' },
  { zh: '巴勒斯坦问题', en: 'question of Palestine', committee: 'ga4' },
  { zh: '外空军备竞赛', en: 'preventing arms race in outer space', committee: 'ga1' },
  { zh: '童工问题', en: 'child labor exploitation', committee: 'ga3' },
]

// ============ 决议草案条款词库 ============
// Preambulatory phrases（序言性，斜体，逗号结尾）
export const PREAMBULATORY_PHRASES: string[] = [
  'Acknowledging', 'Acting', 'Affirming', 'Alarmed by', 'Anxious to', 'Applauding',
  'Appreciating', 'Approving', 'Aware of', 'Bearing in mind', 'Believing', 'Cognizant of',
  'Commending', 'Concerned', 'Confident', 'Congratulating', 'Conscious', 'Considering',
  'Contemplating', 'Convinced', 'Declaring', 'Deeply concerned', 'Deeply conscious',
  'Deeply convinced', 'Deeply disturbed', 'Deeply regretting', 'Deploring', 'Desiring',
  'Determined', 'Dismayed at', 'Emphasizing', 'Encouraged by', 'Expecting',
  'Expressing appreciation', 'Expressing concern', 'Expressing satisfaction',
  'Firmly convinced', 'Fulfilling', 'Fully alarmed', 'Fully aware', 'Fully believing',
  'Further deploring', 'Further recalling', 'Gravely concerned', 'Guided by',
  'Having adopted', 'Having approved', 'Having considered', 'Having considered further',
  'Having decided', 'Having devoted attention', 'Having examined', 'Having heard',
  'Having noted', 'Having received', 'Having reviewed', 'Having studied', 'Keeping in mind',
  'Mindful of', 'Noting', 'Noting further', 'Noting with approval', 'Noting with concern',
  'Noting with deep concern', 'Noting with grave concern', 'Noting with regret',
  'Noting with satisfaction', 'Observing', 'Pointing out', 'Reaffirming', 'Realizing',
  'Recalling', 'Recognizing', 'Referring', 'Regretting', 'Reiterating', 'Reminding',
  'Seeking', 'Seized of', 'Stressing', 'Taking into account', 'Taking into consideration',
  'Taking note', 'Underlining', 'Viewing with appreciation', 'Viewing with apprehension',
  'Welcoming', 'Whereas',
]

// Operative phrases（执行性，下划线，分号结尾）
export const OPERATIVE_PHRASES: string[] = [
  'Accepts', 'Acknowledges', 'Adopts', 'Advises', 'Affirms', 'Agrees', 'Appeals',
  'Appreciates', 'Approves', 'Asks', 'Authorizes', 'Calls', 'Calls for', 'Calls upon',
  'Commends', 'Concurs', 'Condemns', 'Confirms', 'Congratulates', 'Considers', 'Decides',
  'Declares', 'Declares accordingly', 'Demands', 'Deplores', 'Designates', 'Determines',
  'Directs', 'Draws attention to', 'Emphasizes', 'Encourages', 'Endorses',
  'Expresses appreciation', 'Expresses hope', 'Expresses regret', 'Further invites',
  'Further proclaims', 'Further recommends', 'Further reminds', 'Further requests',
  'Further resolves', 'Has resolved', 'Instructs', 'Introduces', 'Invites', 'Mandates',
  'Notes', 'Notes with approval', 'Notes with concern', 'Notes with satisfaction',
  'Proclaims', 'Proposes', 'Reaffirms', 'Recalls', 'Recognizes', 'Recommends', 'Regrets',
  'Reiterates', 'Reminds', 'Renews its appeal', 'Repeals', 'Repeats', 'Requests',
  'Requires', 'Resolves', 'Solemnly affirms', 'Stresses', 'Strongly advises',
  'Strongly condemns', 'Strongly encourages', 'Suggests', 'Supports', 'Takes note of',
  'Transmits', 'Trusts', 'Underlines', 'Underscores', 'Urges', 'Welcomes',
]

// 语气梯度提示
export const OP_TONE: Record<string, string> = {
  Requests: '中性请求（最常用）',
  'Calls upon': '正式呼吁（较强）',
  Urges: '强烈敦促',
  Demands: '强制要求（安理会级，罕用）',
  Deplores: '遗憾谴责',
  Condemns: '谴责',
  'Strongly condemns': '最强烈谴责',
}
