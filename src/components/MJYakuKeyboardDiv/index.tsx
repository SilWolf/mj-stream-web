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
import MJHanFuTextSpan from '../MJHanFuTextSpan'
import MJUISelectClicker from '../MJUI/MJUISelectClicker'
import MJUIDialogV2, { MJUIDialogV2Props } from '../MJUI/MJUIDialogV2'
import MJUIButton from '../MJUI/MJUIButton'
import {
  getIsPlayerEast,
  getIsPlayerNorth,
  getIsPlayerSouth,
  getIsPlayerWest,
  getIsRoundEast,
  getIsRoundNorth,
  getIsRoundSouth,
  getIsRoundWest,
} from '@/helpers/mahjong.helper'

type YakuFnProps = {
  round: number
  activePlayerIndex: PlayerIndex
  targetPlayerIndex: '-1' | PlayerIndex
  isRevealed: boolean
  raw: Record<string, boolean>
}

type Yaku = {
  id: string
  label: string
  han: number
  hanIfOpened: number
  yakumanCount?: number
  overrideFu?: number
  hidden?: boolean
  disableFn?: (props: YakuFnProps) => boolean
  hiddenIfDisabled?: boolean
  group: string
}

const YAKUS: Yaku[] = [
  {
    id: 'riichi',
    label: '立直',
    han: 1,
    hanIfOpened: 0,
    disableFn: ({ isRevealed, raw }) => !!isRevealed || raw['double-riichi'],
    group: 'riichi',
  },
  {
    id: 'double-riichi',
    label: '雙立直',
    han: 2,
    hanIfOpened: 0,
    disableFn: ({ isRevealed, raw }) => !!isRevealed || raw['riichi'],
    group: 'riichi',
  },
  {
    id: 'ippatsu',
    label: '一發',
    han: 1,
    hanIfOpened: 0,
    disableFn: ({ raw }) =>
      !(raw['riichi'] || raw['double-riichi']) || !!raw['chankan'],
    group: 'riichi',
  },
  {
    id: 'menzenchin-tsumohou',
    label: '門前清自摸和',
    han: 1,
    hanIfOpened: 0,
    hidden: true,
    group: 'menzenchin-tsumohou',
  },
  {
    id: 'tanyao',
    label: '斷么九',
    han: 1,
    hanIfOpened: 1,
    disableFn: ({ raw }) =>
      !!raw['chantaiyao'] ||
      !!raw['junchan-taiyao'] ||
      !!raw['yakuhai-east'] ||
      !!raw['yakuhai-south'] ||
      !!raw['yakuhai-west'] ||
      !!raw['yakuhai-north'] ||
      !!raw['yakuhai-haku'] ||
      !!raw['yakuhai-hatsu'] ||
      !!raw['yakuhai-chun'] ||
      !!raw['honroutou'] ||
      !!raw['honitsu'] ||
      !!raw['ittsu'],
    group: 'common',
  },
  {
    id: 'pinfu',
    label: '平和',
    han: 1,
    hanIfOpened: 0,
    disableFn: ({ isRevealed, raw }) =>
      !!isRevealed ||
      !!raw['chiitoitsu'] ||
      !!raw['yakuhai-east'] ||
      !!raw['yakuhai-south'] ||
      !!raw['yakuhai-west'] ||
      !!raw['yakuhai-north'] ||
      !!raw['yakuhai-haku'] ||
      !!raw['yakuhai-hatsu'] ||
      !!raw['yakuhai-chun'] ||
      !!raw['toitoi'],
    group: 'common',
  },
  {
    id: 'yakuhai-east',
    label: '東',
    han: 1,
    hanIfOpened: 1,
    disableFn: ({ round, activePlayerIndex, raw }) =>
      (!getIsPlayerEast(activePlayerIndex, round) && !getIsRoundEast(round)) ||
      !!raw['tanyao'] ||
      !!raw['pinfu'] ||
      !!raw['chiitoitsu'] ||
      !!raw['chinitsu'] ||
      !!raw['junchan-taiyao'] ||
      !!raw['ryanpeikou'],
    group: 'yakuhai',
  },

  {
    id: 'yakuhai-double-east',
    label: '雙東',
    han: 2,
    hanIfOpened: 2,
    hidden: true,
    group: 'yakuhai-special',
  },

  {
    id: 'yakuhai-south',
    label: '南',
    han: 1,
    hanIfOpened: 1,
    disableFn: ({ round, activePlayerIndex, raw }) =>
      (!getIsPlayerSouth(activePlayerIndex, round) &&
        !getIsRoundSouth(round)) ||
      !!raw['tanyao'] ||
      !!raw['pinfu'] ||
      !!raw['chiitoitsu'] ||
      !!raw['chinitsu'] ||
      !!raw['junchan-taiyao'] ||
      !!raw['ryanpeikou'],
    group: 'yakuhai',
  },
  {
    id: 'yakuhai-double-south',
    label: '雙南',
    han: 2,
    hanIfOpened: 2,
    hidden: true,
    group: 'yakuhai-special',
  },
  {
    id: 'yakuhai-west',
    label: '西',
    han: 1,
    hanIfOpened: 1,
    disableFn: ({ round, activePlayerIndex, raw }) =>
      (!getIsPlayerWest(activePlayerIndex, round) && !getIsRoundWest(round)) ||
      !!raw['tanyao'] ||
      !!raw['pinfu'] ||
      !!raw['chiitoitsu'] ||
      !!raw['chinitsu'] ||
      !!raw['junchan-taiyao'] ||
      !!raw['ryanpeikou'],
    group: 'yakuhai',
  },
  {
    id: 'yakuhai-double-west',
    label: '雙西',
    han: 2,
    hanIfOpened: 2,
    hidden: true,
    group: 'yakuhai-special',
  },
  {
    id: 'yakuhai-north',
    label: '北',
    han: 1,
    hanIfOpened: 1,
    disableFn: ({ round, activePlayerIndex, raw }) =>
      (!getIsPlayerNorth(activePlayerIndex, round) &&
        !getIsRoundNorth(round)) ||
      !!raw['tanyao'] ||
      !!raw['pinfu'] ||
      !!raw['chiitoitsu'] ||
      !!raw['chinitsu'] ||
      !!raw['junchan-taiyao'] ||
      !!raw['ryanpeikou'],
    group: 'yakuhai',
  },
  {
    id: 'yakuhai-double-north',
    label: '雙北',
    han: 2,
    hanIfOpened: 2,
    hidden: true,
    group: 'yakuhai-special',
  },
  {
    id: 'yakuhai-haku',
    label: '白',
    han: 1,
    hanIfOpened: 1,
    group: 'yakuhai',
    disableFn: ({ raw }) =>
      !!raw['tanyao'] ||
      !!raw['pinfu'] ||
      !!raw['chiitoitsu'] ||
      !!raw['chinitsu'] ||
      !!raw['junchan-taiyao'] ||
      !!raw['ryanpeikou'],
  },
  {
    id: 'yakuhai-hatsu',
    label: '發',
    han: 1,
    hanIfOpened: 1,
    group: 'yakuhai',
    disableFn: ({ raw }) =>
      !!raw['tanyao'] ||
      !!raw['pinfu'] ||
      !!raw['chiitoitsu'] ||
      !!raw['chinitsu'] ||
      !!raw['junchan-taiyao'] ||
      !!raw['ryanpeikou'],
  },
  {
    id: 'yakuhai-chun',
    label: '中',
    han: 1,
    hanIfOpened: 1,
    group: 'yakuhai',
    disableFn: ({ raw }) =>
      !!raw['tanyao'] ||
      !!raw['pinfu'] ||
      !!raw['chiitoitsu'] ||
      !!raw['chinitsu'] ||
      !!raw['junchan-taiyao'] ||
      !!raw['ryanpeikou'],
  },
  {
    id: 'shousangen',
    label: '小三元',
    han: 2,
    hanIfOpened: 2,
    disableFn: ({ raw }) =>
      [raw['yakuhai-haku'], raw['yakuhai-hatsu'], raw['yakuhai-chun']].filter(
        (value) => !!value
      ).length !== 2,
    group: 'yakuhai',
  },
  {
    id: 'haitei-raoyue',
    label: '海底撈月',
    han: 1,
    hanIfOpened: 1,
    disableFn: ({ targetPlayerIndex, raw }) =>
      targetPlayerIndex !== '-1' || !!raw['rinshan-kaihou'],
    hiddenIfDisabled: true,
    group: 'luck',
  },
  {
    id: 'houtei-raoyui',
    label: '河底撈魚',
    han: 1,
    hanIfOpened: 1,
    disableFn: ({ targetPlayerIndex }) => targetPlayerIndex === '-1',
    hiddenIfDisabled: true,
    group: 'luck',
  },
  {
    id: 'rinshan-kaihou',
    label: '嶺上開花',
    han: 1,
    hanIfOpened: 1,
    disableFn: ({ targetPlayerIndex, raw }) =>
      targetPlayerIndex !== '-1' ||
      !!raw['pinfu'] ||
      !!raw['chiitoitsu'] ||
      !!raw['ryanpeikou'] ||
      !!raw['haitei-raoyue'],
    hiddenIfDisabled: true,
    group: 'luck',
  },
  {
    id: 'chankan',
    label: '搶槓',
    han: 1,
    hanIfOpened: 1,
    disableFn: ({ targetPlayerIndex }) => targetPlayerIndex === '-1',
    hiddenIfDisabled: true,
    group: 'luck',
  },
  {
    id: 'chiitoitsu',
    label: '七對子',
    han: 2,
    hanIfOpened: 0,
    overrideFu: 25,
    disableFn: ({ isRevealed, raw }) =>
      !!isRevealed ||
      !!raw['iipeikou'] ||
      !!raw['ryanpeikou'] ||
      !!raw['pinfu'] ||
      !!raw['sanshku-doujun'] ||
      !!raw['ittsu'] ||
      !!raw['chantaiyao'] ||
      !!raw['junchan-taiyao'] ||
      !!raw['toitoi'] ||
      !!raw['sanshku-doukou'] ||
      !!raw['sanankou'] ||
      !!raw['sankantsu'] ||
      !!raw['rinshan-kaihou'],
    group: 'peikou',
  },
  {
    id: 'iipeikou',
    label: '一盃口',
    han: 1,
    hanIfOpened: 0,
    disableFn: ({ isRevealed, raw }) =>
      !!isRevealed ||
      !!raw['ryanpeikou'] ||
      !!raw['chiitoitsu'] ||
      !!raw['honroutou'] ||
      !!raw['toitoi'] ||
      !!raw['sanshku-doukou'] ||
      !!raw['sanankou'] ||
      !!raw['sankantsu'],
    group: 'peikou',
  },
  {
    id: 'ryanpeikou',
    label: '二盃口',
    han: 3,
    hanIfOpened: 0,
    disableFn: ({ isRevealed, raw }) =>
      !!isRevealed ||
      !!raw['iipeikou'] ||
      !!raw['chiitoitsu'] ||
      !!raw['rinshan-kaihou'] ||
      !!raw['sanshku-doujun'] ||
      !!raw['ittsu'] ||
      !!raw['honroutou'] ||
      !!raw['toitoi'] ||
      !!raw['sanshku-doukou'] ||
      !!raw['sanankou'] ||
      !!raw['sankantsu'] ||
      !!raw['yakuhai-east'] ||
      !!raw['yakuhai-south'] ||
      !!raw['yakuhai-west'] ||
      !!raw['yakuhai-north'] ||
      !!raw['yakuhai-haku'] ||
      !!raw['yakuhai-hatsu'] ||
      !!raw['yakuhai-chun'],
    group: 'peikou',
  },
  {
    id: 'sanshku-doujun',
    label: '三色同順',
    han: 2,
    hanIfOpened: 1,
    disableFn: ({ raw }) =>
      !!raw['sanshku-doukou'] ||
      !!raw['sanankou'] ||
      !!raw['chiitoitsu'] ||
      !!raw['ittsu'] ||
      !!raw['sankantsu'] ||
      !!raw['ryanpeikou'] ||
      !!raw['honroutou'] ||
      !!raw['chinitsu'] ||
      !!raw['honitsu'] ||
      !!raw['toitoi'],
    group: 'row',
  },
  {
    id: 'ittsu',
    label: '一氣通貫',
    han: 2,
    hanIfOpened: 1,
    disableFn: ({ raw }) =>
      !!raw['sanshku-doukou'] ||
      !!raw['sanankou'] ||
      !!raw['chiitoitsu'] ||
      !!raw['tanyao'] ||
      !!raw['sanshku-doujun'] ||
      !!raw['sankantsu'] ||
      !!raw['ryanpeikou'] ||
      !!raw['honroutou'] ||
      !!raw['chantaiyao'] ||
      !!raw['junchan-taiyao'] ||
      !!raw['toitoi'],
    group: 'row',
  },
  {
    id: 'honitsu',
    label: '混一色',
    han: 3,
    hanIfOpened: 2,
    disableFn: ({ raw }) =>
      !!raw['chinitsu'] ||
      !!raw['tanyao'] ||
      !!raw['junchan-taiyao'] ||
      !!raw['sanshku-doujun'] ||
      !!raw['sanshku-doukou'],
    group: 'itsu',
  },
  {
    id: 'chinitsu',
    label: '清一色',
    han: 6,
    hanIfOpened: 5,
    disableFn: ({ raw }) =>
      !!raw['honitsu'] ||
      !!raw['honroutou'] ||
      !!raw['chantaiyao'] ||
      !!raw['sanshku-doukou'],
    group: 'itsu',
  },
  {
    id: 'chantaiyao',
    label: '混全帶么九',
    han: 2,
    hanIfOpened: 1,
    disableFn: ({ raw }) =>
      !!raw['tanyao'] ||
      !!raw['junchan-taiyao'] ||
      !!raw['honroutou'] ||
      !!raw['chiitoitsu'] ||
      !!raw['chinitsu'] ||
      !!raw['ittsu'] ||
      !!raw['toitoi'],
    group: 'taiyao',
  },
  {
    id: 'junchan-taiyao',
    label: '純全帶么九',
    han: 3,
    hanIfOpened: 2,
    disableFn: ({ raw }) =>
      !!raw['tanyao'] ||
      !!raw['chantaiyao'] ||
      !!raw['honroutou'] ||
      !!raw['chiitoitsu'] ||
      !!raw['ittsu'] ||
      !!raw['honitsu'] ||
      !!raw['toitoi'],
    group: 'taiyao',
  },
  {
    id: 'honroutou',
    label: '混老頭',
    han: 2,
    hanIfOpened: 2,
    disableFn: ({ raw }) =>
      !!raw['tanyao'] ||
      !!raw['chantaiyao'] ||
      !!raw['junchan-taiyao'] ||
      !!raw['chinitsu'] ||
      !!raw['iipeikou'] ||
      !!raw['ryanpeikou'],
    group: 'taiyao',
  },
  {
    id: 'toitoi',
    label: '對對和',
    han: 2,
    hanIfOpened: 2,
    disableFn: ({ raw }) =>
      !!raw['sanshku-doujun'] ||
      !!raw['chiitoitsu'] ||
      !!raw['chantaiyao'] ||
      !!raw['junchan-taiyao'] ||
      !!raw['ittsu'] ||
      !!raw['iipeikou'] ||
      !!raw['ryanpeikou'],
    group: 'column',
  },
  {
    id: 'sanshku-doukou',
    label: '三色同刻',
    han: 2,
    hanIfOpened: 2,
    disableFn: ({ raw }) =>
      !!raw['sanshku-doujun'] ||
      !!raw['chiitoitsu'] ||
      !!raw['ittsu'] ||
      !!raw['chinitsu'] ||
      !!raw['iipeikou'] ||
      !!raw['ryanpeikou'] ||
      !!raw['honitsu'],
    group: 'column',
  },
  {
    id: 'sanankou',
    label: '三暗刻',
    han: 2,
    hanIfOpened: 2,
    disableFn: ({ raw }) =>
      !!raw['sanshku-doujun'] ||
      !!raw['chiitoitsu'] ||
      !!raw['ittsu'] ||
      !!raw['iipeikou'] ||
      !!raw['ryanpeikou'],
    group: 'column',
  },
  {
    id: 'sankantsu',
    label: '三槓子',
    han: 2,
    hanIfOpened: 2,
    disableFn: ({ raw }) =>
      !!raw['sanshku-doujun'] ||
      !!raw['chiitoitsu'] ||
      !!raw['ittsu'] ||
      !!raw['iipeikou'] ||
      !!raw['ryanpeikou'],
    group: 'column',
  },
  {
    id: 'kokushi-musou',
    label: '國士無雙',
    han: 13,
    hanIfOpened: 0,
    yakumanCount: 1,
    disableFn: ({ raw, isRevealed }) =>
      !!isRevealed ||
      !!raw['suuankou'] ||
      !!raw['suuankou-dannki'] ||
      !!raw['daisangen'] ||
      !!raw['shousuushii'] ||
      !!raw['daisuushii'] ||
      !!raw['tsuuiisou'] ||
      !!raw['chinroutou'] ||
      !!raw['suukantsu'] ||
      !!raw['ryuuiisou'] ||
      !!raw['chuuren-poutou'] ||
      !!raw['pure-chuuren-poutou'] ||
      !!raw['kokushi-musou-jsuan-men'],
    group: 'kokushi-musou',
  },
  {
    id: 'kokushi-musou-jsuan-men',
    label: '國士無雙十三面',
    han: 13,
    hanIfOpened: 0,
    yakumanCount: 1,
    disableFn: ({ raw, isRevealed }) =>
      !!isRevealed ||
      !!raw['suuankou'] ||
      !!raw['suuankou-dannki'] ||
      !!raw['daisangen'] ||
      !!raw['shousuushii'] ||
      !!raw['daisuushii'] ||
      !!raw['tsuuiisou'] ||
      !!raw['chinroutou'] ||
      !!raw['suukantsu'] ||
      !!raw['ryuuiisou'] ||
      !!raw['chuuren-poutou'] ||
      !!raw['pure-chuuren-poutou'] ||
      !!raw['kokushi-musou'],
    group: 'kokushi-musou',
  },
  {
    id: 'daisangen',
    label: '大三元',
    han: 13,
    hanIfOpened: 13,
    yakumanCount: 1,
    disableFn: ({ raw }) =>
      !!raw['kokushi-musou'] ||
      !!raw['shousuushii'] ||
      !!raw['daisuushii'] ||
      !!raw['chinroutou'] ||
      !!raw['ryuuiisou'] ||
      !!raw['chuuren-poutou'] ||
      !!raw['pure-chuuren-poutou'],
    group: 'kan',
  },
  {
    id: 'shousuushii',
    label: '小四喜',
    han: 13,
    hanIfOpened: 13,
    yakumanCount: 1,
    disableFn: ({ raw }) =>
      !!raw['kokushi-musou'] ||
      !!raw['daisangen'] ||
      !!raw['daisuushii'] ||
      !!raw['chinroutou'] ||
      !!raw['ryuuiisou'] ||
      !!raw['chuuren-poutou'] ||
      !!raw['pure-chuuren-poutou'],
    group: 'kan',
  },
  {
    id: 'daisuushii',
    label: '大四喜',
    han: 26,
    hanIfOpened: 26,
    yakumanCount: 1,
    disableFn: ({ raw }) =>
      !!raw['kokushi-musou'] ||
      !!raw['daisangen'] ||
      !!raw['shousuushii'] ||
      !!raw['chinroutou'] ||
      !!raw['ryuuiisou'] ||
      !!raw['chuuren-poutou'] ||
      !!raw['pure-chuuren-poutou'],
    group: 'kan',
  },
  {
    id: 'chinroutou',
    label: '清老頭',
    han: 13,
    hanIfOpened: 13,
    yakumanCount: 1,
    disableFn: ({ raw }) =>
      !!raw['kokushi-musou'] ||
      !!raw['shousuushii'] ||
      !!raw['daisangen'] ||
      !!raw['daisuushii'] ||
      !!raw['ryuuiisou'] ||
      !!raw['chuuren-poutou'] ||
      !!raw['pure-chuuren-poutou'],
    group: 'kan',
  },
  {
    id: 'ryuuiisou',
    label: '綠一色',
    han: 13,
    hanIfOpened: 13,
    yakumanCount: 1,
    disableFn: ({ raw }) =>
      !!raw['kokushi-musou'] ||
      !!raw['shousuushii'] ||
      !!raw['daisangen'] ||
      !!raw['daisuushii'] ||
      !!raw['chinroutou'] ||
      !!raw['chuuren-poutou'] ||
      !!raw['pure-chuuren-poutou'] ||
      !!raw['tsuuiisou'],
    group: 'ryuuiisou',
  },
  {
    id: 'tsuuiisou',
    label: '字一色',
    han: 13,
    hanIfOpened: 13,
    yakumanCount: 1,
    disableFn: ({ raw }) =>
      !!raw['kokushi-musou'] ||
      !!raw['chinroutou'] ||
      !!raw['ryuuiisou'] ||
      !!raw['chuuren-poutou'] ||
      !!raw['pure-chuuren-poutou'],
    group: 'combo',
  },
  {
    id: 'suuankou',
    label: '四暗刻',
    han: 13,
    hanIfOpened: 0,
    yakumanCount: 1,
    disableFn: ({ isRevealed, raw }) =>
      !!isRevealed ||
      !!raw['kokushi-musou'] ||
      !!raw['chuuren-poutou'] ||
      !!raw['pure-chuuren-poutou'] ||
      !!raw['suuankou-dannki'],
    group: 'combo',
  },
  {
    id: 'suuankou-dannki',
    label: '四暗刻單騎',
    han: 13,
    hanIfOpened: 0,
    yakumanCount: 1,
    disableFn: ({ isRevealed, raw }) =>
      !!isRevealed ||
      !!raw['kokushi-musou'] ||
      !!raw['chuuren-poutou'] ||
      !!raw['pure-chuuren-poutou'] ||
      !!raw['suuankou'],
    group: 'combo',
  },
  {
    id: 'suukantsu',
    label: '四槓子',
    han: 13,
    hanIfOpened: 13,
    yakumanCount: 1,
    disableFn: ({ raw }) =>
      !!raw['kokushi-musou'] ||
      !!raw['chuuren-poutou'] ||
      !!raw['pure-chuuren-poutou'] ||
      !!raw['tenhou'] ||
      !!raw['chiihou'] ||
      !!raw['ronhou'],
    group: 'combo',
  },
  {
    id: 'chuuren-poutou',
    label: '九連寶燈',
    han: 13,
    hanIfOpened: 0,
    yakumanCount: 1,
    disableFn: ({ isRevealed, raw }) =>
      !!isRevealed ||
      !!raw['kokushi-musou'] ||
      !!raw['daisangen'] ||
      !!raw['shousuushii'] ||
      !!raw['daisuushii'] ||
      !!raw['chinroutou'] ||
      !!raw['ryuuiisou'] ||
      !!raw['tsuuiisou'] ||
      !!raw['suuankou'] ||
      !!raw['suuankou-dannki'] ||
      !!raw['suukantsu'] ||
      !!raw['pure-chuuren-poutou'],
    group: 'chuuren-poutou',
  },
  {
    id: 'pure-chuuren-poutou',
    label: '純正九連寶燈',
    han: 13,
    hanIfOpened: 0,
    yakumanCount: 1,
    disableFn: ({ isRevealed, raw }) =>
      !!isRevealed ||
      !!raw['kokushi-musou'] ||
      !!raw['daisangen'] ||
      !!raw['shousuushii'] ||
      !!raw['daisuushii'] ||
      !!raw['chinroutou'] ||
      !!raw['ryuuiisou'] ||
      !!raw['tsuuiisou'] ||
      !!raw['suuankou'] ||
      !!raw['suuankou-dannki'] ||
      !!raw['suukantsu'] ||
      !!raw['chuuren-poutou'],
    group: 'chuuren-poutou',
  },
  {
    id: 'tenhou',
    label: '天和',
    han: 13,
    hanIfOpened: 0,
    yakumanCount: 1,
    disableFn: ({
      isRevealed,
      round,
      activePlayerIndex,
      targetPlayerIndex,
      raw,
    }) =>
      !!isRevealed ||
      !getIsPlayerEast(activePlayerIndex, round) ||
      targetPlayerIndex !== '-1' ||
      !!raw['suukantsu'],
    hiddenIfDisabled: true,
    group: 'hou',
  },
  {
    id: 'chiihou',
    label: '地和',
    han: 13,
    hanIfOpened: 0,
    yakumanCount: 1,
    disableFn: ({
      isRevealed,
      round,
      activePlayerIndex,
      targetPlayerIndex,
      raw,
    }) =>
      !!isRevealed ||
      !!getIsPlayerEast(activePlayerIndex, round) ||
      targetPlayerIndex !== '-1' ||
      !!raw['suukantsu'],
    hiddenIfDisabled: true,
    group: 'hou',
  },
  {
    id: 'ronhou',
    label: '人和',
    han: 13,
    hanIfOpened: 0,
    yakumanCount: 1,
    disableFn: ({
      isRevealed,
      round,
      activePlayerIndex,
      targetPlayerIndex,
      raw,
    }) =>
      !!isRevealed ||
      !!getIsPlayerEast(activePlayerIndex, round) ||
      targetPlayerIndex === '-1' ||
      !!raw['suukantsu'],
    hiddenIfDisabled: true,
    group: 'hou',
  },
]

