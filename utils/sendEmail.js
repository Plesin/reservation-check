import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

export async function sendEmail(subject, message) {
  if (
    !process.env.EMAIL_USER ||
    !process.env.EMAIL_APP_PASSWORD ||
    !process.env.NOTIFICATION_EMAIL
  ) {
    console.error(
      'Error: environment variables not set. Check .env.example for reference'
    )
    return
  }
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    })

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFICATION_EMAIL,
      subject: subject,
      text: message,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully!')
    return result
  } catch (error) {
    console.error('Failed to send email:', error)
  }
}
