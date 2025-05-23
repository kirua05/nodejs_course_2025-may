const express = require('express')
const router = express.Router()
const { payNewOrder, capturePaypalOrder } = require('../controllers/usePaypal')

router.post('/order', payNewOrder) // build order
router.post('/order/:orderID/capture', capturePaypalOrder) // receive order

module.exports = router