import { lazy } from 'react'

const PageOfSakuraTheme = lazy(() => import('./byTheme/sakura/page'))
const PageOfDefaultTheme = lazy(() => import('./byTheme/default/page'))

type Props = {
  themeId?: string | null
  params: { matchId: string }
  forwardFlag?: number
  resetFlag?: number
  disableClick?: boolean
}

export default function V2ObsSceneOfIntroductionForMatch({
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
