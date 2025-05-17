import { q, runQuery } from '../adapters/sanity'

export const apiGetActivityBySlug = (slug: string) => {
  const query = q.star
    .filterByType('activity')
    .filterRaw(`slug.current == "${slug}"`)
    .slice(0)
    .project(() => ({
      '...': true,
    }))

  return runQuery(query).then((activity) => {
    if (!activity) {
      throw new Error('找不到賽事')
    }

    return activity
  })
}
