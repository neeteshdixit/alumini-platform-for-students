import { env } from '../config/env.js'

const resendApiUrl = 'https://api.resend.com/emails'

const hasResendConfig = () => {
  return Boolean(env.resendApiKey && env.otpFromEmail)
}

const sendHtmlEmail = async ({ toEmail, subject, html }) => {
  if (!hasResendConfig()) {
    console.log(`[mail] ${subject} -> ${toEmail}`)
    console.log(html.replace(/\s+/g, ' ').trim())
    return { delivered: false, provider: 'console' }
  }

  const response = await fetch(resendApiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.otpFromEmail,
      to: [toEmail],
      subject,
      html,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to send email: ${errorText}`)
  }

  return { delivered: true, provider: 'resend' }
}

export const sendOtpEmail = async ({ toEmail, name, otp }) => {
  const greetingName = name || 'there'
  const subject = 'Your AlumniConnect verification code'
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111827">
      <h2 style="margin:0 0 12px">Verify your AlumniConnect account</h2>
      <p>Hello ${greetingName},</p>
      <p>Your one-time verification code is:</p>
      <p style="font-size:28px;font-weight:700;letter-spacing:4px;margin:12px 0">${otp}</p>
      <p>This code expires in ${env.otpExpiryMinutes} minutes.</p>
      <p>If you did not request this, you can safely ignore this email.</p>
    </div>
  `

  return sendHtmlEmail({ toEmail, subject, html })
}

export const sendGraduationCongratsEmail = async ({ toEmail, name, graduationLabel }) => {
  const subject = 'Congratulations on your degree!'
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
      <h2 style="margin:0 0 12px">Congrats on your degree! 🎓</h2>
      <p>Hello ${name || 'there'},</p>
      <p>You completed your ${graduationLabel || 'degree'}.</p>
      <p>Add your achievements to your profile so juniors and alumni can connect with you.</p>
      <p style="margin-top:20px;font-weight:700">AlumniConnect</p>
    </div>
  `

  return sendHtmlEmail({ toEmail, subject, html })
}

export const sendGraduationReminderEmail = async ({ toEmail, name, hoursElapsed = 24 }) => {
  const subject = 'We saved your alumni spotlight'
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
      <h2 style="margin:0 0 12px">We'd love to see you back on AlumniConnect</h2>
      <p>Hello ${name || 'there'},</p>
      <p>Your degree milestone is waiting on your profile. It has been ${hoursElapsed} hours since graduation.</p>
      <p>Login to update your achievements and let juniors discover your journey.</p>
    </div>
  `

  return sendHtmlEmail({ toEmail, subject, html })
}

export const sendPasswordResetEmail = async ({ toEmail, name, resetUrl }) => {
  const subject = 'Reset your AlumniConnect password'
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
      <h2 style="margin:0 0 12px">Reset your password</h2>
      <p>Hello ${name || 'there'},</p>
      <p>Use the secure link below to create a new password:</p>
      <p><a href="${resetUrl}" style="color:#1d4ed8;font-weight:700">${resetUrl}</a></p>
      <p>This link will expire shortly.</p>
    </div>
  `

  return sendHtmlEmail({ toEmail, subject, html })
}
