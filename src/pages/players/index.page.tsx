import React, { useMemo } from 'react'
import { Player } from '@/models'
import { useFirebaseDatabaseByKey } from '@/providers/firebaseDatabase.provider'

function PlayersPage() {
  const { data: playersMap } = useFirebaseDatabaseByKey<Player>('players', {
    onlyOnce: true,
  })

  const players = useMemo(
    () =>
      playersMap
        ? Object.entries(playersMap).map(([_id, player]) => ({
            ...player,
            _id,
          }))
        : [],
    [playersMap]
  )

  return (
    <div className="container mx-auto max-w-screen-sm">
      <div className="min-h-screen flex flex-col py-16 gap-y-4">
        <div className="shrink-0">
          <a href="/" className="underline">
            &lt; 回上一頁
          </a>
        </div>
        <div className="flex-1">
          <div className="space-y-4">
            <h1 className="text-4xl">玩家</h1>
            <div className="space-y-4">
              {players &&
                players.map((player) => (
                  <div key={player._id} className="flex items-center gap-x-2">
                    <div className="flex-1 flex items-center gap-x-2 bg-white bg-opacity-30 rounded p-2">
                      <div className="shrink-0">
                        <div
                          className="w-14 h-14 bg-center bg-contain bg-no-repeat"
                          style={{
                            backgroundImage: `url(${
                              player.propicSrc ??
                              '/images/portrait-placeholder.jpeg'
                            })`,
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <div>{player.title}</div>
                        <div className="text-2xl">{player.name}</div>
                      </div>
                    </div>
                    <div className="shrink-0 space-x-2">
                      <a href={`/players/${player._id}`} type="button">
                        <span className="material-symbols-outlined">edit</span>
                      </a>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayersPage
