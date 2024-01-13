import {
  Match,
  MatchRound,
  PlayerIndex,
  PlayerResultWinnerOrLoserEnum,
  RoundResultTypeEnum,
} from '@/models'
import { useCallback, useEffect, useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import MJMatchRonForm, { MJMatchRonFormProps } from '../MJMatchRonForm'
import MJMatchExhaustedForm, {
  MJMatchExhaustedFormProps,
} from '../MJMatchExhaustedForm'

export type MJMatchRoundEditFormProps = {
  match: Match
  matchRound: MatchRound | null
  showChainedWarning?: boolean
  onSubmit?: (resultMatchRound: MatchRound) => unknown
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
  onSubmit,
}: MJMatchRoundEditFormProps) => {
  const { control, register, reset } = useForm<FormProps>()

  const myPlayerResults = useWatch({ name: '_playerResults', control })
  const myResultType = useWatch({ name: '_resultType', control })

  const myMatchRound = useMemo<MatchRound | null>(() => {
    if (!matchRound || !myPlayerResults) {
      return null
    }

    return {
      ...matchRound,
      playerResults: {
        '0': {
          ...matchRound.playerResults['0'],
          isRiichi: myPlayerResults[0].status === 'isRiichied',
          isRevealed: myPlayerResults[0].status === 'isRevealed',
          detail: {
            ...matchRound.playerResults['0'].detail,
            isRiichied: myPlayerResults[0].status === 'isRiichied',
            isRevealed: myPlayerResults[0].status === 'isRevealed',
          },
        },
        '1': {
          ...matchRound.playerResults['1'],
          isRiichi: myPlayerResults[1].status === 'isRiichied',
          isRevealed: myPlayerResults[1].status === 'isRevealed',
          detail: {
            ...matchRound.playerResults['1'].detail,
            isRiichied: myPlayerResults[1].status === 'isRiichied',
            isRevealed: myPlayerResults[1].status === 'isRevealed',
          },
        },
        '2': {
          ...matchRound.playerResults['2'],
          isRiichi: myPlayerResults[2].status === 'isRiichied',
          isRevealed: myPlayerResults[2].status === 'isRevealed',
          detail: {
            ...matchRound.playerResults['2'].detail,
            isRiichied: myPlayerResults[2].status === 'isRiichied',
            isRevealed: myPlayerResults[2].status === 'isRevealed',
          },
        },
        '3': {
          ...matchRound.playerResults['3'],
          isRiichi: myPlayerResults[3].status === 'isRiichied',
          isRevealed: myPlayerResults[3].status === 'isRevealed',
          detail: {
            ...matchRound.playerResults['3'].detail,
            isRiichied: myPlayerResults[3].status === 'isRiichied',
            isRevealed: myPlayerResults[3].status === 'isRevealed',
          },
        },
      },
    }
  }, [matchRound, myPlayerResults])

  const ronFormProps = useMemo<Omit<
    MJMatchRonFormProps,
    'onSubmit'
  > | null>(() => {
    if (!myMatchRound) {
      return null
    }

    return {
      match,
      currentMatchRound: myMatchRound,
      initialActivePlayerIndex: (myMatchRound.resultType ===
        RoundResultTypeEnum.Ron ||
      myMatchRound.resultType === RoundResultTypeEnum.SelfDrawn
        ? Object.entries(myMatchRound.playerResults).find(
            ([, player]) => player.type === PlayerResultWinnerOrLoserEnum.Win
          )?.[0] ?? '0'
        : '0') as PlayerIndex,
      initialTargetPlayerIndex: (myMatchRound.resultType ===
      RoundResultTypeEnum.Ron
        ? Object.entries(myMatchRound.playerResults).find(
            ([, player]) => player.type === PlayerResultWinnerOrLoserEnum.Lose
          )?.[0] ?? '-1'
        : '-1') as PlayerIndex,
    }
  }, [match, myMatchRound])

  const exhaustedFormProps = useMemo<Omit<
    MJMatchExhaustedFormProps,
    'onSubmit'
  > | null>(() => {
    if (!myMatchRound) {
      return null
    }
    return {
      match,
      currentMatchRound: myMatchRound,
    }
  }, [match, myMatchRound])

  const handleSubmitRonFormOrExhaustedForm = useCallback(
    (newMatchRound: MatchRound) => {
      onSubmit?.(newMatchRound)
    },
    [onSubmit]
  )

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
        <MJMatchRonForm
          {...ronFormProps}
          submitNode="提交修改"
          onSubmit={handleSubmitRonFormOrExhaustedForm}
        />
      )}
      {myResultType === 'exhausted' && !!exhaustedFormProps && (
        <MJMatchExhaustedForm
          {...exhaustedFormProps}
          submitNode="提交修改"
          onSubmit={handleSubmitRonFormOrExhaustedForm}
        />
      )}
    </div>
  )
}

export default MJMatchRoundEditForm
