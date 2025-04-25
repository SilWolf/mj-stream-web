import { getQrCodeImgSrc } from '@/utils/string.util'

export default function ObsRoomEndPage() {
  return (
    <div
      className="absolute inset-0 text-[#ec276e] flex flex-col justify-center items-center"
      style={{
        background:
          'linear-gradient(to bottom, rgb(255, 217, 227), rgb(255, 192, 203))',
      }}
    >
      <div className="w-[80%]">
        <div className="flex flex-col justify-center items-center h-[70vh]">
          <img src="/images/logo-sakura-long.png" className="w-[40%]" alt="" />
          <p className="text-[100px] text-center">
            今日賽事已結束，感謝各位收看！
          </p>
          <div className="text-center mt-[5vh]">
            <img
              src={getQrCodeImgSrc('https://sakura2025.hkmahjong.org/')}
              className="w-[40%] mx-auto"
              alt=""
            />
          </div>
          <p className="text-[48px] text-center">
            <u>https://sakura2025.hkmahjong.org/</u>
          </p>
          <p className="text-[48px] text-center">賽程、賽事重溫、選手介紹</p>
        </div>
      </div>
    </div>
  )
}
