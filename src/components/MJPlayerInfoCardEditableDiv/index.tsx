import { Player, PlayerIndex, Team } from '@/models'
import React, {
  FormEvent,
  HTMLAttributes,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useBoolean } from 'react-use'
import { useFirebaseDatabaseByKey } from '@/providers/firebaseDatabase.provider'
import MJUIDialogV2 from '../MJUI/MJUIDialogV2'
import MJUIButton from '../MJUI/MJUIButton'
import MJUIInput from '../MJUI/MJUIInput'
import MJUIInputForColor from '../MJUI/MJUIInputForColor'
import MJUIFormGroup from '../MJUI/MJUIFormGroup'
import MJPlayerCardDiv from '../MJPlayerCardDiv'
import MJUISelect from '../MJUI/MJUISelect'

type Props = HTMLAttributes<HTMLDivElement> & {
  player: Player
  playerIndex: PlayerIndex
  onEdit?: (playerIndex: PlayerIndex, newPlayer: Player) => Promise<unknown>
}

function MJPlayerInfoCardDiv({
  player,
  playerIndex,
  onEdit,
  children,
  ...divProps
}: Props) {
  const { data: teamsMap } = useFirebaseDatabaseByKey<Team>('teams')
  const teams = useMemo(
    () =>
      teamsMap
        ? Object.entries(teamsMap).map(([key, value]) => ({
            ...value,
            _id: key,
          }))
        : [],
    [teamsMap]
  )

  const [isShowEditDialog, toggleEditDialog] = useBoolean(false)
  const [modifiedPlayer, setModifiedPlayer] = useState<Player>(player)

  const formRef = useRef<HTMLFormElement | null>(null)

  const handleClickRefreshPreview = useCallback(() => {
    if (!formRef.current) {
      return
    }

    const elements = [
      ...(formRef.current as HTMLFormElement).querySelectorAll('input'),
    ]

    const newPlayer: Player = { name: '' }
    for (let i = 0; i < elements.length; i += 1) {
      const ele = elements[i] as HTMLInputElement
      if (ele) {
        const key = ele.getAttribute('id')
        if (key) {
          newPlayer[key as keyof Player] = ele.value
        }
      }
    }

    setModifiedPlayer(newPlayer)
  }, [])

  const handleClickEdit = useCallback(() => {
    toggleEditDialog(true)

    if (formRef.current) {
      const keys = ['title', 'name', 'propicSrc', 'color'] as const
      for (let i = 0; i < keys.length; i += 1) {
        const ele = formRef.current.querySelector(
          `input#${keys[i]}`
        ) as HTMLInputElement
        if (ele) {
          ele.value = player[keys[i]] ?? ''
        }
      }
    }

    handleClickRefreshPreview()
  }, [handleClickRefreshPreview, player, toggleEditDialog])

  const [selectedTeam, setSelectedTeam] = useState<Team | undefined>()

  const handleChangeTeam = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newTeamId = (e.currentTarget as HTMLSelectElement).value

      setSelectedTeam(teamsMap?.[newTeamId])
    },
    [teamsMap]
  )

  const handleClickFillTeam = useCallback(() => {
    if (!selectedTeam) {
      return
    }

    setModifiedPlayer((prev) => ({
      ...prev,
      color: selectedTeam.color,
      title: selectedTeam.name,
    }))
  }, [])

  const handleSubmitEditForm = useCallback(
    (e: FormEvent) => {
      e.preventDefault()

      if (!onEdit) {
        return
      }

      const elements = [
        ...(e.target as HTMLFormElement).querySelectorAll('input'),
      ]

      const newPlayer: Player = { name: '' }
      for (let i = 0; i < elements.length; i += 1) {
        const ele = elements[i] as HTMLInputElement
        if (ele) {
          const key = ele.getAttribute('id')
          if (key) {
            newPlayer[key as keyof Player] = ele.value
          }
        }
      }

      onEdit(playerIndex, newPlayer).then(() => toggleEditDialog(false))
    },
    [onEdit, playerIndex, toggleEditDialog]
  )

  const handleCloseEditDialog = useCallback(
    () => toggleEditDialog(false),
    [toggleEditDialog]
  )

  return (
    <>
      <div
        className="flex-1 flex items-center gap-x-2 rounded p-2 text-white"
        style={{
          background: player.color ?? '#115e59',
        }}
        {...divProps}
      >
        <div className="shrink-0">
          <div
            className="w-14 h-14 bg-center bg-contain bg-no-repeat rounded"
            style={{
              backgroundImage: `url(${
                player.propicSrc || '/images/portrait-placeholder.jpeg'
              })`,
            }}
          />
        </div>
        <div className="flex-1">
          <div>{player.title ?? '(無頭銜)'}</div>
          <div className="text-2xl">{player.name ?? '(無名稱)'}</div>
        </div>
        {onEdit && (
          <div className="shrink-0">
            <MJUIButton
              variant="icon"
              color="inverted"
              type="button"
              onClick={handleClickEdit}
            >
              <span className="material-symbols-outlined">edit</span>
            </MJUIButton>
          </div>
        )}
      </div>

      <MJUIDialogV2
        title="修改玩家"
        open={isShowEditDialog}
        onClose={handleCloseEditDialog}
      >
        <div className="container">
          <form ref={formRef} onSubmit={handleSubmitEditForm}>
            <div>
              <MJUIFormGroup className="mb-6" label="隊伍">
                <div className="flex gap-x-2">
                  <div className="flex-1 items-center">
                    <MJUISelect id="team" onChange={handleChangeTeam}>
                      <option value="-1" disabled selected>
                        請選擇
                      </option>
                      {teams.map((team) => (
                        <option value={team._id}>{team.name}</option>
                      ))}
                    </MJUISelect>
                  </div>
                  <div className="shrink-0 w-40">
                    <MJUIButton
                      type="button"
                      className="w-full text-white"
                      onClick={handleClickFillTeam}
                      style={{ background: selectedTeam?.color }}
                      disabled={!selectedTeam}
                    >
                      更新頭銜及顏色
                    </MJUIButton>
                  </div>
                </div>
              </MJUIFormGroup>
              <MJUIFormGroup className="mb-6" label="頭銜">
                <MJUIInput id="title" type="text" />
              </MJUIFormGroup>
              <MJUIFormGroup className="mb-6" label="名字">
                <MJUIInput id="name" type="text" required />
              </MJUIFormGroup>
              <MJUIFormGroup className="mb-6" label="圖片URL (https://...)">
                <MJUIInput id="propicSrc" type="url" placeholder="https://" />
              </MJUIFormGroup>
              <MJUIFormGroup
                className="mb-6"
                label="顏色（務必選能看清楚白字的深色）"
              >
                <MJUIInputForColor id="color" />
              </MJUIFormGroup>
            </div>

            <div className="mb-6">
              <div className="mb-2">
                預覽{' '}
                <MJUIButton
                  variant="text"
                  size="small"
                  type="button"
                  onClick={handleClickRefreshPreview}
                >
                  <div className="flex items-center">
                    <span>刷新</span>
                    <span className="material-symbols-outlined text-md">
                      refresh
                    </span>
                  </div>
                </MJUIButton>
              </div>
              <div className="text-[4rem] px-4 pt-6 pb-1 bg-gray-800 text-white relative">
                <MJPlayerCardDiv player={modifiedPlayer} score={25000} />
              </div>
            </div>

            <div className="flex gap-x-2">
              <div className="flex-1">
                <MJUIButton
                  className="w-full"
                  color="secondary"
                  type="button"
                  onClick={handleCloseEditDialog}
                >
                  取消
                </MJUIButton>
              </div>
              <div className="flex-1">
                <MJUIButton className="w-full" type="submit">
                  儲存
                </MJUIButton>
              </div>
            </div>
          </form>
        </div>
      </MJUIDialogV2>
    </>
  )
}

export default MJPlayerInfoCardDiv
