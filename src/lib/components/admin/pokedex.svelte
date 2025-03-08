<script lang="ts">
  import { onMount } from 'svelte';
  import SearchDex from './search-dex.svelte';
  import ModalGeneral from './modal-general.svelte';
  import ModalMoves from './modal-moves.svelte';
  import type { FullDexEntry, Generation } from '$lib/pokedex/fulldex';
  import ModalEvolutions from './modal-evolutions.svelte';
  import RegionSelect from './region-select.svelte';
  import type {GameData} from '$lib/game/data.model';

  // load current pokedex file
  export let data: GameData;
  export let originalPokedex: FullDexEntry[] = [];

  let pokeForm: FullDexEntry | undefined;
  let selected: FullDexEntry;
  let edited: FullDexEntry;
  let generation: Generation;
  let display: 'lines' | 'grid' = 'lines';

  function setForm() {
    pokeForm = edited ? structuredClone(edited) : selected ? structuredClone(selected) : undefined;
  }
  $: if(selected) setForm();

  //$: pokeForm = selected ? structuredClone(selected) : undefined;

  let showModal = false;
  let closedModal = true;
  let tab = 1;

  const setRegion = (e: CustomEvent<Generation>) => {
    generation = e.detail;
  };

  function edit(pokemon: FullDexEntry) {
    const original = originalPokedex.find((entry) => entry.id === pokemon.id);
    if (original) {
      edited = pokemon;
      selected = original;
      toggleModal();
    }
  }

  function remove(pokemon: FullDexEntry) {
    data.pokedex = data.pokedex.filter((entry) => entry.id !== pokemon.id);
  }

  const addAll = () => {
    originalPokedex.forEach(poke => {
      if(!data.pokedex.find(entry => entry.id === poke.id)){
        data.pokedex = [...data.pokedex, poke];
      }
    });
    data.pokedex.sort((a, b) => a.id - b.id);
  }

  const toggleModal = () => {
    showModal = !showModal;
    setTimeout(() => {
      closedModal = !closedModal;
    }, 500);
  };

  const save = () => {
    if (pokeForm) {
      data.pokedex = data.pokedex.filter((entry) => entry.id !== pokeForm?.id);
      data.pokedex = [...data.pokedex, pokeForm];
      data.pokedex.sort((a, b) => a.id - b.id);
      toggleModal();
    }
  };

  onMount(() => {
    console.log('pokedex', data);
    fetch('resources/dex/base-pokedex-moves.json')
      .then((response) => response.json())
      .then((data) => {
        originalPokedex = data;
      });
  });
</script>

