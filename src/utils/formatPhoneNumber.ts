const formatPhoneNumber = (value: string) => {
  const cleanValue = value.replace(/\D/g, '') // 숫자가 아닌 문자는 제거
  let formattedNumber = cleanValue

  if (cleanValue.length > 3 && cleanValue.length <= 7) {
    formattedNumber = `${cleanValue.slice(0, 3)}-${cleanValue.slice(3)}`
  } else if (cleanValue.length > 7) {
    formattedNumber = `${cleanValue.slice(0, 3)}-${cleanValue.slice(3, 7)}-${cleanValue.slice(7, 11)}`
  }

  return formattedNumber
}
export default formatPhoneNumber
