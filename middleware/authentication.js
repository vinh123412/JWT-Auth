const User = require('../models/User')
const Token = require('../models/refresh-token')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')


const auth = async (req, res, next) => {
  //check header
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Authentication invalid')
  }
  const accessToken = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    // attach the user to the job routes
    req.user = { name: payload.name, id: payload.userId }
    next()
  } catch (error) {
    throw new UnauthenticatedError('Authentication Invalid')
  }
}

module.exports = auth