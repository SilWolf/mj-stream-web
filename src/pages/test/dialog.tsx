import React, { ChangeEvent, useCallback, useState } from 'react'
import MJUIDialog from '@/components/MJUI/MJUIDialog'
import MJUIButton from '@/components/MJUI/MJUIButton'
import MJScoreSelect from '@/components/MJHanFuScoreSelect'

export default function TestForDialogPage() {
  const [isConfirm, setIsConfirm] = useState<boolean>(false)

  const handleChangeIsConfirm = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setIsConfirm(e.currentTarget.checked)
    },
    []
  )

  return (
    <MJUIDialog title="東一局一本場 和了" open>
      <div className="space-y-8">
        <div className="flex gap-x-4 items-center">
          <div className="flex-1">
            <div className="p-2 rounded bg-gray-200 text-center">
              <span className="font-bold">井上義明</span> (25000)
            </div>
          </div>
          <div className="text-xs text-gray-500">和了</div>
          <div className="flex-1">
            <div className="p-2 border border-gray-500 rounded cursor-pointer hover:bg-gray-200 text-center">
              自摸
            </div>
          </div>
        </div>
        <MJScoreSelect isEast isRon />

        <div className="space-y-2">
          <h5 className="font-bold">分數變動</h5>

          <table className="text-sm w-full">
            <tbody>
              <tr>
                <th>井上義明</th>
                <td>25000</td>
                <td>+8000</td>
                <td className="text-right">25000</td>
              </tr>
              <tr>
                <th>井上義明</th>
                <td>25000</td>
                <td />
                <td className="text-right">25000</td>
              </tr>
              <tr>
                <th>井上義明</th>
                <td>25000</td>
                <td />
                <td className="text-right">25000</td>
              </tr>
              <tr>
                <th>井上義明</th>
                <td>25000</td>
                <td>-8000</td>
                <td className="text-right">25000</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <label htmlFor="isConfirm">
            <input
              id="isConfirm"
              type="checkbox"
              checked={isConfirm}
              onChange={handleChangeIsConfirm}
            />
            我已確認上述分數變動正確無誤
          </label>
        </div>

        <MJUIButton className="w-full" disabled={!isConfirm}>
          提交並播出分數變動動畫
        </MJUIButton>
      </div>
    </MJUIDialog>
  )
}
