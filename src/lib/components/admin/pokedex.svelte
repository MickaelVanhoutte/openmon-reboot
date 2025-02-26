<script lang="ts">
    import { PokedexEntry } from "$lib/pokedex/pokedex";
    import { onMount } from "svelte";
    import SearchDex from "./search-dex.svelte";

    // load current pokedex file
    let pokedex: PokedexEntry[] = [
        new PokedexEntry(1, "bulbasaur", {
            front: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
            back: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
        }),
        new PokedexEntry(2, "ivysaur", {
            front: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png",
            back: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png"
        })
    ];

    let selected: FullDexEntry;
    let showModal = false;
    let closedModal = true;
    const toggleModal = () => {
        showModal = !showModal;
        setTimeout(() => {
            closedModal = !closedModal;
        }, 500);
    }

    const save = () => {
        console.log(selected);
    }

    onMount(() => {
        // fetch("/pokedex.json")
        //     .then((response) => response.json())
        //     .then((data) => {
        //         pokedex = data;
        //     });
    });
</script>

<div class="flex h-16 items-center justify-end">
    <button on:click={toggleModal} class="rounded-md bg-indigo-600 px-3 py-2 text-[0.8125rem]/5 font-semibold text-white hover:bg-indigo-500">Add</button>
</div>


<ul role="list" class="divide-y divide-gray-100">
    {#each pokedex as pokemon}
    <li class="flex justify-between gap-x-6 py-5">
      <div class="flex min-w-0 gap-x-4">
        <img class="size-12 flex-none rounded-full bg-gray-50" src="{pokemon.sprites?.front}" alt="">
        <div class="min-w-0 flex-auto">
          <p class="text-sm/6 font-semibold text-gray-900">{pokemon.id} - {pokemon.name}</p>
          <p class="mt-1 truncate text-xs/5 text-gray-500">Types, abilities</p>
        </div>
      </div>
      <div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
        <p class="text-sm/6 text-gray-900">Edit</p>
        <p class="mt-1 text-xs/5 text-gray-500">Delete</p>
      </div>
    </li>
    {/each}
</ul>

todo:  <br>
load current pokedex file <br>
start from scratch <br>
export pokedex as json  <br>
add pokemon <br>
edit stats, moves, abilities, evolutions <br>
search pokemon <br>
filter pokemon <br>
sort pokemon <br>



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
              <div class="relative mt-6 flex-1 px-4 sm:px-6">
                
                <!-- Drawer content -->
                <div class="w-full columns-1 gap-4 sm:columns-2 flex items-center h-30">
                    <div class="w-full">
                        <SearchDex bind:selected/>
                    </div>
                    <div class="w-full h-full flex justify-center">
                        {#if selected}
                        <img class="h-full" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{selected.id}.png" alt="">

                        {/if}
                    </div>
                </div>

                {#if selected}
                    <div class="w-full mt-1">
                        <h2 class="text-2xl font-bold">{selected.name?.english}</h2>
                        <div class="flex gap-x-4 mt-2">
                            {#each selected.type as type, index}

                            <div>
                                <label for="price" class="block text-sm/6 font-medium text-gray-900">Type {index + 1}</label>
                                <div class="mt-2">
                                  <div class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                        
                                    <input type="text"  value="{type}"  class="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6" placeholder="Type">
                                    
                                  </div>
                                </div>
                              </div>
                            {/each}
                        </div>

                        <div class="flex-1 mt-2">
                            
                            <label for="HP" class="block mb-1 text-sm font-medium text-gray-900">HP ({selected.base?.HP})</label>
                            <input id="HP" type="range" min="5" max="255" value="{selected.base?.HP}" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700">

                            <label for="attack" class="block mb-1 text-sm font-medium text-gray-900">Attack  ({selected.base?.attack})</label>
                            <input id="attack" type="range" min="5" max="255" value="{selected.base?.attack}" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700">
                            
                            <label for="defense" class="block mb-1 text-sm font-medium text-gray-900">Defense ({selected.base?.defense})</label>
                            <input id="defense" type="range" min="5" max="255" value="{selected.base?.defense}" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700">

                            <label for="spAttack" class="block mb-1 text-sm font-medium text-gray-900">Sp.Attack ({selected.base?.spAttack})</label>
                            <input id="spAttack" type="range" min="5" max="255" value="{selected.base?.spAttack}" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700">

                            <label for="spDefense" class="block mb-1 text-sm font-medium text-gray-900">Sp.Defense ({selected.base?.spDefense})</label>
                            <input id="spDefense" type="range" min="5" max="255" value="{selected.base?.spDefense}" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700">

                            <label for="speed" class="block mb-1 text-sm font-medium text-gray-900">Speed ({selected.base?.speed})</label>
                            <input id="speed" type="range" min="5" max="255" value="{selected.base?.speed}" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700">
                        </div>
                    </div>


                    <button on:click={save} class="fixed bottom-2 right-2 rounded-md bg-indigo-600 px-3 py-2 text-[0.8125rem]/5 font-semibold text-white hover:bg-indigo-500">Save</button>
                {/if}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>