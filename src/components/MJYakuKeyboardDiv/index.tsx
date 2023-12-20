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
import MJUISelectClicker from '../MJUI/MJUISelectClicker'
import MJUIDialogV2, { MJUIDialogV2Props } from '../MJUI/MJUIDialogV2'
import MJUIButton from '../MJUI/MJUIButton'

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
    id: 'tanyao',
    label: '斷么九',
    han: 1,
    hanIfOpened: 1,
  },
  {
    id: 'iipeikou',
    label: '一盃口',
    han: 1,
    hanIfOpened: 0,
  },
  {
    id: 'yakuhai-self-kazehai',
    label: '自風',
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
    id: 'double-riichi',
    label: '雙立直',
    han: 2,
    hanIfOpened: 0,
  },
  {
    id: 'chiitoitsu',
    label: '七對子',
    han: 2,
    hanIfOpened: 0,
    overrideFu: 25,
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
    id: 'chantaiyao',
    label: '混全帶么九',
    han: 2,
    hanIfOpened: 1,
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
    label: '純全帶么九',
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

const DORA_OPTIONS = [
  { label: '0', value: '0' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '10', value: '10' },
  { label: '11', value: '11' },
  { label: '12', value: '12' },
  { label: '13', value: '13' },
  { label: '14', value: '14' },
  { label: '15', value: '15' },
  { label: '16', value: '16' },
  { label: '17', value: '17' },
  { label: '18', value: '18' },
]

const RED_DORA_OPTIONS = [
  { label: '0', value: '0' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
]

const FU_OPTIONS = [
  { label: '20符', value: '20' },
  { label: '30符', value: '30' },
  { label: '40符', value: '40' },
  { label: '50符', value: '50' },
  { label: '60符', value: '60' },
  { label: '70符', value: '70' },
  { label: '80符', value: '80' },
  { label: '90符', value: '90' },
  { label: '100符', value: '100' },
  { label: '110符', value: '110' },
  { label: '25符', value: '25' },
]

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
      className="text-xl text-center px-3 border border-neutral-300 text-neutral-800 cursor-pointer hover:opacity-80 data-[han='0']:cursor-not-allowed disabled:opacity-20 disabled:hover:opacity-20 data-[active='1']:enabled:border-teal-800 data-[active='1']:enabled:text-white data-[active='1']:enabled:bg-teal-800"
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
  onChange?: (result: Required<MJYakuKeyboardResult>) => unknown
  value?: MJYakuKeyboardResult
}

export type MJYakuKeyboardResult = {
  han: number
  fu: number
  yakusInText: string[] | null
  isYakuman: boolean
  raw: Record<string, boolean> | null
  dora: number
  redDora: number
  innerDora: number
  isRevealed: boolean
  isRiichied: boolean
}

const MJYakuKeyboardDiv = ({
  round,
  activePlayerIndex,
  onChange,
  value,
}: MJYakuKeyboardDivProps) => {
  const [yakuChecks, setYakuChecks] = useState<
    NonNullable<MJYakuKeyboardResult['raw']>
  >({})
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
      raw: yakuChecks,
      dora: parseInt(dora),
      redDora: parseInt(redDora),
      innerDora: parseInt(innerDora),
      isRevealed: isOpened,
      isRiichied: !!yakuChecks['riichi'],
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
  }, [result, onChange])

  useEffect(() => {
    if (value) {
      setYakuChecks(value.raw ?? {})
      setDora(value.dora.toString())
      setRedDora(value.redDora.toString())
      setInnerDora('0')
      toggleOpened(value.isRevealed)
    }
  }, [toggleOpened, value])

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
          <table className="data-table">
            <tbody>
              <tr>
                <th className="bg-neutral-100 px-1 border-neutral-100 border-t border-b">
                  1番
                </th>
                <td
                  className="py-1 pl-2 border-neutral-100 border-t border-b"
                  colSpan={3}
                >
                  <div className="flex flex-wrap gap-2">
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
                  <div className="flex flex-wrap gap-2">
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
                <td className="py-1 pl-2 border-neutral-100 border-t border-b w-2/3">
                  <div className="flex flex-wrap gap-2">
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
                <td className="py-1 pl-2 border-neutral-100 border-t border-b w-1/3 ">
                  <div className="flex flex-wrap gap-2">
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
              <tr>
                <th className="w-20 bg-yellow-400 px-1 border-yellow-100 border-t border-b">
                  寶牌
                </th>
                <td
                  className="w-36 py-1 px-2 bg-yellow-200 data-[active='1']:text-red-600"
                  data-active={dora !== '0' ? '1' : '0'}
                >
                  <MJUISelectClicker
                    value={dora}
                    onChange={setDora}
                    options={DORA_OPTIONS}
                  />
                </td>
                <th className="w-20 bg-red-400 px-1 border-neutral-100 border-t border-b">
                  赤寶牌
                </th>
                <td
                  className="w-36 py-1 px-2 bg-red-200 data-[active='1']:text-red-600"
                  data-active={redDora !== '0' ? '1' : '0'}
                >
                  <MJUISelectClicker
                    value={redDora}
                    onChange={setRedDora}
                    options={RED_DORA_OPTIONS}
                  />
                </td>
                <th className="w-20 bg-blue-400 px-1 border-neutral-100 border-t border-b">
                  裡寶牌
                </th>
                <td
                  className="w-36 py-1 px-2 bg-blue-200 data-[active='1']:text-red-600"
                  data-active={innerDora !== '0' ? '1' : '0'}
                >
                  <MJUISelectClicker
                    value={innerDora}
                    onChange={setInnerDora}
                    options={DORA_OPTIONS}
                  />
                </td>
                <th className="w-20 bg-neutral-400 px-1 border-neutral-100 border-t border-b">
                  符數
                </th>
                <td
                  className="w-36 py-1 px-2 bg-neutral-200 data-[active='1']:text-red-600"
                  data-active={dora !== '0' ? '1' : '0'}
                >
                  <MJUISelectClicker
                    value={result.isFuOverrided ? result.fu.toString() : fu}
                    onChange={setFu}
                    options={FU_OPTIONS}
                    disabled={result.isFuOverrided}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {isShowYakuman && (
        <div>
          <table className="data-table">
            <tbody>
              <tr>
                <th className="bg-neutral-100 px-1 border-neutral-100 border-t border-b">
                  役滿
                </th>
                <td
                  className="py-1 pl-2 border-neutral-100 border-t border-b"
                  colSpan={3}
                >
                  <div className="flex flex-wrap gap-2">
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
    </div>
  )
}

