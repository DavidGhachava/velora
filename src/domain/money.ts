type DisplayCurrency = 'GEL' | 'USD'

const gelPerUsd = 2.63
let activeCurrency: DisplayCurrency = 'GEL'
let activeLocale = 'en-US'

export const setMoneyPreferences = (currency: DisplayCurrency, language: 'en' | 'ka') => {
  activeCurrency = currency
  activeLocale = language === 'ka' ? 'ka-GE' : 'en-US'
}

export const formatMoney = (minor: number, currency: DisplayCurrency = activeCurrency): string => {
  const gel = minor / 100
  const amount = currency === 'USD' ? gel / gelPerUsd : gel
  return new Intl.NumberFormat(activeLocale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
}

export const calculateTax = (subtotal: number): number => Math.round(subtotal * 0.1)

export const sum = (values: number[]): number => values.reduce((total, value) => total + value, 0)
