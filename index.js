import express from 'express'
import puppeteer from 'puppeteer'
import dotenv from 'dotenv'

import { hasAvailableDay } from './utils/hasAvailableDay.js'
import { getCurrentMonth } from './utils/getCurrentMonth.js'
import { months } from './consts.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000
const pageURL = process.env.PAGE_URL
const calendarSelector = process.env.CALENDAR_SELECTOR
const calendarHeaderSelector = process.env.CALENDAR_HEADER_SELECTOR
const dayCellSelector = process.env.DAY_CELL_SELECTOR
const lastMonthIndex = parseInt(process.env.LAST_MONTH_INDEX ?? 11)

if (
  !pageURL ||
  !calendarSelector ||
  !calendarHeaderSelector ||
  !dayCellSelector
) {
  console.error('Error: environment variables not set. Cannot continue.')
  console.error('Please set PAGE_URL and CALENDAR_SELECTOR in your .env file.')
  process.exit(1)
}

async function checkReservation() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()
  await page.goto(pageURL, { waitUntil: 'networkidle2' })
  const calendar = await page.$(`${calendarSelector}`)
  const calendarHeader = await calendar.$(calendarHeaderSelector)
  const nextMonth = await calendarHeader.$('td:nth-child(3)')
  const currentMonth = await getCurrentMonth(calendarHeader, nextMonth)
  let currentMonthIndex = months.indexOf(currentMonth)
  console.log(
    'CLOG ~ currentMonth:',
    currentMonth,
    currentMonthIndex,
    lastMonthIndex
  )

  if (lastMonthIndex < currentMonthIndex) {
    console.log(
      `Last month to check is in the past.
      currentMonth: ${months[currentMonthIndex]},
      LAST_MONTH_INDEX: ${months[lastMonthIndex]}`
    )
    await browser.close()
    return
  }

  while (currentMonthIndex < lastMonthIndex) {
    const calendar = await page.$(`${calendarSelector}`)
    const dayCells = await calendar.$$(dayCellSelector)
    const { available, availableDay } = await hasAvailableDay(
      calendar,
      dayCells
    )
    if (available) {
      console.log('available day:', availableDay)
      await browser.close()
      return
    }

    const calendarHeader = await calendar.$(calendarHeaderSelector)
    const nextMonth = await calendarHeader.$('td:nth-child(3)')
    nextMonth.click()
    await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {})
    currentMonthIndex++
  }
  await browser.close()
}

async function runCheck() {
  checkReservation()
}

// setInterval(runCheck, 8 * 60 * 60 * 1000) // 8 hours
runCheck()

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)
})
