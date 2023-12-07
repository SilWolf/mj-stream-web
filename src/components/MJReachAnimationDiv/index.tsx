import { Player } from '@/models'

const MJReactAnimationDiv = ({
  teamPicUrl,
}: {
  teamPicUrl: Player['teamPicUrl']
}) => {
  return (
    <div className="reach-animation">
      <div
        className="reach-animation-logo"
        style={{ backgroundImage: `url("${teamPicUrl}")` }}
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
  )
}

export default MJReactAnimationDiv
