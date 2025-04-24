import { V2Ruleset } from '../models/V2Ruleset.model'

export async function getRulesets(): Promise<
  Pick<V2Ruleset, 'id' | 'metadata'>[]
> {
  const response = await fetch('/jsons/rulesets/index.json')
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`)
  }

  return (await response.json()) as Pick<V2Ruleset, 'id' | 'metadata'>[]
}

export async function getRulesetById(id: string): Promise<V2Ruleset> {
  const response = await fetch(`/jsons/rulesets/entries/${id}.json`)
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`)
  }

  return (await response.json()) as V2Ruleset
}
