import cron from 'node-cron'
import { readFileSync } from 'fs'

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'))
const appName = packageJson.name ?? 'app'

cron.schedule('0 * * * *', async () => {
  try {
    const response = await fetch('http://localhost:3000/healthcheck')
    if (!response.ok) {
      await sendEmail(
        'Server Health Check Failed',
        `The application: ${appName} server responded with status code: ${response.status}`
      )
    }
  } catch (error) {
    await sendEmail(
      'Server Health Check Failed',
      `The application: ${appName} server is not responding. Error: ${error.message}`
    )
  }
})
