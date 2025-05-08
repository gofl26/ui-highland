export function formatNumberWithCommas(value: number | string): string {
  const strValue = value.toString()
  const [integerPart, decimalPart] = strValue.split('.')
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger
}
