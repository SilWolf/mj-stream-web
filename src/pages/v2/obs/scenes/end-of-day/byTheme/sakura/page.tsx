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
      <div className="absolute inset-0">
        <video
          src="/videos/ptt-bg3.mp4"
          className="absolute inset-0"
          autoPlay
          loop
          muted
        ></video>
      </div>
      <div className="absolute pt-16 pb-64 px-24 inset-0 flex items-center justify-center">
        <div className="w-[100%]">
          <div className="flex flex-col justify-center items-center h-[70vh]">
            <img
              src="/images/logo-sakura-long.png"
              className="w-[40%]"
              alt=""
            />
            <div className="flex items-center justify-center gap-x-[2em]">
              <img className="h-[6em]" src="/images/logo-poly.webp" alt="" />
              <img
                className="h-[6em]"
                src="/images/logo-hkma-black.png"
                alt=""
              />
            </div>
            <p className="text-[110px] text-center mt-[0.5em]">
              本次賽事結束，感謝耐心收看
            </p>
          </div>
        </div>
      </div>
      <div className="absolute bottom-[4em] left-[4em]">
        <div className="flex items-center gap-x-4 self-start">
          <img
            src={getQrCodeImgSrc('https://sakura2025.hkmahjong.org/')}
            className="w-[120px]"
            alt=""
          />
          <div className="flex-1">
            <p className="text-[60px] text-left">
              <u>https://sakura2025.hkmahjong.org/</u>
            </p>
            <p className="text-[40px] text-left">賽程、賽事重溫、選手介紹</p>
          </div>
        </div>
      </div>
    </div>
  )
}
