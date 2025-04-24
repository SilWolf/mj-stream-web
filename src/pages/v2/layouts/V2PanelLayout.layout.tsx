import { PropsWithChildren } from 'react'

export default function V2PanelLayout({ children }: PropsWithChildren) {
  return (
    <div className="drawer drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <div className="navbar bg-base-100 w-full border-b-1 border-base-300">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-3"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 flex-1 px-2">HK League 2025</div>
        </div>
        <main>{children}</main>
      </div>
      <div className="drawer-side border-r-1 border-base-300">
        <div className="p-4 w-full text-lg text-center">日麻直播系統</div>
        <ul className="menu bg-base-100 text-base-content min-h-full w-80 p-4">
          {/* Sidebar content here */}
          <li>
            <a>賽事</a>
          </li>
          <li>
            <a>隊伍／選手</a>
          </li>
          <li>
            <a>風格</a>
          </li>
        </ul>
      </div>
    </div>
  )
}
