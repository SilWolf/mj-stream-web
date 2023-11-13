/* eslint-disable import/no-extraneous-dependencies */
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

  R = Math.round(R * 1.5)
  G = Math.round(G * 1.5)
  B = Math.round(B * 1.5)

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
