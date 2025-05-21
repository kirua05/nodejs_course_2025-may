const express = require('express')
require('dotenv').config()
const connectDB = require('./config/db')
const userRoutes = require('./routes/user')

// const { MongoClient } = require('mongodb');

// const connectDB = async () => {
//   try {
//     const client = new MongoClient(process.env.MONGODB_URI)
//     await client.connect()
//     console.log('MongoDB 連接成功')
//   } catch (err) {
//     console.error(`Error: ${err.message}`)
//   }
// }

connectDB()

const app = express()

app.use(express.json())
app.use('/api', userRoutes)

app.listen(3000, () => {
  console.log('已運作在 http://localhost:3000');
  
})

