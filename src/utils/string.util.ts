import { PlayerIndex } from '@/models'
import { nanoid } from 'nanoid'

export const getRandomId = (length = 12) => nanoid(length)

export const getYearString = () => {
  const date = new Date()
  return `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`
}

export const getQrCodeImgSrc = (value: string) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${value}`

export const getLightColorOfColor = (color: string) => {
  let R = parseInt(color.substring(1, 3), 16)
  let G = parseInt(color.substring(3, 5), 16)
  let B = parseInt(color.substring(5, 7), 16)

  R = Math.round(R * 1.25)
  G = Math.round(G * 1.25)
  B = Math.round(B * 1.25)

  R = R < 255 ? R : 255
  G = G < 255 ? G : 255
  B = B < 255 ? B : 255

  R = Math.round(R)
  G = Math.round(G)
  B = Math.round(B)

  const RR = R.toString(16).length === 1 ? `0${R.toString(16)}` : R.toString(16)
  const GG = G.toString(16).length === 1 ? `0${G.toString(16)}` : G.toString(16)
  const BB = B.toString(16).length === 1 ? `0${B.toString(16)}` : B.toString(16)

  return `#${RR}${GG}${BB}`
}

export const getWindByRoundWithOffset = (round: number, offset: number) => {
  switch ((round + offset - 1) % 4) {
    case 0:
      return '東'
    case 1:
      return '南'
    case 2:
      return '西'
    case 3:
      return '北'
  }

  return '東'
}

export const getWindByRound = (round: number) => {
  switch (Math.floor((round - 1) / 4)) {
    case 0:
      return '東'
    case 1:
      return '南'
    case 2:
      return '西'
    case 3:
      return '北'
  }

  return '東'
}

export const getWindByRoundAndPlayerIndex = (
  round: number,
  playerIndex: PlayerIndex
) => {
  switch ((parseInt(playerIndex) - ((round - 1) % 4) + 4) % 4) {
    case 0:
      return '東'
    case 1:
      return '南'
    case 2:
      return '西'
    case 3:
      return '北'
  }

  return '東'
}

export const getYakuMaxLabel = (value: '12' | '13') => {
  switch (value) {
    case '12':
      return '三倍滿 (12翻)'
    case '13':
      return '累計役滿 (13翻)'
  }

  return '(未知)'
}

export const getYakumanMaxLabel = (value: '13' | '26' | '39' | '130') => {
  switch (value) {
    case '13':
      return '單倍役滿'
    case '26':
      return '雙倍役滿'
    case '39':
      return '三倍役滿'
    case '130':
      return '無上限'
  }

  return '(未知)'
}

export const renderPoint = (value: number | undefined | null) => {
  if (typeof value === 'undefined' || value === null) {
    return '-'
  }

  if (value >= 0) {
    return `+${value.toFixed(1)}`
  }

  return `▲${Math.abs(value).toFixed(1)}`
}

export const renderRanking = (i: number | undefined) => {
  if (i === 1) {
    return '1st'
  } else if (i === 2) {
    return '2nd'
  } else if (i === 3) {
    return '3rd'
  }

  return `${i}th`
}
