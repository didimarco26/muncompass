// MUN 本地推荐引擎：议题分类 + 条款推荐 + 讲稿论点推荐 + 语气/时长配置
// 纯前端规则，无需后端

export type TopicCategory =
  | 'climate_env' | 'refugees_hum' | 'health' | 'peace_security'
  | 'cyber_ai' | 'economy_dev' | 'rights_social' | 'legal_crime' | 'generic'

export const CATEGORY_LABEL: Record<TopicCategory, string> = {
  climate_env: '气候与环境',
  refugees_hum: '难民与人道',
  health: '公共卫生',
  peace_security: '和平与安全',
  cyber_ai: '科技（AI/网络/外空）',
  economy_dev: '经济与发展',
  rights_social: '人权与社会',
  legal_crime: '法律与犯罪',
  generic: '综合议题',
}

const CATEGORY_KEYWORDS: [TopicCategory, string[]][] = [
  ['climate_env', ['climate', 'environment', 'carbon', 'emission', 'pollution', 'biodiversity', 'ocean', 'forest', 'desert', 'sustainab', 'energy', 'plastic', 'marine', 'warming', '气候', '环境', '可持续', '海洋', '污染']],
  ['refugees_hum', ['refugee', 'displaced', 'displacement', 'humanitarian', 'migration', 'migrant', 'asylum', 'famine', 'hunger', 'idp', 'food security', 'food insecurity', '难民', '移民', '人道', '流离', '粮食安全']],
  ['health', ['health', 'pandemic', 'epidemic', 'disease', 'vaccine', 'virus', 'medical', 'mental', '卫生', '疫情', '疾病', '医疗']],
  ['peace_security', ['war', 'conflict', 'peace', 'weapon', 'nuclear', 'disarmament', 'military', 'arms', 'terror', 'ceasefire', '战争', '冲突', '核', '武器', '裁军', '安全']],
  ['cyber_ai', ['cyber', 'artificial intelligence', ' ai ', 'digital', 'internet', 'outer space', 'technology', 'data governance', '网络', '人工智能', '外空', '科技']],
  ['economy_dev', ['economy', 'trade', 'debt', 'finance', 'poverty', 'development', 'gdp', 'investment', '经济', '贸易', '发展', '贫困', '金融']],
  ['rights_social', ['human rights', 'women', 'children', 'child labor', 'child labour', 'gender', 'education', 'discrimination', 'indigenous', 'labor rights', 'labour rights', 'forced labour', '人权', '妇女', '儿童', '童工', '教育', '歧视']],
  ['legal_crime', ['law', 'crime', 'criminal', 'justice', 'treaty', 'corruption', 'legal', 'trafficking', '法律', '犯罪', '司法', '腐败']],
]

export function categorizeTopic(topic: string, committee = ''): TopicCategory {
  const t = ' ' + topic.toLowerCase() + ' ' + committee.toLowerCase() + ' '
  let best: TopicCategory = 'generic'
  let bestScore = 0
  for (const [cat, words] of CATEGORY_KEYWORDS) {
    const score = words.reduce((n, w) => n + (t.includes(w) ? 1 : 0), 0)
    if (score > bestScore) { bestScore = score; best = cat }
  }
  return best
}

// ============ 决议条款推荐 ============
export interface ClauseSuggestion {
  phrase: string
  text: string // 带括号占位的模板
}
export interface ResRecommendation {
  category: TopicCategory
  preamb: ClauseSuggestion[]
  oper: ClauseSuggestion[]
  rationale: string
}

