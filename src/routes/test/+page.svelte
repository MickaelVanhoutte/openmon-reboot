<script lang="ts">
  import GameStart from '$lib/components/game/game-start.svelte';
  import { getDataById } from '$lib/db';
  import type { GameData } from '$lib/game/data.model';
  import {
    onGoogleScriptLoad,
    decodeJwtResponse,
    getUser,
    isAuthorized,
    type User,
  } from '$lib/google-auth';
  import { onMount } from 'svelte';

  let gameData: GameData;
  let user: User;
  let authorized: boolean;
  let indexedData: GameData | undefined;

  function fetchFromStatics() {
    console.log('fetching from statics');
    fetch('final/game-data.json')
      .then((response) => response.json())
      .then((data) => {
        gameData = data;
        console.log(data);
      });
  }

  onMount(() => {
    onGoogleScriptLoad(decodeJwtResponse);
    user = getUser();
    authorized = isAuthorized(user);
    if (user && !authorized) {
      window.location.href = '/';
    } else {
      getDataById(1).subscribe({
        next: (data) => {
          if (data) {
            gameData = data;
            indexedData = { ...data };
            console.log(data);
          } else {
            fetchFromStatics();
          }
        },
        error: (error) => {
          console.error(error);
          fetchFromStatics();
        },
      });
    }
  });
</script>

{#if user && authorized && gameData}
  <GameStart debug={true} {gameData} />
{:else if !user}
  <div id="googleSignIn"></div>
{/if}
