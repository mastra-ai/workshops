<script lang="ts">
	import '$lib/css/fonts.css';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<title>Self-Hosting Stack Advisor</title>
  <meta
    name="description"
    content="Supervisor agent demo for turning self-hosting requests into tailored stack recommendations."
  />
	<link rel="icon" href={favicon} />
</svelte:head>
{@render children()}
