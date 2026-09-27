import type { Committee } from "./committees"
import { COMMITTEES_L1_3 as A } from "./committees"


// ===== 第四层 人权与司法 =====
const B: Committee[] = [
  { id: 'hrc', layer: 4, name: '联合国人权理事会', en: 'Human Rights Council', abbr: 'HRC', desc: '47席；国别审议、特别机制、UPR', url: 'https://www.ohchr.org/en/hrbodies/hrc', type: 'subsidiary', real: true },
  { id: 'ohchr', layer: 4, name: '人权事务高级专员办事处', en: 'Office of the High Commissioner for HR', abbr: 'OHCHR', desc: '人权理事会秘书处', url: 'https://www.ohchr.org', type: 'related_org', real: true },
  { id: 'icj', layer: 4, name: '国际法院', en: 'International Court of Justice', abbr: 'ICJ', desc: '国家间争端+咨询意见', url: 'https://www.icj-cij.org', type: 'un_organ', real: true },
  { id: 'icc', layer: 4, name: '国际刑事法院', en: 'International Criminal Court', abbr: 'ICC', desc: '灭绝种族/危害人类/战争/侵略罪', url: 'https://www.icc-cpi.int', type: 'related_org', real: true },
  { id: 'itlos', layer: 4, name: '国际海洋法法庭', en: 'Intl Tribunal for the Law of the Sea', abbr: 'ITLOS', desc: '海洋划界、渔业、深海采矿', url: 'https://www.itlos.org', type: 'related_org', real: true },
  { id: 'pca', layer: 4, name: '常设仲裁法院', en: 'Permanent Court of Arbitration', abbr: 'PCA', desc: '仲裁与调查调解', url: 'https://pca-cpa.org/en/home/', type: 'related_org', real: true },
  { id: 'irmct', layer: 4, name: '国际刑事法庭余留机制', en: 'Intl Residual Mechanism for Criminal Tribunals', abbr: 'IRMCT', desc: '承继前南、卢旺达刑庭', url: 'https://www.irmct.org', type: 'subsidiary', real: true },
  { id: 'icty', layer: 4, name: '前南刑庭（历史）', en: 'Intl Criminal Tribunal for Yugoslavia', abbr: 'ICTY', desc: '1993-2017', url: 'https://www.icty.org', type: 'subsidiary', real: true },
  { id: 'ictr', layer: 4, name: '卢旺达刑庭（历史）', en: 'Intl Criminal Tribunal for Rwanda', abbr: 'ICTR', desc: '1994-2016', url: 'https://unictr.irmct.org', type: 'subsidiary', real: true },
  { id: 'eccc', layer: 4, name: '柬埔寨法院特别法庭', en: 'Extraordinary Chambers in Courts of Cambodia', abbr: 'ECCC', desc: '红色高棉罪行（混合法庭）', url: 'https://www.eccc.gov.kh/en', type: 'related_org', real: true },
  { id: 'stl', layer: 4, name: '黎巴嫩问题特别法庭', en: 'Special Tribunal for Lebanon', abbr: 'STL', desc: '哈里里遇刺案', url: 'https://www.stl-tsa.org', type: 'related_org', real: true },
  { id: 'uncitral', layer: 4, name: '国际贸易法委员会', en: 'UN Commission on Intl Trade Law', abbr: 'UNCITRAL', desc: '仲裁、电商、破产', url: 'https://uncitral.un.org', type: 'subsidiary', real: true },
  { id: 'ilc', layer: 4, name: '国际法委员会', en: 'International Law Commission', abbr: 'ILC', desc: '国际法发展与编纂', url: 'https://legal.un.org/ilc/', type: 'subsidiary', real: true },
]

