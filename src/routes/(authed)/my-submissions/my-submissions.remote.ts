import { fail } from '@sveltejs/kit';
import { form, query } from '$app/server';
import { count, desc, eq, sql } from 'drizzle-orm';
import { get_session } from '$lib/auth.remote';
import { db } from '$lib/server/db';
import { description, upvote } from '$lib/server/db/schema';
import * as v from 'valibot';

const PAGE_SIZE = 20;

export const get_my_submissions = query(v.number(), async (page = 1) => {
	const session = await get_session();

	const rows = await db
		.select({
			id: description.id,
			module_id: description.module_id,
			body: description.body,
			example: description.example,
			created_at: description.created_at,
			upvote_count: count(upvote.id)
		})
		.from(description)
		.leftJoin(upvote, eq(upvote.description_id, description.id))
		.where(eq(description.user_id, session.user.id))
		.groupBy(description.id)
		.orderBy(desc(description.created_at))
		.limit(PAGE_SIZE)
		.offset((page - 1) * PAGE_SIZE);

	const total_count = await db
		.select({ count: sql<number>`count(*)` })
		.from(description)
		.where(eq(description.user_id, session.user.id))
		.then((r) => r[0]?.count ?? 0);

	return {
		submissions: rows,
		page,
		total: total_count,
		page_size: PAGE_SIZE
	};
});

const edit_schema = v.object({
	description_id: v.pipe(v.string(), v.nonEmpty()),
	body: v.pipe(v.string(), v.nonEmpty('Description is required')),
	example: v.optional(v.string())
});

export const edit_submission = form(edit_schema, async ({ description_id, body, example }) => {
	const session = await get_session();

	const target = await db
		.select({ user_id: description.user_id })
		.from(description)
		.where(eq(description.id, description_id))
		.limit(1)
		.then((r) => r[0]);

	if (!target) return fail(404, { error: 'Description not found' });
	if (target.user_id !== session.user.id)
		return fail(403, { error: "Cannot edit another user's description" });

	const trimmed_body = body.trim();
	const trimmed_example = example?.trim() || null;

	await db
		.update(description)
		.set({
			body: trimmed_body,
			example: trimmed_example,
			created_at: sql`(cast(unixepoch('subsecond') * 1000 as integer))`
		})
		.where(eq(description.id, description_id));
});

const delete_schema = v.object({
	description_id: v.pipe(v.string(), v.nonEmpty())
});

export const delete_submission = form(delete_schema, async ({ description_id }) => {
	const session = await get_session();

	const target = await db
		.select({ user_id: description.user_id })
		.from(description)
		.where(eq(description.id, description_id))
		.limit(1)
		.then((r) => r[0]);

	if (!target) return fail(404, { error: 'Description not found' });
	if (target.user_id !== session.user.id)
		return fail(403, { error: "Cannot delete another user's description" });

	await db.delete(description).where(eq(description.id, description_id));
});
