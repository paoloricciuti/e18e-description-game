import { fail } from '@sveltejs/kit';
import { form, query } from '$app/server';
import { and, count, desc, eq, sql } from 'drizzle-orm';
import { get_session } from '$lib/auth.remote';
import { db } from '$lib/server/db';
import { description, upvote, user } from '$lib/server/db/schema';
import * as v from 'valibot';

const PAGE_SIZE = 20;

export const get_descriptions = query(v.number(), async (page = 1) => {
	const session = await get_session();

	const rows = await db
		.select({
			id: description.id,
			module_id: description.module_id,
			body: description.body,
			example: description.example,
			created_at: description.created_at,
			author_id: user.id,
			author_name: user.name,
			author_image: user.image,
			upvote_count: count(upvote.id)
		})
		.from(description)
		.innerJoin(user, eq(user.id, description.user_id))
		.leftJoin(upvote, eq(upvote.description_id, description.id))
		.groupBy(description.id)
		.orderBy(desc(count(upvote.id)), desc(description.created_at))
		.limit(PAGE_SIZE)
		.offset((page - 1) * PAGE_SIZE);

	// Fetch viewer's upvotes in a separate query
	const viewer_upvotes = await db
		.select({ description_id: upvote.description_id })
		.from(upvote)
		.where(eq(upvote.user_id, session.user.id));

	const viewer_upvoted_set = new Set(viewer_upvotes.map((r) => r.description_id));

	const total_count = await db
		.select({ count: sql<number>`count(*)` })
		.from(description)
		.then((r) => r[0]?.count ?? 0);

	return {
		descriptions: rows.map((r) => ({
			...r,
			viewer_has_upvoted: viewer_upvoted_set.has(r.id)
		})),
		page,
		total: total_count,
		page_size: PAGE_SIZE,
		viewer_id: session.user.id
	};
});

const toggle_upvote_schema = v.object({
	description_id: v.pipe(v.string(), v.nonEmpty())
});

export const toggle_upvote = form(toggle_upvote_schema, async ({ description_id }) => {
	const session = await get_session();

	// Prevent self-upvote
	const target = await db
		.select({ user_id: description.user_id })
		.from(description)
		.where(eq(description.id, description_id))
		.limit(1)
		.then((r) => r[0]);

	if (!target) return fail(404, { error: 'Description not found' });
	if (target.user_id === session.user.id)
		return fail(403, { error: 'Cannot upvote your own description' });

	// Toggle: delete if exists, insert if not
	const existing = await db
		.select({ id: upvote.id })
		.from(upvote)
		.where(and(eq(upvote.user_id, session.user.id), eq(upvote.description_id, description_id)))
		.limit(1)
		.then((r) => r[0]);

	if (existing) {
		await db.delete(upvote).where(eq(upvote.id, existing.id));
	} else {
		await db.insert(upvote).values({ user_id: session.user.id, description_id });
	}
});