export default MJYakuKeyboardDiv

type MJYakuKeyboardResultDivProps = {
  result: MJYakuKeyboardResult
  matchSetting: MatchSetting
}

export const MJYakuKeyboardResultDiv = ({
  result,
  matchSetting,
}: MJYakuKeyboardResultDivProps) => {
  return (
    <div>
      <table className="w-full mt-2 bg-teal-100">
        <tbody>
          <tr>
            <th className="w-16 bg-teal-400 py-2 px-1">結算</th>
            <td className="flex flex-wrap gap-2 p-2 align-middle">
              {result.yakusInText?.map((text) => (
                <span key={text}>{text}</span>
              ))}
            </td>
            <td className="w-32 bg-teal-400 text-center">
              <MJHanFuTextSpan
                han={Math.min(result.isYakuman ? 13 : 12, result.han)}
                fu={result.fu}
                isManganRoundUp={matchSetting.isManganRoundUp === '1'}
              />
              <MJHanFuTextSpan
                className="text-xs text-neutral-600"
                han={result.han}
                fu={result.fu}
                isManganRoundUp={matchSetting.isManganRoundUp === '1'}
                raw
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

type MJYakuKeyboardDialogProps = Omit<MJYakuKeyboardDivProps, 'onChange'> & {
  onSubmit: (result: Required<MJYakuKeyboardResult>) => unknown
  defaultValue?: MJYakuKeyboardResult
} & Pick<MJUIDialogV2Props, 'open' | 'onClose'>

export const MJYakuKeyboardDialog = ({
  onSubmit,
  defaultValue,
  open,
  onClose,
  ...props
}: MJYakuKeyboardDialogProps) => {
  const [value, setValue] = useState<MJYakuKeyboardResult>()

  const handleSubmit = useCallback(() => {
    if (!value) {
      return
    }

    onSubmit(value)
  }, [onSubmit, value])

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  return (
    <MJUIDialogV2 open={open} onClose={onClose}>
      <MJYakuKeyboardDiv {...props} onChange={setValue} value={defaultValue} />
      <div className="mt-4">
        <MJUIButton className="w-full" onClick={handleSubmit}>
          儲存
        </MJUIButton>
      </div>
    </MJUIDialogV2>
  )
}
