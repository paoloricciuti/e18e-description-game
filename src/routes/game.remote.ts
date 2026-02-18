import { form, query } from '$app/server';
import { eq, and, sql } from 'drizzle-orm';
import * as v from 'valibot';
import { get_session } from '$lib/auth.remote';
import { db } from '$lib/server/db';
import { description, user_progress } from '$lib/server/db/schema';
import { ORDERED_IDS, TOTAL, get_replacement } from '$lib/replacements';

async function get_next_module_id(user_id: string) {
	const done = await db
		.select({ module_id: user_progress.module_id })
		.from(user_progress)
		.where(eq(user_progress.user_id, user_id));

	const done_set = new Set(done.map((r) => r.module_id));

	for (const id of ORDERED_IDS) {
		if (!done_set.has(id)) return { id, done_set };
	}

	// All done — wrap around
	return { id: ORDERED_IDS[0], done_set };
}

export const get_current = query(async () => {
	const session = await get_session();

	const { id: module_id, done_set } = await get_next_module_id(session.user.id);
	const replacement = get_replacement(module_id);

	const submitted_count = await db
		.select({ count: sql<number>`count(*)` })
		.from(user_progress)
		.where(and(eq(user_progress.user_id, session.user.id), eq(user_progress.status, 'submitted')))
		.then((r) => r[0]?.count ?? 0);

	const skipped_count = await db
		.select({ count: sql<number>`count(*)` })
		.from(user_progress)
		.where(and(eq(user_progress.user_id, session.user.id), eq(user_progress.status, 'skipped')))
		.then((r) => r[0]?.count ?? 0);

	return {
		module_id,
		replacement,
		progress: {
			done: done_set.size,
			submitted: submitted_count,
			skipped: skipped_count,
			total: TOTAL,
			wrapped: done_set.size >= TOTAL
		}
	};
});

const submit_schema = v.object({
	module_id: v.pipe(v.string(), v.nonEmpty()),
	body: v.pipe(v.string(), v.nonEmpty('Description is required')),
	example: v.optional(v.string())
});

export const submit = form(submit_schema, async ({ module_id, body, example }) => {
	const session = await get_session();

	const trimmed_body = body.trim();
	const trimmed_example = example?.trim() || null;

	await db.transaction(async (tx) => {
		await tx
			.insert(description)
			.values({ user_id: session.user.id, module_id, body: trimmed_body, example: trimmed_example })
			.onConflictDoUpdate({
				target: [description.user_id, description.module_id],
				set: {
					body: trimmed_body,
					example: trimmed_example,
					created_at: sql`(cast(unixepoch('subsecond') * 1000 as integer))`
				}
			});

		await tx
			.insert(user_progress)
			.values({ user_id: session.user.id, module_id, status: 'submitted' })
			.onConflictDoUpdate({
				target: [user_progress.user_id, user_progress.module_id],
				set: { status: 'submitted' }
			});
	});
});

const skip_schema = v.object({
	module_id: v.pipe(v.string(), v.nonEmpty())
});

export const skip = form(skip_schema, async ({ module_id }) => {
	const session = await get_session();

	await db
		.insert(user_progress)
		.values({ user_id: session.user.id, module_id, status: 'skipped' })
		.onConflictDoUpdate({
			target: [user_progress.user_id, user_progress.module_id],
			set: { status: 'skipped' }
		});
});