const RES_REC: Record<Exclude<TopicCategory, 'generic'>, ResRecommendation> = {
  climate_env: {
    category: 'climate_env',
    rationale: '气候类决议通常以《联合国气候变化框架公约》《巴黎协定》为法律锚点，序言强调科学共识与共同但有区别的责任（CBDR），执行条款围绕减排承诺、气候资金、技术转让与适应行动。',
    preamb: [
      { phrase: 'Recalling', text: 'the United Nations Framework Convention on Climate Change and the Paris Agreement, as well as Sustainable Development Goal 13' },
      { phrase: 'Alarmed by', text: 'the continued rise in global greenhouse gas emissions and the increasing frequency of climate-related disasters' },
      { phrase: 'Recognizing', text: 'the findings of the Intergovernmental Panel on Climate Change and the principle of common but differentiated responsibilities' },
      { phrase: 'Deeply concerned', text: 'that developing and most vulnerable countries bear the heaviest impacts despite contributing the least to emissions' },
    ],
    oper: [
      { phrase: 'Calls upon', text: 'all parties to strengthen and fully implement their nationally determined contributions in line with the 1.5°C goal' },
      { phrase: 'Urges', text: 'developed countries to fulfill their climate finance commitments, including the annual US$100 billion goal and the new collective quantified goal' },
      { phrase: 'Requests', text: 'the United Nations Environment Programme to support developing states in adaptation planning and access to green technology' },
      { phrase: 'Encourages', text: 'the scaling of renewable energy investment and the phasing out of inefficient fossil fuel subsidies' },
    ],
  },
  refugees_hum: {
    category: 'refugees_hum',
    rationale: '人道/难民类决议以1951年《难民地位公约》、大会第46/182号决议和《全球难民契约》为核心，强调不推回原则、负担共担与人道准入。',
    preamb: [
      { phrase: 'Reaffirming', text: 'the Global Compact on Refugees and the fundamental principle of non-refoulement under international refugee law' },
      { phrase: 'Recalling', text: 'General Assembly resolution 46/182 on the strengthening of humanitarian assistance' },
      { phrase: 'Deeply concerned', text: 'by the record number of forcibly displaced persons worldwide and the shortfall in humanitarian funding' },
      { phrase: 'Recognizing', text: 'that host countries, many of them developing states, shoulder a disproportionate share of the burden' },
    ],
    oper: [
      { phrase: 'Calls upon', text: 'all parties to respect international humanitarian law and guarantee unimpeded humanitarian access' },
      { phrase: 'Urges', text: 'member states to increase burden- and responsibility-sharing through resettlement, complementary pathways and financial support' },
      { phrase: 'Requests', text: 'the Office of the United Nations High Commissioner for Refugees to strengthen protection monitoring and durable solutions' },
      { phrase: 'Further requests', text: 'the consolidation of funding appeals to ensure predictable and flexible financing for host communities' },
    ],
  },
  health: {
    category: 'health',
    rationale: '卫生类决议以《世卫组织组织法》和《国际卫生条例（2005）》为依据，兼顾疫情监测、药品疫苗公平可及与卫生体系韧性。',
    preamb: [
      { phrase: 'Recalling', text: 'the Constitution of the World Health Organization and the International Health Regulations (2005)' },
      { phrase: 'Alarmed by', text: 'the spread of [disease] and its severe social and economic consequences' },
      { phrase: 'Recognizing', text: 'the enjoyment of the highest attainable standard of health as a fundamental human right' },
      { phrase: 'Deeply concerned', text: 'by persistent shortages of health workers, medical supplies and equitable access in affected regions' },
    ],
    oper: [
      { phrase: 'Urges', text: 'member states to strengthen disease surveillance, early warning and health-system preparedness' },
      { phrase: 'Requests', text: 'the World Health Organization to coordinate the international response and provide technical assistance' },
      { phrase: 'Calls upon', text: 'states and manufacturers to ensure equitable and affordable access to vaccines, diagnostics and treatments' },
      { phrase: 'Encourages', text: 'increased investment in primary health care and international cooperation on medical research' },
    ],
  },
  peace_security: {
    category: 'peace_security',
    rationale: '安全类决议以《联合国宪章》为锚，序言谴责暴力、回顾相关安理会决议；执行条款强度高（停火、制裁、授权行动）。注意 Demands/Authorizes 一般仅安理会使用。',
    preamb: [
      { phrase: 'Reaffirming', text: 'its strong commitment to the sovereignty, independence and territorial integrity of all states, in accordance with the Charter of the United Nations' },
      { phrase: 'Gravely concerned', text: 'by the escalation of hostilities and the deteriorating humanitarian situation' },
      { phrase: 'Recalling', text: 'all its relevant resolutions and statements on this matter' },
      { phrase: 'Condemning', text: 'all attacks against civilians, civilian infrastructure and humanitarian and medical personnel' },
    ],
    oper: [
      { phrase: 'Demands', text: 'the immediate and complete cessation of all hostilities and full respect for the ceasefire agreement' },
      { phrase: 'Calls upon', text: 'all parties to return to inclusive negotiations under the auspices of the United Nations' },
      { phrase: 'Requests', text: 'the Secretary-General to appoint a special envoy and report on the implementation of this resolution' },
      { phrase: 'Decides', text: 'to remain actively seized of the matter and to review further measures, including targeted sanctions, if compliance is not achieved' },
    ],
  },
  cyber_ai: {
    category: 'cyber_ai',
    rationale: '科技类决议强调负责任国家行为规范、能力建设与多方利益相关者对话，兼顾创新机遇与数字鸿沟、恶意使用风险。',
    preamb: [
      { phrase: 'Recognizing', text: 'the significant opportunities that [cyber/artificial intelligence/space] technologies offer for sustainable development' },
      { phrase: 'Deeply concerned', text: 'by the risks of malicious use, disinformation, and the widening digital and technological divide' },
      { phrase: 'Recalling', text: 'the norms, rules and principles of responsible state behavior in cyberspace and relevant ethical frameworks' },
      { phrase: 'Bearing in mind', text: 'the need for an inclusive, multi-stakeholder approach and full respect for human rights online' },
    ],
    oper: [
      { phrase: 'Encourages', text: 'member states to adopt and implement international norms of responsible behavior and sound governance standards' },
      { phrase: 'Calls for', text: 'expanded capacity-building and technology transfer to developing countries' },
      { phrase: 'Requests', text: 'the Secretary-General to convene a multi-stakeholder expert dialogue and present recommendations' },
      { phrase: 'Further recommends', text: 'the development of transparent, accountable and human-centric safeguards, including data protection' },
    ],
  },
  economy_dev: {
    category: 'economy_dev',
    rationale: '发展类决议以2030议程、《亚的斯亚贝巴行动议程》为框架，聚焦发展筹资、债务可持续、贸易公平与多边机构改革。',
    preamb: [
      { phrase: 'Recalling', text: 'the 2030 Agenda for Sustainable Development and the Addis Ababa Action Agenda' },
      { phrase: 'Recognizing', text: 'the growing debt vulnerabilities and uneven recovery facing many developing economies' },
      { phrase: 'Concerned', text: 'by rising inequality, trade barriers and the shortfall in official development assistance commitments' },
      { phrase: 'Bearing in mind', text: 'the special needs of least developed, landlocked and small island developing states' },
    ],
    oper: [
      { phrase: 'Calls upon', text: 'the international community to advance reform of the international financial architecture and voting representation' },
      { phrase: 'Requests', text: 'expanded debt relief and fair, transparent debt-restructuring mechanisms for vulnerable countries' },
      { phrase: 'Encourages', text: 'an open, rules-based multilateral trading system and increased foreign direct investment in productive sectors' },
      { phrase: 'Urges', text: 'developed countries to honor the target of devoting 0.7 per cent of gross national income to official development assistance' },
    ],
  },
  rights_social: {
    category: 'rights_social',
    rationale: '人权社会类决议以《世界人权宣言》及核心人权公约（如CEDAW、CRC）为依据，先谴责侵权、再要求立法与制度改革。',
    preamb: [
      { phrase: 'Reaffirming', text: 'the purposes and principles of the Charter of the United Nations and the Universal Declaration of Human Rights' },
      { phrase: 'Recalling', text: 'the Convention on the Elimination of All Forms of Discrimination against Women and the Convention on the Rights of the Child' },
      { phrase: 'Deeply concerned', text: 'by persistent discrimination, violence and the exclusion of affected groups from education and economic life' },
      { phrase: 'Recognizing', text: 'the important progress already achieved while noting that major implementation gaps remain' },
    ],
    oper: [
      { phrase: 'Condemns', text: 'all forms of discrimination and violence and calls for the protection of victims and witnesses' },
      { phrase: 'Calls upon', text: 'member states to enact and enforce legislative reforms and to withdraw discriminatory provisions' },
      { phrase: 'Urges', text: 'states to guarantee equal access to quality education, employment and justice' },
      { phrase: 'Requests', text: 'the Office of the High Commissioner to monitor the situation and report regularly to the Council' },
    ],
  },
  legal_crime: {
    category: 'legal_crime',
    rationale: '犯罪类决议以《联合国打击跨国有组织犯罪公约》《反腐败公约》为核心，强调批准履约、司法协助与能力建设。',
    preamb: [
      { phrase: 'Recalling', text: 'the United Nations Convention against Transnational Organized Crime and the Convention against Corruption' },
      { phrase: 'Deeply concerned', text: 'by the expansion of transnational crime, trafficking and the resulting climate of impunity' },
      { phrase: 'Recognizing', text: 'the central role of the rule of law, independent judiciaries and international judicial cooperation' },
      { phrase: 'Bearing in mind', text: 'that effective prevention must complement enforcement and prosecution' },
    ],
    oper: [
      { phrase: 'Urges', text: 'all states to ratify and fully implement the relevant conventions and protocols without delay' },
      { phrase: 'Calls upon', text: 'states to strengthen mutual legal assistance, extradition and information-sharing arrangements' },
      { phrase: 'Requests', text: 'the United Nations Office on Drugs and Crime to provide technical and legislative assistance' },
      { phrase: 'Encourages', text: 'cross-border cooperation, victim protection and preventive measures addressing root causes' },
    ],
  },
}

