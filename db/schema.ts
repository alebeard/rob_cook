import { integer, pgTable, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const celebrations = pgTable('celebrations', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    clientName: varchar({ length: 255 }),
    supportiveMessage: text().notNull(),
    activityDetails: text(),
    documents: text(), // JSON string containing uploaded document data
    bibleVerse: text(),
    bibleReference: varchar({ length: 100 }),
    photoUrl: text(),
    createdAt: timestamp().defaultNow().notNull(),
    createdBy: varchar({ length: 255 })
});