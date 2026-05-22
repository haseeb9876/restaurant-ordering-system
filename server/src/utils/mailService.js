import nodemailer from "nodemailer"

function getMailTransporter() {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_PORT ||
    !process.env.SMTP_EMAIL ||
    !process.env.SMTP_PASSWORD
  ) {
    throw new Error("SMTP configuration is missing in .env file.")
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  })
}

export async function sendOtpEmail({ to, fullName, otp, purpose }) {
  const transporter = getMailTransporter()

  const title =
    purpose === "PASSWORD_RESET"
      ? "Password Reset Code"
      : "Email Verification Code"

  const subject = `Royal Pizza Palace - ${title}`

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #111827; padding: 30px;">
      <div style="max-width: 560px; margin: auto; background-color: #ffffff; border-radius: 18px; overflow: hidden;">
        <div style="background-color: #f97316; padding: 24px; text-align: center;">
          <h1 style="margin: 0; color: #ffffff;">Royal Pizza Palace</h1>
          <p style="margin: 8px 0 0; color: #fff7ed;">Premium Restaurant Ordering Experience</p>
        </div>

        <div style="padding: 30px; color: #111827;">
          <h2 style="margin-top: 0;">${title}</h2>

          <p>Dear ${fullName || "Customer"},</p>

          <p>Your OTP code is:</p>

          <div style="font-size: 34px; font-weight: bold; letter-spacing: 6px; background-color: #fff7ed; color: #f97316; padding: 18px; text-align: center; border-radius: 14px; margin: 24px 0;">
            ${otp}
          </div>

          <p>This OTP is valid for <strong>10 minutes</strong>.</p>

          <p>If you did not request this code, please ignore this email.</p>

          <p style="margin-top: 30px;">Thank you,<br /><strong>Royal Pizza Palace Team</strong></p>
        </div>
      </div>
    </div>
  `

  await transporter.sendMail({
    from: `"Royal Pizza Palace" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html,
  })
}
