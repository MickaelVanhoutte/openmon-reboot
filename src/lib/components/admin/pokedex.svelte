<script lang="ts">
    import { onMount } from "svelte";
    import SearchDex from "./search-dex.svelte";
    import ModalGeneral from "./modal-general.svelte";
    import ModalMoves from "./modal-moves.svelte";
    import type { FullDexEntry, Generation } from "$lib/pokedex/fulldex";
    import ModalEvolutions from "./modal-evolutions.svelte";
    import RegionSelect from "./region-select.svelte";

    // load current pokedex file
    export let pokedex: FullDexEntry[] = [];
    export let originalPokedex: FullDexEntry[] = [];

    let pokeForm: FullDexEntry | undefined;
    let selected: FullDexEntry;
    let edited: FullDexEntry;
    let generation: Generation;

    function setForm(){
      pokeForm = edited ? structuredClone(edited) : selected ? structuredClone(selected) : undefined
    }
    $:selected, setForm();

    //$: pokeForm = selected ? structuredClone(selected) : undefined;
    
    let showModal = false;
    let closedModal = true;
    let tab = 1;

    const setRegion = (e: CustomEvent<Generation>) => {
      generation = e.detail;
    }

    function edit(pokemon: FullDexEntry) {
        const original = originalPokedex.find((entry) => entry.id === pokemon.id);
        if(original){
          edited = pokemon;
          selected = original;
          toggleModal();
        }
    }

    function remove(pokemon: FullDexEntry) {
        pokedex = pokedex.filter((entry) => entry.id !== pokemon.id);
    }

    const toggleModal = () => {
        showModal = !showModal;
        setTimeout(() => {
            closedModal = !closedModal;
        }, 500);
    }

    const save = () => {
        if(pokeForm){
          pokedex = pokedex.filter((entry) => entry.id !== pokeForm?.id);
          pokedex = [...pokedex, pokeForm];
          pokedex.sort((a, b) => a.id - b.id);
          toggleModal();
        }
    }

    onMount(() => {
        fetch("final/pokedex.json")
             .then((response) => response.json())
             .then((data) => {
                 pokedex = data;
             });
        fetch("base-pokedex-moves.json")
          .then((response) => response.json())
          .then((data) => {
              originalPokedex = data;
          });
    });
</script>

<div class="flex h-16 items-center justify-end">
    <button on:click={toggleModal} class="rounded-md bg-indigo-600 px-3 py-2 text-[0.8125rem]/5 font-semibold text-white hover:bg-indigo-500 min-w-30">Add</button>
</div>


