'use client'

import { PropsWithChildren, useCallback, useEffect, useMemo } from 'react'
import { CurrentTournamentIdContext } from '../hooks/useCurrentTournament'
import useAllTournaments from '../hooks/useAllTournaments'
import { useLocalStorage } from 'react-use'
import { closeDialog, openDialog } from '@/components/Dialog'
import CurrentLiveMatchWidget from '../widgets/CurrentLiveMatchWidget'
import { Link } from 'wouter'

export default function V2PanelLayout({ children }: PropsWithChildren) {
  const { data: allTournaments = [] } = useAllTournaments()
  const [currentTournamentId, setCurrentTournamentId] = useLocalStorage(
    'v2-current-tournament-id',
    ''
  )

  const currentTournament = useMemo(
    () => allTournaments?.find(({ id }) => id === currentTournamentId),
    [allTournaments, currentTournamentId]
  )

  useEffect(() => {
    if (!currentTournamentId && allTournaments[0]) {
      setCurrentTournamentId(allTournaments[0].id)
    }
  }, [allTournaments, currentTournamentId, setCurrentTournamentId])

  const handleSwitchTournament = useCallback(
    (e: React.MouseEvent) => {
      const newTournamentId = e.currentTarget.getAttribute('data-tournament-id')
      setCurrentTournamentId(newTournamentId as string)
      closeDialog('tournament-selector-dialog')
    },
    [setCurrentTournamentId]
  )

  return (
    <CurrentTournamentIdContext.Provider value={currentTournamentId!}>
      <div className="drawer drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <div className="navbar bg-base-100 w-full border-b-1 border-base-300">
            <div className="mx-2 flex-1 px-2 flex gap-x-2 items-center">
              <div className="flex gap-x-2 items-center">
                <img
                  src={currentTournament?.image.logo?.default.url}
                  className="w-8 h-8"
                />
                <span>{currentTournament?.name}</span>
              </div>
              <div>
                {allTournaments.length > 1 && (
                  <button
                    onClick={() => openDialog('tournament-selector-dialog')}
                    className="btn btn-xs btn-ghost text-primary"
                  >
                    切換
                  </button>
                )}
              </div>
            </div>
          </div>
          <main>{children}</main>
        </div>
        <div className="drawer-side border-r-1 border-base-300">
          <div className="w-60">
            <div className="p-4 w-full text-lg text-center">日麻直播系統</div>

            <h5 className="text-sm font-bold px-4">聯賽控制</h5>
            <ul className="menu bg-base-100 text-base-content min-h-full p-4 w-full">
              {/* Sidebar content here */}
              <li>
                <Link href="/">賽事</Link>
              </li>
              <li>
                <a>隊伍／選手</a>
              </li>
              <li>
                <a>風格</a>
              </li>
            </ul>

            <div className="divider"></div>

            <h5 className="text-sm font-bold px-4">OBS 控制</h5>

            <div className="px-4 py-2">
              <CurrentLiveMatchWidget />
            </div>

            <ul className="menu bg-base-100 text-base-content min-h-full p-4 w-full">
              {/* Sidebar content here */}
              <li>
                <a>如何設置 OBS</a>
              </li>
              <li>
                <Link href="/obs/match-control">分數控制台</Link>
              </li>
              <li>
                <Link href="/obs/scene-control">多合一場景控制台</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <dialog id="tournament-selector-dialog" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">切換聯賽</h3>
          <ul className="menu w-full">
            {allTournaments.map((tournament) => (
              <li key={tournament.id}>
                <a
                  className="flex gap-x-2"
                  onClick={handleSwitchTournament}
                  data-tournament-id={tournament.id}
                >
                  <img
                    src={tournament.image.logo?.default.url}
                    className="w-8 h-8"
                    alt=""
                  />
                  <span className="flex-1">{tournament.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </CurrentTournamentIdContext.Provider>
  )
}
