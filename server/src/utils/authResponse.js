import generateToken from "./generateToken.js"

function authResponse(user) {
  const token = generateToken(user)

  return {
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  }
}

export default authResponse
