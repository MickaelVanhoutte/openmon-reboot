<script lang="ts">
    import { onMount } from "svelte";
    import SearchMoves from "./search-moves.svelte";
    import type { FullDexEntry, Move } from "$lib/pokedex/fulldex";

    export let pokeForm: FullDexEntry;
    $: movesByLevel = pokeForm.moves.filter((move) => move.method === '1')?.sort((a, b) => parseInt(a.level) - parseInt(b.level));

    let allMoves = [];
    let selected: Move | null = null;

    function remove(id: number){
        pokeForm.moves = pokeForm.moves.filter((move) => move.id !== id);
    }

    function addMove(){
      if(selected){
        pokeForm.moves = [...pokeForm.moves, {...selected, method: '1', level: '1'}];
        selected = null;
      }
    }

    onMount(() => {
        fetch("all-moves.json")
             .then((response) => response.json())
             .then((data) => {
                 allMoves = data;
             });
    });
</script>

<div class="flex h-16 items-center gap-5 gap-x-1">
  <div class="w-full md:w-1/2">
    <SearchMoves bind:selected bind:pokeForm/>
  </div>
  {#if selected}
    <button on:click={() => addMove()} class="rounded-md bg-indigo-600 w-1/2 px-3 py-2 text-[0.8125rem]/5 font-semibold text-white hover:bg-indigo-500 min-w-30">Add {selected.name}</button>
  {/if}
</div>

<ul role="list" class="divide-y divide-gray-100 w-full max-w-full">
{#each movesByLevel as move, index}

    <li class="py-2 w-full max-w-11/12 md:max-w-full border-b-blue-200">
      <div class="flex justify-between items-center md:gap-2 gap-x-0 w-full max-w-full">
      <div class="flex min-w-0 gap-x-4 max-w-2/3">
        <img class="size-12 flex-none rounded-full bg-gray-50" src="{'images/types/'+move.type?.toLocaleLowerCase()+'-small.png'}" alt="">
        <div class="min-w-0 flex-auto">
          <p class="text-m font-semibold text-gray-900">{move.name}</p>
          <p class="mt-1 truncate text-xs/5 text-gray-500">{move.effect?.short_effect}</p>
        </div>
      </div>
      <div class="flex flex-col items-end gap-2 justify-end ">
        <div class="flex items-end gap-2 justify-end">
          <label for="number-input" class="block mb-2 text-sm font-medium text-gray-900">Lvl:</label>
          <input type="number" class="w-16 text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5" bind:value={move.level}>
        </div>
        <button on:click={() => remove(move.id)} class="rounded-md bg-red-400 px-3 py-2 text-[0.8125rem]/5 font-semibold text-white hover:bg-red-500">Remove</button>
      </div>
    </div>
    </li>
 
{/each}
</ul>