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
  <div class="w-1/2">
    <SearchMoves bind:selected/>
  </div>
  {#if selected}
    <button on:click={() => addMove()} class="rounded-md bg-indigo-600 w-1/2 px-3 py-2 text-[0.8125rem]/5 font-semibold text-white hover:bg-indigo-500 min-w-30">Add {selected.name}</button>
  {/if}
</div>

<ul role="list" class="divide-y divide-gray-100 w-full">
{#each movesByLevel as move, index}

    <li class="flex justify-stretch  sm:justify-between gap-2 gap-x-0 py-5 w-full">
      <div class="flex min-w-0 gap-x-4 max-w-1/2">
        <img class="size-12 flex-none rounded-full bg-gray-50" src="{'images/types/'+move.type?.toLocaleLowerCase()+'-small.png'}" alt="">
        <div class="min-w-0 flex-auto">
          <p class="text-m font-semibold text-gray-900">{move.name}</p>
          <p class="mt-1 truncate text-xs/5 text-gray-500">{move.effect?.short_effect}</p>
        </div>
      </div>
      <div class="sm:flex sm:flex-col sm:items-end">
        <p class="text-m text-gray-900">Lvl {move.level}</p>
        <button on:click={() => remove(move.id)} class="rounded-md bg-red-400 px-3 py-2 text-[0.8125rem]/5 font-semibold text-white hover:bg-red-500">Remove</button>
      </div>
    </li>
 
{/each}
</ul>