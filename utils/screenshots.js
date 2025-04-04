import fs from 'fs'
import path from 'path'

const screenshotsDir = path.join(process.cwd(), 'data/screenshots')

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true })
}

export function takeScreenshot(page, currentMonthIndex, calendarSelector) {
  return page
    .evaluate((selector) => {
      document.querySelector(selector).scrollIntoView()
    }, calendarSelector)
    .then(() => {
      const screenshotPath = path.join(
        screenshotsDir,
        `${new Date()
          .toISOString()
          .slice(0, 16)
          .replace(/:/g, '-')
          .replace('T', '-')}-${currentMonthIndex}.png`
      )
      return page.screenshot({ path: screenshotPath })
    })
}

export { screenshotsDir }
