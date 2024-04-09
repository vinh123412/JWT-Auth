const Token = require('../models/refresh-token')
const { UnauthenticatedError } = require('../errors')
const jwt = require('jsonwebtoken')


const getToken = async (req, res) => {
  const refreshToken = req.body.refreshToken
  if (!refreshToken) {
    throw new UnauthenticatedError('Please provide refresh token')
  }
  try {
    const refreshTokenPayload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

    const refreshTokenDB = await Token.findOne({ token: refreshToken, userId: refreshTokenPayload.userId })
    if (!refreshTokenDB) {
      throw new UnauthenticatedError('refresh token Invalid')
    }
    const newAccessToken = jwt.sign({ userId: refreshTokenPayload.userId, userName: refreshTokenPayload.name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' })
    res.json({ newAccessToken })
  } catch (error) {
    throw new UnauthenticatedError('Authentication Invadid')
  }
}

module.exports = getToken