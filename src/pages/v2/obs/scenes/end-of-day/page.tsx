import { lazy } from 'react'

const PageOfSakuraTheme = lazy(() => import('./byTheme/sakura/page'))
const PageOfDefaultTheme = lazy(() => import('./byTheme/default/page'))

type Props = {
  themeId?: string | null
}

export default function V2ObsSceneOfIntroductionForMatch({
  themeId = 'default',
}: Props) {
  switch (themeId) {
    case 'sakura': {
      return <PageOfSakuraTheme />
    }
  }

  return <PageOfDefaultTheme />
}