// ===== 第五层 专门机构 =====
const C: Committee[] = [
  { id: 'ilo', layer: 5, name: '国际劳工组织', en: 'International Labour Organization', abbr: 'ILO', desc: '劳工标准、体面劳动', url: 'https://www.ilo.org', type: 'specialized_agency', real: true },
  { id: 'fao', layer: 5, name: '粮食及农业组织', en: 'Food and Agriculture Organization', abbr: 'FAO', desc: '粮食安全、农林渔业', url: 'https://www.fao.org', type: 'specialized_agency', real: true },
  { id: 'unesco', layer: 5, name: '教科文组织', en: 'UN Educational, Scientific & Cultural Org', abbr: 'UNESCO', desc: '教育、世遗、科学', url: 'https://www.unesco.org', type: 'specialized_agency', real: true },
  { id: 'who', layer: 5, name: '世界卫生组织', en: 'World Health Organization', abbr: 'WHO', desc: '疾病防控、卫生体系', url: 'https://www.who.int', type: 'specialized_agency', real: true },
  { id: 'ibrd', layer: 5, name: '国际复兴开发银行（世行）', en: 'Intl Bank for Reconstruction & Development', abbr: 'IBRD', desc: '中等收入国家贷款', url: 'https://www.worldbank.org/en/who-we-are/ibrd', type: 'specialized_agency', real: true },
  { id: 'ida', layer: 5, name: '国际开发协会', en: 'International Development Association', abbr: 'IDA', desc: '最贫困国优惠信贷', url: 'https://ida.worldbank.org', type: 'specialized_agency', real: true },
  { id: 'ifc', layer: 5, name: '国际金融公司', en: 'International Finance Corporation', abbr: 'IFC', desc: '私营部门投资', url: 'https://www.ifc.org', type: 'specialized_agency', real: true },
  { id: 'miga', layer: 5, name: '多边投资担保机构', en: 'Multilateral Investment Guarantee Agency', abbr: 'MIGA', desc: '投资政治风险担保', url: 'https://www.miga.org', type: 'specialized_agency', real: true },
  { id: 'icsid', layer: 5, name: '国际投资争端解决中心', en: 'Intl Centre for Settlement of Investment Disputes', abbr: 'ICSID', desc: '投资者-国家仲裁', url: 'https://icsid.worldbank.org', type: 'specialized_agency', real: true },
  { id: 'imf', layer: 5, name: '国际货币基金组织', en: 'International Monetary Fund', abbr: 'IMF', desc: '货币体系、汇率、救助', url: 'https://www.imf.org', type: 'specialized_agency', real: true },
  { id: 'icao', layer: 5, name: '国际民用航空组织', en: 'Intl Civil Aviation Organization', abbr: 'ICAO', desc: '民航安全标准', url: 'https://www.icao.int', type: 'specialized_agency', real: true },
  { id: 'upu', layer: 5, name: '万国邮政联盟', en: 'Universal Postal Union', abbr: 'UPU', desc: '国际邮政网络', url: 'https://www.upu.int', type: 'specialized_agency', real: true },
  { id: 'itu', layer: 5, name: '国际电信联盟', en: 'International Telecommunication Union', abbr: 'ITU', desc: '频谱、通信标准', url: 'https://www.itu.int', type: 'specialized_agency', real: true },
  { id: 'wmo', layer: 5, name: '世界气象组织', en: 'World Meteorological Organization', abbr: 'WMO', desc: '气象水文气候', url: 'https://wmo.int', type: 'specialized_agency', real: true },
  { id: 'imo', layer: 5, name: '国际海事组织', en: 'International Maritime Organization', abbr: 'IMO', desc: '航运安全、防污染', url: 'https://www.imo.org', type: 'specialized_agency', real: true },
  { id: 'wipo', layer: 5, name: '世界知识产权组织', en: 'World Intellectual Property Organization', abbr: 'WIPO', desc: '专利商标版权', url: 'https://www.wipo.int', type: 'specialized_agency', real: true },
  { id: 'ifad', layer: 5, name: '国际农业发展基金', en: 'Intl Fund for Agricultural Development', abbr: 'IFAD', desc: '农村减贫', url: 'https://www.ifad.org', type: 'specialized_agency', real: true },
  { id: 'unido', layer: 5, name: '联合国工业发展组织', en: 'UN Industrial Development Org', abbr: 'UNIDO', desc: '包容可持续工业', url: 'https://www.unido.org', type: 'specialized_agency', real: true },
  { id: 'untourism', layer: 5, name: '联合国世界旅游组织（UN Tourism）', en: 'UN Tourism', abbr: 'UN Tourism', desc: '可持续旅游（2024更名）', url: 'https://www.untourism.int/', type: 'specialized_agency', real: true },
]

