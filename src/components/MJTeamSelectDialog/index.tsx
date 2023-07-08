import React, { useCallback, useMemo } from 'react'
import { Team } from '@/models'
import MJUIDialogV2, { MJUIDialogV2Props } from '../MJUI/MJUIDialogV2'
import MJTeamInfoCardDiv from '../MJTeamInfoCardDiv'

type Props = {
  teams: Record<string, Team>
  onSelect: (id: string, team: Team) => unknown
} & Omit<MJUIDialogV2Props, 'children'>

function MJTeamSelectDialog({ teams, onSelect, ...dialogProps }: Props) {
  const myTeams = useMemo(
    () =>
      teams
        ? Object.entries(teams).map(
            ([_id, team]) => ({
              ...team,
              _id,
            }),
            []
          )
        : [],
    [teams]
  )

  const handleClickTeam = useCallback(
    (e: React.MouseEvent) => {
      const id = e.currentTarget.getAttribute('data-id')
      if (!id) {
        return
      }

      const team = teams[id]
      if (!team) {
        return
      }

      onSelect(id, team)
    },
    [onSelect, teams]
  )

  return (
    <MJUIDialogV2 title="選擇隊伍" {...dialogProps}>
      {myTeams.length === 0 && (
        <div className="text-gray-500 text-center py-4">
          沒有儲存的玩家。請先在外面新增玩家，然後開始對局，下一次該玩家就可供選擇。
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {myTeams.map((team) => (
          <button
            type="button"
            key={team._id}
            className="text-left flex items-center gap-x-2"
            onClick={handleClickTeam}
            data-id={team._id}
          >
            <MJTeamInfoCardDiv team={team} />
          </button>
        ))}
      </div>
    </MJUIDialogV2>
  )
}

export default MJTeamSelectDialog
