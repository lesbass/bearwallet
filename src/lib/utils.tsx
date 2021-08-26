import React from 'react'

import { Icon } from 'interfaces/NotionModels'

export function getRating(val: number) {
  const absVal = Math.abs(val)
  const symbol = '💰'
  if (absVal < 25) return symbol
  if (absVal < 60) return `${symbol}${symbol}`
  return `${symbol}${symbol}${symbol}`
}

export function formatEuro(val: number) {
  const formatter = new Intl.NumberFormat('it-IT', {
    currency: 'EUR',
    style: 'currency',
  })

  return formatter.format(val)
}

export function renderIcon(icon: Icon | null) {
  switch (icon?.type) {
    case null:
      return ''
    case 'emoji':
      return icon.emoji
    default:
      // eslint-disable-next-line @next/next/no-img-element
      return <img alt={'Category Icon'} src={icon?.file?.url} style={{ height: '1em' }} />
  }
}

export function renderValore(val: number, hideValues: boolean) {
  const isNegative = val < 0
  const color = isNegative ? 'red' : 'green'
  const symbol = isNegative ? '⇃' : '↿'
  const valore = hideValues ? getRating(val) : formatEuro(Math.abs(val))

  return (
    <>
      <b style={{ color: color }}>{symbol}</b> {valore}
    </>
  )
}
