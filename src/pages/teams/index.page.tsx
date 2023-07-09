import MJPlayerCardDiv from '@/components/MJPlayerCardDiv'
import MJTeamInfoCardDiv from '@/components/MJTeamInfoCardDiv'
import MJUIButton from '@/components/MJUI/MJUIButton'
import MJUIDialogV2 from '@/components/MJUI/MJUIDialogV2'
import MJUIFormGroup from '@/components/MJUI/MJUIFormGroup'
import MJUIInput from '@/components/MJUI/MJUIInput'
import MJUIInputForColor from '@/components/MJUI/MJUIInputForColor'
import { Team } from '@/models'
import { useFirebaseDatabaseByKey } from '@/providers/firebaseDatabase.provider'
import React, { useCallback, useMemo, useRef } from 'react'
import { useBoolean } from 'react-use'

import { Controller, useForm, useWatch } from 'react-hook-form'

function TeamsPage() {
  const {
    data: teamsMap,
    update: updateTeamMap,
    push: pushTeamMap,
  } = useFirebaseDatabaseByKey<Team>('teams')

  const teams = useMemo(
    () =>
      Object.entries(teamsMap ?? {})
        .reverse()
        .map(([key, value]) => ({
          ...value,
          _id: key,
        })),
    [teamsMap]
  )

  const [isShowEditDialog, toggleEditDialog] = useBoolean(false)

  const {
    register,
    reset: resetForm,
    handleSubmit,
    control: formControl,
  } = useForm<Team>({
    defaultValues: {
      _id: undefined,
      name: '新的隊伍',
      color: '#000000',
    },
  })

  const watchedTeam = useWatch({ control: formControl })

  const formRef = useRef<HTMLFormElement | null>(null)

  const handleCloseEditDialog = useCallback(
    () => toggleEditDialog(false),
    [toggleEditDialog]
  )

  const handleClickAdd = useCallback(() => {
    resetForm({ _id: '', name: '新的隊伍', color: '#000000' })
    toggleEditDialog(true)
  }, [resetForm, toggleEditDialog])

  const handleClickEdit = useCallback(
    (team: Team) => {
      resetForm({ ...team })
      toggleEditDialog(true)
    },
    [resetForm, toggleEditDialog]
  )

  const handleSubmitEditForm = useMemo(
    () =>
      handleSubmit((newTeam: Team) => {
        console.log(newTeam)
        if (!newTeam._id) {
          pushTeamMap(newTeam)
        } else {
          updateTeamMap({ [newTeam._id]: newTeam })
        }

        toggleEditDialog(false)
      }),
    [handleSubmit, pushTeamMap, toggleEditDialog, updateTeamMap]
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
            <h1 className="text-4xl">隊伍</h1>
          </div>
          <div>
            <MJUIButton onClick={handleClickAdd}>新增</MJUIButton>
          </div>
        </div>
        <div className="space-y-2">
          {teams.map((team) => (
            <MJTeamInfoCardDiv
              key={team._id}
              team={team}
              onClickEdit={handleClickEdit}
            />
          ))}
        </div>
      </div>

      <MJUIDialogV2
        title="新增／修改隊伍"
        open={isShowEditDialog}
        onClose={handleCloseEditDialog}
      >
        <div className="container">
          <form ref={formRef} onSubmit={handleSubmitEditForm}>
            <input type="hidden" {...register('_id')} />

            <div>
              <MJUIFormGroup className="mb-6" label="名字">
                <Controller
                  name="name"
                  control={formControl}
                  rules={{ required: true }}
                  render={({ field }) => <MJUIInput {...field} />}
                />
              </MJUIFormGroup>

              <MJUIFormGroup
                className="mb-6"
                label="顏色（務必選能看清楚白字的深色）"
              >
                <Controller
                  name="color"
                  control={formControl}
                  rules={{ required: true }}
                  render={({ field }) => <MJUIInputForColor {...field} />}
                />
              </MJUIFormGroup>
            </div>

            <div className="mb-6">
              <div className="mb-2">預覽</div>
              <div className="text-[4rem] px-4 pt-6 pb-1 bg-gray-800 text-white relative">
                <MJPlayerCardDiv
                  name="隊員名字"
                  title={watchedTeam.name}
                  color={watchedTeam.color}
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

export default TeamsPage
