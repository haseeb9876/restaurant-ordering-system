export function generateOtp(length = 6) {
  let otp = ""

  for (let index = 0; index < length; index += 1) {
    otp += Math.floor(Math.random() * 10)
  }

  return otp
}

export function getOtpExpiry(minutes = 10) {
  return new Date(Date.now() + minutes * 60 * 1000)
}
