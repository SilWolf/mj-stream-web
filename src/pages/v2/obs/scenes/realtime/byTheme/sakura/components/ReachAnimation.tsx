import { RealtimePlayer } from '@/models'

import styles from './index.module.css'

export default function MJReachAnimationDiv({
  active,
  color = '#000000',
  largeLogoUrl,
}: {
  largeLogoUrl: RealtimePlayer['largeLogoUrl']
  color: string | null
  active: boolean
}) {
  return (
    <>
      <img src="/mj-stream-web/images/r.png" className="w-0 h-0 opacity-0" />
      <img src="/mj-stream-web/images/e.png" className="w-0 h-0 opacity-0" />
      <img src="/mj-stream-web/images/a.png" className="w-0 h-0 opacity-0" />
      <img src="/mj-stream-web/images/c.png" className="w-0 h-0 opacity-0" />
      <img src="/mj-stream-web/images/h.png" className="w-0 h-0 opacity-0" />
      <img
        src="/mj-stream-web/images/score-thousand.png"
        className="w-0 h-0 opacity-0"
      />

      {active && (
        <div className={styles['reach-animation']}>
          <div
            className="reach-background"
            style={{
              background: `linear-gradient(to bottom, transparent, ${color}80 40%, ${color}80 60%, transparent)`,
            }}
          ></div>
          <div
            className="reach-animation-logo"
            style={{ backgroundImage: `url("${largeLogoUrl}")` }}
          ></div>
          <div
            className="reach-animation-bar"
            style={{
              backgroundImage:
                'url("/mj-stream-web/images/score-thousand.png")',
            }}
          ></div>
          <div className="reach-animation-text">
            <div
              className="reach-animation-text-character c1"
              style={{ backgroundImage: 'url("/mj-stream-web/images/r.png")' }}
            ></div>
            <div
              className="reach-animation-text-character c2"
              style={{ backgroundImage: 'url("/mj-stream-web/images/e.png")' }}
            ></div>
            <div
              className="reach-animation-text-character c3"
              style={{ backgroundImage: 'url("/mj-stream-web/images/a.png")' }}
            ></div>
            <div
              className="reach-animation-text-character c4"
              style={{ backgroundImage: 'url("/mj-stream-web/images/c.png")' }}
            ></div>
            <div
              className="reach-animation-text-character c5"
              style={{ backgroundImage: 'url("/mj-stream-web/images/h.png")' }}
            ></div>
          </div>
        </div>
      )}
    </>
  )
}
