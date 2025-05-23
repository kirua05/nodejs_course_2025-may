require('dotenv').config()
const express = require('express')
const app = express()
const passport = require('passport')
const cookieParser = require('cookie-parser')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const useRouters = require('./src/routes/useRouters')
const morgan = require('morgan')
const cors = require('cors')
const connectDB = require('./src/config/db')


const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  done(null, profile)
}))

app.use(cors({
  origin: 'http://localhost:5173', // 明確指定前端的 origin
  credentials: true               // 允許攜帶 cookies / headers 等憑證
}))

app.use('/auth', useRouters)
app.use(passport.initialize())


app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