const GENERIC_REC: ResRecommendation = {
  category: 'generic',
  rationale: '该议题跨多个领域。建议按「回顾国际法依据 → 陈述现状关切 → 提出具体行动」的通用逻辑起草，并到资料检索页核实相关公约与决议编号。',
  preamb: [
    { phrase: 'Recalling', text: 'the Charter of the United Nations and all relevant resolutions on this issue' },
    { phrase: 'Recognizing', text: 'the complexity of this matter and its implications for international cooperation' },
    { phrase: 'Deeply concerned', text: 'by the continued challenges faced by the international community in this area' },
  ],
  oper: [
    { phrase: 'Calls upon', text: 'member states to strengthen cooperation and fulfill their existing obligations' },
    { phrase: 'Requests', text: 'the Secretary-General to report on progress and options for further action' },
    { phrase: 'Encourages', text: 'capacity-building, resource mobilization and inclusive multi-stakeholder partnerships' },
  ],
}

export function recommendResolution(cat: TopicCategory): ResRecommendation {
  return cat === 'generic' ? GENERIC_REC : RES_REC[cat]
}

// ============ 讲稿论点推荐 ============
export interface PointSuggestion {
  claim: string
  evidence: string // 建议查找的权威来源
}

const SPEECH_POINTS: Record<Exclude<TopicCategory, 'generic'>, PointSuggestion[]> = {
  climate_env: [
    { claim: 'the climate crisis is accelerating beyond previous projections', evidence: 'IPCC Sixth Assessment Report; WMO State of the Global Climate' },
    { claim: 'vulnerable and developing countries suffer the worst impacts despite the lowest emissions', evidence: 'ND-GAIN Country Index; UNEP Adaptation Gap Report' },
    { claim: 'current national pledges and climate finance remain insufficient to meet the 1.5°C goal', evidence: 'UNEP Emissions Gap Report; OECD climate finance tracking' },
    { claim: 'a just transition, scaled adaptation finance and technology transfer are both necessary and achievable', evidence: 'ILO just transition guidelines; Green Climate Fund reports' },
  ],
  refugees_hum: [
    { claim: 'forced displacement has reached record levels and is increasingly protracted', evidence: 'UNHCR Global Trends Report' },
    { claim: 'host communities, often in developing countries, bear an unsustainable share of the burden', evidence: 'UNHCR Global Compact on Refugees; World Bank refugee reports' },
    { claim: 'humanitarian appeals remain severely underfunded, threatening lives and protection', evidence: 'OCHA Global Humanitarian Overview; FTS funding data' },
    { claim: 'durable solutions require responsibility-sharing, legal pathways and development investment', evidence: 'Global Compact on Refugees; IOM World Migration Report' },
  ],
  health: [
    { claim: 'health emergencies reveal deep gaps in preparedness and health-system resilience', evidence: 'WHO World Health Statistics; GPMB reports' },
    { claim: 'unequal access to vaccines, treatments and supplies costs lives and prolongs crises', evidence: 'WHO; UNICEF supply data' },
    { claim: 'investing in primary health care and surveillance yields the highest protective return', evidence: 'WHO primary health care reports; World Bank health financing data' },
    { claim: 'no country can address cross-border health threats acting alone', evidence: 'International Health Regulations (2005); WHO guidance' },
  ],
  peace_security: [
    { claim: 'the escalation of hostilities inflicts unacceptable suffering, above all on civilians', evidence: 'OCHA situation reports; OHCHR civilian casualty data' },
    { claim: 'violations of international humanitarian and human rights law must not go unpunished', evidence: 'Security Council resolutions; ICC/OHCHR findings' },
    { claim: 'military means alone cannot produce a durable political solution', evidence: 'Security Council Report; UN mediation guidance' },
    { claim: 'an inclusive negotiated settlement and credible guarantees offer the only sustainable path', evidence: 'Secretary-General reports; relevant UN envoys' },
  ],
  cyber_ai: [
    { claim: 'emerging technologies create unprecedented opportunities but also serious governance risks', evidence: 'UN SG reports; ITU/UNCTAD analyses' },
    { claim: 'the digital and technological divide threatens to widen existing inequalities', evidence: 'ITU Digital Development Reports; UNCTAD digital economy reports' },
    { claim: 'agreed norms of responsible behavior are essential to prevent escalation and harm', evidence: 'GGE/OEWG reports on responsible state behavior in cyberspace' },
    { claim: 'human-centric, inclusive governance and capacity-building must keep pace with innovation', evidence: 'UNESCO AI ethics recommendation; multi-stakeholder frameworks' },
  ],
  economy_dev: [
    { claim: 'the recovery is uneven and debt vulnerabilities are mounting across developing countries', evidence: 'IMF World Economic Outlook; World Bank Debt Reports' },
    { claim: 'inequality and unequal trade opportunities undermine the 2030 Agenda', evidence: 'UNDP Human Development Report; UNCTAD Trade and Development Report' },
    { claim: 'reform of the international financial architecture is overdue and widely supported', evidence: 'UN SG SDG Stimulus; Addis Ababa Action Agenda follow-up' },
    { claim: 'mobilizing domestic resources, investment and ODA can close the SDG financing gap', evidence: 'OECD development finance data; UN financing for sustainable development reports' },
  ],
  rights_social: [
    { claim: 'discrimination and exclusion remain structural, not isolated, problems', evidence: 'OHCHR reports; relevant treaty body concluding observations' },
    { claim: 'violations impose lasting social and economic costs on entire communities', evidence: 'UN Women; UNICEF data and reports' },
    { claim: 'existing legal commitments are inadequate unless enforced with resources and accountability', evidence: 'Universal Periodic Review outcomes; OHCHR reporting' },
    { claim: 'equal access to education, justice and economic opportunity transforms outcomes', evidence: 'UNESCO education data; UN Women flagship reports' },
  ],
  legal_crime: [
    { claim: 'transnational crime and corruption undermine security, development and trust in institutions', evidence: 'UNODC World Drug Report; crime trend studies' },
    { claim: 'gaps between ratification and implementation allow impunity to persist', evidence: 'UNCAC/UNTOC implementation review reports' },
    { claim: 'weak judicial cooperation across borders is exploited by criminal networks', evidence: 'UNODC legal assistance data; relevant resolutions' },
    { claim: 'prevention, victim protection and the rule of law must be strengthened together', evidence: 'UNODC technical guides; CCPCJ outcomes' },
  ],
}

