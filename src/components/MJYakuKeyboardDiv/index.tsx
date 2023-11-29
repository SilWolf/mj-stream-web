import {
  ButtonHTMLAttributes,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useToggle } from 'react-use'
import MJUISwitch from '../MJUI/MJUISwitch'
import { MatchSetting, PlayerIndex } from '@/models'
import {
  getWindByRound,
  getWindByRoundAndPlayerIndex,
} from '@/utils/string.util'
import MJHanFuTextSpan from '../MJHanFuTextSpan'

type Yaku = {
  id: string
  label: string
  han: number
  hanIfOpened: number
  overrideFu?: number
  hidden?: boolean
}

const YAKUS: Yaku[] = [
  {
    id: 'riichi',
    label: '立直',
    han: 1,
    hanIfOpened: 0,
  },
  {
    id: 'ippatsu',
    label: '一發',
    han: 1,
    hanIfOpened: 0,
  },
  {
    id: 'menzenchin-tsumohou',
    label: '門前清自摸和',
    han: 1,
    hanIfOpened: 0,
  },
  {
    id: 'pinfu',
    label: '平和',
    han: 1,
    hanIfOpened: 0,
  },
  {
    id: 'iipeikou',
    label: '一盃口',
    han: 1,
    hanIfOpened: 0,
  },
  {
    id: 'haitei-raoyue',
    label: '海底撈月',
    han: 1,
    hanIfOpened: 1,
  },
  {
    id: 'houtei-raoyui',
    label: '河底撈魚',
    han: 1,
    hanIfOpened: 1,
  },
  {
    id: 'rinshan-kaihou',
    label: '嶺上開花',
    han: 1,
    hanIfOpened: 1,
  },
  {
    id: 'chankan',
    label: '搶槓',
    han: 1,
    hanIfOpened: 1,
  },
  {
    id: 'tanyao',
    label: '斷么九',
    han: 1,
    hanIfOpened: 1,
  },
  {
    id: 'yakuhai-match-kazehai',
    label: '場風',
    han: 1,
    hanIfOpened: 1,
  },
  {
    id: 'yakuhai-self-kazehai',
    label: '自風',
    han: 1,
    hanIfOpened: 1,
  },
  {
    id: 'yakuhai-double-kazehai',
    label: '雙風',
    han: 2,
    hanIfOpened: 2,
    hidden: true,
  },
  {
    id: 'yakuhai-chun',
    label: '中',
    han: 1,
    hanIfOpened: 1,
  },
  {
    id: 'yakuhai-haku',
    label: '白',
    han: 1,
    hanIfOpened: 1,
  },
  {
    id: 'yakuhai-hatsu',
    label: '發',
    han: 1,
    hanIfOpened: 1,
  },
  {
    id: 'double-riichi',
    label: '雙立直',
    han: 2,
    hanIfOpened: 0,
  },
  {
    id: 'chantaiyao',
    label: '全帶么九',
    han: 2,
    hanIfOpened: 1,
  },
  {
    id: 'sanshoku-doujun',
    label: '三色同順',
    han: 2,
    hanIfOpened: 1,
  },
  {
    id: 'ittsu',
    label: '一氣通貫',
    han: 2,
    hanIfOpened: 1,
  },
  {
    id: 'toitoi',
    label: '對對和',
    han: 2,
    hanIfOpened: 2,
  },
  {
    id: 'sanankou',
    label: '三暗刻',
    han: 2,
    hanIfOpened: 2,
  },
  {
    id: 'sanshku-doukou',
    label: '三色同刻',
    han: 2,
    hanIfOpened: 2,
  },
  {
    id: 'sankantsu',
    label: '三槓子',
    han: 2,
    hanIfOpened: 2,
  },
  {
    id: 'chiitoitsu',
    label: '七對子',
    han: 2,
    hanIfOpened: 0,
    overrideFu: 25,
  },
  {
    id: 'honroutou',
    label: '混老頭',
    han: 2,
    hanIfOpened: 2,
  },
  {
    id: 'shousangen',
    label: '小三元',
    han: 2,
    hanIfOpened: 2,
  },
  {
    id: 'honitsu',
    label: '混一色',
    han: 3,
    hanIfOpened: 2,
  },
  {
    id: 'junchan-taiyao',
    label: '純全帶么',
    han: 3,
    hanIfOpened: 2,
  },
  {
    id: 'ryanpeikou',
    label: '二盃口',
    han: 3,
    hanIfOpened: 0,
  },
  {
    id: 'chinitsu',
    label: '清一色',
    han: 6,
    hanIfOpened: 5,
  },
  {
    id: 'kazoe-yakuman',
    label: '累計役滿',
    han: 13,
    hanIfOpened: 13,
  },
  {
    id: 'kokushi-musou',
    label: '國士無雙',
    han: 13,
    hanIfOpened: 0,
  },
  {
    id: 'suuankou',
    label: '四暗刻',
    han: 13,
    hanIfOpened: 0,
  },
  {
    id: 'daisangen',
    label: '大三元',
    han: 13,
    hanIfOpened: 13,
  },
  {
    id: 'shousuushii',
    label: '小四喜',
    han: 13,
    hanIfOpened: 13,
  },
  {
    id: 'daisuushii',
    label: '大四喜',
    han: 13,
    hanIfOpened: 13,
  },
  {
    id: 'tsuuiisou',
    label: '字一色',
    han: 13,
    hanIfOpened: 13,
  },
  {
    id: 'chinroutou',
    label: '清老頭',
    han: 13,
    hanIfOpened: 13,
  },
  {
    id: 'ryuuiisou',
    label: '綠一色',
    han: 13,
    hanIfOpened: 13,
  },
  {
    id: 'chuuren-poutou',
    label: '九連寶燈',
    han: 13,
    hanIfOpened: 0,
  },
  {
    id: 'suukantsu',
    label: '四槓子',
    han: 13,
    hanIfOpened: 13,
  },
  {
    id: 'tenhou',
    label: '天和',
    han: 13,
    hanIfOpened: 0,
  },
  {
    id: 'chiihou',
    label: '地和',
    han: 13,
    hanIfOpened: 0,
  },
]

