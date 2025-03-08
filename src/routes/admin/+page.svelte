<script lang="ts">
  import Dashboard from '$lib/components/admin/dashboard.svelte';
  import Maps from '$lib/components/admin/maps.svelte';
  import Pokedex from '$lib/components/admin/pokedex.svelte';
  import {
    decodeJwtResponse,
    onGoogleScriptLoad,
    getUser,
    isAuthorized,
    type User,
  } from '$lib/google-auth';
  import { onMount } from 'svelte';
  import type { GameData } from '$lib/game/data.model';
  import { createData, getData, getDataById } from '$lib/db';
  import { Button, Tooltip } from 'flowbite-svelte';
  import General from '$lib/components/admin/general.svelte';

  let user: User | null = null;
  let authorized = false;
  let menus = ['Dashboard', 'General', 'Pokedex', 'Items', 'Maps'];
  let activeMenu: string = 'Dashboard';
  let gameData: GameData;
  let indexedData: GameData | undefined;

  const save = () => {
    createData(gameData).then((data) => {
      gameData.id = data;
    });
  };

  const testGameData = () => {
    console.log(gameData);
    window.location.href = '/test';
  };

  function needSave() {
    console.log('check');
    return JSON.stringify(gameData) !== JSON.stringify(indexedData);
  }

  function fetchFromStatics() {
    console.log('fetching from statics');
    fetch('final/game-data.json')
      .then((response) => response.json())
      .then((data) => {
        gameData = data;
        console.log(data);
      });
  }

  onMount(() => {
    onGoogleScriptLoad(decodeJwtResponse);
    user = getUser();
    authorized = isAuthorized(user);
    if (user && !authorized) {
      window.location.href = '/';
    } else {
      getDataById(1).subscribe({
        next: (data) => {
          if (data) {
            gameData = data;
            indexedData = { ...data };
            console.log(data);
          } else {
            fetchFromStatics();
          }
        },
        error: (error) => {
          console.error(error);
          fetchFromStatics();
        },
      });
    }
  });
</script>

{#if user && authorized}
  <div class="min-h-full">
    <nav class="bg-gray-800">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center">
            <div class="shrink-0">
              <img class="size-8" src="favicon.webp" alt="Openmon" />
            </div>
            <div class="hidden md:block">
              <div class="ml-10 flex items-baseline space-x-4">
                {#each menus as menu}
                  <a
                    href={'#' + menu}
                    class={menu === activeMenu
                      ? 'rounded-md px-3 py-2 text-sm font-medium bg-gray-900 text-white'
                      : 'rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white'}
                    aria-current="page"
                    on:click={() => (activeMenu = menu)}>{menu}</a
                  >
                {/each}
              </div>
            </div>
          </div>
          <div class="hidden md:block">
            <div class="ml-4 flex items-center md:ml-6">
              <!-- Profile dropdown -->
              <div class="relative ml-3">
                <div>
                  <div>
                    {#if needSave()}
                      <a
                        data-tooltip-target="tooltip-save"
                        on:click={save}
                        href="#"
                        class="rounded-md bg-indigo-600 px-3 py-2 text-[0.8125rem]/5 font-semibold text-white hover:bg-indigo-500 min-w-30"
                        >Save</a
                      >
                      <Tooltip
                        ><p class="min-w-36">
                          Save data in indexedDB to avoid losing your work
                        </p></Tooltip
                      >
                    {:else}
                      <a
                        download="game-data.json"
                        href={'data:text/json;charset=utf-8,' +
                          encodeURIComponent(JSON.stringify(gameData))}
                        class="rounded-md bg-indigo-600 px-3 py-2 text-[0.8125rem]/5 font-semibold text-white hover:bg-indigo-500 min-w-30"
                        >Export</a
                      >
                      <Tooltip
                        ><p class="min-w-36">
                          Download the data to put it in your project
                        </p></Tooltip
                      >
                    {/if}

                    <a
                      class:disabled={gameData?.maps?.length === 0 ||
                        gameData?.pokedex?.length === 0}
                      href="#"
                      on:click={testGameData}
                      class="rounded-md bg-indigo-600 px-3 py-2 text-[0.8125rem]/5 font-semibold text-white hover:bg-indigo-500 min-w-30"
                      >Test</a
                    >
                    <Tooltip
                      ><p class="min-w-36">
                        {gameData?.maps?.length === 0 || gameData?.pokedex?.length === 0
                          ? 'You need to add pokemons or maps first'
                          : 'Start the game in test mode'}
                      </p></Tooltip
                    >
                  </div>
                </div>
              </div>
            </div>
            <div class="-mr-2 flex md:hidden">
              <!-- Mobile menu button -->
              <button
                type="button"
                class="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span class="absolute -inset-0.5"></span>
                <span class="sr-only">Open main menu</span>
                <!-- Menu open: "hidden", Menu closed: "block" -->
                <svg
                  class="block size-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
                <!-- Menu open: "block", Menu closed: "hidden" -->
                <svg
                  class="hidden size-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile menu, show/hide based on menu state. -->
        <div class="md:hidden" id="mobile-menu">
          <div class="space-y-1 px-2 pt-2 pb-3 sm:px-3">
            {#each menus as menu}
              <a
                href={'#' + menu}
                class={menu === activeMenu
                  ? 'block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white'
                  : 'block text-gray-300 hover:bg-gray-700 hover:text-white'}
                aria-current="page"
                on:click={() => (activeMenu = menu)}>{menu}</a
              >
            {/each}
          </div>
          <div class="border-t border-gray-700 pt-4 pb-3">
            <div class="flex items-center px-5">
              <div>
                <button
                  on:click={save}
                  class="rounded-md bg-indigo-600 px-3 py-2 text-[0.8125rem]/5 font-semibold text-white hover:bg-indigo-500 min-w-30"
                  >save</button
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <header class="bg-white shadow-sm">
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">{activeMenu}</h1>
      </div>
    </header>
    <main>
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <!-- Your content -->
        {#if gameData}
          {#if activeMenu === 'Dashboard'}
            <Dashboard bind:data={gameData} />
          {:else if activeMenu === 'General'}
            <General bind:data={gameData} />
          {:else if activeMenu === 'Pokedex'}
            <Pokedex bind:data={gameData} />
          {:else if activeMenu === 'Items'}
            todo: <br />
            load current items file <br />
            start from scratch <br />
            export items as json <br />
            add item <br />
            edit item <br />
            search item <br />
            filter item <br />
            sort item <br />
          {:else if activeMenu === 'Maps'}
            <Maps bind:data={gameData} />
          {/if}
        {/if}
      </div>
    </main>
  </div>
{:else if !user}
  <div id="googleSignIn"></div>
{/if}

<style>
  a.disabled {
    pointer-events: none;
    opacity: 0.5;
  }
</style>
