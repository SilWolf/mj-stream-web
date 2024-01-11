import {
  Match,
  MatchRound,
  PlayerIndex,
  PlayerResultWinnerOrLoserEnum,
  RoundResultTypeEnum,
} from '@/models'
import { useEffect, useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import MJMatchRonForm, { MJMatchRonFormProps } from '../MJMatchRonForm'
import MJMatchExhaustedForm, {
  MJMatchExhaustedFormProps,
} from '../MJMatchExhaustedForm'

export type MJMatchRoundEditFormProps = {
  match: Match
  matchRound: MatchRound | null
  showChainedWarning?: boolean
}

type FormProps = {
  _playerResults: Record<
    PlayerIndex,
    { status: 'none' | 'isRiichied' | 'isRevealed' }
  >
  _resultType: 'ron' | 'exhausted'
}

const MJMatchRoundEditForm = ({
  match,
  matchRound,
}: MJMatchRoundEditFormProps) => {
  const { control, register, reset } = useForm<FormProps>()
  const myResultType = useWatch({ name: '_resultType', control })

  const ronFormProps = useMemo<Omit<
    MJMatchRonFormProps,
    'onSubmit'
  > | null>(() => {
    if (!matchRound) {
      return null
    }

    return {
      match,
      currentMatchRound: matchRound,
      initialActivePlayerIndex: (matchRound.resultType ===
        RoundResultTypeEnum.Ron ||
      matchRound.resultType === RoundResultTypeEnum.SelfDrawn
        ? Object.entries(matchRound.playerResults).find(
            ([, player]) => player.type === PlayerResultWinnerOrLoserEnum.Win
          )?.[0] ?? '0'
        : '0') as PlayerIndex,
      initialTargetPlayerIndex: (matchRound.resultType ===
      RoundResultTypeEnum.Ron
        ? Object.entries(matchRound.playerResults).find(
            ([, player]) => player.type === PlayerResultWinnerOrLoserEnum.Lose
          )?.[0] ?? '-1'
        : '-1') as PlayerIndex,
    }
  }, [match, matchRound])

  const exhaustedFormProps = useMemo<Omit<
    MJMatchExhaustedFormProps,
    'onSubmit'
  > | null>(() => {
    if (!matchRound) {
      return null
    }
    return {
      match,
      currentMatchRound: matchRound,
    }
  }, [match, matchRound])

  useEffect(() => {
    if (!matchRound) {
      return
    }

    reset({
      _resultType:
        matchRound.resultType === RoundResultTypeEnum.Ron ||
        matchRound.resultType === RoundResultTypeEnum.SelfDrawn
          ? 'ron'
          : 'exhausted',
      _playerResults: {
        '0': {
          status: matchRound.playerResults['0'].isRevealed
            ? 'isRevealed'
            : matchRound.playerResults['0'].isRiichi
            ? 'isRiichied'
            : 'none',
        },
        '1': {
          status: matchRound.playerResults['1'].isRevealed
            ? 'isRevealed'
            : matchRound.playerResults['1'].isRiichi
            ? 'isRiichied'
            : 'none',
        },
        '2': {
          status: matchRound.playerResults['2'].isRevealed
            ? 'isRevealed'
            : matchRound.playerResults['2'].isRiichi
            ? 'isRiichied'
            : 'none',
        },
        '3': {
          status: matchRound.playerResults['3'].isRevealed
            ? 'isRevealed'
            : matchRound.playerResults['3'].isRiichi
            ? 'isRiichied'
            : 'none',
        },
      },
    })
  }, [matchRound, matchRound?.playerResults, matchRound?.resultType, reset])

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">各玩家終局狀態</h2>
      <table className="w-full data-table">
        <thead>
          <tr>
            <th></th>
            <th>立直/副露？</th>
          </tr>
        </thead>
        <tbody>
          {(['0', '1', '2', '3'] as const).map((playerIndex) => (
            <tr key={playerIndex}>
              <td>{match.players[playerIndex].nickname}</td>
              <td>
                <select {...register(`_playerResults.${playerIndex}.status`)}>
                  <option value="none">-</option>
                  <option value="isRiichied">立直</option>
                  <option value="isRevealed">副露</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      <h2 className="text-xl font-bold">
        <span>對局結果：</span>
        <select {...register('_resultType')}>
          <option value="ron">和了</option>
          <option value="exhausted">流局</option>
        </select>
      </h2>

      {myResultType === 'ron' && !!ronFormProps && (
        <MJMatchRonForm {...ronFormProps} submitNode="提交修改" />
      )}
      {myResultType === 'exhausted' && !!exhaustedFormProps && (
        <MJMatchExhaustedForm {...exhaustedFormProps} submitNode="提交修改" />
      )}
    </div>
  )
}

export default MJMatchRoundEditForm