const NORMAL_YAKUS = YAKUS.filter(
  ({ yakumanCount, hidden }) => !yakumanCount && !hidden
)
const YAKUS_GROUP_KEYS = NORMAL_YAKUS.map((yaku) => yaku.group).filter(
  (item, index) =>
    NORMAL_YAKUS.findIndex(({ group }) => item === group) === index
)

const YAKUMANS = YAKUS.filter(
  ({ yakumanCount, hidden }) =>
    typeof yakumanCount !== 'undefined' && yakumanCount > 0 && !hidden
)
const YAKUMANS_GROUP_KEYS = YAKUMANS.map((yaku) => yaku.group).filter(
  (item, index) => YAKUMANS.findIndex(({ group }) => item === group) === index
)

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
  { label: '30符', value: '30' },
  { label: '40符', value: '40' },
  { label: '50符', value: '50' },
  { label: '60符', value: '60' },
  { label: '70符', value: '70' },
  { label: '80符', value: '80' },
  { label: '90符', value: '90' },
  { label: '100符', value: '100' },
  { label: '110符', value: '110' },
  { label: '20符', value: '20' },
  { label: '25符', value: '25' },
]

const MJYakuButton = ({
  yaku,
  active,
  isRevealed,
  disabled,
  onClick,
  hiddenIfDisabled,
}: {
  yaku: Yaku
  active: boolean
  isRevealed: boolean
  hiddenIfDisabled?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>) => {
  if (disabled && hiddenIfDisabled) {
    return <></>
  }

  return (
    <button
      data-id={yaku.id}
      data-han={isRevealed ? yaku.hanIfOpened : yaku.han}
      data-active={active ? '1' : '0'}
      disabled={disabled}
      className="text-xl text-center px-3 border border-neutral-300 text-neutral-800 cursor-pointer hover:opacity-80 data-[han='0']:cursor-not-allowed disabled:opacity-20 disabled:hover:opacity-20 data-[active='1']:enabled:border-teal-800 data-[active='1']:enabled:text-white data-[active='1']:enabled:bg-teal-800 disabled:cursor-not-allowed"
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
  targetPlayerIndex: PlayerIndex | '-1'
  onChange?: (result: Required<MJYakuKeyboardResult>) => unknown
  value?: MJYakuKeyboardResult
}

export type MJYakuKeyboardResult = {
  han: number
  fu: number
  yakumanCount: number
  yakus:
    | { id: string; label: string; han: number; yakumanCount: number }[]
    | null
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
  targetPlayerIndex,
  onChange,
  value,
}: MJYakuKeyboardDivProps) => {
  const [yakuChecks, setYakuChecks] = useState<
    NonNullable<MJYakuKeyboardResult['raw']>
  >({})
  const [isRevealed, toggleOpened] = useToggle(false)
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

  const yakuFnProps = useMemo<YakuFnProps>(
    () => ({
      activePlayerIndex,
      targetPlayerIndex,
      round,
      isRevealed: isRevealed,
      raw: yakuChecks,
    }),
    [activePlayerIndex, isRevealed, round, targetPlayerIndex, yakuChecks]
  )

  const result = useMemo(() => {
    let finalFu = parseInt(fu)
    let isFuOverrided = false
    const finalYakus: {
      id: string
      label: string
      han: number
      yakumanCount: number
    }[] = []

    const myYakuChecks = { ...yakuChecks }

    if (targetPlayerIndex === '-1' && !isRevealed) {
      myYakuChecks['menzenchin-tsumohou'] = true
    }

    if (myYakuChecks['yakuhai-east'] && getIsRoundEast(round)) {
      myYakuChecks['yakuhai-east'] = false
      myYakuChecks['yakuhai-double-east'] = true
    } else if (myYakuChecks['yakuhai-south'] && getIsRoundSouth(round)) {
      myYakuChecks['yakuhai-south'] = false
      myYakuChecks['yakuhai-double-south'] = true
    } else if (myYakuChecks['yakuhai-west'] && getIsRoundWest(round)) {
      myYakuChecks['yakuhai-west'] = false
      myYakuChecks['yakuhai-double-west'] = true
    } else if (myYakuChecks['yakuhai-north'] && getIsRoundNorth(round)) {
      myYakuChecks['yakuhai-north'] = false
      myYakuChecks['yakuhai-double-north'] = true
    }

    if (
      myYakuChecks['yakuhai-haku'] &&
      myYakuChecks['yakuhai-hatsu'] &&
      myYakuChecks['yakuhai-chun']
    ) {
      myYakuChecks['daisangen'] = true
    }

    const yakus = YAKUS.filter(
      ({ id, disableFn }) => !!myYakuChecks[id] && !disableFn?.(yakuFnProps)
    )
    const yakumans = yakus.filter(
      ({ yakumanCount }) =>
        typeof yakumanCount !== 'undefined' && yakumanCount > 0
    )

    if (yakumans.length > 0) {
      for (const yakuman of yakumans) {
        if (yakuman.yakumanCount && yakuman.yakumanCount > 0) {
          finalYakus.push({
            id: yakuman.id,
            label: yakuman.label,
            han: 0,
            yakumanCount: yakuman.yakumanCount,
          })
        }
      }
    } else if (yakus.length > 0) {
      for (const yaku of yakus) {
        const hanPlus = isRevealed ? yaku.hanIfOpened : yaku.han
        if (hanPlus === 0) {
          continue
        }

        finalYakus.push({
          id: yaku.id,
          label: yaku.label,
          han: hanPlus,
          yakumanCount: 0,
        })
      }

      if (finalYakus.findIndex(({ id }) => id === 'chiitoitsu') !== -1) {
        isFuOverrided = true
        finalFu = 25
      } else if (finalYakus.findIndex(({ id }) => id === 'pinfu') !== -1) {
        isFuOverrided = true
        finalFu = targetPlayerIndex === '-1' ? 20 : 30
      }

      if (dora !== '0') {
        finalYakus.push({
          id: `dora-${dora}`,
          label: `寶牌${dora}`,
          han: parseInt(dora),
          yakumanCount: 0,
        })
      }

      if (redDora !== '0') {
        finalYakus.push({
          id: `dora-${redDora}`,
          label: `赤寶牌${redDora}`,
          han: parseInt(redDora),
          yakumanCount: 0,
        })
      }

      if (innerDora !== '0') {
        finalYakus.push({
          id: `dora-${innerDora}`,
          label: `裡寶牌${innerDora}`,
          han: parseInt(innerDora),
          yakumanCount: 0,
        })
      }
    }

    return {
      han: finalYakus.reduce((prev, { han }) => prev + han, 0),
      fu: finalFu,
      yakumanCount: finalYakus.reduce(
        (prev, { yakumanCount }) => prev + yakumanCount,
        0
      ),
      yakus: finalYakus,
      isFuOverrided,
      raw: yakuChecks,
      dora: parseInt(dora),
      redDora: parseInt(redDora),
      innerDora: parseInt(innerDora),
      isRevealed,
      isRiichied: !!yakuChecks['riichi'],
    }
  }, [
    fu,
    yakuChecks,
    targetPlayerIndex,
    isRevealed,
    round,
    dora,
    redDora,
    innerDora,
    yakuFnProps,
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
      <div className="flex justify-between mb-2">
        <div>
          <MJUISwitch checked={isRevealed} onChangeChecked={toggleOpened} />{' '}
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
          <div className="flex flex-wrap gap-y-4 gap-x-8">
            {YAKUS_GROUP_KEYS.map((groupKey) => (
              <div className="flex flex-wrap gap-2" key={groupKey}>
                {YAKUS.filter(({ group }) => group === groupKey).map((yaku) => (
                  <MJYakuButton
                    key={yaku.id}
                    yaku={yaku}
                    isRevealed={isRevealed}
                    active={yakuChecks[yaku.id]}
                    disabled={yaku.disableFn?.(yakuFnProps)}
                    hiddenIfDisabled={yaku.hiddenIfDisabled}
                    onClick={handleClickYaku}
                  >
                    {yaku.label}
                  </MJYakuButton>
                ))}
              </div>
            ))}
          </div>

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
                <td className="w-2"></td>
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
                <td className="w-2"></td>
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
                <td className="w-2"></td>
                <th className="w-20 bg-neutral-400 px-1 border-neutral-100 border-t border-b">
                  符數
                </th>
                <td className="w-36 py-1 px-2 bg-neutral-200">
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
        <div className="flex flex-wrap gap-y-4 gap-x-8">
          {YAKUMANS_GROUP_KEYS.map((groupKey) => (
            <div className="flex flex-wrap gap-2" key={groupKey}>
              {YAKUS.filter(({ group }) => group === groupKey).map((yaku) => (
                <MJYakuButton
                  key={yaku.id}
                  yaku={yaku}
                  isRevealed={isRevealed}
                  active={yakuChecks[yaku.id]}
                  disabled={yaku.disableFn?.(yakuFnProps)}
                  hiddenIfDisabled={yaku.hiddenIfDisabled}
                  onClick={handleClickYaku}
                >
                  {yaku.label}
                </MJYakuButton>
              ))}
            </div>
          ))}
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
              {result.yakus?.map(({ label }) => (
                <span key={label}>{label}</span>
              ))}
            </td>
            <td className="w-32 bg-teal-400 text-center">
              <MJHanFuTextSpan
                han={result.han}
                fu={result.fu}
                yakumanCount={result.yakumanCount}
                isManganRoundUp={matchSetting.isManganRoundUp === '1'}
              />
              <MJHanFuTextSpan
                className="text-xs text-neutral-600"
                han={result.han}
                fu={result.fu}
                yakumanCount={result.yakumanCount}
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
