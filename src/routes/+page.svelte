<script lang="ts">
  import { fly } from 'svelte/transition';
  import GameStart from '$lib/components/game/game-start.svelte';
  import { getDataById } from '$lib/db';
  import type { GameData } from '$lib/game/data.model';
  import { onMount } from 'svelte';

  let gameData: GameData;
  let indexedData: GameData | undefined;
  let ready = false;

  function fetchFromStatics() {
    console.log('fetching from statics');
    fetch('final/game-data.json')
      .then((response) => response.json())
      .then((data) => {
        gameData = data;
        ready = true;
      });
  }

  onMount(() => {
    getDataById(1).subscribe({
      next: (data) => {
        if (data) {
          gameData = data;
          indexedData = { ...data };
          ready = true;
        } else {
          fetchFromStatics();
        }
      },
      error: (error) => {
        console.error(error);
        fetchFromStatics();
      },
    });
  });
</script>

{#if gameData && ready}
  <div transition:fly={{ y: 200, duration: 2000 }}>
    <GameStart debug={false} {gameData} />
  </div>
{:else if ready}
  <p>No game data found</p>
{/if}
