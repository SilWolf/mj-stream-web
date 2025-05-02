import RecentRealtimeMatchesSection from './sections/RecentRealtimeMatchesSection'

export default function V2PanelRealtimeMatchesPage() {
  return (
    <>
      <section className="mx-6 my-4 space-y-4">
        <h2 className="text-2xl">暫存資料庫</h2>

        <div className="alert alert-error alert-soft text-error-content">
          警告：暫存實料庫的數據會定時清除。請確保一場比賽結束後盡快上傳成績，否則數據很可能會丟失。
        </div>

        <RecentRealtimeMatchesSection />
      </section>
    </>
  )
}
