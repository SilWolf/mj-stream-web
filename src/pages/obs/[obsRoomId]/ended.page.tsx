export default function ObsRoomEndPage() {
  return (
    <div
      className="fixed inset-0 text-white flex flex-col justify-center items-center"
      style={{
        background:
          'linear-gradient(to bottom, rgb(30, 34, 59), rgb(16, 18, 33))',
      }}
    >
      <div className="w-[80vw]">
        <div className="flex justify-between">
          <img
            src="/images/tournament-long-logo.png"
            className="w-[50%]"
            alt=""
          />
          <div>
            <img src="/images/logo-hkma.webp" className="w-[12vw]" alt="" />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center h-[70vh]">
          <p className="text-[100px] text-center">
            今天賽事已結束，感謝各位收看！
          </p>
          <div className="text-center mt-[5vh]">
            <img
              src="/images/homepage-qr.png"
              className="w-[12vw] mx-auto"
              alt=""
            />
          </div>
          <p className="text-[48px] text-center">
            <u>https://hkleague2024.hkmahjong.org/</u>
          </p>
          <p className="text-[48px] text-center">
            賽程、賽事重溫、隊伍介紹、新手教程
          </p>
        </div>
      </div>
    </div>
  )
}
