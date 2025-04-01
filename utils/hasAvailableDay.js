export async function hasAvailableDay(calendar, dayCells) {
  if (!calendar) {
    console.error('Calendar not found on the page.')
    return false
  }

  for (const cell of dayCells) {
    const bgColor = await cell.evaluate((el) => el.style.backgroundColor)
    const linkTitle = await cell.evaluate((el) => {
      const link = el.querySelector('a')
      return link?.getAttribute('title') ?? ''
    })

    if (bgColor === 'white' || bgColor === 'rgb(255, 255, 255)') {
      return { available: true, availableDay: linkTitle }
    }
  }

  return { available: false, availableDay: '' }
}
