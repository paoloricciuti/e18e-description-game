<script lang="ts">
	import { get_session, logout } from '$lib/auth.remote';

	let session = $derived(await get_session());
</script>

Hi {session.user.name}

<form {...logout}>
	<button>Logout</button>
</form>
