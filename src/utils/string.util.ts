/* eslint-disable import/no-extraneous-dependencies */
import { nanoid } from 'nanoid'

export const getRandomId = (length = 12) => nanoid(length)

export const getYearString = () => {
  const date = new Date()
  return `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`
}

export const getQrCodeImgSrc = (value: string) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${value}`