// ===== 第六层 基金计划署与相关实体 =====
const D: Committee[] = [
  { id: 'undp', layer: 6, name: '开发计划署', en: 'UN Development Programme', abbr: 'UNDP', desc: '减贫、治理、协调中枢', url: 'https://www.undp.org', type: 'fund_programme', real: true },
  { id: 'unicef', layer: 6, name: '儿童基金会', en: 'UN Children’s Fund', abbr: 'UNICEF', desc: '儿童生存发展保护', url: 'https://www.unicef.org', type: 'fund_programme', real: true },
  { id: 'unhcr', layer: 6, name: '难民署', en: 'Office of the UN HCR', abbr: 'UNHCR', desc: '难民保护、重获安置', url: 'https://www.unhcr.org', type: 'fund_programme', real: true },
  { id: 'wfp', layer: 6, name: '世界粮食计划署', en: 'World Food Programme', abbr: 'WFP', desc: '人道粮食援助', url: 'https://www.wfp.org', type: 'fund_programme', real: true },
  { id: 'unfpa', layer: 6, name: '人口基金', en: 'UN Population Fund', abbr: 'UNFPA', desc: '生殖健康、孕产妇', url: 'https://www.unfpa.org', type: 'fund_programme', real: true },
  { id: 'unctad', layer: 6, name: '贸易和发展会议', en: 'UN Conference on Trade & Development', abbr: 'UNCTAD', desc: '贸易投资发展', url: 'https://unctad.org', type: 'subsidiary', real: true },
  { id: 'unep', layer: 6, name: '环境规划署', en: 'UN Environment Programme', abbr: 'UNEP', desc: '气候、污染、生态', url: 'https://www.unep.org', type: 'fund_programme', real: true },
  { id: 'unhabitat', layer: 6, name: '人类住区规划署', en: 'UN Human Settlements Programme', abbr: 'UN-Habitat', desc: '城市化、住房', url: 'https://unhabitat.org', type: 'fund_programme', real: true },
  { id: 'unwomen', layer: 6, name: '妇女署', en: 'UN Entity for Gender Equality', abbr: 'UN Women', desc: '性别平等', url: 'https://www.unwomen.org', type: 'fund_programme', real: true },
  { id: 'unrwa', layer: 6, name: '近东巴勒斯坦难民救济工程处', en: 'UN Relief & Works Agency', abbr: 'UNRWA', desc: '巴难民救济', url: 'https://www.unrwa.org', type: 'fund_programme', real: true },
  { id: 'unaids', layer: 6, name: '艾滋病规划署', en: 'Joint UN Programme on HIV/AIDS', abbr: 'UNAIDS', desc: '全球抗艾', url: 'https://www.unaids.org', type: 'fund_programme', real: true },
  { id: 'ocha', layer: 6, name: '人道主义事务协调厅', en: 'UN Office for Coordination of Humanitarian Affairs', abbr: 'OCHA', desc: '人道协调、CERF', url: 'https://www.unocha.org', type: 'fund_programme', real: true },
  { id: 'unodc', layer: 6, name: '毒品和犯罪问题办公室', en: 'UN Office on Drugs & Crime', abbr: 'UNODC', desc: '禁毒反恐反腐', url: 'https://www.unodc.org', type: 'fund_programme', real: true },
  { id: 'unea', layer: 6, name: '联合国环境大会', en: 'UN Environment Assembly', abbr: 'UNEA', desc: '最高环境决策论坛', url: 'https://www.unep.org/unea', type: 'subsidiary', real: true },
  { id: 'iaea', layer: 6, name: '国际原子能机构（相关组织）', en: 'Intl Atomic Energy Agency', abbr: 'IAEA', desc: '核能、核不扩散', url: 'https://www.iaea.org', type: 'related_org', real: true },
  { id: 'iom', layer: 6, name: '国际移民组织', en: 'International Organization for Migration', abbr: 'IOM', desc: '移民管理', url: 'https://www.iom.int', type: 'related_org', real: true },
  { id: 'unitar', layer: 6, name: '训练研究所', en: 'UN Institute for Training & Research', abbr: 'UNITAR', desc: '外交官培训', url: 'https://www.unitar.org', type: 'fund_programme', real: true },
  { id: 'itc', layer: 6, name: '国际贸易中心', en: 'International Trade Centre', abbr: 'ITC', desc: '中小企业出口', url: 'https://intracen.org', type: 'related_org', real: true },
  { id: 'unv', layer: 6, name: '志愿人员组织', en: 'UN Volunteers', abbr: 'UNV', desc: '志愿者', url: 'https://www.unv.org', type: 'fund_programme', real: true },
  { id: 'unu', layer: 6, name: '联合国大学', en: 'United Nations University', abbr: 'UNU', desc: '学术智库网络', url: 'https://unu.edu', type: 'related_org', real: true },
  { id: 'unfccc', layer: 6, name: '气候变化框架公约/缔约方大会', en: 'UNFCCC / COP', abbr: 'UNFCCC', desc: '气候谈判、巴黎协定', url: 'https://unfccc.int', type: 'related_org', real: true },
  { id: 'cbd', layer: 6, name: '生物多样性公约', en: 'Convention on Biological Diversity', abbr: 'CBD', desc: '昆明-蒙特利尔框架', url: 'https://www.cbd.int', type: 'related_org', real: true },
  { id: 'unccd', layer: 6, name: '防治荒漠化公约', en: 'UN Convention to Combat Desertification', abbr: 'UNCCD', desc: '土地退化治理', url: 'https://www.unccd.int', type: 'related_org', real: true },
  { id: 'ctbto', layer: 6, name: '全面禁核试条约组织筹委会', en: 'Preparatory Commission for CTBT', abbr: 'CTBTO', desc: '核试验监测', url: 'https://www.ctbto.org', type: 'related_org', real: true },
  { id: 'opcw', layer: 6, name: '禁止化学武器组织', en: 'Organisation for Prohibition of Chemical Weapons', abbr: 'OPCW', desc: '化武履约', url: 'https://www.opcw.org', type: 'related_org', real: true },
  { id: 'isa_seabed', layer: 6, name: '国际海底管理局', en: 'International Seabed Authority', abbr: 'ISA', desc: '深海采矿规章', url: 'https://www.isa.org.jm', type: 'related_org', real: true },
  { id: 'wto', layer: 6, name: '世界贸易组织（非UN）', en: 'World Trade Organization', abbr: 'WTO', desc: '贸易规则与争端', url: 'https://www.wto.org', type: 'nonun_summit', real: true },
]

