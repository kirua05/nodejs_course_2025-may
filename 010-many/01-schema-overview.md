# 📘 Schema Overview

這份資料庫設計示範的是一個簡化版的 Instagram 系統，包含以下三個資料表：

- `users`：使用者
- `posts`：貼文
- `likes`：按讚關係

## 🔗 資料表關聯

- 一對多（1:N）: `users` 👉 `posts`
- 多對多（M:N）: `users` ⇄ `posts`（透過 `likes`）

```plaintext
users ---< posts
users ---< likes >--- posts
```
