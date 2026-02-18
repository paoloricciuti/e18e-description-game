<script lang="ts">
	import { login } from '$lib/auth.remote';
</script>

<h1>Login</h1>
<form {...login}>
	<button>Sign in with GitHub</button>
</form>
