export function getEnvVariables() {
  const lastMonthIndex = parseInt(process.env.LAST_MONTH_INDEX ?? 11)
  const pageURL = process.env.PAGE_URL
  const calendarSelector = process.env.CALENDAR_SELECTOR
  const calendarHeaderSelector = process.env.CALENDAR_HEADER_SELECTOR
  const dayCellSelector = process.env.DAY_CELL_SELECTOR
  const isProd = process.env.NODE_ENV === 'production'

  if (lastMonthIndex < 0 || lastMonthIndex > 11) {
    console.error(
      `LAST_MONTH_INDEX: ${lastMonthIndex} must be between 0 (January) and 11(December)`
    )
    process.exit(1)
  }

  if (
    !pageURL ||
    !calendarSelector ||
    !calendarHeaderSelector ||
    !dayCellSelector
  ) {
    console.error(
      'Error: environment variables not set. Check .env.example for reference'
    )
    process.exit(1)
  }

  return {
    lastMonthIndex,
    pageURL,
    calendarSelector,
    calendarHeaderSelector,
    dayCellSelector,
    isProd,
  }
}
