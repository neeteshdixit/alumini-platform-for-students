import { env } from '../config/env.js'

const resendApiUrl = 'https://api.resend.com/emails'

const hasResendConfig = () => {
  return Boolean(env.resendApiKey && env.otpFromEmail)
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

  if (!hasResendConfig()) {
    console.log(`[otp] ${toEmail} -> ${otp}`)
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
    throw new Error(`Failed to send OTP email: ${errorText}`)
  }

  return { delivered: true, provider: 'resend' }
}
