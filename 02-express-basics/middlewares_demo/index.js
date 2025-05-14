const express = require('express')
const app = express()

const requestLogs =[]

const requestTimer = (req, res, next) => {
  const startTime = Date.now()

  res.on('finish', () => {
    const endTime = Date.now()
    const duration = endTime - startTime

    console.log(res);
    

    const log = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`
    }
    requestLogs.push(log)
  })
  next()
}

app.get('logs', (req, res) => {
  res.json(requestLogs)
})


const firstMiddleware = (req, res, next) => {
  // console.log('firstMiddleware')
  next()
}

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: '未提供認證 token' });
  }
  // 驗證 token 邏輯
  next();
};


// middleware zone
app.use(requestTimer)
// 404 處理
app.use((req, res) => {
  res.status(404).json({ error: '路徑錯誤' });
});
app.use(firstMiddleware)
app.use(authMiddleware)

app.get('/', (req, res) => {
  res.send('Welcome to the homepage!')
})
app.get('/hello', (req, res) =>{
  res.send('Hi!!!')
})

const port = 3000
app.listen(port, () => {
  console.log(`伺服器啟動在http://localhost:${port}`);

})