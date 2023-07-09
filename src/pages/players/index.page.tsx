import MJPlayerCardDiv from '@/components/MJPlayerCardDiv'
import MJPlayerInfoCardDiv from '@/components/MJPlayerInfoCardDiv'
import MJUIButton from '@/components/MJUI/MJUIButton'
import MJUIDialogV2 from '@/components/MJUI/MJUIDialogV2'
import MJUIFormGroup from '@/components/MJUI/MJUIFormGroup'
import MJUIInput from '@/components/MJUI/MJUIInput'
import MJUIInputForColor from '@/components/MJUI/MJUIInputForColor'
import { Player, Team } from '@/models'
import { useFirebaseDatabaseByKey } from '@/providers/firebaseDatabase.provider'
import React, { useCallback, useMemo, useState } from 'react'
import { useBoolean } from 'react-use'

import { Controller, useForm, useWatch } from 'react-hook-form'
import MJUISelect from '@/components/MJUI/MJUISelect'

function PlayersPage() {
  const {
    data: playersMap,
    update: updatePlayerMap,
    push: pushPlayerMap,
  } = useFirebaseDatabaseByKey<Player>('players')

  const players = useMemo(
    () =>
      Object.entries(playersMap ?? {})
        .reverse()
        .map(([key, value]) => ({
          ...value,
          _id: key,
        })),
    [playersMap]
  )

  const { data: teamsMap } = useFirebaseDatabaseByKey<Team>('teams')

  const teams = useMemo(
    () =>
      Object.entries(teamsMap ?? {}).map(([key, value]) => ({
        ...value,
        _id: key,
      })),
    [teamsMap]
  )

  const [isShowEditDialog, toggleEditDialog] = useBoolean(false)

  const {
    register,
    setValue: setFormValue,
    reset: resetForm,
    handleSubmit,
    control: formControl,
  } = useForm<Player>({
    defaultValues: {
      _id: '',
      title: '',
      name: '新的玩家',
      color: '#000000',
      propicSrc: '',
    },
  })

  const watchedPlayer = useWatch({ control: formControl })

  const handleCloseEditDialog = useCallback(
    () => toggleEditDialog(false),
    [toggleEditDialog]
  )

  const handleClickAdd = useCallback(() => {
    resetForm({
      _id: '',
      title: '',
      name: '新的玩家',
      color: '#000000',
      propicSrc: '',
    })
    toggleEditDialog(true)
  }, [resetForm, toggleEditDialog])

  const handleClickEdit = useCallback(
    (player: Player) => {
      resetForm({ ...player })
      toggleEditDialog(true)
    },
    [resetForm, toggleEditDialog]
  )

  const [selectedTeam, setSelectedTeam] = useState<Team | undefined>()

  const handleChangeTeam = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newTeamId = (e.currentTarget as HTMLSelectElement).value

      setSelectedTeam(teamsMap?.[newTeamId])
    },
    [teamsMap]
  )

  const handleClickApplyTeam = useCallback(() => {
    if (!selectedTeam) {
      return
    }

    setFormValue('color', selectedTeam.color)
    setFormValue('title', selectedTeam.name)
  }, [selectedTeam, setFormValue])

  const handleSubmitEditForm = useMemo(
    () =>
      handleSubmit((newPlayer: Player) => {
        console.log(newPlayer)
        if (!newPlayer._id) {
          pushPlayerMap(newPlayer)
        } else {
          updatePlayerMap({ [newPlayer._id]: newPlayer })
        }

        toggleEditDialog(false)
      }),
    [handleSubmit, pushPlayerMap, toggleEditDialog, updatePlayerMap]
  )

  return (
    <>
      <div className="container mx-auto max-w-screen-sm space-y-4 py-16">
        <div className="shrink-0">
          <a href="/" className="underline">
            &lt; 回上一頁
          </a>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl">玩家</h1>
          </div>
          <div>
            <MJUIButton onClick={handleClickAdd}>新增</MJUIButton>
          </div>
        </div>
        <div className="space-y-2">
          {players.map((player) => (
            <MJPlayerInfoCardDiv
              key={player._id}
              player={player}
              onClickEdit={handleClickEdit}
            />
          ))}
        </div>
      </div>

      <MJUIDialogV2
        title="新增／修改玩家"
        open={isShowEditDialog}
        onClose={handleCloseEditDialog}
      >
        <div className="container">
          <form onSubmit={handleSubmitEditForm}>
            <input type="hidden" {...register('_id')} />

            <div className="flex gap-x-4 items-center mb-6">
              <div className="flex-1 border border-gray-200 p-4">
                <MJUIFormGroup
                  className="mb-6"
                  label="顏色（務必選能看清楚白字的深色）"
                >
                  <Controller
                    name="color"
                    control={formControl}
                    render={({ field }) => <MJUIInputForColor {...field} />}
                  />
                </MJUIFormGroup>

                <MJUIFormGroup label="頭銜">
                  <Controller
                    name="title"
                    control={formControl}
                    render={({ field }) => <MJUIInput type="text" {...field} />}
                  />
                </MJUIFormGroup>
              </div>
              <div>或</div>
              <div className="flex-1 border border-gray-200 p-4 space-y-4">
                <p>選擇一個隊伍</p>

                <MJUISelect id="team" onChange={handleChangeTeam}>
                  <option value="-1" disabled selected>
                    請選擇
                  </option>
                  {teams.map((team) => (
                    <option value={team._id}>{team.name}</option>
                  ))}
                </MJUISelect>

                <MJUIButton
                  type="button"
                  color="secondary"
                  onClick={handleClickApplyTeam}
                >
                  套用頭銜和顏色
                </MJUIButton>
              </div>
            </div>

            <div>
              <MJUIFormGroup className="mb-6" label="名字">
                <Controller
                  name="name"
                  control={formControl}
                  rules={{ required: true }}
                  render={({ field }) => <MJUIInput {...field} />}
                />
              </MJUIFormGroup>

              <MJUIFormGroup className="mb-6" label="圖片URL (https://...)">
                <Controller
                  name="propicSrc"
                  control={formControl}
                  render={({ field }) => (
                    <MJUIInput type="url" placeholder="https://" {...field} />
                  )}
                />
              </MJUIFormGroup>
            </div>

            <div className="mb-6">
              <div className="mb-2">預覽</div>
              <div className="text-[4rem] px-4 pt-6 pb-1 bg-gray-800 text-white relative">
                <MJPlayerCardDiv
                  title={watchedPlayer.title}
                  name={watchedPlayer.name ?? ''}
                  color={watchedPlayer.color}
                  propicSrc={watchedPlayer.propicSrc}
                  score={25000}
                />
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

export default PlayersPage