<div class="flex h-16 gap-8 items-center justify-end">

  <button on:click={() => (display = display === 'lines' ? 'grid' : 'lines')} class="hidden md:inline-flex text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-1.5 text-center items-center me-2">
    {#if display === 'lines'}
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="size-6" viewBox="0 -0.5 21 21" version="1.1">


      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="Dribbble-Light-Preview" transform="translate(-219.000000, -200.000000)" fill="currentColor">
              <g id="icons" transform="translate(56.000000, 160.000000)">
                  <path d="M181.9,54 L179.8,54 C178.63975,54 177.7,54.895 177.7,56 L177.7,58 C177.7,59.105 178.63975,60 179.8,60 L181.9,60 C183.06025,60 184,59.105 184,58 L184,56 C184,54.895 183.06025,54 181.9,54 M174.55,54 L172.45,54 C171.28975,54 170.35,54.895 170.35,56 L170.35,58 C170.35,59.105 171.28975,60 172.45,60 L174.55,60 C175.71025,60 176.65,59.105 176.65,58 L176.65,56 C176.65,54.895 175.71025,54 174.55,54 M167.2,54 L165.1,54 C163.93975,54 163,54.895 163,56 L163,58 C163,59.105 163.93975,60 165.1,60 L167.2,60 C168.36025,60 169.3,59.105 169.3,58 L169.3,56 C169.3,54.895 168.36025,54 167.2,54 M181.9,47 L179.8,47 C178.63975,47 177.7,47.895 177.7,49 L177.7,51 C177.7,52.105 178.63975,53 179.8,53 L181.9,53 C183.06025,53 184,52.105 184,51 L184,49 C184,47.895 183.06025,47 181.9,47 M174.55,47 L172.45,47 C171.28975,47 170.35,47.895 170.35,49 L170.35,51 C170.35,52.105 171.28975,53 172.45,53 L174.55,53 C175.71025,53 176.65,52.105 176.65,51 L176.65,49 C176.65,47.895 175.71025,47 174.55,47 M167.2,47 L165.1,47 C163.93975,47 163,47.895 163,49 L163,51 C163,52.105 163.93975,53 165.1,53 L167.2,53 C168.36025,53 169.3,52.105 169.3,51 L169.3,49 C169.3,47.895 168.36025,47 167.2,47 M181.9,40 L179.8,40 C178.63975,40 177.7,40.895 177.7,42 L177.7,44 C177.7,45.105 178.63975,46 179.8,46 L181.9,46 C183.06025,46 184,45.105 184,44 L184,42 C184,40.895 183.06025,40 181.9,40 M174.55,40 L172.45,40 C171.28975,40 170.35,40.895 170.35,42 L170.35,44 C170.35,45.105 171.28975,46 172.45,46 L174.55,46 C175.71025,46 176.65,45.105 176.65,44 L176.65,42 C176.65,40.895 175.71025,40 174.55,40 M169.3,42 L169.3,44 C169.3,45.105 168.36025,46 167.2,46 L165.1,46 C163.93975,46 163,45.105 163,44 L163,42 C163,40.895 163.93975,40 165.1,40 L167.2,40 C168.36025,40 169.3,40.895 169.3,42" id="grid-[#1526]">
  
  </path>
              </g>
          </g>
      </g>
  </svg>
  {:else}
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="size-6" viewBox="0 0 16 16" version="1.1">
    <path fill="currentColor" d="M0 1h3v2h-3v-2z"/>
    <path fill="currentColor" d="M0 5h3v2h-3v-2z"/>
    <path fill="currentColor" d="M0 9h3v2h-3v-2z"/>
    <path fill="currentColor" d="M0 13h3v2h-3v-2z"/>
    <path fill="currentColor" d="M4 1h12v2h-12v-2z"/>
    <path fill="currentColor" d="M4 5h12v2h-12v-2z"/>
    <path fill="currentColor" d="M4 9h12v2h-12v-2z"/>
    <path fill="currentColor" d="M4 13h12v2h-12v-2z"/>
    </svg>
  {/if}
  </button>

  <button
    on:click={toggleModal}
    class="rounded-md bg-indigo-600 px-3 py-2 text-[0.8125rem]/5 font-semibold text-white hover:bg-indigo-500 min-w-20"
    >Add</button
  >

  <button
  on:click={addAll}
  class="rounded-md border-1 border-indigo-600 px-3 py-2 text-[0.8125rem]/5 font-semibold text-indigo-600 hover:bg-indigo-500 hover:text-white min-w-20"
  >Add all</button
>
</div>

<ul role="list" class="divide-y divide-gray-100 {display === 'grid' ? 'grid grid-cols-3 gap-8' : ''}">
  {#each data.pokedex as pokemon}
    <li class="flex justify-between gap-x-6 py-5">
      <div class="flex min-w-0 gap-x-4">
        <img class="size-12 flex-none rounded-full bg-gray-50" src={pokemon.image.sprite} alt="" />
        <div class="min-w-0 flex-auto">
          <p class="text-m/6 font-semibold text-gray-900">{pokemon.id} - {pokemon.name?.english}</p>
          <p class="mt-1 truncate text-s/5 text-gray-500 flex gap-6">
            <span class="flex gap-2">
            {#each pokemon.type as type}
              <img
                class="size-4 flex-none rounded-full bg-gray-50"
                src={'images/types/' + type?.toLocaleLowerCase() + '-small.png'}
                alt=""
              />
            {/each}
          </span>
          <span class="flex gap-2">
            {#each pokemon.profile.ability as ability}
              <span class="text-xs/5 text-gray-500" class:text-indigo-600={ability[1] === 'true'}>{ability[0]}</span>
            {/each}
          </span>
          </p>
        </div>
      </div>
      <div class="sm:flex sm:flex-col sm:items-end">
        <p on:click={() => edit(pokemon)} class="text-m text-gray-900">Edit</p>
        <p on:click={() => remove(pokemon)} class="mt-1 text-sm text-red-500">Delete</p>
      </div>
    </li>
  {/each}

  {#if data.pokedex.length === 0}
    <li class="py-5">
      <p class="text-center text-gray-500">No Pokemon in the Pokedex, add some !</p>
    </li>
  {/if}
</ul>

<!--<div class="flex h-16 items-center justify-end sticky bottom-0">
  <a
    download="pokedex.json"
    href={'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data.pokedex))}
    class="absolute bottom-8 rounded-md bg-indigo-600 px-3 py-2 text-[0.8125rem]/5 font-semibold text-white hover:bg-indigo-500"
    >Export as JSON</a
  >
</div>-->

<div
  class={showModal
    ? 'relative ease-linear z-10'
    : closedModal
      ? 'relative ease-linear -z-10'
      : 'relative ease-linear z-10'}
  aria-labelledby="slide-over-title"
  role="dialog"
  aria-modal="true"
>
  <div
    class={showModal
      ? 'fixed ease-in-out duration-500 inset-0 bg-gray-500/75 transition-opacity opacity-100'
      : 'fixed ease-in-out duration-500 inset-0 bg-gray-500/75 transition-opacity opacity-0'}
    aria-hidden="true"
  ></div>

  <div class="fixed inset-0 overflow-hidden">
    <div class="absolute inset-0 overflow-hidden">
      <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div
          class={showModal
            ? 'pointer-events-auto relative w-screen max-w-6xl transform transition ease-in-out duration-500 sm:duration-700 translate-x-0'
            : 'pointer-events-auto relative w-screen max-w-md transform transition ease-in-out duration-500 sm:duration-700 translate-x-full'}
        >
          <div
            class={showModal
              ? 'absolute top-0 left-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4 opacity-100'
              : 'absolute top-0 left-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4 opacity-0'}
          >
            <button
              on:click={toggleModal}
              type="button"
              class="relative rounded-md text-gray-100 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden"
            >
              <span class="absolute -inset-2.5"></span>
              <span class="sr-only">Close panel</span>
              <svg
                class="size-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="3"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
            <div class="px-4 sm:px-6">
              <h2 class="text-3xl font-semibold text-gray-900" id="slide-over-title">
                Add a Pokemon
              </h2>
            </div>
            <div class="relative mt-6 flex-1 px-1">
              <!-- Drawer content -->

              <div class="mb-4 border-b border-gray-200">
                <ul
                  class="flex flex-wrap -mb-px text-sm font-medium text-center"
                  id="default-tab"
                  data-tabs-toggle="#default-tab-content"
                  role="tablist"
                >
                  <li class="me-2" role="presentation">
                    <button
                      on:click={() => (tab = 1)}
                      class={tab === 1
                        ? 'inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 text-blue-600'
                        : 'inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-60 border-gray-100 hover:border-gray-300'}
                      id="general-tab"
                      data-tabs-target="#general"
                      type="button"
                      role="tab"
                      aria-controls="general"
                      aria-selected="false">General</button
                    >
                  </li>
                  <li class="me-2" role="presentation">
                    <button
                      disabled={!pokeForm}
                      on:click={() => (tab = 2)}
                      class={tab === 2
                        ? 'inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 text-blue-600'
                        : 'inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 border-gray-100 hover:border-gray-300'}
                      id="moves-tab"
                      data-tabs-target="#moves"
                      type="button"
                      role="tab"
                      aria-controls="moves"
                      aria-selected="false">Moves</button
                    >
                  </li>
                  <li class="me-2" role="presentation">
                    <button
                      disabled={!pokeForm}
                      on:click={() => (tab = 3)}
                      class={tab === 3
                        ? 'inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 text-blue-600'
                        : 'inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 border-gray-100 hover:border-gray-300'}
                      id="evos-tab"
                      data-tabs-target="#evos"
                      type="button"
                      role="tab"
                      aria-controls="evos"
                      aria-selected="false">Evolutions</button
                    >
                  </li>
                </ul>
              </div>
              <div id="default-tab-content">
                <div
                  class={tab === 1
                    ? 'p-1 md:p-4 rounded-lg bg-gray-50'
                    : 'hidden p-1 md:p-4 rounded-lg bg-gray-50'}
                  id="general"
                  role="tabpanel"
                  aria-labelledby="general-tab"
                >
                  <div class="w-1/2 columns-2 gap-4 flex flex-col items-start h-20">
                    <div class="w-full">
                      <RegionSelect on:genSelect={setRegion} />
                    </div>
                    <div class="w-full">
                      <SearchDex bind:selected {originalPokedex} {generation} {data} />
                    </div>
                  </div>

                  <div class="w-full h-full flex justify-center mb-10">
                    {#if selected}
                      <img
                        class="mini-pic"
                        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{selected.id}.png"
                        alt=""
                      />
                    {/if}
                  </div>

                  {#if pokeForm}
                    <ModalGeneral bind:pokeForm bind:baseEntry={selected} />
                  {/if}
                </div>

                <div
                  class={tab === 2
                    ? 'p-1 md:p-4 rounded-lg bg-gray-50'
                    : 'hidden p-1 md:p-4 rounded-lg bg-gray-50'}
                  id="moves"
                  role="tabpanel"
                  aria-labelledby="moves-tab"
                >
                  {#if pokeForm}
                    <ModalMoves bind:pokeForm />
                  {/if}
                </div>
                <div
                  class={tab === 3
                    ? 'p-1 md:p-4 rounded-lg bg-gray-50'
                    : 'hidden p-1 md:p-4 rounded-lg bg-gray-50'}
                  id="evos"
                  role="tabpanel"
                  aria-labelledby="evos-tab"
                >
                  {#if pokeForm}
                    <ModalEvolutions bind:pokeForm {originalPokedex} />
                  {/if}
                </div>

                {#if pokeForm}
                  <button
                    on:click={save}
                    class="fixed bottom-2 right-2 rounded-md bg-indigo-600 px-3 py-2 text-[0.8125rem]/5 font-semibold text-white hover:bg-indigo-500 min-w-30"
                    >Save</button
                  >
                {/if}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

todo:<br />
save work in indexeddb regularly<br />

<style>
  .mini-pic {
    position: absolute;
    top: 5em;
    right: 4em;
    max-width: 120px;
    max-height: 160px;
  }

  @media (min-width: 860px) {
    .mini-pic {
      right: 4em;
      max-height: 260px;
      max-width: 50%;
    }
  }
</style>
