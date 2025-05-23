const { pgTable, serial, varchar, timestamp, integer, primaryKey } = require('drizzle-orm/pg-core')

const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 20 }).notNull().unique(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('create_at').defaultNow(),
})

const postsTable = pgTable('posts', {
  id: serial('id').primaryKey(),
  userID: integer('user_id').notNull().references(() => usersTable.id),
  imageUrl: varchar('image_url', { length: 255 }).notNull(),
  caption: varchar('caption', { length: 255 }),
  createdAt: timestamp('create_at').defaultNow(),
})

const likesTable = pgTable('likes', {
  userID: integer('user_id').notNull().references(() => usersTable.id),
  postID: integer('post_id').notNull().references(() => postsTable.id),
  createdAt: timestamp('created_at').defaultNow()
}, (table) => ({
  pk: primaryKey(table.userID, table.postID)
}))

module.exports = {
  usersTable,
  postsTable,
  likesTable
}