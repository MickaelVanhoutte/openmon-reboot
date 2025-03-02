<script lang="ts">
  import { onMount } from 'svelte';
  import type { Map } from '$lib/maps/map.model';
  import { Drawer } from 'flowbite-svelte';

  interface TilesetConfig {
    name: string;
    tileSize: number;
    x: number;
    y: number;
}

  let maps: Map[] = [];
  let tilesetConfig: TilesetConfig | undefined;
  let edited: Map;
  let mapSize: { x: number; y: number } = { x: 15, y: 15 };
  let selectedTile: { x: number; y: number } | undefined;
  let showMapModal = false;
  let closedModal = true;
  let optimized = false;
  let canvas: HTMLCanvasElement;
  let spriteImg: HTMLImageElement;
  let spriteSizeReference: HTMLDivElement;
  let canvasContainer: HTMLDivElement;
  let squareSize = 32;
  let scale = 1;

  const toggleModal = () => {
    console.log('toggle');
    showMapModal = !showMapModal;
    setTimeout(() => {
      closedModal = !closedModal;
    }, 500);
  };

  function newMap(){
    edited = { id: '0', label: 'new map', width: 5, height: 5, grid: [] };
    console.log(edited);
    toggleModal();
  }

  function edit(map: Map) {
    edited = map;
    toggleModal();
  }

  function optimizeCanvas(ctx: CanvasRenderingContext2D) {
    if (canvas && ctx) {
      console.log('optimize');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      optimized = true;
    }
  }

  function remove(map: Map) {
    maps = maps.filter((entry) => entry.id !== map.id);
  }

  function selectTile(x: number, y: number) {
    selectedTile = { x, y };
  }

  function drawCanvasGrid(){
    const ctx = canvas.getContext('2d');
    if(!optimized && ctx){
        optimizeCanvas(ctx);
    }
    canvas.width = canvasContainer.offsetWidth;
    canvas.height = canvasContainer.offsetHeight;
    const refWidth = spriteSizeReference?.offsetWidth;
    const refHeight = spriteSizeReference?.offsetHeight;
    squareSize = refWidth || refHeight;
    console.log('draw', canvas.width, canvas.height, refWidth, refHeight);
    //const smaller = canvas.height < canvas.width ? canvas.height : canvas.width;
    //const tileWidth = smaller / edited.width;
    if (ctx && tilesetConfig && spriteSizeReference) {
     
      const tileSize = tilesetConfig.tileSize;
      const x = edited.width;
      const y = edited.height;
      ctx.strokeStyle = 'black';
      ctx.lineWidth = .5;

      // should we rescale ? 
      const totalWidth = x * refWidth;
      const totalHeight = y * refHeight;
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      ctx.scale(scale, scale);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

      
      for (let i = 0; i < x; i++) {
        for (let j = 0; j < y; j++) {
          // draw rect borders
            
            ctx.strokeRect(i * refWidth, j * refHeight, refWidth, refHeight);
        }
      }
    }
  }

  function editWidth(e: Event & { currentTarget: EventTarget & HTMLInputElement; }) {
    console.log(e.target.value);
    edited = { ...edited, width: parseInt(e.currentTarget.value) };
  }

    function editHeight(e: Event & { currentTarget: EventTarget & HTMLInputElement; }) {
        console.log(e.target.value);
        edited = { ...edited, height: parseInt(e.currentTarget.value) };
    }

    function addTile(e){
        if(!selectedTile || !canvas || !spriteSizeReference){
            return;
        }
        const ctx = canvas.getContext('2d');
        console.log(e);
        // position in canvas based on e
        const position = {
            x: Math.floor(e.offsetX / spriteSizeReference.offsetWidth),
            y: Math.floor(e.offsetY / spriteSizeReference.offsetHeight)
        };
        const sourceStart = {
            x: selectedTile.x * tilesetConfig?.tileSize,
            y: selectedTile.y * tilesetConfig?.tileSize
        };
    
        const destStart = {
            x: position.x * spriteSizeReference.offsetWidth,
            y: position.y * spriteSizeReference.offsetHeight
        };
        console.log(sourceStart, destStart);

        ctx?.drawImage(spriteImg, sourceStart.x, sourceStart.y, tilesetConfig?.tileSize, tilesetConfig?.tileSize, destStart.x, destStart.y, spriteSizeReference.offsetWidth, spriteSizeReference.offsetHeight);
    }

  $: if (canvas && edited && spriteSizeReference) {
    drawCanvasGrid();
  }

  onMount(() => {
    fetch('final/maps.json')
      .then((response) => response.json())
      .then((data) => {
        maps = data;
      });

    fetch('final/tileset-config.json')
        .then((response) => response.json())
        .then((data: TilesetConfig) => {
            tilesetConfig = data;
        });
  });



</script>

