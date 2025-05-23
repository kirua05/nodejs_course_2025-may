const passport = require("passport")
const { eq } = require('drizzle-orm')
const db = require("../config/db") // 你的 drizzle instance
const { usersTable } = require('../models/schema') // 你的 table schema
// const db = require('../config/db')

// 第一步：導向 Google 登入頁
const googleAuth = (req, res) => {
  passport.authenticate("google", { scope: ["email", "profile"] })(req, res)
}

// // 第二步：Google 認證完成後回來這邊
// const googleAuthCallback = (req, res, next) => {
//   passport.authenticate("google", { session: false }, (err, user) => {
//     if (err) return next(err)
//     if (!user) return res.redirect("/auth/google") // 沒登入成功就導回去

//     // 登入成功：把 user 資料傳到前端
//     const userData = encodeURIComponent(JSON.stringify(user))
//     res.redirect(`http://localhost:5173/home?user=${userData}`)
//   })(req, res, next)
// }


const googleAuthCallback = (req, res, next) => {
  passport.authenticate("google", { session: false }, async (err, user) => {
    if (err) return next(err)
    if (!user) return res.redirect("/auth/google")
    
    console.log("🐛 Google 回傳的 user：", user)
    const email = user.emails?.[0]?.value
    const displayName = user.displayName

    try {
      // 1. 查 DB 有沒有這個 user
      const existingUsers = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))

      if (existingUsers.length === 0) {
        // 2. 沒有的話就插入
        await db.insert(usersTable).values({
          username: displayName,
          email,
          profilePicture: user.photos[0].value,
          lastLogin: new Date()
        })
      }

      // 3. 登入成功導回前端
      const userData = encodeURIComponent(JSON.stringify(user))
      res.redirect(`http://localhost:5173/home?user=${userData}`)
    } catch (dbErr) {
      console.error('資料庫寫入錯誤：', dbErr)
      return res.status(500).send('Server error')
    }
  })(req, res, next)
}

module.exports = {
  googleAuth,
  googleAuthCallback
}