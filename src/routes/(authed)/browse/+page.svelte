<script lang="ts">
	import { get_descriptions, toggle_upvote } from './browse.remote';

	let page = $state(1);

	let data = $derived(await get_descriptions(page));

	function download_description(desc: {
		module_id: string;
		body: string;
		example: string | null;
		author_name: string;
		upvote_count: number;
	}) {
		const sanitized = desc.module_id.replace(/[^a-zA-Z0-9]/g, '_');
		const json = JSON.stringify(
			{
				module_id: desc.module_id,
				description: desc.body,
				example: desc.example,
				author: desc.author_name,
				upvotes: desc.upvote_count
			},
			null,
			2
		);
		const blob = new Blob([json], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${sanitized}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}

	const total_pages = $derived(Math.ceil(data.total / data.page_size));
</script>

<div class="browse">
	<header class="page-header">
		<div class="header-title">
			<h1>BROWSE DESCRIPTIONS</h1>
		</div>
		<div class="header-stats">
			<span class="stat-number">{data.total}</span>
			<span class="stat-label">ENTRIES</span>
		</div>
	</header>

	<ul class="description-list">
		{#each data.descriptions as desc (desc.id)}
			<li class="entry">
				<div class="entry-top">
					<h2 class="module-id">{desc.module_id}</h2>
					<form {...toggle_upvote.for(desc.id)}>
						<input {...toggle_upvote.fields.description_id.as('hidden', desc.id)} />
						<button
							type="submit"
							disabled={desc.author_id === data.viewer_id}
							class="upvote-btn"
							class:upvoted={desc.viewer_has_upvoted}
							aria-label="Upvote"
						>
							▲ {desc.upvote_count}
						</button>
					</form>
				</div>

				<p class="body">{desc.body}</p>

				{#if desc.example !== null}
					<pre><code>{desc.example}</code></pre>
				{/if}

				<div class="entry-bottom">
					<div class="author">
						{#if desc.author_image !== null}
							<img src={desc.author_image} alt={desc.author_name} class="avatar" />
						{/if}
						<span class="author-name">{desc.author_name}</span>
					</div>

					<button type="button" class="download-btn" onclick={() => download_description(desc)}>
						↓ DOWNLOAD
					</button>
				</div>
			</li>
		{/each}
	</ul>

	<nav class="pagination">
		<button type="button" class="page-btn" onclick={() => page--} disabled={page === 1}>
			<span class="btn-long">← PREVIOUS</span>
			<span class="btn-short">←</span>
		</button>

		<span class="page-info">PAGE {page} OF {total_pages}</span>

		<button type="button" class="page-btn" onclick={() => page++} disabled={page === total_pages}>
			<span class="btn-long">NEXT →</span>
			<span class="btn-short">→</span>
		</button>
	</nav>
</div>

<style>
	.browse {
		max-width: 900px;
		margin: 0 auto;
		padding: 0 1.5rem 3rem;
	}

	/* ── PAGE HEADER ─────────────────────────────────────── */
	.page-header {
		border-top: 2px solid var(--black);
		border-bottom: 2px solid var(--black);
		display: flex;
		align-items: stretch;
		justify-content: space-between;
		margin-bottom: 0;
	}

	.header-title {
		border-left: 8px solid var(--red);
		padding: 1.5rem 2rem 1.5rem 1.25rem;
		flex: 1;
	}

	.header-title h1 {
		font-family: 'Barlow Condensed', sans-serif;
		font-weight: 900;
		font-size: clamp(2rem, 5vw, 3.5rem);
		line-height: 1;
		margin: 0;
		letter-spacing: -0.02em;
		color: var(--black);
		text-transform: uppercase;
	}

	.header-stats {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: center;
		padding: 1.5rem 0 1.5rem 2rem;
		border-left: 2px solid var(--black);
		min-width: 120px;
	}

	.stat-number {
		font-family: 'Barlow Condensed', sans-serif;
		font-weight: 900;
		font-size: clamp(2.5rem, 6vw, 4rem);
		line-height: 1;
		color: var(--black);
	}

	.stat-label {
		font-family: 'Barlow Condensed', sans-serif;
		font-weight: 700;
		font-size: 0.75rem;
		letter-spacing: 0.12em;
		color: var(--black);
		text-transform: uppercase;
	}

	/* ── DESCRIPTION LIST ────────────────────────────────── */
	.description-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.entry {
		border-bottom: 2px solid var(--black);
		padding: 1.5rem 0;
	}

	/* ── ENTRY TOP ROW ───────────────────────────────────── */
	.entry-top {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 0.75rem;
		flex-wrap: wrap;
	}

	.module-id {
		font-family: 'Barlow Condensed', sans-serif;
		font-weight: 900;
		font-size: 1.5rem;
		line-height: 1.1;
		margin: 0;
		color: var(--black);
		letter-spacing: -0.01em;
		word-break: break-all;
	}

	/* ── UPVOTE BUTTON ───────────────────────────────────── */
	.upvote-btn {
		font-family: 'Barlow Condensed', sans-serif;
		font-weight: 700;
		font-size: 0.9rem;
		letter-spacing: 0.05em;
		padding: 0.35rem 0.75rem;
		border: 2px solid var(--black);
		background: var(--white);
		color: var(--black);
		cursor: pointer;
		transition: none;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.upvote-btn:hover:not(:disabled) {
		background: var(--black);
		color: var(--white);
	}

	.upvote-btn.upvoted {
		background: var(--red);
		color: var(--white);
		border-color: var(--red);
	}

	.upvote-btn.upvoted:hover:not(:disabled) {
		background: var(--black);
		border-color: var(--black);
		color: var(--white);
	}

	.upvote-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	/* ── BODY TEXT ───────────────────────────────────────── */
	.body {
		font-family: 'Barlow', sans-serif;
		font-weight: 400;
		font-size: 1rem;
		line-height: 1.6;
		margin: 0 0 1rem;
		color: var(--black);
	}

	/* ── CODE BLOCK ──────────────────────────────────────── */
	pre {
		background: var(--code-bg);
		border-left: 4px solid var(--black);
		padding: 1rem 1.25rem;
		overflow-x: auto;
		margin: 0 0 1rem;
		border-radius: 0;
	}

	code {
		font-family: 'Courier New', Courier, monospace;
		font-size: 0.875rem;
		line-height: 1.5;
		color: var(--black);
	}

	/* ── ENTRY BOTTOM ROW ────────────────────────────────── */
	.entry-bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 0.5rem;
	}

	.author {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.avatar {
		width: 24px;
		height: 24px;
		border-radius: 0;
		object-fit: cover;
		border: 1px solid var(--black);
		flex-shrink: 0;
	}

	.author-name {
		font-family: 'Barlow Condensed', sans-serif;
		font-weight: 700;
		font-size: 0.8rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--black);
	}

	/* ── DOWNLOAD BUTTON ─────────────────────────────────── */
	.download-btn {
		font-family: 'Barlow Condensed', sans-serif;
		font-weight: 700;
		font-size: 0.8rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		padding: 0;
		border: none;
		background: transparent;
		color: var(--black);
		cursor: pointer;
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.download-btn:hover {
		color: var(--red);
	}

	/* ── PAGINATION ──────────────────────────────────────── */
	.pagination {
		border-top: 2px solid var(--black);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 0;
		margin-top: 0;
	}

	.page-btn {
		font-family: 'Barlow Condensed', sans-serif;
		font-weight: 700;
		font-size: 0.9rem;
		letter-spacing: 0.08em;
		padding: 0.5rem 1.25rem;
		border: 2px solid var(--black);
		background: var(--white);
		color: var(--black);
		cursor: pointer;
		transition: none;
		text-transform: uppercase;
	}

	.page-btn:hover:not(:disabled) {
		background: var(--black);
		color: var(--white);
	}

	.page-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.page-info {
		font-family: 'Barlow Condensed', sans-serif;
		font-weight: 700;
		font-size: 0.9rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--black);
	}

	/* ── RESPONSIVE ──────────────────────────────────────── */
	.btn-short {
		display: none;
	}

	@media (max-width: 640px) {
		.browse {
			padding: 0 1rem 2rem;
		}

		.page-header {
			flex-direction: column;
		}

		.header-stats {
			border-left: none;
			border-top: 2px solid var(--black);
			flex-direction: row;
			align-items: baseline;
			gap: 0.5rem;
			padding: 0.75rem 0 0.75rem 1.25rem;
			min-width: 0;
		}

		.entry-top {
			flex-wrap: wrap;
		}

		.btn-long {
			display: none;
		}

		.btn-short {
			display: inline;
		}

		.page-btn {
			padding: 0.5rem 0.875rem;
		}
	}
</style>
