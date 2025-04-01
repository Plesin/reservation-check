import fs from 'fs'
import path from 'path'

export function logger(text, addLine = false) {
  const logsDir = './logs'
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir)
  }

  const today = new Date().toISOString()
  const currentDate = today.split('T')[0] // Format: YYYY-MM-DD
  const filePath = path.join(logsDir, `${currentDate}.log`)

  const content = `${addLine ? '\n' : ''}[${today}] ${text}\n`

  fs.appendFile(filePath, content, (err) => {
    if (err) {
      console.error('Failed to write to log file:', err)
    }
  })
}
