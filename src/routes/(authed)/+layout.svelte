<script lang="ts">
	import { get_session, logout } from '$lib/auth.remote';

	let { children } = $props();

	const year = new Date().getFullYear();

	const session = $derived(await get_session());
</script>

<header>
	<div class="logo-group">
		<a href="/" class="logo">E18E</a>
		<div class="red-square" aria-hidden="true">■</div>
	</div>
	<nav>
		<a href="/">GAME</a>
		<span class="sep">·</span>
		<a href="/browse">BROWSE</a>
		<span class="sep">·</span>
		<a href="/leaderboard">LEADERBOARD</a>
		<span class="sep">·</span>
		<a href="/my-submissions">MINE</a>
		<span class="sep">·</span>
		{#if session.user}
			<form {...logout}>
				<button type="submit" class="btn btn-logout">LOGOUT</button>
			</form>
		{/if}
	</nav>
</header>

{@render children()}

<footer>
	<span>CATALOG ENTRY</span>
	<span class="sep">/</span>
	<span>e18e.dev</span>
	<span class="sep">/</span>
	<span>{year}</span>
</footer>

<style>
	header {
		position: sticky;
		top: 0;
		z-index: 100;
		background: var(--white);
		border-bottom: 4px solid var(--black);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 2rem;
	}

	.logo-group {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.logo {
		font-family: var(--font-display);
		font-weight: 900;
		font-size: clamp(2.5rem, 5vw, 4.5rem);
		line-height: 1;
		text-decoration: none;
		letter-spacing: -0.02em;
	}

	.red-square {
		width: 2rem;
		height: 2rem;
		background: var(--red);
		flex-shrink: 0;
		font-size: 0;
	}

	nav {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	button {
		all: unset;
		cursor: pointer;
	}

	nav :is(a, button) {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.85rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		text-decoration: none;
	}

	nav :is(a, button):hover {
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.sep {
		color: var(--red);
		font-weight: 700;
	}

	footer {
		border-top: 2px solid var(--black);
		padding: 0.6rem 2rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-display);
		font-weight: 300;
		font-size: 0.7rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	footer .sep {
		color: var(--red);
	}

	@media (max-width: 600px) {
		.red-square {
			display: none;
		}

		nav a {
			font-size: 0.65rem;
		}

		header {
			padding: 0.5rem 1rem;
		}

		footer {
			padding: 0.6rem 1rem;
		}
	}
</style>
