<script lang="ts">
  import type { FullDexEntry, Move } from '$lib/pokedex/fulldex';
  import { clickOutside } from '$lib/utils';
  import { onMount } from 'svelte';

  export let pokeForm: FullDexEntry;
  export let selected: Move | null;
  let allMoves: Move[] = [];
  let isOpen = false;
  let searchValue = '';

  // Function to toggle the dropdown state
  const toggleDropdown = () => {
    isOpen = !isOpen;
  };

  function select(entry: Move) {
    selected = entry;
    toggleDropdown();
  }

  $: filtered = (
    searchValue && searchValue?.length > 2
      ? allMoves.filter((entry) => {
          let nameNorm = entry?.name
            ?.normalize('NFD')
            ?.replace(/\p{Diacritic}/gu, '')
            ?.toLocaleLowerCase();
          return (
            nameNorm?.includes(searchValue?.toLocaleLowerCase()) ||
            entry?.type?.toLocaleLowerCase()?.includes(searchValue?.toLocaleLowerCase())
          );
        })
      : allMoves
  )
    .sort((a, b) => a.type.localeCompare(b.type))
    .filter((entry) => pokeForm.moves.findIndex((move) => move.id === entry.id) === -1);

  onMount(() => {
    fetch('resources/dex/all-moves.json')
      .then((response) => response.json())
      .then((data) => {
        allMoves = data;
      });
  });
</script>

<div class="relative group" use:clickOutside on:outclick={() => (isOpen = false)}>
  <button
    on:click={toggleDropdown}
    id="dropdown-button"
    class="inline-flex justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
  >
    <span class="mr-2">Search move</span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-5 h-5 ml-2 -mr-1"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fill-rule="evenodd"
        d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
        clip-rule="evenodd"
      />
    </svg>
  </button>
  <div
    id="dropdown-menu"
    class={isOpen
      ? 'absolute z-10 right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1 space-y-1 dropdown-sizes'
      : 'hidden absolute right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1 space-y-1'}
  >
    <!-- Search input -->
    <input
      bind:value={searchValue}
      id="search-input"
      class="block w-full px-4 py-2 text-gray-800 border rounded-md border-gray-300 focus:outline-none sticky"
      type="text"
      placeholder="Search items"
      autocomplete="off"
    />
    <!-- Dropdown content goes here -->
    {#each filtered as entry}
      <div
        on:click={() => select(entry)}
        class="flex justify-between items-center gap-2 gap-x-0 w-full pl-2 pr-6 border-b-blue-200"
      >
        <div
          class="flex gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer rounded-md"
        >
          <img
            class="size-6 flex-none rounded-full bg-gray-50"
            src={'images/types/' + entry.type?.toLocaleLowerCase() + '-small.png'}
            alt=""
          />
          <span>{entry.name}</span>
        </div>
        <span>{entry.power || '/'}</span>
      </div>
    {/each}
  </div>
</div>

<style>
  .dropdown-sizes {
    width: 100%;
    max-height: 60dvh;
    overflow-y: auto;
  }
  .sticky {
    position: sticky;
    top: 0;
    z-index: 1000;
    background-color: white;
  }
</style>
