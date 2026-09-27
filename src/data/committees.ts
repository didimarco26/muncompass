// MUN 委员会完整分层数据库（118 条 / 7 层）
// 第1-6层=真实联合国/国际机构；第7层=MUN创设形式及非UN峰会

export type OrgType = 'un_organ' | 'subsidiary' | 'specialized_agency' | 'fund_programme' | 'related_org' | 'mun_only' | 'nonun_summit'

export interface Committee {
  id: string
  layer: number
  name: string
  en: string
  abbr: string
  desc: string
  url: string
  type: OrgType
  real: boolean
}

export const LAYER_NAMES: Record<number, string> = {
  1: '第一层 · 联合国大会体系',
  2: '第二层 · 安全理事会体系',
  3: '第三层 · 经社理事会体系',
  4: '第四层 · 人权与司法机构',
  5: '第五层 · 联合国专门机构',
  6: '第六层 · 基金、计划署与相关实体',
  7: '第七层 · MUN创设形式与非UN峰会',
}

const A: Committee[] = [
  // ===== 第一层 大会体系 =====
  { id: 'unga', layer: 1, name: '联合国大会（全会）', en: 'UN General Assembly (Plenary)', abbr: 'UNGA', desc: '最高审议机关，宪章范围内全部问题', url: 'https://www.un.org/en/ga', type: 'un_organ', real: true },
  { id: 'ga1', layer: 1, name: '第一委员会：裁军与国际安全', en: 'First Committee (Disarmament & Intl Security)', abbr: 'DISEC', desc: '军控、裁军、新兴武器与国际安全', url: 'https://www.un.org/en/ga/first', type: 'subsidiary', real: true },
  { id: 'ga2', layer: 1, name: '第二委员会：经济与财政', en: 'Second Committee (Economic & Financial)', abbr: 'ECOFIN', desc: '全球经济、发展筹资、贸易与可持续发展', url: 'https://www.un.org/en/ga/second', type: 'subsidiary', real: true },
  { id: 'ga3', layer: 1, name: '第三委员会：社会、人道和文化', en: 'Third Committee (Social, Humanitarian & Cultural)', abbr: 'SOCHUM', desc: '社会发展、人道救助、人权与文化', url: 'https://www.un.org/en/ga/third', type: 'subsidiary', real: true },
  { id: 'ga4', layer: 1, name: '第四委员会：特别政治和非殖民化', en: 'Fourth Committee (Special Political & Decolonization)', abbr: 'SPECPOL', desc: '维和政治、非殖民化、巴难民', url: 'https://www.un.org/en/ga/fourth', type: 'subsidiary', real: true },
  { id: 'ga5', layer: 1, name: '第五委员会：行政和预算', en: 'Fifth Committee (Administrative & Budgetary)', abbr: 'GA5', desc: '联合国预算、会费、人事行政', url: 'https://www.un.org/en/ga/fifth', type: 'subsidiary', real: true },
  { id: 'ga6', layer: 1, name: '第六委员会：法律', en: 'Sixth Committee (Legal)', abbr: 'GA6', desc: '国际法编纂、条约、国际刑事司法', url: 'https://www.un.org/en/ga/sixth', type: 'subsidiary', real: true },
  { id: 'undc', layer: 1, name: '联合国裁军审议委员会', en: 'UN Disarmament Commission', abbr: 'UNDC', desc: '大会框架下裁军原则审议', url: 'https://www.un.org/disarmament/', type: 'subsidiary', real: true },
  { id: 'copuos', layer: 1, name: '和平利用外层空间委员会', en: 'Committee on Peaceful Uses of Outer Space', abbr: 'COPUOS', desc: '外空规则、空间碎片、外空资源', url: 'https://www.unoosa.org/oosa/en/ourwork/copuos/', type: 'subsidiary', real: true },
  { id: 'unscear', layer: 1, name: '原子辐射影响科学委员会', en: 'UN Scientific Committee on Effects of Atomic Radiation', abbr: 'UNSCEAR', desc: '电离辐射与核事故剂量科学评估', url: 'https://www.unscear.org/', type: 'subsidiary', real: true },
  { id: 'c24', layer: 1, name: '非殖民化特别委员会（24国委员会）', en: 'Special Committee on Decolonization', abbr: 'C24', desc: '监督非殖民化、剩余非自治领土', url: 'https://www.un.org/dppa/decolonization/en/', type: 'subsidiary', real: true },
  { id: 'c34', layer: 1, name: '维和行动特别委员会（34国委员会）', en: 'Special Committee on Peacekeeping Operations', abbr: 'C34', desc: '全面审查维和政策与改革', url: 'https://peacekeeping.un.org/en/c34', type: 'subsidiary', real: true },

  // ===== 第二层 安理会体系 =====
  { id: 'unsc', layer: 2, name: '联合国安全理事会', en: 'UN Security Council', abbr: 'UNSC', desc: '制裁、授权武力、维和', url: 'https://www.un.org/securitycouncil', type: 'un_organ', real: true },
  { id: 'hsc', layer: 2, name: '历史安全理事会（MUN创设）', en: 'Historical Security Council', abbr: 'HSC', desc: '还原指定历史年份', url: 'https://thehague.thimun.org/', type: 'mun_only', real: false },
  { id: 'crisis_sc', layer: 2, name: '安理会危机变体（MUN创设）', en: 'Crisis SC / Ad Hoc SC', abbr: '—', desc: '小型指令驱动+后台危机', url: 'https://www.harvardmun.org/committee-list', type: 'mun_only', real: false },

  // ===== 第三层 经社体系 =====
  { id: 'ecosoc', layer: 3, name: '经济及社会理事会（全会）', en: 'Economic and Social Council', abbr: 'ECOSOC', desc: '统筹经济、社会、环境与发展', url: 'https://www.un.org/ecosoc', type: 'un_organ', real: true },
  { id: 'statcom', layer: 3, name: '统计委员会', en: 'Statistical Commission', abbr: 'StatCom', desc: '统计标准、指标与SDG框架', url: 'https://www.un.org/en/desa/statistical-commission', type: 'subsidiary', real: true },
  { id: 'cpd', layer: 3, name: '人口与发展委员会', en: 'Commission on Population and Development', abbr: 'CPD', desc: '人口趋势、移徙、生殖健康', url: 'https://www.un.org/en/desa/commission-population-and-development', type: 'subsidiary', real: true },
  { id: 'csocd', layer: 3, name: '社会发展委员会', en: 'Commission for Social Development', abbr: 'CSocD', desc: '减贫、就业、社会融合', url: 'https://www.un.org/development/desa/dspd/commission-for-social-development.html', type: 'subsidiary', real: true },
  { id: 'csw', layer: 3, name: '妇女地位委员会', en: 'Commission on the Status of Women', abbr: 'CSW', desc: '全球最大性别平等政府间机制', url: 'https://www.unwomen.org/en/csw', type: 'subsidiary', real: true },
  { id: 'cnd', layer: 3, name: '麻醉品委员会', en: 'Commission on Narcotic Drugs', abbr: 'CND', desc: '国际毒品管制、列管物质', url: 'https://www.unodc.org/unodc/en/commissions/CND/index.html', type: 'subsidiary', real: true },
  { id: 'ccpcj', layer: 3, name: '预防犯罪和刑事司法委员会', en: 'Commission on Crime Prevention & Criminal Justice', abbr: 'CCPCJ', desc: '有组织犯罪、网络犯罪、腐败', url: 'https://www.unodc.org/unodc/en/commissions/CCPCJ/index.html', type: 'subsidiary', real: true },
  { id: 'cstd', layer: 3, name: '科学和技术促进发展委员会', en: 'Commission on Science & Technology for Development', abbr: 'CSTD', desc: 'STI促发展、ICT/AI', url: 'https://unctad.org/topic/commission-on-science-and-technology-for-development', type: 'subsidiary', real: true },
  { id: 'csd', layer: 3, name: '可持续发展委员会（历史）', en: 'Commission on Sustainable Development', abbr: 'CSD', desc: '1992-2013，后并入HLPF', url: 'https://sustainabledevelopment.un.org/csd.html', type: 'subsidiary', real: true },
  { id: 'hlpf', layer: 3, name: '可持续发展高级别政治论坛', en: 'High-level Political Forum on SD', abbr: 'HLPF', desc: 'SDG核心审议、VNR国别评估', url: 'https://sustainabledevelopment.un.org/hlpf', type: 'subsidiary', real: true },
  { id: 'unff', layer: 3, name: '联合国森林论坛', en: 'UN Forum on Forests', abbr: 'UNFF', desc: '森林战略计划', url: 'https://forests.desa.un.org/', type: 'subsidiary', real: true },
  { id: 'eca', layer: 3, name: '非洲经济委员会', en: 'Economic Commission for Africa', abbr: 'ECA', desc: '总部亚的斯亚贝巴', url: 'https://www.uneca.org', type: 'subsidiary', real: true },
  { id: 'ece', layer: 3, name: '欧洲经济委员会', en: 'Economic Commission for Europe', abbr: 'ECE', desc: '总部日内瓦', url: 'https://unece.org', type: 'subsidiary', real: true },
  { id: 'eclac', layer: 3, name: '拉丁美洲和加勒比经济委员会', en: 'ECLAC', abbr: 'ECLAC', desc: '总部圣地亚哥', url: 'https://www.cepal.org/en', type: 'subsidiary', real: true },
  { id: 'escap', layer: 3, name: '亚洲及太平洋经济社会委员会', en: 'ESCAP', abbr: 'ESCAP', desc: '总部曼谷', url: 'https://www.unescap.org', type: 'subsidiary', real: true },
  { id: 'escwa', layer: 3, name: '西亚经济社会委员会', en: 'ESCWA', abbr: 'ESCWA', desc: '总部贝鲁特', url: 'https://www.unescwa.org', type: 'subsidiary', real: true },
  { id: 'unpfii', layer: 3, name: '土著问题常设论坛', en: 'Permanent Forum on Indigenous Issues', abbr: 'UNPFII', desc: '土著民权利与发展', url: 'https://www.un.org/development/desa/indigenouspeoples.html', type: 'subsidiary', real: true },
  { id: 'cepa', layer: 3, name: '公共行政专家委员会', en: 'Committee of Experts in Public Administration', abbr: 'CEPA', desc: '公共治理与数字政府', url: 'https://publicadministration.un.org/', type: 'subsidiary', real: true },
  { id: 'cdp_ecosoc', layer: 3, name: '发展政策委员会', en: 'Committee for Development Policy', abbr: 'CDP', desc: '认定最不发达国家', url: 'https://www.un.org/development/desa/dpad/', type: 'subsidiary', real: true },
  { id: 'ngo_cttee', layer: 3, name: '非政府组织委员会', en: 'Committee on NGOs', abbr: 'NGO Cttee', desc: '审议NGO经社咨商地位', url: 'https://www.un.org/ecosoc/en/partnership-division/committee-ngos', type: 'subsidiary', real: true },
  { id: 'tax_cttee', layer: 3, name: '国际税务合作专家委员会', en: 'Committee of Experts on Intl Tax Cooperation', abbr: 'Tax Cttee', desc: '联合国税收范本、税改', url: 'https://www.un.org/development/desa/financing.html', type: 'subsidiary', real: true },
  { id: 'pbc', layer: 3, name: '建设和平委员会', en: 'Peacebuilding Commission', abbr: 'PBC', desc: '冲突后建设和平', url: 'https://www.un.org/peacebuilding/commission', type: 'subsidiary', real: true },
]
export const COMMITTEES_L1_3 = A
