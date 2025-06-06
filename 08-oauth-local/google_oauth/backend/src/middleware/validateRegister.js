const { z } = require('zod') // 檢查是否符合規範
const jwt = require('jsonwebtoken')
require('dotenv').config()

const SECRET_KEY = process.env.SECRET_KEY

// zod 定義註冊 schema
const registerSchema = z.object({
  username: z
    .string()
    .min(3, '使用者名稱至少需要3個字元')
    .max(20, '使用者名稱不能超過20個字元'),
  password: z.string().min(8, '密碼至少需要8個字元'),
  email: z.string().email('請輸入正確的email'),
})

// 驗證註冊 middleware
const validateRegister = (req, res, next) => {
  try {
    registerSchema.parse(req.body)
    next()
  } catch (error) {
    // zod 錯誤格式化
    const formattedErrors = error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message
    }))

    res.status(400).json({
      error: '驗證錯誤',
      details: formattedErrors
    })
  }
}

// 驗證
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: '沒提供 token' })
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'token 無效' })
    }

    req.user = user
    next()
  })
}


// const session = require('express-session')

// // 建議放在 passport 初始化前
// app.use(session({
//   secret: '你的超機密字串',
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     secure: false, // 如果你用 HTTPS 記得改成 true
//     httpOnly: true
//   }
// }))
// app.use(passport.initialize())
// app.use(passport.session())


// passport.serializeUser((user, done) => {
//   done(null, user)
// })

// passport.deserializeUser((user, done) => {
//   done(null, user)
// })


module.exports = {
  validateRegister,
  authenticateToken
}