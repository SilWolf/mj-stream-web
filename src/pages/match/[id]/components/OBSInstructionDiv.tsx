import { getQrCodeImgSrc } from '@/utils/string.util'
import React, { useCallback, useMemo } from 'react'

const cssText = `body { 
  background-color: rgba(0, 0, 0, 0); 
  color: rgba(0, 0, 0, 0); 
  margin: 0px auto; 
  overflow: hidden; 
}

.body-hidden {
  display: none;
}`

type Props = {
  matchId: string
}

export default function OBSInstructionDiv({ matchId }: Props) {
  const controlUrl = useMemo(
    () => `${window.location.origin}/match/${matchId}/control`,
    [matchId]
  )

  const handleClickCopy = useCallback(() => {
    window.navigator.clipboard.writeText(cssText)
  }, [])

  return (
    <div className="flex items-center justify-center gap-x-8">
      <div>
        <p>1. 打開OBS</p>
        <p>
          2. 來源 {'->'} + {'->'} 瀏覽器，然後照下面設定
        </p>
        <p>
          - 網址 = 此頁的網址 <strong>{window.location.href}</strong>
          <br />- 寬度 = 1920, 高度 = 1080
          <br /> - 自訂CSS ={' '}
          <div className="relative bg-gray-700 text-white p-4 rounded-sm">
            <pre>{cssText}</pre>
            <div className="absolute top-2 right-2">
              <button type="button" onClick={handleClickCopy}>
                <i className="bi bi-copy"></i>
              </button>
            </div>
          </div>
        </p>
      </div>
      <div>
        <p>3. 在管理後台點擊右上角的 "開始OBS" </p>
        <p>4. 確定</p>
      </div>
      <div className="shrink-0">
        <a
          href={controlUrl}
          target="_blank"
          rel="noreferrer"
          className="text-center underline"
        >
          <img
            className="block w-32 h-32"
            src={getQrCodeImgSrc(controlUrl)}
            alt=""
          />
          <p>管理後台</p>
        </a>
      </div>
    </div>
  )
}
