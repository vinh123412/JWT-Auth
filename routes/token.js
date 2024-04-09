const express = require('express')
const router = express.Router()
const getToken = require('../controllers/token')

router.route('/').post(getToken)

module.exports = router