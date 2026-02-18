<script lang="ts">
	import { get_leaderboard } from './leaderboard.remote';

	let data = $derived(await get_leaderboard());

	function rank_label(i: number) {
		return String(i + 1).padStart(2, '0');
	}

	function rank_size(i: number): 'gold' | 'silver' | 'bronze' | 'normal' {
		if (i === 0) return 'gold';
		if (i === 1) return 'silver';
		if (i === 2) return 'bronze';
		return 'normal';
	}
</script>

<section class="leaderboard">
	<header class="page-header">
		<div class="title-block">
			<h1>LEADERBOARD</h1>
		</div>
		<div class="subtitle-block">
			<span class="subtitle-line">TOP PERFORMERS</span>
			<span class="subtitle-line">MODULE CATALOGUING SYSTEM</span>
		</div>
	</header>

	{#if data.entries.length === 0}
		<div class="empty-state">
			<hr class="empty-rule" />
			<p class="empty-text">NO SCORES YET</p>
			<hr class="empty-rule" />
		</div>
	{:else}
		<div class="table-scroll">
			<table>
				<thead>
					<tr>
						<th class="col-rank">#</th>
						<th class="col-player">PLAYER</th>
						<th class="col-submissions hide-mobile">SUBMISSIONS</th>
						<th class="col-upvotes hide-mobile">UPVOTES</th>
						<th class="col-score">SCORE</th>
					</tr>
				</thead>
				<tbody>
					{#each data.entries as entry, i (entry.id)}
						{@const tier = rank_size(i)}
						{@const is_viewer = entry.id === data.viewer_id}
						<tr class="data-row" class:viewer={is_viewer}>
							<td class="rank-cell">
								<span class="rank-number rank-{tier}">{rank_label(i)}</span>
							</td>
							<td class="player-cell">
								{#if entry.image !== null}
									<img src={entry.image} alt={entry.name} class="avatar" />
								{/if}
								<span class="player-name" class:viewer-name={is_viewer}>{entry.name}</span>
							</td>
							<td class="hide-mobile">{entry.submission_count}</td>
							<td class="hide-mobile">{entry.upvotes_received}</td>
							<td class="score-cell">{entry.score}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</section>

<style>
	.leaderboard {
		border-top: 2px solid var(--black);
		padding: 0;
	}

	/* ── Page header ── */
	.page-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 2rem;
		padding: 2rem 2.5rem 2rem;
		border-bottom: 2px solid var(--black);
	}

	.title-block {
		border-left: 8px solid var(--red);
		padding-left: 1rem;
	}

	.title-block h1 {
		font-family: 'Barlow Condensed', sans-serif;
		font-weight: 900;
		font-size: clamp(3rem, 8vw, 6rem);
		line-height: 0.9;
		letter-spacing: -0.02em;
		color: var(--black);
		margin: 0;
		text-transform: uppercase;
	}

	.subtitle-block {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: flex-end;
		padding-bottom: 0.25rem;
		align-self: flex-end;
	}

	.subtitle-line {
		font-family: 'Barlow Condensed', sans-serif;
		font-weight: 400;
		font-size: 0.7rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--black);
		line-height: 1.6;
	}

	/* ── Table scroll wrapper ── */
	.table-scroll {
		overflow-x: auto;
	}

	/* ── Table base ── */
	table {
		width: 100%;
		border-collapse: collapse;
		font-family: 'Barlow', sans-serif;
	}

	/* ── Header row ── */
	thead tr {
		background: var(--black);
		color: var(--white);
	}

	thead th {
		font-family: 'Barlow Condensed', sans-serif;
		font-weight: 700;
		font-size: 0.7rem;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--white);
		padding: 0.75rem 1.25rem;
		text-align: left;
	}

	.col-rank {
		width: 4rem;
		text-align: center;
	}

	.col-score {
		text-align: right;
		padding-right: 2rem;
	}

	/* ── Body rows ── */
	.data-row td {
		padding: 0.85rem 1.25rem;
		border-bottom: 2px solid var(--black);
		vertical-align: middle;
	}

	.data-row:hover td {
		background: #e8e7e2;
	}

	/* Viewer highlight */
	.data-row.viewer td {
		background: #ececea;
	}

	.data-row.viewer td:first-child {
		border-left: 4px solid var(--red);
		padding-left: calc(1.25rem - 4px);
	}

	.data-row.viewer:hover td {
		background: #e0dfda;
	}

	/* ── Rank cell ── */
	.rank-cell {
		text-align: center;
		width: 4rem;
	}

	.rank-number {
		font-family: 'Barlow Condensed', sans-serif;
		font-weight: 900;
		line-height: 1;
	}

	.rank-gold {
		font-size: 2.25rem;
		color: var(--red);
	}

	.rank-silver {
		font-size: 1.6rem;
		color: var(--black);
	}

	.rank-bronze {
		font-size: 1.3rem;
		color: var(--black);
	}

	.rank-normal {
		font-size: 1rem;
		color: var(--black);
	}

	/* ── Player cell ── */
	.player-cell {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.avatar {
		width: 2rem;
		height: 2rem;
		border-radius: 0;
		object-fit: cover;
		flex-shrink: 0;
		border: 1.5px solid var(--black);
	}

	.player-name {
		font-family: 'Barlow', sans-serif;
		font-size: 1rem;
	}

	.player-name.viewer-name {
		color: var(--red);
		font-weight: 700;
	}

	/* ── Score cell ── */
	.score-cell {
		font-family: 'Barlow Condensed', sans-serif;
		font-weight: 900;
		font-size: 1.4rem;
		text-align: right;
		padding-right: 2rem;
		color: var(--black);
	}

	/* ── Empty state ── */
	.empty-state {
		padding: 4rem 2.5rem;
		text-align: center;
	}

	.empty-rule {
		border: none;
		border-top: 2px solid var(--red);
		margin: 1.25rem 0;
	}

	.empty-text {
		font-family: 'Barlow Condensed', sans-serif;
		font-weight: 300;
		font-size: clamp(2rem, 5vw, 3.5rem);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--black);
		margin: 0;
	}

	/* ── Responsive ── */
	@media (max-width: 640px) {
		.page-header {
			flex-direction: column;
			gap: 1rem;
			padding: 1.5rem 1.25rem;
		}

		.subtitle-block {
			align-items: flex-start;
		}

		.data-row td {
			padding: 0.75rem 0.75rem;
		}

		.hide-mobile {
			display: none;
		}

		thead th.hide-mobile {
			display: none;
		}
	}
</style>
