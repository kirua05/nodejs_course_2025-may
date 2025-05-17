const { integer, pgTable, varchar, text, timestamp } = require('drizzle-orm/pg-core');

const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 50 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  created_at: timestamp().defaultNow(),
  address: varchar({ length: 255 }).notNull()
});

const postsTable = pgTable('posts', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 100 }).notNull(),
  content: text().notNull(),
  user_id: integer().references(() => usersTable.id),
  created_at: timestamp().defaultNow(),
})

module.exports = {
  usersTable,
  postsTable
};