const YAKUS_GROUPS_BY_HAN = {
  1: YAKUS.filter(({ han, hidden }) => han === 1 && !hidden),
  2: YAKUS.filter(({ han, hidden }) => han === 2 && !hidden),
  3: YAKUS.filter(({ han, hidden }) => han === 3 && !hidden),
  6: YAKUS.filter(({ han, hidden }) => han === 6 && !hidden),
  13: YAKUS.filter(({ han, hidden }) => han === 13 && !hidden),
} as const

const MJYakuButton = ({
  yaku,
  active,
  isOpened,
  disabled,
  onClick,
}: {
  yaku: Yaku
  active: boolean
  isOpened: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      data-id={yaku.id}
      data-han={isOpened ? yaku.hanIfOpened : yaku.han}
      data-active={active ? '1' : '0'}
      disabled={disabled}
      className="text-center px-3 rounded-full border border-neutral-200 text-neutral-400 cursor-pointer hover:opacity-80 data-[han='0']:cursor-not-allowed disabled:opacity-30 disabled:hover:opacity-30 data-[active='1']:enabled:border-teal-500 data-[active='1']:enabled:text-teal-600 data-[active='1']:enabled:bg-teal-100"
      key={yaku.id}
      onClick={onClick}
    >
      {yaku.label}
    </button>
  )
}

export type MJYakuKeyboardDivProps = {
  round: number
  activePlayerIndex: PlayerIndex
  isEast: boolean
  isRon: boolean
  setting: MatchSetting
  onChange?: (result: {
    han: number
    fu: number
    yakusInText: string[]
    isYakuman: boolean
  }) => unknown
}

