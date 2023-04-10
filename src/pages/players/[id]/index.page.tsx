import { Player } from '@/models'
import React, { useCallback, useEffect, useState } from 'react'
import MJInlineEditButton from '@/components/MJInlineEditButton'
import { useFirebaseDatabaseByKey } from '@/providers/firebaseDatabase.provider'

type Props = {
  params: { playerId: string }
}

function CreateMatchPage({ params: { playerId } }: Props) {
  const { data: loadedPlayer, update: updatePlayer } =
    useFirebaseDatabaseByKey<string>(`players/${playerId}`, { onlyOnce: true })

  const [name, setName] = useState<string | undefined | null>()
  const [title, setTitle] = useState<string | undefined | null>()
  const [propicSrc, setPropicSrc] = useState<string | undefined | null>()

  const handleChangeProfilePic = useCallback(() => {
    const newValue = prompt('請輸入圖片網址', propicSrc as string)

    if (newValue) {
      setPropicSrc(newValue)
    }
  }, [propicSrc])

  const handleClickSave = useCallback(async () => {
    updatePlayer({
      propicSrc: propicSrc as string,
      name: name as string,
      title: title as string,
    })
  }, [name, propicSrc, title, updatePlayer])

  useEffect(() => {
    if (loadedPlayer) {
      setName((loadedPlayer as unknown as Player).name)
      setTitle((loadedPlayer as unknown as Player).title)
      setPropicSrc((loadedPlayer as unknown as Player).propicSrc)
    }
  }, [loadedPlayer])

  if (!loadedPlayer) {
    return <div>讀取中...</div>
  }

  return (
    <div className="container mx-auto max-w-screen-sm">
      <div className="min-h-screen flex flex-col py-16 gap-y-4">
        <div className="shrink-0">
          <a href="/players" className="underline">
            &lt; 回上一頁
          </a>
        </div>
        <div className="flex-1">
          <div className="space-y-4">
            <h1 className="text-4xl">玩家</h1>
            <div className="space-y-4">
              <div className="flex items-center gap-x-2">
                <div className="flex-1 flex items-center gap-x-2 bg-white bg-opacity-30 rounded p-2">
                  <div className="shrink-0">
                    <button type="button" onClick={handleChangeProfilePic}>
                      <div
                        className="w-14 h-14 bg-center bg-contain bg-no-repeat"
                        style={{
                          backgroundImage: `url(${
                            propicSrc ?? '/images/portrait-placeholder.jpeg'
                          })`,
                        }}
                      />
                    </button>
                  </div>
                  <div className="flex-1">
                    <div>
                      <MJInlineEditButton
                        value={title as string}
                        placeholder="(無頭銜)"
                        onEdit={setTitle}
                      />
                    </div>
                    <div className="text-2xl">
                      <MJInlineEditButton
                        required
                        value={name as string}
                        onEdit={setName}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="shrink-0 space-y-4">
          <button
            type="button"
            className="w-full bg-blue-600 text-white text-4xl p-4 rounded-lg"
            onClick={handleClickSave}
          >
            儲存
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateMatchPage
