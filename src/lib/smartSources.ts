// 主题智能信源精选：按议题分类，从 114 信源目录中精选最贴切的信源（≥10 个）
import type { Source } from '../data/sources'
import { SOURCES_DOC } from '../data/sources'
import { ALL_SOURCES_EXTRA } from '../data/sources2'
import { categorizeTopic, type TopicCategory } from './recommend'

const ALL: Source[] = [...SOURCES_DOC, ...ALL_SOURCES_EXTRA]
const BY_ID = new Map(ALL.map((s) => [s.id, s]))

// 每类议题 → 按贴切度排序的信源 id（人工策展，均来自 114 目录）
const PICKS: Record<TopicCategory, string[]> = {
  climate_env: [
    'un_issues', 'unep', 'unfccc', 'wmo', 'cbd', 'unccd', 'docs_un', 'un_dl',
    'un_news', 'fao', 'imo', 'itlos_db', 'undp', 'owid', 'un_data', 'sdg_data', 'reliefweb',
  ],
  refugees_hum: [
    'unhcr', 'iom', 'unrwa', 'ocha', 'reliefweb', 'newhum', 'wfp', 'unicef',
    'fts', 'hdx', 'msr', 'un_news', 'docs_un', 'un_dl', 'undp', 'unwomen',
  ],
  health: [
    'who', 'unaids', 'unicef', 'unfpa', 'unicef_data', 'owid', 'un_data',
    'wbank_api', 'hdx', 'un_news', 'docs_un', 'un_dl', 'reliefweb', 'fao', 'wmo',
  ],
  peace_security: [
    'scr', 'docs_un', 'un_dl', 'undocs', 'un_press', 'un_tv', 'icrc_ihl',
    'icj_db', 'iaea', 'opcw', 'un_news', 'reuters_un', 'passblue', 'un_treaty',
  ],
  cyber_ai: [
    'itu', 'un_issues', 'docs_un', 'un_dl', 'un_news', 'unodc', 'wipo',
    'uncitral_db', 'oecd_data', 'owid', 'un_press', 'ilo', 'unido', 'bestdelegate',
  ],
  economy_dev: [
    'imf', 'wbank', 'wbank_api', 'unctad', 'undp', 'hdr', 'ifad', 'fao',
    'wfp', 'unido', 'oecd_data', 'imf_data', 'un_data', 'devex', 'sdg_data',
  ],
  rights_social: [
    'unwomen', 'unicef', 'ilo', 'ilo_normlex', 'unicef_data', 'unfpa', 'unhcr',
    'un_news', 'un_treaty', 'icc_db', 'unodc', 'msr', 'owid', 'hdx', 'docs_un', 'un_dl',
  ],
  legal_crime: [
    'unodc', 'icc_db', 'icj_db', 'un_treaty', 'ilc_db', 'uncitral_db', 'icrc_ihl',
    'pca_db', 'icsid_s', 'itlos_db', 'avl_intlaw', 'ilo_normlex', 'docs_un', 'un_dl', 'un_droit',
  ],
  generic: [
    'un_issues', 'docs_un', 'un_dl', 'undocs', 'un_news', 'scr', 'reliefweb',
    'msr', 'cia_fb', 'owid', 'un_data', 'mfa_dir', 'bestdelegate', 'un_press', 'un_tv',
  ],
}

export interface SmartResult {
  category: TopicCategory
  sources: Source[]
}

export function smartPickSources(topic: string, committee = '', min = 10): SmartResult {
  const category = categorizeTopic(topic, committee)
  const ids = PICKS[category]
  const sources = ids.map((id) => BY_ID.get(id)).filter((s): s is Source => Boolean(s))
  // 极端情况下不足 min，用核心通用源补齐
  if (sources.length < min) {
    for (const id of PICKS.generic) {
      if (sources.length >= min) break
      if (!sources.find((s) => s.id === id)) {
        const s = BY_ID.get(id)
        if (s) sources.push(s)
      }
    }
  }
  return { category, sources }
}
