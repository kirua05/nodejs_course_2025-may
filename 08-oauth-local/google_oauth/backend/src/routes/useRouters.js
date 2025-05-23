const express = require('express')
const router = express.Router()
const { googleAuth, googleAuthCallback } = require('../controllers/useController')

// /auth/google => 導向 Google 登入頁
router.get('/google', googleAuth)

// /auth/google/callback => Google 登入後導回來
router.get('/google/callback', googleAuthCallback)

router.get('/check', (req, res) => {
  // 範例實作：你可以根據是否登入來調整邏輯
  if (req.isAuthenticated && req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user })
  } else {
    res.status(401).json({ authenticated: false })
  }
})

module.exports = router

// router.get('/check', (req, res) => {
//   if (req.isAuthenticated()) {
//     res.json({ authenticated: true, user: req.user })
//   } else {
//     res.status(401).json({ authenticated: false })
//   }
// })
