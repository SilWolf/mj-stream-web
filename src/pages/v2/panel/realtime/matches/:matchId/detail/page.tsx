import React, { useCallback, useState } from 'react'
import useRealtimeMatch from '@/hooks/useRealtimeMatch'
import { convertMatchToExportedMatch } from '@/helpers/mahjong.helper'
import MJMatchHistoryTable from '@/components/MJMatchHistoryTable'
import MJUIButton from '@/components/MJUI/MJUIButton'

type Props = {
  params: { matchId: string }
}

export default function MatchExportPage({ params: { matchId } }: Props) {
  const { rtMatch, rtMatchRounds, rtMatchCurrentRound } =
    useRealtimeMatch(matchId)

  const [isExported, setIsExported] = useState<boolean>(false)
  const [isExporting, setIsExporting] = useState<boolean>(false)

  const handleClickExport = useCallback(() => {
    if (!rtMatch || !rtMatchRounds) {
      return
    }

    const exportedMatch = {
      _id: rtMatch.databaseId || matchId,
      ...convertMatchToExportedMatch(Object.values(rtMatchRounds)),
    }

    setIsExporting(true)
    fetch(
      `${import.meta.env.VITE_HOMEPAGE_HOST}/api/match/${
        exportedMatch._id
      }/result`,
      {
        method: 'PATCH',
        body: JSON.stringify(exportedMatch),
        headers: {
          Accept: 'application/json',
        },
      }
    ).then(() => {
      setIsExported(true)
      setIsExporting(false)
      alert('上傳完畢，請在資料庫上查看。')
    })
  }, [rtMatch, matchId, rtMatchRounds])

  if (!rtMatch || !rtMatchCurrentRound) {
    return <div>對局讀取失敗。</div>
  }

  return (
    <div>
      <div className="container mx-auto my-8 px-8 space-y-6">
        <div>
          <h3 className="text-2xl text-center">{rtMatch.name}</h3>
        </div>

        <div>
          <p className="text-sm">
            暫存資料庫ID: <strong>{matchId}</strong>
          </p>
          <p className="text-sm">
            長久資料庫ID: <strong>{rtMatch.databaseId}</strong>
          </p>
        </div>

        <MJMatchHistoryTable
          players={rtMatch.players}
          matchRounds={rtMatchRounds}
          className="w-full table-auto"
        />

        <div className="text-center">
          {!isExported && (
            <MJUIButton disabled={isExporting} onClick={handleClickExport}>
              {isExporting ? '上傳中…' : '上傳成績'}
            </MJUIButton>
          )}
          {isExported && (
            <a
              href={`${
                import.meta.env.VITE_CMS_HOST
              }/structure/general-list-matches-past;${matchId}`}
            >
              <MJUIButton color="secondary">在資料庫上查看</MJUIButton>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
