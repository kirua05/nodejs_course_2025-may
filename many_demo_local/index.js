const express = require("express")
const app = express()

// app.use(cors())
// app.use(express.json())
// 設置好 routes 的 API 路徑

// app.use('/api', route)

app.listen(3000, () => {
  console.log('運作在 http://localhost:3000');
  
})