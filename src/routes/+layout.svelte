<script>
	import './+layout.css';
	import '@fontsource/barlow-condensed/300.css';
	import '@fontsource/barlow-condensed/700.css';
	import '@fontsource/barlow-condensed/900.css';
	import '@fontsource/barlow/300.css';
	import '@fontsource/barlow/400.css';
	import '@fontsource/barlow/600.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<title>E18E Description Game</title>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
