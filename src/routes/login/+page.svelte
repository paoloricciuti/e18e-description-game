<script lang="ts">
	import { login } from '$lib/auth.remote';
</script>

<div class="login-page">
	<div class="login-inner">
		<div class="col-headline">
			<div class="text-block">
				<span class="label-tag">ACCESS</span>
				<span class="label-sub">RESTRICTED</span>
				<p class="description">
					Sign in to begin cataloguing module replacements for the JavaScript ecosystem.
				</p>
			</div>
		</div>

		<div class="col-auth">
			<div class="auth-box">
				<div class="auth-badge">01 / AUTHENTICATION</div>
				<div class="auth-header">
					<span class="auth-label">AUTHENTICATION REQUIRED</span>
					<hr class="auth-rule" />
				</div>
				<form {...login} class="auth-form">
					<button type="submit" class="auth-btn">
						<span class="btn-prefix">[ GH ]</span>
						<span class="btn-text">SIGN IN WITH GITHUB →</span>
					</button>
				</form>
			</div>
		</div>
	</div>
</div>

<style>
	.login-page {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 60vh;
		border-top: 2px solid var(--black);
		padding: 3rem 2rem;
	}

	.login-inner {
		display: grid;
		grid-template-columns: 3fr 2fr;
		gap: 0;
		width: 100%;
		max-width: 1100px;
		align-items: stretch;
	}

	/* ── Left column ── */
	.col-headline {
		border-left: 8px solid var(--red);
		padding: 2rem 2.5rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.text-block {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.label-tag {
		font-family: 'Barlow Condensed', sans-serif;
		font-weight: 900;
		font-size: clamp(4rem, 12vw, 9rem);
		line-height: 0.9;
		color: var(--black);
		letter-spacing: -0.02em;
		text-transform: uppercase;
	}

	.label-sub {
		font-family: 'Barlow Condensed', sans-serif;
		font-weight: 900;
		font-size: clamp(2.5rem, 7vw, 5.5rem);
		line-height: 0.9;
		color: var(--black);
		letter-spacing: -0.02em;
		text-transform: uppercase;
	}

	.description {
		margin-top: 1.75rem;
		font-family: 'Barlow', sans-serif;
		font-weight: 300;
		font-size: 1rem;
		line-height: 1.6;
		color: var(--black);
		max-width: 38ch;
	}

	/* ── Right column ── */
	.col-auth {
		border-left: 2px solid var(--black);
		padding: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.auth-box {
		position: relative;
		border: 2px solid var(--black);
		padding: 2rem;
		width: 100%;
	}

	.auth-badge {
		position: absolute;
		top: -1px;
		right: -1px;
		font-family: 'Barlow Condensed', sans-serif;
		font-weight: 700;
		font-size: 0.65rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--white);
		background: var(--red);
		padding: 0.2rem 0.5rem;
	}

	.auth-header {
		margin-bottom: 1.75rem;
	}

	.auth-label {
		display: block;
		font-family: 'Barlow Condensed', sans-serif;
		font-weight: 700;
		font-size: 0.7rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--black);
		margin-bottom: 0.6rem;
	}

	.auth-rule {
		border: none;
		border-top: 2px solid var(--black);
		margin: 0;
	}

	.auth-form {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.auth-btn {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		width: 100%;
		background: var(--black);
		color: var(--white);
		border: 2px solid var(--black);
		padding: 0.85rem 1rem;
		cursor: pointer;
		font-family: 'Barlow Condensed', sans-serif;
		font-weight: 700;
		font-size: 0.85rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		transition: none;
	}

	.auth-btn:hover {
		background: var(--white);
		color: var(--black);
	}

	.btn-prefix {
		font-family: 'Barlow', sans-serif;
		font-weight: 700;
		opacity: 0.6;
		font-size: 0.75rem;
	}

	.btn-text {
		flex: 1;
		text-align: right;
	}

	/* ── Mobile ── */
	@media (max-width: 680px) {
		.login-inner {
			grid-template-columns: 1fr;
		}

		.col-auth {
			border-left: none;
			border-top: 2px solid var(--black);
			padding-top: 2rem;
		}

		.col-headline {
			padding: 1.5rem 1rem 1.5rem 1.5rem;
		}
	}
</style>
