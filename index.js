import express from 'express'
import puppeteer from 'puppeteer'
import dotenv from 'dotenv'
import cron from 'node-cron'

import { getEnvVariables } from './utils/getEnvVariables.js'
import { hasAvailableDay } from './utils/hasAvailableDay.js'
import { getCurrentMonth } from './utils/getCurrentMonth.js'
import { months } from './consts.js'
import { logger } from './utils/logger.js'
import { sendEmail } from './utils/sendEmail.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000
const cronSchedule = process.env.CRON_SCHEDULE || '0 6-22/2 * * *' // Every 2 hours from 6am to 10pm
const {
  lastMonthIndex,
  pageURL,
  calendarSelector,
  calendarHeaderSelector,
  dayCellSelector,
  isProd,
} = getEnvVariables()

async function checkReservation() {
  const browser = await puppeteer.launch({
    headless: isProd,
    args: [
      `--no-sandbox`,
      `--headless`,
      `--disable-gpu`,
      `--disable-dev-shm-usage`,
      '--window-size=1280,800',
    ],
  })
  const page = await browser.newPage()
  await page.goto(pageURL, { waitUntil: 'networkidle2' })
  const calendar = await page.$(`${calendarSelector}`)
  const calendarHeader = await calendar.$(calendarHeaderSelector)
  const nextMonth = await calendarHeader.$('td:nth-child(3)')
  const currentMonth = await getCurrentMonth(calendarHeader, nextMonth)
  let currentMonthIndex = months.indexOf(currentMonth)
  logger(`NEW CHECK: ${currentMonth} till ${months[lastMonthIndex]}`, true)

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
    logger(`Checking month: ${months[currentMonthIndex]}`)
    const calendar = await page.$(`${calendarSelector}`)
    const dayCells = await calendar.$$(dayCellSelector)
    const { available, availableDay } = await hasAvailableDay(
      calendar,
      dayCells
    )
    if (available) {
      logger(`Found available day: ${availableDay}`)
      sendEmail(
        `Available Reservation: ${availableDay}`,
        `Found available day for your reservation at ${pageURL}: ${availableDay} in month: ${months[currentMonthIndex]}
        The available day is: ${availableDay}`
      )
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

if (isProd) {
  cron.schedule(cronSchedule, async () => {
    console.log('Cron job triggered at:', new Date().toISOString())
    await checkReservation()
  })
} else {
  console.log('Running check in development mode')
  await checkReservation()
}

app.get('/healthcheck', (req, res) => {
  res.status(200).send('OK')
})

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)
})
