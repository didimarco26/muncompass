// MUN Compass 后端 FaaS 客户端
const FAAS_URL = 'https://magic.solutionsuite.cn/api/faas/zz28GYo1EwDUX'

export interface AICtx {
  committee?: string
  conference?: string
  country?: string
  topic?: string
}

export interface WebResult {
  title: string
  url: string
  snippet: string
  date?: string
}

async function call<T>(stage: string, payload: Record<string, unknown>, timeoutMs = 100000): Promise<T> {
  const ctrl = new AbortController()
  const tm = setTimeout(() => ctrl.abort(), timeoutMs)
  let res: Response
  try {
    res = await fetch(FAAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage, ...payload }),
      signal: ctrl.signal,
    })
  } finally {
    clearTimeout(tm)
  }
  const data = await res.json().catch(() => ({ ok: false, error: '服务返回异常，请重试' }))
  if (!data.ok) throw new Error(data.error || '服务暂不可用，请稍后重试')
  return data as T
}

export const api = {
  webSearch: (query: string) =>
    call<{ list: WebResult[] }>('web_search', { query }),

  chat: (history: { role: 'user' | 'assistant'; content: string }[], ctx: AICtx) =>
    call<{ answer: string; sources: WebResult[] }>('chat', { history, ctx }),

  ppSection: (section: string, ctx: AICtx) =>
    call<{ text: string }>('pp_section', { section, ctx }),

  contentDirection: (ctx: AICtx) =>
    call<{ text: string }>('content_direction', { ctx }),

  notesToResolution: (notes: string, ctx: AICtx) =>
    call<{ data: ResolutionJSON }>('notes_to_resolution', { notes, ctx }),

  refineResolution: (current: string, instruction: string, ctx: AICtx) =>
    call<{ data: ResolutionJSON }>('refine_resolution', { current, instruction, ctx }),

  speechPoints: (
    direction: string,
    maxPoints: number,
    ctx: AICtx,
    occasion: string,
    position?: string,
    callToAction?: string,
  ) =>
    call<{ points: { claim: string; evidence: string }[] }>('speech_points', {
      direction, maxPoints, ctx, occasion, position, callToAction,
    }),

  speechKeynote: (field: 'position' | 'cta', ctx: AICtx, occasion: string) =>
    call<{ text: string }>('speech_keynote', { field, ctx, occasion }),

  researchReport: (input: {
    country: string; topic: string; committee?: string; conference?: string; focus?: string
  }) =>
    call<{ report: ResearchReport; sources: BriefSource[] }>('research_report', input),
}

export interface BriefSource {
  title: string
  url: string
  snippet: string
}

export interface ResearchReport {
  thesis: string
  thesisZh?: string
  countryContext: string
  countryContextZh?: string
  arguments: { claim: string; evidence: string; zh?: string; sources: number[] }[]
  counterarguments: { view: string; holders: string; response: string; zh?: string; sources: number[] }[]
  resultsChain: { action: string; outcome: string; impact: string; zh?: string; sources: number[] }[]
  gaps: string[]
}

export interface ResolutionJSON {
  title: string
  preamb: { phrase: string; text: string }[]
  oper: { phrase: string; text: string; children?: { phrase: string; text: string }[] }[]
}