// ===== 第七层 MUN创设 + 非UN峰会 =====
const E: Committee[] = [
  { id: 'jcc', layer: 7, name: '联合内阁危机委员会', en: 'Joint Crisis Committee', abbr: 'JCC', desc: '多内阁指令联动', url: 'https://www.harvardmun.org/committee-list', type: 'mun_only', real: false },
  { id: 'ccc', layer: 7, name: '持续危机委员会', en: 'Continuous Crisis Committee', abbr: 'CCC', desc: '单内阁连续危机', url: 'https://www.hnmun.org/committees', type: 'mun_only', real: false },
  { id: 'adhoc', layer: 7, name: '临时委员会', en: 'Ad Hoc Committee', abbr: 'Ad Hoc', desc: '开幕才公布议题', url: 'https://www.harvardmun.org/ad-hoc', type: 'mun_only', real: false },
  { id: 'historical', layer: 7, name: '历史委员会（总类）', en: 'Historical Committees', abbr: '—', desc: '还原历史年份', url: 'https://thehague.thimun.org/', type: 'mun_only', real: false },
  { id: 'futuristic', layer: 7, name: '未来委员会', en: 'Futuristic Committee', abbr: '—', desc: '未来假想场景', url: 'https://www.harvardmun.org/committee-list', type: 'mun_only', real: false },
  { id: 'fantasy', layer: 7, name: '虚构/流行文化危机', en: 'Fantasy / Pop-Culture Crisis', abbr: '—', desc: '影视文学背景', url: 'https://www.harvardmun.org/committee-list', type: 'mun_only', real: false },
  { id: 'cabinet', layer: 7, name: '国家内阁/战情室', en: 'National Cabinet / Situation Room', abbr: '—', desc: '个人职位角色扮演', url: 'http://www.fduimun.org', type: 'mun_only', real: false },
  { id: 'mpc', layer: 7, name: '主新闻中心/记者团', en: 'Main Press Centre / Press Corps', abbr: 'MPC', desc: '通讯社代表', url: 'https://www.harvardmun.org/presscorps', type: 'mun_only', real: false },
  { id: 'spc', layer: 7, name: '特别会议', en: 'Special Conference', abbr: 'SPC', desc: 'THIMUN主题论坛', url: 'https://thehague.thimun.org/', type: 'mun_only', real: false },
  { id: 'bilingual', layer: 7, name: '语言特色委员会', en: 'Comité français / Bilingual', abbr: '—', desc: '全法语/双语', url: 'https://thehague.thimun.org/', type: 'mun_only', real: false },
  { id: 'ungass', layer: 7, name: '安理会改革/特别联大', en: 'SC Reform / GA Special Session', abbr: 'UNGASS', desc: '改革工作组', url: 'https://www.un.org/en/ga/sessions/', type: 'mun_only', real: false },
  { id: 'g20', layer: 7, name: '二十国集团', en: 'Group of Twenty', abbr: 'G20', desc: '元首级峰会，产出公报', url: 'https://www.g20.org', type: 'nonun_summit', real: true },
  { id: 'brics', layer: 7, name: '金砖国家', en: 'BRICS', abbr: 'BRICS', desc: '新兴经济体峰会', url: 'https://www.brics.utoronto.ca', type: 'nonun_summit', real: true },
  { id: 'apec', layer: 7, name: '亚太经济合作组织', en: 'Asia-Pacific Economic Cooperation', abbr: 'APEC', desc: '区域经贸峰会', url: 'https://www.apec.org', type: 'nonun_summit', real: true },
  { id: 'asean', layer: 7, name: '东南亚国家联盟', en: 'Association of Southeast Asian Nations', abbr: 'ASEAN', desc: '含10+3、ARF', url: 'https://asean.org', type: 'nonun_summit', real: true },
  { id: 'eu', layer: 7, name: '欧洲联盟', en: 'European Union', abbr: 'EU', desc: '欧洲理事会/部长理事会', url: 'https://european-union.europa.eu', type: 'nonun_summit', real: true },
  { id: 'nato', layer: 7, name: '北大西洋公约组织峰会', en: 'NATO Summit', abbr: 'NATO', desc: '安全同盟峰会', url: 'https://www.nato.int', type: 'nonun_summit', real: true },
  { id: 'au', layer: 7, name: '非洲联盟', en: 'African Union', abbr: 'AU', desc: '含和平安全理事会', url: 'https://au.int', type: 'nonun_summit', real: true },
  { id: 'ecowas', layer: 7, name: '西非国家经济共同体', en: 'Economic Community of West African States', abbr: 'ECOWAS', desc: '区域一体化', url: 'https://www.ecowas.int', type: 'nonun_summit', real: true },
  { id: 'las', layer: 7, name: '阿拉伯国家联盟', en: 'League of Arab States', abbr: 'LAS', desc: '阿拉伯国家组织', url: 'https://www.leagueofarabstates.net', type: 'nonun_summit', real: true },
  { id: 'oic', layer: 7, name: '伊斯兰合作组织', en: 'Organisation of Islamic Cooperation', abbr: 'OIC', desc: '伊斯兰国家组织', url: 'https://www.oic-oci.org', type: 'nonun_summit', real: true },
  { id: 'cis', layer: 7, name: '独立国家联合体', en: 'Commonwealth of Independent States', abbr: 'CIS', desc: '后苏联空间', url: 'https://e-cis.info', type: 'nonun_summit', real: true },
]

export const COMMITTEES_L4_7 = [...B, ...C, ...D, ...E]
export const ALL_COMMITTEES: Committee[] = [...A, ...B, ...C, ...D, ...E]
