import express from 'express'
import puppeteer from 'puppeteer'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000
const PAGE_URL = process.env.PAGE_URL

if (!PAGE_URL) {
  console.error('Error: The PAGE_URL environment variable is not set.')
  process.exit(1)
}

async function checkReservation() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()
  await page.goto(PAGE_URL, { waitUntil: 'networkidle2' })
  await new Promise((resolve) => setTimeout(resolve, 10000))
  await browser.close()
}

async function runCheck() {
  checkReservation()
}

// setInterval(runCheck, 5 * 60 * 1000) // Run every 5 minutes
setInterval(runCheck, 20 * 1000) // Run every 30 seconds
// runCheck()

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)
})
