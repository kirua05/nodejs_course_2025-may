const express = require('express')
require('dotenv').config()
const {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
  paginateListObjectsV2,
  GetObjectCommand,
  ListObjectsV2Command,
} = require("@aws-sdk/client-s3");
const multer = require("multer")
const fs = require("node:fs")
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")

const bucketName = process.env.S3_BUCKET_NAME
const region = process.env.AWS_REGION


const app = express()
// multer 主要先將檔案存在本地端，再上傳到 S3
const upload = multer({
  dest: "uploads/", // 自設的路徑
  limits: {
    fileSize: 3 * 1024 *1024 // 3MB
  },
  fileFilter: (req, file, cb) => { // 限制上傳檔案條件，cb = callback
    if(file.mimetype.startsWith('image/')) { // 限制只限圖片
      cb(null, true) // (錯誤訊息, 是否能上傳)
    } else {
      cb(new Error('只能上傳圖片'), false)
    }
  }
})

const s3 = new S3Client({
  region,
  credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
})

app.post("/upload", upload.single("image"), async (req, res) => {
  // 使用者上傳檔案
  const file = req.file

  if (!file) {
    return res.status(400).send("沒有上傳檔案")
  }

const fileKey = `${Date.now()}-${file.originalname}` // 使用時間戳記 ＋ 原始檔案名稱
const filestream = fs.createReadStream(file.path) // 從本地暫存資料夾讀取檔案

// 設定上傳到S3的參數
const uploadParams = {
  Bucket: bucketName, // 設定上傳到哪個Bucket
  Key: fileKey, // 上傳的內容
  Body: filestream, // 上傳的內容
  ContentType: file.mimetype //上傳檔案的類型
}

try {
  await s3.send(new PutObjectCommand(uploadParams))
  fs.unlinkSync(file.path)
  // 生成預簽名 URL
      const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileKey
      })
  
      const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }) // 1h = 3600s
  

      const publicUrl = `http://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`
      res.json({
        message: "上傳成功",
        imageUrl: signedUrl,
        publicUrl
      })
    } catch (err) {
      console.error("S3 Upload Error:", err)
      res.status(500).send("上傳失敗")
    }
  })

app.get("/files", async (req, res) => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.S3_BUCKET_NAME
    })

    const data = await s3.send(command)

    const files = (data.Contents || []).map((item) => ({
      key: item.Key,
      url: `https://${bucketName}.s3.${region}.amazonaws.com/${item.Key}`
    }))

    res.json(files)
  } catch (err) {
    console.error("List Files Error:", err)
    res.status(500).send("無法列出檔案")
  }
})

app.delete("/files/:key", async (req, res) => {
  const { key } = req.params

  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key
    })

    await s3.send(command)

    res.json({ message: `檔案已刪除: ${key}` })
  } catch (err) {
    console.error("Delete Error:", err)
    res.status(500).send("刪除失敗")
  }
})

app.listen(3000, () => {
  console.log('已運作在 http://localhost:3000');
})


// /express_project
//   -/src
//   -/routes // API路徑
//   -/config // 連線設定，例如資料庫
//   -/controllers // 操作邏輯，例如 API 怎麼操作
//   -/models // 存資料庫的 schema
//   -/middlewsres // 存放 middlewares
//   -index.js // 主要執行的檔案