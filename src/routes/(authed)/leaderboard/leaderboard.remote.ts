import { query } from '$app/server';
import { countDistinct, eq, sql } from 'drizzle-orm';
import { get_session } from '$lib/auth.remote';
import { db } from '$lib/server/db';
import { description, upvote, user } from '$lib/server/db/schema';

export const get_leaderboard = query(async () => {
	const session = await get_session();

	const rows = await db
		.select({
			id: user.id,
			name: user.name,
			image: user.image,
			submission_count: countDistinct(description.id),
			upvotes_received: countDistinct(upvote.id),
			score: sql<number>`count(distinct ${description.id}) + count(distinct ${upvote.id})`
		})
		.from(user)
		.leftJoin(description, eq(description.user_id, user.id))
		.leftJoin(upvote, eq(upvote.description_id, description.id))
		.groupBy(user.id)
		.orderBy(sql`count(distinct ${description.id}) + count(distinct ${upvote.id}) desc`)
		.limit(50);

	return {
		entries: rows,
		viewer_id: session.user.id
	};
});
