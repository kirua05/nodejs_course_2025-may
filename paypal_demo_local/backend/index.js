const express = require("express")
const app = express()
const route = require ('./src/routes/order')
const bodyParser = require("body-parser")
const cors = require("cors")

app.use(cor())
app.use(bodyParser.json())
app.use('/api', route)



app.listen(3000, () => console.log("Server running on http://localhost:3000"))