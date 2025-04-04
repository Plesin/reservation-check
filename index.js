import fs from 'fs'
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
import { takeScreenshot, screenshotsDir } from './utils/screenshots.js'

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
    await takeScreenshot(page, currentMonthIndex, calendarSelector)

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

app.get('/healthcheck', (req, res) => {
  res.status(200).send('OK')
})

app.get('/screenshots', (req, res) => {
  fs.readdir(screenshotsDir, (err, files) => {
    if (err) {
      res.status(500).send('Error reading screenshots directory')
      return
    }
    const screenshots = files
      .map(
        (file) =>
          `<img src="/screenshots/${file}" style="max-width: 100%; margin-bottom: 10px;">`
      )
      .join('<br>')
    res.send(`<html><body>${screenshots}</body></html>`)
  })
})

app.use('/screenshots', express.static(screenshotsDir))

app.listen(PORT, (err) => {
  if (err) {
    console.error(`Failed to start server: ${err.message}`)
    process.exit(1)
  }
  console.log(`Server listening on port: ${PORT}`)
})

if (isProd) {
  cron.schedule(cronSchedule, async () => {
    console.log('Cron job triggered at:', new Date().toISOString())
    await checkReservation()
  })
} else {
  console.log('Running check in development mode')
  await checkReservation()
}
