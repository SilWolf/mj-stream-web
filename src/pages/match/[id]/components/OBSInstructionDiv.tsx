import React from 'react'

export default function OBSInstructionDiv() {
  return (
    <div className="w-[80vw] ml-20 flex-1 text-current text-[40px] flex items-center justify-center">
      <div>
        <p>1. 打開OBS</p>
        <p>
          2. 來源 {'->'} + {'->'} 瀏覽器，然後照下面設定
        </p>
        <p>
          - 網址 = 此頁的網址 <strong>{window.location.href}</strong>
          <br />- 寬度 = 1920, 高度 = 1080
          <br /> - 自訂CSS ={' '}
          {
            'body { background-color: rgba(0, 0, 0, 0); color: rgba(0, 0, 0, 0); margin: 0px auto; overflow: hidden; }'
          }
          <br />
          其餘默認即可。
        </p>
        <p>4. 確定</p>
      </div>
    </div>
  )
}
