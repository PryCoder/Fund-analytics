import { isAfter, subYears } from 'date-fns'

export const filterDataByDateRange = (data, range) => {
  if (!data || data.length === 0) return []

  if (range === 'ALL') return data

  const now = new Date()
  let startDate

  switch (range) {
    case '1Y':
      startDate = subYears(now, 1)
      break
    case '3Y':
      startDate = subYears(now, 3)
      break
    case '5Y':
      startDate = subYears(now, 5)
      break
    default:
      return data
  }

  return data.filter((item) => {
    const itemDate = new Date(item.parsedDate)
    return isAfter(itemDate, startDate) || itemDate.toDateString() === startDate.toDateString()
  })
}

export const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    const [day, month, year] = dateString.split('-')
    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateString
  }
}

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value)
}

export const calculateReturns = (startNav, endNav) => {
  if (!startNav || !endNav) return { absolute: 0, percentage: 0 }
  const absolute = endNav - startNav
  const percentage = (absolute / startNav) * 100
  return { absolute, percentage }
}
