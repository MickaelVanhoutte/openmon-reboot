<script lang="ts">
  import type { GameData } from '$lib/game/data.model';
  import { onMount } from 'svelte';
  import { createSave, getSaves, type Save } from '$lib/db';

  export let debug = false;
  export let gameData: GameData;

  let saves: Save[] = [];

  function newGame() {
    console.log('new game');
    createSave({
      created: Date.now(),
      updated: Date.now(),
    });
  }

  function continueSave(save: Save) {
    console.log('continue', save);
  }

  function removeSave(save: Save) {
    console.log('remove', save);
  }

  onMount(() => {
    getSaves().subscribe((value) => {
      saves = value || [];
    });
  });
</script>

{#if saves.length > 0}
  <ul role="list" class="divide-y divide-gray-100">
    {#each saves as save}
      <li class="flex justify-between gap-x-6 py-5">
        <div class="flex min-w-0 gap-x-4">
          <!-- <img class="size-12 flex-none rounded-full bg-gray-50" src={pokemon.image.sprite} alt="" /> -->
          <div class="min-w-0 flex-auto">
            <p class="text-m/6 font-semibold text-gray-900">{save.id}</p>
            <p class="mt-1 truncate text-s/5 text-gray-500 flex gap-6">
              <span class="flex gap-2">
                last update: {new Date(save.updated).toUTCString()}
              </span>
              <span class="flex gap-2">
                created: {new Date(save.created).toUTCString()}
              </span>
            </p>
          </div>
        </div>
        <div class="sm:flex sm:flex-col sm:items-end">
          <p on:click={() => continueSave(save)} class="text-m text-gray-900">Continue</p>
          <p on:click={() => removeSave(save)} class="mt-1 text-sm text-red-500">Delete</p>
        </div>
      </li>
    {/each}
  </ul>
{/if}

<button
  on:click={() => newGame()}
  class="rounded-md bg-indigo-600 px-3 py-2 text-[0.8125rem]/5 font-semibold text-white hover:bg-indigo-500 min-w-20"
>
  New game
</button>
