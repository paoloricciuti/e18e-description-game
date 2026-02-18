<script lang="ts">
	import { get_current, skip, skip_to_first_missing, submit } from '../game.remote';

	let data = $derived(await get_current());
	let details_open = $state(false);
</script>

<div class="page">
	<div class="grid">
		<!-- LEFT COLUMN: Module identification -->
		<div class="col col-left">
			<div class="type-tag">{data.replacement.type.toUpperCase()}</div>

			<h1 class="module-name">{data.module_id}</h1>

			{#if data.mappings.length > 0}
				<div class="replaces-section">
					<div class="section-label">REPLACES</div>
					<hr class="section-rule replaces-rule" />
					<div class="replaces-chips">
						{#each data.mappings as pkg (pkg)}
							<span class="replaces-chip">{pkg}</span>
						{/each}
					</div>
				</div>
			{/if}

			{#if data.progress.wrapped}
				<div class="wrapped-banner">▲ YOU HAVE DESCRIBED ALL MODULES — STARTING OVER</div>
			{/if}

			<details class="data-details" bind:open={details_open}>
				<summary class="data-summary">
					{details_open ? '▾' : '▸'} FULL OBJECT DATA
				</summary>
				<pre class="data-pre">{JSON.stringify(data.replacement, null, 2)}</pre>
			</details>

			{#if 'description' in data.replacement}
				<div class="hint-block">
					<span class="hint-dash">—</span>
					<p class="hint-text">{data.replacement.description}</p>
				</div>
			{/if}

			{#if 'url' in data.replacement && data.replacement.url !== undefined && typeof data.replacement.url === 'string'}
				<div class="ref-block">
					<span class="ref-label">REF</span>
					<a class="ref-link" href={data.replacement.url} target="_blank" rel="noopener noreferrer"
						>{data.replacement.url}</a
					>
				</div>
			{/if}
		</div>

		<!-- RIGHT COLUMN: Progress + Form -->
		<div class="col col-right">
			<!-- Progress subsection -->
			<div class="progress-section">
				<div class="section-label">PROGRESS</div>
				<hr class="section-rule" />
				<div class="progress-numbers">
					<span class="progress-done">{data.progress.done}</span>
					<span class="progress-sep">/</span>
					<span class="progress-total">{data.progress.total}</span>
				</div>
				<div class="progress-bar-wrap">
					<div
						class="progress-bar-fill"
						style="width: {data.progress.total > 0
							? (data.progress.done / data.progress.total) * 100
							: 0}%"
					></div>
				</div>
				<div class="progress-stats">
					<span>{data.progress.submitted} SUBMITTED</span>
					<span class="red-dot">·</span>
					<span>{data.progress.skipped} SKIPPED</span>
				</div>
			</div>

			<!-- Form subsection -->
			<div class="form-section">
				<form {...submit}>
					<input {...submit.fields.module_id.as('hidden', data.module_id)} />

					<div class="field">
						<div class="field-header">
							<span class="field-num">01</span>
							<label class="field-label" for="body">DESCRIPTION</label>
						</div>
						<div class="field-rule"></div>
						<textarea
							id="body"
							class="field-textarea"
							placeholder="Write a human-readable description..."
							{...submit.fields.body.as('text')}
						></textarea>
					</div>

					<div class="field">
						<div class="field-header">
							<span class="field-num">02</span>
							<label class="field-label" for="example">CODE EXAMPLE</label>
						</div>
						<div class="field-rule"></div>
						<textarea
							id="example"
							{...submit.fields.example.as('text')}
							class="field-textarea field-textarea--mono"
							placeholder="Optional code example..."
						></textarea>
					</div>

					<button type="submit" class="btn btn-submit">SUBMIT DESCRIPTION →</button>
				</form>

				<form {...skip}>
					<input {...skip.fields.module_id.as('hidden', data.module_id)} />
					<button type="submit" class="btn btn-skip">SKIP</button>
				</form>

				<form {...skip_to_first_missing}>
					<button type="submit" class="btn btn-skip">SKIP TO FIRST MISSING →</button>
				</form>
			</div>
		</div>
	</div>
</div>

<style>
	.page {
		border-top: 2px solid var(--black);
	}

	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		min-height: calc(100vh - 2px);
	}

	/* ——— COLUMNS ——— */
	.col {
		padding: 2.5rem 2rem;
	}

	.col-left {
		border-left: 8px solid var(--red);
		border-right: 2px solid var(--black);
	}

	.col-right {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	/* ——— LEFT COL ——— */
	.type-tag {
		display: inline-block;
		background: var(--black);
		color: var(--white);
		font-family: 'Barlow Condensed', sans-serif;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		padding: 0.25rem 0.6rem;
		margin-bottom: 1.25rem;
	}

	.module-name {
		font-family: 'Barlow Condensed', sans-serif;
		font-weight: 900;
		font-size: clamp(2.5rem, 6vw, 5.5rem);
		line-height: 0.95;
		word-break: break-all;
		color: var(--black);
		margin: 0 0 1.5rem 0;
		text-transform: none;
	}

	/* Replaces section */
	.replaces-section {
		margin-bottom: 1.5rem;
	}

	.replaces-rule {
		margin-bottom: 0.75rem;
	}

	.replaces-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.replaces-chip {
		display: inline-block;
		background: var(--code-bg);
		color: var(--black);
		font-family: 'Courier New', Courier, monospace;
		font-size: 0.72rem;
		font-weight: 400;
		letter-spacing: 0.03em;
		padding: 0.2rem 0.5rem;
		border: 1px solid var(--black);
	}

	.wrapped-banner {
		background: var(--red);
		color: var(--white);
		font-family: 'Barlow Condensed', sans-serif;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		padding: 0.6rem 0.9rem;
		margin-bottom: 1.5rem;
	}

	/* Details / JSON */
	.data-details {
		border: 2px solid var(--black);
		margin-bottom: 1.5rem;
	}

	.data-summary {
		font-family: 'Barlow Condensed', sans-serif;
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		cursor: pointer;
		padding: 0.5rem 0.75rem;
		list-style: none;
		user-select: none;
		background: var(--white);
		color: var(--black);
	}

	.data-summary::-webkit-details-marker {
		display: none;
	}

	.data-pre {
		font-size: 0.72rem;
		line-height: 1.5;
		padding: 0.75rem;
		margin: 0;
		border-top: 2px solid var(--black);
		background: var(--code-bg);
		overflow-x: auto;
		white-space: pre-wrap;
		word-break: break-all;
	}

	/* Hint */
	.hint-block {
		display: flex;
		gap: 0.75rem;
		align-items: flex-start;
		margin-bottom: 1.25rem;
	}

	.hint-dash {
		font-size: 2rem;
		font-weight: 900;
		color: var(--red);
		line-height: 1;
		flex-shrink: 0;
		margin-top: -0.1rem;
	}

	.hint-text {
		font-family: 'Barlow', sans-serif;
		font-weight: 300;
		font-size: 0.95rem;
		line-height: 1.5;
		color: var(--black);
		margin: 0;
	}

	/* Ref */
	.ref-block {
		display: flex;
		align-items: baseline;
		gap: 0.75rem;
	}

	.ref-label {
		font-family: 'Barlow Condensed', sans-serif;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		background: var(--black);
		color: var(--white);
		padding: 0.15rem 0.4rem;
		flex-shrink: 0;
	}

	.ref-link {
		font-family: 'Barlow', sans-serif;
		font-size: 0.82rem;
		color: var(--black);
		word-break: break-all;
		text-decoration: underline;
	}

	.ref-link:hover {
		color: var(--red);
	}

	/* ——— RIGHT COL ——— */
	.progress-section {
		padding: 2.5rem 2rem 2rem;
		border-bottom: 2px solid var(--black);
	}

	.section-label {
		font-family: 'Barlow Condensed', sans-serif;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		color: var(--black);
		margin-bottom: 0.4rem;
	}

	.section-rule {
		border: none;
		border-top: 2px solid var(--black);
		margin: 0 0 1.25rem 0;
	}

	.progress-numbers {
		display: flex;
		align-items: baseline;
		gap: 0.4rem;
		margin-bottom: 1rem;
		font-family: 'Barlow Condensed', sans-serif;
		line-height: 1;
	}

	.progress-done {
		font-size: 4rem;
		font-weight: 900;
		color: var(--black);
	}

	.progress-sep {
		font-size: 2.5rem;
		font-weight: 300;
		color: var(--black);
	}

	.progress-total {
		font-size: 4rem;
		font-weight: 900;
		color: var(--red);
	}

	.progress-bar-wrap {
		width: 100%;
		height: 1.25rem;
		border: 2px solid var(--black);
		margin-bottom: 0.75rem;
		background: transparent;
		box-sizing: border-box;
	}

	.progress-bar-fill {
		height: 100%;
		background: var(--black);
		transition: none;
	}

	.progress-stats {
		font-family: 'Barlow Condensed', sans-serif;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		color: var(--black);
		display: flex;
		gap: 0.4rem;
		align-items: center;
	}

	.red-dot {
		color: var(--red);
		font-size: 1.1em;
	}

	/* Form section */
	.form-section {
		padding: 2rem 2rem 2.5rem;
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.field {
		margin-bottom: 1.5rem;
	}

	.field-header {
		display: flex;
		align-items: baseline;
		gap: 0.6rem;
		margin-bottom: 0.3rem;
	}

	.field-num {
		font-family: 'Barlow Condensed', sans-serif;
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--red);
		letter-spacing: 0.05em;
	}

	.field-label {
		font-family: 'Barlow Condensed', sans-serif;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		color: var(--black);
	}

	.field-rule {
		height: 2px;
		background: var(--black);
		margin-bottom: 0.5rem;
	}

	.field-textarea {
		width: 100%;
		min-height: 7rem;
		padding: 0.6rem 0.75rem;
		background: var(--white);
		border: 2px solid var(--black);
		border-radius: 0;
		font-family: 'Barlow', sans-serif;
		font-size: 0.9rem;
		color: var(--black);
		resize: vertical;
		box-sizing: border-box;
		outline: none;
	}

	.field-textarea:focus {
		border-color: var(--red);
	}

	.field-textarea--mono {
		font-family: 'Courier New', Courier, monospace;
		font-size: 0.82rem;
	}

	/* Buttons */
	.btn {
		display: block;
		width: 100%;
		padding: 0.9rem 1rem;
		border: 2px solid var(--black);
		border-radius: 0;
		font-family: 'Barlow Condensed', sans-serif;
		font-size: 0.85rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		cursor: pointer;
		text-align: center;
		box-sizing: border-box;
	}

	.btn-submit {
		background: var(--black);
		color: var(--white);
		margin-bottom: 0.5rem;
	}

	.btn-submit:hover {
		background: var(--white);
		color: var(--black);
	}

	.btn-skip {
		background: var(--white);
		color: var(--black);
		margin-bottom: 0.5rem;
	}

	.btn-skip:hover {
		background: var(--black);
		color: var(--white);
	}

	/* ——— RESPONSIVE ——— */
	@media (max-width: 900px) {
		.grid {
			grid-template-columns: 1fr;
		}

		.col-left {
			border-right: none;
		}

		.col-right {
			border-right: none;
		}

		.col {
			padding: 1.5rem 1rem;
		}

		.progress-section {
			padding: 1.5rem 1rem 1.25rem;
		}

		.form-section {
			padding: 1.25rem 1rem 2rem;
		}
	}
</style>
