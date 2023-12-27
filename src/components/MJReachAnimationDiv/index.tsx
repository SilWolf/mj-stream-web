import { Player } from '@/models'

const MJReachAnimationDiv = ({
  active,
  color = '#000000',
  largeTeamPicUrl,
}: {
  largeTeamPicUrl: Player['largeTeamPicUrl']
  color: string | null
  active: boolean
}) => {
  return (
    <>
      <img src="/images/r.png" className="w-0 h-0 opacity-0" />
      <img src="/images/e.png" className="w-0 h-0 opacity-0" />
      <img src="/images/a.png" className="w-0 h-0 opacity-0" />
      <img src="/images/c.png" className="w-0 h-0 opacity-0" />
      <img src="/images/h.png" className="w-0 h-0 opacity-0" />
      <img src="/images/score-thousand.png" className="w-0 h-0 opacity-0" />

      {active && (
        <div className="reach-animation">
          <div
            className="reach-background"
            style={{
              background: `linear-gradient(to bottom, transparent, ${color}80 40%, ${color}80 60%, transparent)`,
            }}
          ></div>
          <div
            className="reach-animation-logo"
            style={{ backgroundImage: `url("${largeTeamPicUrl}")` }}
          ></div>
          <div
            className="reach-animation-bar"
            style={{ backgroundImage: 'url("/images/score-thousand.png")' }}
          ></div>
          <div className="reach-animation-text">
            <div
              className="reach-animation-text-character c1"
              style={{ backgroundImage: 'url("/images/r.png")' }}
            ></div>
            <div
              className="reach-animation-text-character c2"
              style={{ backgroundImage: 'url("/images/e.png")' }}
            ></div>
            <div
              className="reach-animation-text-character c3"
              style={{ backgroundImage: 'url("/images/a.png")' }}
            ></div>
            <div
              className="reach-animation-text-character c4"
              style={{ backgroundImage: 'url("/images/c.png")' }}
            ></div>
            <div
              className="reach-animation-text-character c5"
              style={{ backgroundImage: 'url("/images/h.png")' }}
            ></div>
          </div>
        </div>
      )}
    </>
  )
}

export default MJReachAnimationDiv
