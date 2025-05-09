import { lazy } from 'react'

const PageOfSakuraTheme = lazy(() => import('./byTheme/sakura/page'))
const PageOfDefaultTheme = lazy(() => import('./byTheme/default/page'))

type Props = {
  themeId?: string | null
  params: { tournamentId: string }
  forwardFlag?: number
  resetFlag?: number
}

export default function V2ObsSceneOfLatestStatistics({
  themeId = 'default',
  ...otherProps
}: Props) {
  switch (themeId) {
    case 'sakura': {
      return <PageOfSakuraTheme {...otherProps} />
    }
  }

  return <PageOfDefaultTheme {...otherProps} />
}
