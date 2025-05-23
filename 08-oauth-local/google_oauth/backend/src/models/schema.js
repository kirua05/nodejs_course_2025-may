const { pgTable, serial, varchar, timestamp } = require('drizzle-orm/pg-core');

const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 20 }).notNull().unique(),
  email: varchar('email', { length: 40 }).notNull().unique(),
  profilePicture: varchar('pfp', { length: 200 }),
  createdAt: timestamp('created_at', { precision: 0 }).defaultNow(),
  lastLogin: timestamp('last_login', { precision: 0 }).defaultNow()
});

module.exports = {
  usersTable
};