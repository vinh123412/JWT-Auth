const mongoose = require('mongoose')

const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: [true, 'Please provide refresh token']
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    require: [true, 'Please provide user id']
  }

})

module.exports = mongoose.model('refresh token', refreshTokenSchema)