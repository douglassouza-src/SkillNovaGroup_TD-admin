const percentFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})

const decimalFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatPercent(value: number): string {
  return `${percentFormatter.format(value)}%`
}

export function formatAverage(value: number): string {
  return decimalFormatter.format(value)
}