export function recommendPoints(cat: TopicCategory): PointSuggestion[] {
  if (cat === 'generic') {
    return [
      { claim: 'state the scale and nature of the problem with the latest available data', evidence: 'UN Digital Library; relevant UN agency reports' },
      { claim: 'explain why the status quo is unacceptable for your country and the international community', evidence: 'country statements; CIA World Factbook; voting records' },
      { claim: 'present a concrete, feasible solution and identify who should act', evidence: 'existing resolutions and agency mandates' },
    ]
  }
  return SPEECH_POINTS[cat]
}

// ============ 时长与语气 ============
export type SpeechDuration = 1 | 2 | 5 | 10
export type SpeechTone = 'advisory' | 'declarative' | 'condemnatory' | 'conciliatory' | 'urgent'

export interface DurationCfg { id: SpeechDuration; label: string; words: [number, number]; maxPoints: number }
export const DURATIONS: DurationCfg[] = [
  { id: 1, label: '1 分钟', words: [120, 160], maxPoints: 2 },
  { id: 2, label: '2 分钟', words: [250, 300], maxPoints: 3 },
  { id: 5, label: '5 分钟', words: [620, 720], maxPoints: 5 },
  { id: 10, label: '10 分钟', words: [1250, 1450], maxPoints: 7 },
]