<div class="flex h-16 items-center justify-end">
  <button
    on:click={() => newMap()}
    class="rounded-md bg-indigo-600 px-3 py-2 text-[0.8125rem]/5 font-semibold text-white hover:bg-indigo-500 min-w-30"
    >New map</button
  >
</div>

<ul role="list" class="divide-y divide-gray-100">
  {#each maps as map}
    <li class="flex justify-between gap-x-6 py-5">
      <div class="flex min-w-0 gap-x-4">
        <div class="min-w-0 flex-auto">
          <p class="text-m/6 font-semibold text-gray-900">{map.label}</p>
          <p class="mt-1 truncate text-s/5 text-gray-500">Types, abilities</p>
        </div>
      </div>
      <div class="sm:flex sm:flex-col sm:items-end">
        <p on:click={() => edit(map)} class="text-m text-gray-900">Edit</p>
        <p on:click={() => remove(map)} class="mt-1 text-sm text-gray-500">Delete</p>
      </div>
    </li>
  {/each}

  {#if maps.length === 0}
    <li class="py-5">
      <p class="text-center text-gray-500">No maps yet, add some !</p>
    </li>
  {/if}
</ul>


<div
  class={showMapModal
    ? 'relative ease-linear z-10'
    : closedModal
      ? 'relative ease-linear -z-10'
      : 'relative ease-linear z-10'}
  aria-labelledby="slide-over-title"
  role="dialog"
  aria-modal="true"
>
  <div
    class={showMapModal
      ? 'fixed ease-in-out duration-500 inset-0 bg-gray-500/75 transition-opacity opacity-100'
      : 'fixed ease-in-out duration-500 inset-0 bg-gray-500/75 transition-opacity opacity-0'}
    aria-hidden="true"
  ></div>

  <div class="fixed inset-0 overflow-hidden">
    <div class="absolute inset-0 overflow-hidden">
      <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div
          class={showMapModal
            ? 'pointer-events-auto relative w-screen max-w-screen h-screen transform transition ease-in-out duration-500 sm:duration-700 translate-x-0'
            : 'pointer-events-auto relative w-screen max-w-md transform transition ease-in-out duration-500 sm:duration-700 translate-x-full'}
        >
          <div
            class={showMapModal
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

          <div class="flex h-full max-h-full flex-col overflow-y-hidden bg-white py-6 shadow-xl">
            <div class="px-4 sm:px-6">
              <h2 class="text-3xl font-semibold text-gray-900" id="slide-over-title">
                Map editor
              </h2>
            </div>
            <div class="relative flex-1 px-1 h-full">
              <!-- Drawer content -->

                {#if tilesetConfig}
                    <div class="overflow-hidden w-full h-full flex gap-8">
                        <div class="w-1/4 h-full overflow-y-scroll relative">
                            <img
                                bind:this={spriteImg}
                                class="w-full h-auto aspect-auto mb-8"
                                src={`final/tileset.png`}
                                alt=""/>

                                <div class="absolute top-0 left-0 w-full h-full flex flex-wrap box-border">
                                    {#each {length: tilesetConfig.y} as _, i}
                                        {#each {length: tilesetConfig.x} as _, j}
                                        {#if i === 0 && j === 0}
                                        <div
                                        bind:this={spriteSizeReference}
                                        on:click={() => selectTile(j, i)}
                                        role="button"
                                        class="border-1 border-black hover:border-2 hover:border-blue-500 hover:backdrop-brightness-125"
                                        style="
                                            width: calc(100% / {tilesetConfig.x});
                                            aspect-ratio: 1 / 1;
                                        "
                                    ></div>
                                        {:else}
                                            <div
                                                on:click={() => selectTile(j, i)}
                                                role="button"
                                                class="border-1 border-black hover:border-2 hover:border-blue-500 hover:backdrop-brightness-125"
                                                style="
                                                    width: calc(100% / {tilesetConfig.x});
                                                    aspect-ratio: 1 / 1;
                                                "
                                            ></div>
                                            {/if}
                                        {/each}
                                    {/each}
                                </div>
                        </div>
                        <div class="w-3/4 h-full overflow-hidden flex flex-col gap-4">
                            {#if edited}
                                <div class="w-full flex flex-wrap content-start gap-4">
                                    <input type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Map label" bind:value={edited.label} />
                                    <input type="number" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Map width" on:change={(e) => editWidth(e)} value={edited.width}/>
                                    <input type="number" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Map height" on:change={(e) => editHeight(e)} value={edited.height}/>
                                </div>
                                <div bind:this={canvasContainer} class="">
                                    {#if squareSize}
                                        <canvas id="canvas" on:click={e => addTile(e)} bind:this={canvas} ></canvas>
                                    {/if}
                                </div>
                            {/if}
                        </div>
                    </div>
                {/if}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
    #canvas {
        image-rendering: pixelated;
        border: 1px solid black;
    }
</style>

