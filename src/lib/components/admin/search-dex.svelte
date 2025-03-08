<script lang="ts">
  import type { GameData } from '$lib/game/data.model';
  import type { FullDexEntry, Generation } from '$lib/pokedex/fulldex';
  import { clickOutside } from '$lib/utils';

  export let data: GameData;
  export let generation: Generation;
  export let selected: FullDexEntry;
  export let originalPokedex: FullDexEntry[];

  let isOpen = false;
  let searchValue = '';

  // Function to toggle the dropdown state
  const toggleDropdown = () => {
    isOpen = !isOpen;
  };

  function select(entry: FullDexEntry) {
    selected = entry;
    toggleDropdown();
  }

  $: filtered =
    (searchValue && searchValue?.length > 2) || generation?.id !== 0
      ? originalPokedex
          .slice(
            generation ? generation.indexes[0] - 1 : 0,
            generation ? generation.indexes[1] : originalPokedex.length,
          )
          .filter((entry) => {
            let frenchNorm = entry?.name?.french
              ?.normalize('NFD')
              ?.replace(/\p{Diacritic}/gu, '')
              ?.toLocaleLowerCase();
            let englishNorm = entry?.name?.english?.toLocaleLowerCase();
            return (
              frenchNorm?.includes(searchValue?.toLocaleLowerCase()) ||
              englishNorm?.includes(searchValue?.toLocaleLowerCase()) ||
              entry?.type?.join('')?.toLocaleLowerCase()?.includes(searchValue?.toLocaleLowerCase())
            );
          })
      : originalPokedex;
</script>

<div class="relative group" use:clickOutside on:outclick={() => (isOpen = false)}>
  <button
    on:click={toggleDropdown}
    id="dropdown-button"
    class="inline-flex justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
  >
    <span class="mr-2">{selected?.name?.english || 'Search'}</span>
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
      placeholder="Search by name (en/fr), type"
      autocomplete="off"
    />
    <!-- Dropdown content goes here -->
    {#each filtered as entry}
      <div
        on:click={(e) =>
          data.pokedex.find((pk) => pk.id === entry.id) ? e.preventDefault() : select(entry)}
        class="flex justify-between px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100 rounded-md {data.pokedex.find(
          (pk) => pk.id === entry.id,
        )
          ? 'opacity-50 cursor-not-allowed'
          : 'cursor-pointer'}"
      >
        <span>{entry.name?.english}</span>
        <div class="flex gap-2">
          {#each entry.type as type}
            <img
              class="size-6 flex-none rounded-full bg-gray-50"
              src={'images/types/' + type?.toLocaleLowerCase() + '-small.png'}
              alt=""
            />
          {/each}
        </div>
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
