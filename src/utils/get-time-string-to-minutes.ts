export function getMinutesInStringToNumber(timerString: string) {
  const [hours, minutes] = timerString.split(':').map((time) => Number(time))

  return hours * 60 + minutes
}
