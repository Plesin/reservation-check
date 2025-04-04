import fs from 'fs'
import path from 'path'

const screenshotsDir = path.join(process.cwd(), 'data/screenshots')

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true })
}

export async function takeScreenshot(page, currentMonthIndex, calendar) {
  const screenshotPath = path.join(
    screenshotsDir,
    `${new Date()
      .toISOString()
      .slice(0, 16)
      .replace(/:/g, '-')
      .replace('T', '-')}-${currentMonthIndex}.png`
  )
  await calendar.screenshot({ path: screenshotPath })
}

export { screenshotsDir }
