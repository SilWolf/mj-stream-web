import { Team } from '@/models'
import React, {
  FormEvent,
  HTMLAttributes,
  useCallback,
  useRef,
  useState,
} from 'react'
import { useBoolean } from 'react-use'
import MJUIDialogV2 from '../MJUI/MJUIDialogV2'
import MJUIButton from '../MJUI/MJUIButton'
import MJUIInput from '../MJUI/MJUIInput'
import MJUIInputForColor from '../MJUI/MJUIInputForColor'
import MJUIFormGroup from '../MJUI/MJUIFormGroup'

type Props = HTMLAttributes<HTMLDivElement> & {
  team: Team
  onEdit?: (newTeam: Team) => Promise<unknown>
}

function MJTeamInfoCardDiv({ team, onEdit, children, ...divProps }: Props) {
  const [isShowEditDialog, toggleEditDialog] = useBoolean(false)
  const [modifiedTeam, setModifiedTeam] = useState<Team>(team)

  const formRef = useRef<HTMLFormElement | null>(null)

  const handleClickRefreshPreview = useCallback(() => {
    if (!formRef.current) {
      return
    }

    const elements = [
      ...(formRef.current as HTMLFormElement).querySelectorAll('input'),
    ]

    const newTeam: Team = { name: '', color: '' }
    for (let i = 0; i < elements.length; i += 1) {
      const ele = elements[i] as HTMLInputElement
      if (ele) {
        const key = ele.getAttribute('id')
        if (key) {
          newTeam[key as keyof Team] = ele.value
        }
      }
    }

    setModifiedTeam(newTeam)
  }, [])

  const handleClickEdit = useCallback(() => {
    toggleEditDialog(true)

    if (formRef.current) {
      const keys = ['name', 'logoUrl', 'color'] as const
      for (let i = 0; i < keys.length; i += 1) {
        const ele = formRef.current.querySelector(
          `input#${keys[i]}`
        ) as HTMLInputElement
        if (ele) {
          ele.value = team[keys[i]] ?? ''
        }
      }
    }

    handleClickRefreshPreview()
  }, [handleClickRefreshPreview, team, toggleEditDialog])

  const handleSubmitEditForm = useCallback(
    (e: FormEvent) => {
      e.preventDefault()

      if (!onEdit) {
        return
      }

      const elements = [
        ...(e.target as HTMLFormElement).querySelectorAll('input'),
      ]

      const newTeam: Team = { name: '', color: '#000000' }
      for (let i = 0; i < elements.length; i += 1) {
        const ele = elements[i] as HTMLInputElement
        if (ele) {
          const key = ele.getAttribute('id')
          if (key) {
            newTeam[key as keyof Team] = ele.value
          }
        }
      }

      onEdit(newTeam).then(() => toggleEditDialog(false))
    },
    [onEdit, toggleEditDialog]
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
          background: team.color ?? '#115e59',
        }}
        {...divProps}
      >
        <div className="shrink-0">
          <div
            className="w-14 h-14 bg-center bg-contain bg-no-repeat rounded"
            style={{
              backgroundImage: `url(${
                team.logoUrl || '/images/portrait-placeholder.jpeg'
              })`,
            }}
          />
        </div>
        <div className="flex-1">
          <div className="text-2xl">{team.name ?? '(無名稱)'}</div>
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
              <MJUIFormGroup className="mb-6" label="名字">
                <MJUIInput id="name" type="text" required />
              </MJUIFormGroup>
              <MJUIFormGroup className="mb-6" label="圖片URL (https://...)">
                <MJUIInput id="logoUrl" type="url" placeholder="https://" />
              </MJUIFormGroup>
              <MJUIFormGroup
                className="mb-6"
                label="顏色（務必選能看清楚白字的深色）"
              >
                <MJUIInputForColor id="color" />
              </MJUIFormGroup>
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

export default MJTeamInfoCardDiv
