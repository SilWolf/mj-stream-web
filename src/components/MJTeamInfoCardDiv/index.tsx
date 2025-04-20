import { Team } from '@/models'
import React, { HTMLAttributes, useCallback } from 'react'
import MJUIButton from '../MJUI/MJUIButton'

type Props = HTMLAttributes<HTMLDivElement> & {
  team: Team
  onClickEdit?: (newTeam: Team) => unknown
}

function MJTeamInfoCardDiv({
  team,
  onClickEdit,
  children,
  ...divProps
}: Props) {
  const handleClickEdit = useCallback(() => {
    onClickEdit?.(team)
  }, [onClickEdit, team])

  return (
    <div
      className="flex-1 flex items-center gap-x-2 rounded-sm p-2 text-white"
      style={{
        background: team.color ?? '#115e59',
      }}
      {...divProps}
    >
      <div className="flex-1">
        <div className="text-2xl">{team.name ?? '(無名稱)'}</div>
      </div>

      {onClickEdit && (
        <div className="shrink-0">
          <MJUIButton
            variant="icon"
            color="inverted"
            type="button"
            onClick={handleClickEdit}
          >
            <i className="bi bi-pencil"></i>
          </MJUIButton>
        </div>
      )}
    </div>
  )
}

export default MJTeamInfoCardDiv
