<script lang="ts">
	import { get_my_submissions, edit_submission, delete_submission } from './my-submissions.remote';

	let page = $state(1);
	let editing_id = $state<string | null>(null);
	let edit_body = $state('');
	let edit_example = $state('');

	let data = $derived(await get_my_submissions(page));

	const total_pages = $derived(Math.ceil(data.total / data.page_size));

	function start_edit(id: string, body: string, example: string | null) {
		editing_id = id;
		edit_body = body;
		edit_example = example ?? '';
	}

	function cancel_edit() {
		editing_id = null;
		edit_body = '';
		edit_example = '';
	}
</script>

<div class="my-submissions">
	<header class="page-header">
		<div class="header-title">
			<h1>MY SUBMISSIONS</h1>
		</div>
		<div class="header-stats">
			<span class="stat-number">{data.total}</span>
			<span class="stat-label">SUBMITTED</span>
		</div>
	</header>

	{#if data.submissions.length === 0}
		<div class="empty">
			<p>No submissions yet. Head to the <a href="/">game</a> to start contributing!</p>
		</div>
	{:else}
		<ul class="submission-list">
			{#each data.submissions as sub (sub.id)}
				<li class="entry">
					<div class="entry-top">
						<h2 class="module-id">{sub.module_id}</h2>
						<div class="entry-meta">
							<span class="upvote-count">▲ {sub.upvote_count}</span>
							<button
								type="button"
								class="edit-btn"
								onclick={() => start_edit(sub.id, sub.body, sub.example)}
							>
								EDIT
							</button>
							<form {...delete_submission.for(sub.id)}>
								<input {...delete_submission.fields.description_id.as('hidden', sub.id)} />
								<button type="submit" class="delete-btn">DELETE</button>
							</form>
						</div>
					</div>

					{#if editing_id === sub.id}
						<form
							{...edit_submission.for(sub.id)}
							onsubmit={() => (editing_id = null)}
							class="edit-form"
						>
							<input {...edit_submission.fields.description_id.as('hidden', sub.id)} />
							<div class="field">
								<label for="edit-body-{sub.id}" class="field-label">DESCRIPTION</label>
								<textarea
									id="edit-body-{sub.id}"
									{...edit_submission.fields.body.as('text')}
									bind:value={edit_body}
									class="field-input"
									rows={4}
									required
								></textarea>
							</div>
							<div class="field">
								<label for="edit-example-{sub.id}" class="field-label"
									>CODE EXAMPLE <span class="optional">(optional)</span></label
								>
								<textarea
									id="edit-example-{sub.id}"
									{...edit_submission.fields.example.as('text')}
									bind:value={edit_example}
									class="field-input field-code"
									rows={4}
								></textarea>
							</div>
							<div class="edit-actions">
								<button type="submit" class="save-btn">SAVE</button>
								<button type="button" class="cancel-btn" onclick={cancel_edit}>CANCEL</button>
							</div>
						</form>
					{:else}
						<p class="body">{sub.body}</p>
						{#if sub.example !== null}
							<pre><code>{sub.example}</code></pre>
						{/if}
					{/if}
				</li>
			{/each}
		</ul>

		{#if total_pages > 1}
			<nav class="pagination">
				<button type="button" class="page-btn" onclick={() => page--} disabled={page === 1}>
					<span class="btn-long">← PREVIOUS</span>
					<span class="btn-short">←</span>
				</button>
				<span class="page-info">PAGE {page} OF {total_pages}</span>
				<button
					type="button"
					class="page-btn"
					onclick={() => page++}
					disabled={page === total_pages}
				>
					<span class="btn-long">NEXT →</span>
					<span class="btn-short">→</span>
				</button>
			</nav>
		{/if}
	{/if}
</div>

<style>
	.my-submissions {
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

	/* ── EMPTY STATE ─────────────────────────────────────── */
	.empty {
		padding: 3rem 0;
		text-align: center;
		border-bottom: 2px solid var(--black);
	}

	.empty p {
		font-family: 'Barlow', sans-serif;
		font-size: 1rem;
		color: var(--black);
	}

	.empty a {
		color: var(--red);
		font-weight: 700;
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	/* ── SUBMISSION LIST ─────────────────────────────────── */
	.submission-list {
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

	.entry-meta {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-shrink: 0;
	}

	.upvote-count {
		font-family: 'Barlow Condensed', sans-serif;
		font-weight: 700;
		font-size: 0.9rem;
		letter-spacing: 0.05em;
		padding: 0.35rem 0.75rem;
		border: 2px solid var(--black);
		color: var(--black);
		background: transparent;
	}

	/* ── EDIT / DELETE BUTTONS ───────────────────────────── */
	.edit-btn,
	.delete-btn {
		font-family: 'Barlow Condensed', sans-serif;
		font-weight: 700;
		font-size: 0.8rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		padding: 0.35rem 0.75rem;
		border: 2px solid var(--black);
		background: var(--white);
		color: var(--black);
		cursor: pointer;
	}

	.edit-btn:hover {
		background: var(--black);
		color: var(--white);
	}

	.delete-btn {
		border-color: var(--red);
		color: var(--red);
	}

	.delete-btn:hover {
		background: var(--red);
		color: var(--white);
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

	/* ── EDIT FORM ───────────────────────────────────────── */
	.edit-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 0.5rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.field-label {
		font-family: 'Barlow Condensed', sans-serif;
		font-weight: 700;
		font-size: 0.75rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--black);
	}

	.optional {
		font-weight: 400;
		text-transform: none;
		letter-spacing: 0;
		color: #666;
	}

	.field-input {
		font-family: 'Barlow', sans-serif;
		font-size: 0.95rem;
		line-height: 1.5;
		padding: 0.6rem 0.75rem;
		border: 2px solid var(--black);
		background: var(--white);
		color: var(--black);
		resize: vertical;
		width: 100%;
		box-sizing: border-box;
	}

	.field-input:focus {
		outline: none;
		border-color: var(--red);
	}

	.field-code {
		font-family: 'Courier New', Courier, monospace;
		font-size: 0.875rem;
	}

	.edit-actions {
		display: flex;
		gap: 0.75rem;
	}

	.save-btn {
		font-family: 'Barlow Condensed', sans-serif;
		font-weight: 700;
		font-size: 0.85rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		padding: 0.5rem 1.5rem;
		border: 2px solid var(--black);
		background: var(--black);
		color: var(--white);
		cursor: pointer;
	}

	.save-btn:hover {
		background: var(--red);
		border-color: var(--red);
	}

	.cancel-btn {
		font-family: 'Barlow Condensed', sans-serif;
		font-weight: 700;
		font-size: 0.85rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		padding: 0.5rem 1.5rem;
		border: 2px solid var(--black);
		background: var(--white);
		color: var(--black);
		cursor: pointer;
	}

	.cancel-btn:hover {
		background: var(--black);
		color: var(--white);
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
		.my-submissions {
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