export interface ToneCfg {
  id: SpeechTone
  label: string
  desc: string
  openers: string[]
  closers: string[]
  verbs: string[]
}
export const TONES: ToneCfg[] = [
  {
    id: 'advisory', label: '建议性', desc: '建设性、协商式，适合提出方案与合作倡议',
    openers: ['My delegation would like to offer a constructive perspective on this issue.', 'We believe this is an opportunity for collective, forward-looking action.'],
    closers: ['My delegation respectfully recommends that this committee consider these proposals.', 'We stand ready to work with all partners toward these shared goals.'],
    verbs: ['suggests', 'recommends', 'proposes', 'encourages'],
  },
  {
    id: 'declarative', label: '陈述性', desc: '客观、正式地阐明本国立场与事实',
    openers: ['My delegation wishes to state clearly the position of our country on this matter.', 'Allow me to set out the facts and principles that guide our position.'],
    closers: ['This is the firm and consistent position of my delegation.', 'We shall continue to act in accordance with these principles.'],
    verbs: ['affirms', 'states', 'notes', 'reaffirms'],
  },
  {
    id: 'condemnatory', label: '谴责性', desc: '针对侵权、暴行或违约，语气强硬严肃',
    openers: ['My delegation must raise its voice in the strongest possible terms today.', 'What we are witnessing demands an unambiguous response from this body.'],
    closers: ['My delegation condemns these acts and will not remain silent in the face of impunity.', 'Those responsible must be held to account without exception.'],
    verbs: ['strongly condemns', 'deplores', 'rejects', 'denounces'],
  },
  {
    id: 'conciliatory', label: '调解性', desc: '释放善意、寻求共识与斡旋',
    openers: ['My delegation comes before you in a spirit of dialogue and compromise.', 'Despite our differences, our common interests far outweigh them.'],
    closers: ['We extend our hand to every delegation willing to build consensus.', 'My delegation remains committed to a negotiated, shared solution.'],
    verbs: ['welcomes', 'appreciates', 'stands ready', 'supports'],
  },
  {
    id: 'urgent', label: '敦促性', desc: '时间紧迫，要求立即行动',
    openers: ['Mr/Madam President, we no longer have the luxury of time.', 'The situation before us demands immediate and decisive action.'],
    closers: ['My delegation urges this committee to act — and to act now.', 'Delay itself carries a cost that the most vulnerable can no longer bear.'],
    verbs: ['urges', 'calls upon', 'demands', 'insists'],
  },
]