const MJYakuKeyboardDiv = ({
  round,
  activePlayerIndex,
  isEast,
  isRon,
  setting,
  onChange,
}: MJYakuKeyboardDivProps) => {
  const [yakuChecks, setYakuChecks] = useState<Record<string, boolean>>({})
  const [isOpened, toggleOpened] = useToggle(false)
  const [isShowYakuman, toggleShowYakuman] = useToggle(false)

  const [dora, setDora] = useState('0')
  const [redDora, setRedDora] = useState('0')
  const [innerDora, setInnerDora] = useState('0')
  const [fu, setFu] = useState('30')

  const handleClickYaku = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    const yakuId = e.currentTarget.getAttribute('data-id')
    if (!yakuId) {
      return
    }

    const yaku = YAKUS.find(({ id }) => id === yakuId)
    if (!yaku) {
      return
    }

    setYakuChecks((prev) => ({
      ...prev,
      [yakuId]: !prev[yakuId],
    }))
  }, [])

  const handleClickReset = useCallback(() => {
    setYakuChecks({})
    toggleOpened(false)
    setDora('0')
    setRedDora('0')
    setInnerDora('0')
    setFu('30')
  }, [toggleOpened])

  const result = useMemo(() => {
    let finalHan = 0
    let finalFu = parseInt(fu)
    let isFuOverrided = false
    const yakusInText: string[] = []

    const myYakuChecks = { ...yakuChecks }

    if (
      myYakuChecks['yakuhai-match-kazehai'] &&
      myYakuChecks['yakuhai-self-kazehai'] &&
      getWindByRound(round) ===
        getWindByRoundAndPlayerIndex(round, activePlayerIndex)
    ) {
      myYakuChecks['yakuhai-double-kazehai'] = true
      myYakuChecks['yakuhai-match-kazehai'] = false
      myYakuChecks['yakuhai-self-kazehai'] = false
    }

    const yakus = YAKUS.filter(({ id }) => !!myYakuChecks[id])
    for (const yaku of yakus) {
      const hanPlus = isOpened ? yaku.hanIfOpened : yaku.han
      if (hanPlus === 0) {
        continue
      }

      if (
        (isShowYakuman && hanPlus < 13) ||
        (!isShowYakuman && hanPlus >= 13)
      ) {
        continue
      }

      finalHan += hanPlus
      if (typeof yaku.overrideFu !== 'undefined') {
        finalFu = yaku.overrideFu
        isFuOverrided = true
      }

      if (yaku.id === 'yakuhai-match-kazehai') {
        yakusInText.push(getWindByRound(round))
      } else if (yaku.id === 'yakuhai-self-kazehai') {
        yakusInText.push(getWindByRoundAndPlayerIndex(round, activePlayerIndex))
      } else if (yaku.id === 'yakuhai-double-kazehai') {
        yakusInText.push(`雙${getWindByRound(round)}`)
      } else {
        yakusInText.push(yaku.label)
      }
    }

    if (dora !== '0') {
      finalHan += parseInt(dora)
      yakusInText.push(`寶牌${dora}`)
    }

    if (redDora !== '0') {
      finalHan += parseInt(redDora)
      yakusInText.push(`赤寶牌${redDora}`)
    }

    if (innerDora !== '0') {
      finalHan += parseInt(innerDora)
      yakusInText.push(`裡寶牌${innerDora}`)
    }

    return {
      yakusInText,
      han: finalHan,
      fu: finalFu,
      isFuOverrided,
      isYakuman: isShowYakuman,
    }
  }, [
    isOpened,
    round,
    activePlayerIndex,
    yakuChecks,
    dora,
    redDora,
    innerDora,
    fu,
    isShowYakuman,
  ])

  useEffect(() => {
    if (!onChange) {
      return
    }

    onChange(result)
  }, [result, onChange, isEast, isRon])

  return (
    <div>
      <div className="flex justify-between">
        <div>
          <MJUISwitch checked={isOpened} onChangeChecked={toggleOpened} />{' '}
          有副露？
        </div>
        <div className="space-x-4">
          <button
            className="text-sm text-teal-700 underline"
            onClick={toggleShowYakuman}
          >
            {isShowYakuman ? '一般役' : '役滿役'}
          </button>
          <button
            className="text-sm text-teal-700 underline"
            onClick={handleClickReset}
          >
            重置
          </button>
        </div>
      </div>

      {!isShowYakuman && (
        <div>
          <table>
            <tbody>
              <tr>
                <th className="bg-neutral-100 px-1 border-neutral-100 border-t border-b">
                  1番
                </th>
                <td
                  className="py-1 pl-2 border-neutral-100 border-t border-b"
                  colSpan={3}
                >
                  <div className="flex flex-wrap gap-1">
                    {YAKUS_GROUPS_BY_HAN[1].map((yaku) => (
                      <MJYakuButton
                        key={yaku.id}
                        yaku={yaku}
                        isOpened={isOpened}
                        active={yakuChecks[yaku.id]}
                        disabled={isOpened && yaku.hanIfOpened === 0}
                        onClick={handleClickYaku}
                      >
                        {yaku.label}
                      </MJYakuButton>
                    ))}
                  </div>
                </td>
              </tr>

              <tr>
                <th className="bg-neutral-100 px-1 border-neutral-100 border-t border-b">
                  2番
                </th>
                <td
                  className="py-1 pl-2 border-neutral-100 border-t border-b"
                  colSpan={3}
                >
                  <div className="flex flex-wrap gap-1">
                    {YAKUS_GROUPS_BY_HAN[2].map((yaku) => (
                      <MJYakuButton
                        key={yaku.id}
                        yaku={yaku}
                        isOpened={isOpened}
                        active={yakuChecks[yaku.id]}
                        disabled={isOpened && yaku.hanIfOpened === 0}
                        onClick={handleClickYaku}
                      >
                        {yaku.label}
                      </MJYakuButton>
                    ))}
                  </div>
                </td>
              </tr>

              <tr>
                <th className="bg-neutral-100 px-1 border-neutral-100 border-t border-b">
                  3番
                </th>
                <td className="py-1 pl-2 border-neutral-100 border-t border-b w-1/2">
                  <div className="flex flex-wrap gap-1">
                    {YAKUS_GROUPS_BY_HAN[3].map((yaku) => (
                      <MJYakuButton
                        key={yaku.id}
                        yaku={yaku}
                        isOpened={isOpened}
                        active={yakuChecks[yaku.id]}
                        disabled={isOpened && yaku.hanIfOpened === 0}
                        onClick={handleClickYaku}
                      >
                        {yaku.label}
                      </MJYakuButton>
                    ))}
                  </div>
                </td>
                <th className="bg-neutral-100 px-1 border-neutral-100 border-t border-b">
                  6番
                </th>
                <td className="py-1 pl-2 border-neutral-100 border-t border-b w-1/2">
                  <div className="flex flex-wrap gap-1">
                    {YAKUS_GROUPS_BY_HAN[6].map((yaku) => (
                      <MJYakuButton
                        key={yaku.id}
                        yaku={yaku}
                        isOpened={isOpened}
                        active={yakuChecks[yaku.id]}
                        disabled={isOpened && yaku.hanIfOpened === 0}
                        onClick={handleClickYaku}
                      >
                        {yaku.label}
                      </MJYakuButton>
                    ))}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <table className="w-full mt-2">
            <tbody>
              <th className="w-16 bg-neutral-200 px-1 border-neutral-100 border-t border-b">
                寶牌
              </th>
              <td className="w-auto pr-4">
                <select
                  className="w-full py-2 border border-neutral-100"
                  value={dora}
                  onChange={(e) => setDora(e.currentTarget.value)}
                >
                  <option>0</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                  <option>8</option>
                  <option>9</option>
                  <option>10</option>
                  <option>11</option>
                  <option>12</option>
                  <option>13</option>
                  <option>14</option>
                  <option>15</option>
                  <option>16</option>
                  <option>17</option>
                  <option>18</option>
                </select>
              </td>
              <th className="w-16 bg-neutral-200 px-1 border-neutral-100 border-t border-b">
                赤寶牌
              </th>
              <td className="w-auto pr-4">
                <select
                  className="w-full py-2 border border-neutral-100"
                  value={redDora}
                  onChange={(e) => setRedDora(e.currentTarget.value)}
                >
                  <option>0</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                  <option>8</option>
                  <option>9</option>
                  <option>10</option>
                  <option>11</option>
                  <option>12</option>
                  <option>13</option>
                  <option>14</option>
                  <option>15</option>
                  <option>16</option>
                  <option>17</option>
                  <option>18</option>
                </select>
              </td>
              <th className="w-16 bg-neutral-200 px-1 border-neutral-100 border-t border-b">
                裡寶牌
              </th>
              <td className="w-auto pr-4">
                <select
                  className="w-full py-2 border border-neutral-100"
                  value={innerDora}
                  onChange={(e) => setInnerDora(e.currentTarget.value)}
                >
                  <option>0</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                  <option>8</option>
                  <option>9</option>
                  <option>10</option>
                  <option>11</option>
                  <option>12</option>
                  <option>13</option>
                  <option>14</option>
                  <option>15</option>
                  <option>16</option>
                  <option>17</option>
                  <option>18</option>
                </select>
              </td>
              <th className="w-16 bg-neutral-200 px-1 border-neutral-100 border-t border-b">
                符數
              </th>
              <td className="w-auto pr-4">
                <select
                  className="w-full py-2 border border-neutral-100"
                  value={result.isFuOverrided ? result.fu : fu}
                  onChange={(e) => setFu(e.currentTarget.value)}
                  disabled={result.isFuOverrided}
                >
                  <option value="20">20符</option>
                  <option value="25">25符</option>
                  <option value="30">30符</option>
                  <option value="40">40符</option>
                  <option value="50">50符</option>
                  <option value="60">60符</option>
                  <option value="70">70符</option>
                  <option value="80">80符</option>
                  <option value="90">90符</option>
                  <option value="100">100符</option>
                  <option value="110">110符</option>
                </select>
              </td>
            </tbody>
          </table>
        </div>
      )}

      {isShowYakuman && (
        <div>
          <table>
            <tbody>
              <tr>
                <th className="bg-neutral-100 px-1 border-neutral-100 border-t border-b">
                  役滿
                </th>
                <td
                  className="py-1 pl-2 border-neutral-100 border-t border-b"
                  colSpan={3}
                >
                  <div className="flex flex-wrap gap-1">
                    {YAKUS_GROUPS_BY_HAN[13].map((yaku) => (
                      <MJYakuButton
                        key={yaku.id}
                        yaku={yaku}
                        isOpened={isOpened}
                        active={yakuChecks[yaku.id]}
                        disabled={isOpened && yaku.hanIfOpened === 0}
                        onClick={handleClickYaku}
                      >
                        {yaku.label}
                      </MJYakuButton>
                    ))}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <table className="w-full mt-2 bg-teal-100">
        <tbody>
          <th className="w-16 bg-teal-400 py-2 px-1">結算</th>
          <td className="flex flex-wrap gap-2 p-2">
            {result.yakusInText.map((text) => (
              <span key={text}>{text}</span>
            ))}
          </td>
          <td className="w-32 bg-teal-400 text-center">
            <MJHanFuTextSpan
              han={Math.min(isShowYakuman ? 13 : 12, result.han)}
              fu={result.fu}
              isManganRoundUp={setting.isManganRoundUp === '1'}
            />
            <MJHanFuTextSpan
              className="text-xs text-neutral-600"
              han={result.han}
              fu={result.fu}
              isManganRoundUp={setting.isManganRoundUp === '1'}
              raw
            />
          </td>
        </tbody>
      </table>
    </div>
  )
}

export default MJYakuKeyboardDiv
