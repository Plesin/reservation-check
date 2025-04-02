import fs from 'fs'
import path from 'path'

const logsDir = path.resolve('data/logs')

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
}

export function logger(text, addLine = false) {
  const today = new Date().toISOString()
  const currentDate = today.split('T')[0] // Format: YYYY-MM-DD
  const filePath = path.join(logsDir, `${currentDate}.log`)

  const content = `${addLine ? '\n' : ''}[${today}] ${text}\n`
  console.log(`LOGGER': ${content}`)

  fs.appendFile(filePath, content, (err) => {
    if (err) {
      console.error('Failed to write to log file:', err)
    }
  })
}
