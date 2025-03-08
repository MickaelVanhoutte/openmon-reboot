<script lang="ts">
  import { onMount } from 'svelte';
  //import { getSaves, createSave, deleteSave } from '$lib/db';
  //import type { Save } from '$lib/db';

  let saves= [];

  // const newGame = () => {
  //   createSave({ created: Date.now(), updated: Date.now() });
  //   updateSaves();
  // };

  // function updateSaves() {
  //   getSaves().subscribe((value) => {
  //     saves = value;
  //   });
  // }

  // function deleteS(id: number) {
  //   deleteSave(id);
  //   updateSaves();
  // }

  // onMount(() => {
  //   updateSaves();
  // });
</script>

{#if saves?.length > 0}
  <div class="flex flex-col items-center justify-center">
    <h1 class="text-3xl font-bold">Your Saves</h1>
    <ul class="flex flex-col items-center justify-center">
      {#each saves as save}
        <li class="flex flex-row items-center justify-center">
          <a href={`/${save.id}`} class="text-blue-500 underline">{save.id}</a>
          <button class="text-red-500" >Delete</button>
          <!-- on:click={() => deleteS(save.id as number)} -->
        </li>
      {/each}
    </ul>
  </div>
{:else}
  <div class="flex flex-col items-center justify-center">
    <h1 class="text-3xl font-bold">No Saves</h1>
    <button class="text-blue-500 underline">Start a new game !</button>
    <!--  on:click={newGame} -->
  </div>
{/if}
