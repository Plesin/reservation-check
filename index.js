import express from 'express'
import puppeteer from 'puppeteer'

const app = express()
const PORT = process.env.PORT || 3000
const CONFIG = {
  url: 'https://radekpleskac.com',
}

async function checkReservation() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()
  await page.goto(CONFIG.url, { waitUntil: 'networkidle2' })
  await new Promise((resolve) => setTimeout(resolve, 10000))
  await browser.close()
}

async function runCheck() {
  checkReservation()
}

// setInterval(runCheck, 5 * 60 * 1000) // Run every 5 minutes
setInterval(runCheck, 30 * 1000) // Run every 30 seconds
// runCheck()

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)
})
