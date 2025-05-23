const { OrdersController, CheckoutPaymentIntent} = require("@paypal/paypal-server-sdk")
const client = require('../configs/paypal')

const ordersController = new OrdersController(client) //初始化訂單控制
// 要給 paypal 的
const createOrder = async () => {
  const collect = {
    body: {
      intent: CheckoutPaymentIntent.Capture, // confirm order
      purchaseUnits: [{
        amount: {
          currencyCode: "TWD", // currency
          value: "100", // 金額
        },
      }],
    },
    prefer: "return=minimal", // 回應最少必要資訊
  }

  try {
    const { body, ...httpResponse } = await ordersController.createOrder(collect) // build order
    return {
      jsonResponse: JSON.parse(body),
      httpStatusCode: httpResponse.statusCode
    }
  } catch (err){
    console.error(err.messsage)    
  }
}

const captureOrder = async (orderID) => {
  const collect = {
    id: orderID,
    prefer: "return=minimal"
  }

  try {
    const { body, ...httpResponse } = await ordersController.captureOrder(collect)
    return {
      jsonResponse: JSON.parse(body),
      httpStatusCode: httpResponse.statusCode
    }
  } catch (err) {
    console.error(err.messsage)
  }
}

// API 的 controller 給 routes
const payNewOrder = async (req, res) => { // 付錢給 paypal
  try {
    const { cart } = req.body
    const{ jsonResponse, httpStatusCode } = await createOrder(cart)
    res.status(httpStatusCode).json(jsonResponse)
  } catch (err) {
    res.status(500).json({ err: "訂單建立失敗" })
  }
}

const capturePaypalOrder = async () => { // 接收付錢後的資訊
  try {
    const { orderID } = req.params
    const { httpStatusCode, jsonResponse } = await captureOrder(orderID)
    res.status(httpStatusCode).json(jsonResponse)
  } catch (err) {
    res.status(500).json({ err: "訂單轉帳失敗" })
  }
}

module.export = {
  payNewOrder,
  capturePaypalOrder
}