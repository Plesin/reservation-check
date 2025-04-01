export async function getCurrentMonth(calendarHeader, nextMonth) {
  const tableCell = await calendarHeader.$('td:nth-child(2)')

  if (!tableCell) {
    console.error('Calendar header not found.')
  }

  const currentMonthText =
    (await tableCell.evaluate((el) => el.innerText.trim())) ?? ''

  return currentMonthText.split(' ')[0]?.toLowerCase()
}