<ul role="list" class="divide-y divide-gray-100">
    {#each pokedex as pokemon}
    <li class="flex justify-between gap-x-6 py-5">
      <div class="flex min-w-0 gap-x-4">
        <img class="size-12 flex-none rounded-full bg-gray-50" src="{pokemon.image.sprite}" alt="">
        <div class="min-w-0 flex-auto">
          <p class="text-m/6 font-semibold text-gray-900">{pokemon.id} - {pokemon.name?.english}</p>
          <p class="mt-1 truncate text-s/5 text-gray-500">Types, abilities</p>
        </div>
      </div>
      <div class="sm:flex sm:flex-col sm:items-end">
        <p on:click={() => edit(pokemon)} class="text-m text-gray-900">Edit</p>
        <p on:click={() => remove(pokemon)} class="mt-1 text-sm text-gray-500">Delete</p>
      </div>
    </li>
    {/each}

    {#if pokedex.length === 0}
    <li class="py-5">
        <p class="text-center text-gray-500">No Pokemon in the Pokedex, add some !</p>
    </li>
    {/if}
</ul>


<div class="flex h-16 items-center justify-end">
  <a download="pokedex.json" href={"data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(pokedex))} class="absolute bottom-8 rounded-md bg-indigo-600 px-3 py-2 text-[0.8125rem]/5 font-semibold text-white hover:bg-indigo-500">Export as JSON</a>
</div>


<div class="{showModal ? 'relative ease-linear z-10': closedModal ? 'relative ease-linear -z-10' : 'relative ease-linear z-10'}" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
    <div class="{showModal ? 'fixed ease-in-out duration-500 inset-0 bg-gray-500/75 transition-opacity opacity-100' : 'fixed ease-in-out duration-500 inset-0 bg-gray-500/75 transition-opacity opacity-0'}" aria-hidden="true"></div>
  
    <div class="fixed inset-0 overflow-hidden">
      <div class="absolute inset-0 overflow-hidden">
        <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div class="{showModal ? 'pointer-events-auto relative w-screen max-w-6xl transform transition ease-in-out duration-500 sm:duration-700 translate-x-0' : 'pointer-events-auto relative w-screen max-w-md transform transition ease-in-out duration-500 sm:duration-700 translate-x-full'}">
            <div class="{showModal ? 'absolute top-0 left-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4 opacity-100' : 'absolute top-0 left-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4 opacity-0'}">
              <button on:click={toggleModal} type="button" class="relative rounded-md text-gray-300 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden">
                <span class="absolute -inset-2.5"></span>
                <span class="sr-only">Close panel</span>
                <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
  
            <div class="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
              <div class="px-4 sm:px-6">
                <h2 class="text-3xl font-semibold text-gray-900" id="slide-over-title">Add a Pokemon</h2>
              </div>
              <div class="relative mt-6 flex-1 px-1">

                <!-- Drawer content -->



<div class="mb-4 border-b border-gray-200">
    <ul class="flex flex-wrap -mb-px text-sm font-medium text-center" id="default-tab" data-tabs-toggle="#default-tab-content" role="tablist">
        <li class="me-2" role="presentation">
            <button on:click={() => tab = 1} class="{tab === 1 ? 'inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 text-blue-600' : 'inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-60 border-gray-100 hover:border-gray-300'}" id="general-tab" data-tabs-target="#general" type="button" role="tab" aria-controls="general" aria-selected="false">General</button>
        </li>
        <li class="me-2" role="presentation">
            <button disabled={!pokeForm} on:click={() => tab = 2} class="{tab === 2 ? 'inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 text-blue-600' : 'inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 border-gray-100 hover:border-gray-300'}" id="moves-tab" data-tabs-target="#moves" type="button" role="tab" aria-controls="moves" aria-selected="false">Moves</button>
        </li>
        <li class="me-2" role="presentation">
            <button disabled={!pokeForm} on:click={() => tab = 3} class="{tab === 3 ? 'inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 text-blue-600' : 'inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 border-gray-100 hover:border-gray-300'}" id="evos-tab" data-tabs-target="#evos" type="button" role="tab" aria-controls="evos" aria-selected="false">Evolutions</button>
        </li>
    </ul>
</div>
<div id="default-tab-content">
    <div class="{tab === 1 ? 'p-1 md:p-4 rounded-lg bg-gray-50' : 'hidden p-1 md:p-4 rounded-lg bg-gray-50' }" id="general" role="tabpanel" aria-labelledby="general-tab">
        
        <div class="w-1/2 columns-2 gap-4 flex flex-col items-start h-20">
            <div class="w-full">
              <RegionSelect on:genSelect={setRegion}/>
          </div>
          <div class="w-full">
            <SearchDex bind:selected {originalPokedex} {generation}/>
          </div>
        </div>

        <div class="w-full h-full flex justify-center mb-10">
          {#if selected}
            <img class="mini-pic" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{selected.id}.png" alt="">
          {/if}
        </div>

        {#if pokeForm}
           <ModalGeneral bind:pokeForm={pokeForm} bind:baseEntry={selected}/> 
        {/if}
    </div>
  
    <div class="{tab === 2 ? 'p-1 md:p-4 rounded-lg bg-gray-50' : 'hidden p-1 md:p-4 rounded-lg bg-gray-50' }" id="moves" role="tabpanel" aria-labelledby="moves-tab">
        {#if pokeForm}
            <ModalMoves bind:pokeForm={pokeForm}/>
        {/if}

    </div>
    <div class="{tab === 3 ? 'p-1 md:p-4 rounded-lg bg-gray-50' : 'hidden p-1 md:p-4 rounded-lg bg-gray-50' }" id="evos" role="tabpanel" aria-labelledby="evos-tab">
      {#if pokeForm}  
        <ModalEvolutions bind:pokeForm={pokeForm} {originalPokedex}/>
      {/if}
    </div>

    {#if pokeForm}
    <button on:click={save} class="fixed bottom-2 right-2 rounded-md bg-indigo-600 px-3 py-2 text-[0.8125rem]/5 font-semibold text-white hover:bg-indigo-500 min-w-30">Save</button>
    {/if}
</div>



        

               
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

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