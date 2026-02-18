import { integer, sqliteTable, text, index, unique } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { user } from './auth.schema';

// One row per accepted submission. Multiple users can describe the same module.
export const description = sqliteTable(
	'description',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		user_id: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		module_id: text('module_id').notNull(), // all.replacements key
		body: text('body').notNull(),
		example: text('example'), // nullable
		created_at: integer('created_at', { mode: 'timestamp_ms' })
			.notNull()
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
	},
	(t) => [
		index('description_module_idx').on(t.module_id),
		index('description_user_idx').on(t.user_id),
		unique('description_user_module_uniq').on(t.user_id, t.module_id)
	]
);

// One upvote per user per description (toggle: insert or delete)
export const upvote = sqliteTable(
	'upvote',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		user_id: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		description_id: text('description_id')
			.notNull()
			.references(() => description.id, { onDelete: 'cascade' }),
		created_at: integer('created_at', { mode: 'timestamp_ms' })
			.notNull()
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
	},
	(t) => [
		unique('upvote_user_description_uniq').on(t.user_id, t.description_id),
		index('upvote_description_idx').on(t.description_id)
	]
);

// Tracks every module a user has actioned (submitted or skipped)
export const user_progress = sqliteTable(
	'user_progress',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		user_id: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		module_id: text('module_id').notNull(),
		status: text('status', { enum: ['submitted', 'skipped'] }).notNull(),
		created_at: integer('created_at', { mode: 'timestamp_ms' })
			.notNull()
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
	},
	(t) => [
		unique('progress_user_module_uniq').on(t.user_id, t.module_id),
		index('progress_user_idx').on(t.user_id)
	]
);

export * from './auth.schema';
