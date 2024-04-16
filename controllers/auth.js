const User = require('../models/User')
const Token = require('../models/refresh-token')
const { StatusCodes } = require('http-status-codes')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
  const { name, email, password } = req.body

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const tempUser = { name, email, password: hashedPassword }
  //create user
  const user = await User.create(tempUser)
  // create token
  const accessToken = jwt.sign({ userId: user._id, name: user.name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' })
  const refreshToken = jwt.sign({ userId: user._id, name: user.name }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' })
  const token = await Token.create({ token: refreshToken, userId: user._id })

  res.status(StatusCodes.CREATED).json({ userName: user.name, accessToken, refreshToken })
}

const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new BadRequestError('Please provide email or password')
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError('Invalid credentials')
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new UnauthenticatedError('Invalid credentials')
  }

  const accessToken = jwt.sign({ userId: user._id, name: user.name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' })
  const refreshToken = jwt.sign({ userId: user._id, name: user.name }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' })
  const token = await Token.create({ token: refreshToken, userId: user._id })
  res.status(StatusCodes.OK).json({ name: user.name, accessToken, refreshToken })
}

module.exports = { register, login }