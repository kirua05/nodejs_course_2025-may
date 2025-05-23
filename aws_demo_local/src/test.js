const db = require('../db/index'); // 根據你的實際路徑調整
const { usersSchema } = require('../db/schema');

async function main() {
  try {
    const result = await db.insert(usersSchema).values({
      name: '小奇犽',
      email: 'test@example.com',
      avatar_url: 'https://example.com/avatar.png',
    }).returning(); // 加上 returning() 可回傳剛插入的資料

    console.log('✅ 插入成功：', result);
  } catch (err) {
    console.error('❌ 插入失敗：', err);
  } 
  // finally {
  //   await db.end?.(); // 若你用 pgDriver，有些版本 db 需要關閉連線
  // }
}

main();