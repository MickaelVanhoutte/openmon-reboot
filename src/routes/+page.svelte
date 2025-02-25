<script lang="ts">
    import { onMount } from 'svelte';
    import { decodeJwtResponse, onGoogleScriptLoad } from '$lib';

    export let data;
    //let { user } = $props();
  
    onMount(() => {
        onGoogleScriptLoad(decodeJwtResponse);
    });
</script>

{#if data.user}
    <p>Logged in as {data.user.email}</p>
{:else}

<div id="googleSignIn"></div>

{/if}