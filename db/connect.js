const mongoose = require('mongoose')

const url = 'mongodb://localhost:27017/Jobs-API'


mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Database connected successfully')
  })
  .catch(() => {
    console.error('Error connecting to MongoDB:', error)
  })
