import RecentMatchesSection from './sections/RecentMatchesSection'

export default function V2PanelPage() {
  return (
    <>
      <section className="container mx-6 my-4">
        <h2 className="text-2xl">直播中</h2>
      </section>

      <section className="container mx-6 my-4">
        <RecentMatchesSection />
      </section>
    </>
  )
}
