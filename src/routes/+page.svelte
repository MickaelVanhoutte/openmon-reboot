<script lang="ts">
    import { onMount } from 'svelte';
    import { decodeJwtResponse, onGoogleScriptLoad, getUser } from '$lib';

    let user = null;
  
    onMount(() => {
        onGoogleScriptLoad(decodeJwtResponse);
        user = getUser();
    });
</script>

{#if user}
    <p>Logged in as {user.email}</p>
{:else}

<div id="googleSignIn"></div>

{/if}