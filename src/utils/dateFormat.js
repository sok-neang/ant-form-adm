export const formatDate = (date) => {
  if (!date) return '-'

  return new Date(date).toLocaleString('en-GB', {
    timeZone: 'Asia/Phnom_Penh',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}