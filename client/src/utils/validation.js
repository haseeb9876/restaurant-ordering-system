export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validateLoginForm(formData) {
  const email = formData.email.trim().toLowerCase()
  const password = formData.password

  if (!email || !password) {
    return {
      isValid: false,
      message: "Please fill all fields.",
      data: null,
    }
  }

  if (!isValidEmail(email)) {
    return {
      isValid: false,
      message: "Please provide a valid email address.",
      data: null,
    }
  }

  return {
    isValid: true,
    message: "",
    data: {
      email,
      password,
    },
  }
}

export function validateRegisterForm(formData) {
  const fullName = formData.fullName.trim()
  const email = formData.email.trim().toLowerCase()
  const password = formData.password

  if (!fullName || !email || !password) {
    return {
      isValid: false,
      message: "Please fill all fields.",
      data: null,
    }
  }

  if (!isValidEmail(email)) {
    return {
      isValid: false,
      message: "Please provide a valid email address.",
      data: null,
    }
  }

  if (password.length < 6) {
    return {
      isValid: false,
      message: "Password must be at least 6 characters long.",
      data: null,
    }
  }

  return {
    isValid: true,
    message: "",
    data: {
      fullName,
      email,
      password,
    },
  }
}
