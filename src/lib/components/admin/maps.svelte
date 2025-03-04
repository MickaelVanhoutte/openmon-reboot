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
  let translatePos: { x: number; y: number } = {x: 0, y: 0};
  let startDragOffset: { x: number; y: number } = {x: 0, y: 0};
  let dragging = false;
  let showMapModal = false;
  let closedModal = true;
  let optimized = false;
  let canvas: HTMLCanvasElement;
  let spriteImg: HTMLImageElement;
  let spriteSizeReference: HTMLDivElement;
  let canvasContainer: HTMLDivElement;
  let squareSize = 32;
  let scale = 1;
  let mode: 'tile' | 'grab' = 'tile'

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
    mode = 'tile';
  }

  function scaleUp(){
    if(scale < 5){
        scale += .5;
    }
  } 

  function scaleDown(){
    if(scale > .5){
        scale -= .5
    }
  }

  function canvasClick(e){
    if(mode === 'tile'){
        addTile(e);
    }else {
        dragging = true;
        startDragOffset = {
            x: e.clientX - translatePos.x,
            y : e.clientY - translatePos.y
        };
    }
  }

  function stopDragging(){
    dragging = false;
  }

  function drag(e){
    if(mode !== 'grab' || !dragging){
        return;
    }
    translatePos = {
        x: e.clientX - startDragOffset.x,
        y: e.clientY - startDragOffset.y
    };
    //drawCanvasGrid();
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
      const maxTileY = canvas.offsetHeight / refHeight;
      const maxTileX = canvas.offsetWidth / refWidth;
      const xDiff = edited.width - maxTileX;
      const yDiff = edited.height - maxTileY;
      
      if(xDiff > 0 || yDiff > 0){
        if(xDiff > yDiff){
            scale = maxTileX / edited.width;
        }else {
            scale = maxTileY / edited.height;
        }
        }

     

        ctx.scale(scale, scale);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(translatePos.x, translatePos.y);

      
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

    function addTile(e: MouseEvent & { currentTarget: EventTarget & HTMLCanvasElement; }){
        if(!selectedTile || !canvas || !spriteSizeReference){
            return;
        }
        const ctx = canvas.getContext('2d');
        const ctxTileSize = spriteSizeReference.offsetWidth * scale;
        // position in canvas based on e

        const position = {
            x: Math.floor((e.offsetX - translatePos.x) / ctxTileSize),
            y: Math.floor((e.offsetY - translatePos.y) / ctxTileSize)
        };
        const sourceStart = {
            x: selectedTile.x * tilesetConfig?.tileSize,
            y: selectedTile.y * tilesetConfig?.tileSize
        };
    
        const destStart = {
            x: position.x * ctxTileSize,
            y: position.y * ctxTileSize
        };
        console.log(sourceStart, destStart);

        ctx?.drawImage(spriteImg, sourceStart.x, sourceStart.y, tilesetConfig?.tileSize, tilesetConfig?.tileSize, destStart.x, destStart.y, spriteSizeReference.offsetWidth, spriteSizeReference.offsetHeight);
    }

  $: if (canvas && edited && spriteSizeReference && scale && translatePos) {
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
                    <div class="w-full h-full flex gap-8">
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
                        <div class="w-3/4 h-full flex flex-col gap-4 pb-8 relative">
                            {#if edited}
                                <div class="w-full flex flex-wrap content-start gap-4">
                                    <input type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Map label" bind:value={edited.label} />
                                    <input type="number" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Map width" on:change={(e) => editWidth(e)} value={edited.width}/>
                                    <input type="number" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Map height" on:change={(e) => editHeight(e)} value={edited.height}/>
                                    <button type="button" on:click={() => mode = (mode === 'grab' ? 'tile' : 'grab') } class:bg-blue-700={mode === 'grab'} class=" text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-1.5 text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500 {mode==='grab' ? 'dark:text-white' : ''}" class:text-white={mode === 'grab'}>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-7" viewBox="0 0 24 24" fill="none">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M11.2071 5.6797C11.0909 5.85386 11 6.14834 11 6.5V7V8C11 8.55228 10.5523 9 10 9C9.44772 9 9 8.55228 9 8V7C9 6.64834 8.90906 6.35386 8.79295 6.1797C8.6966 6.03518 8.61209 6 8.5 6C8.38791 6 8.3034 6.03518 8.20705 6.1797C8.09094 6.35386 8 6.64834 8 7V10V12C8 12.5523 7.55228 13 7 13C6.44772 13 6 12.5523 6 12V10C6 9.64834 5.90906 9.35386 5.79295 9.1797C5.6966 9.03518 5.61209 9 5.5 9C5.38791 9 5.3034 9.03518 5.20705 9.1797C5.09094 9.35386 5 9.64834 5 10V14C5 15.033 5.70057 16.1402 7.0547 17.0429C8.3875 17.9315 10.1939 18.5 12 18.5C15.6675 18.5 18 16.251 18 14V8.5C18 8.14834 17.9091 7.85386 17.7929 7.6797C17.6966 7.53518 17.6121 7.5 17.5 7.5C17.3879 7.5 17.3034 7.53518 17.2071 7.6797C17.0909 7.85386 17 8.14834 17 8.5V9C17 9.55228 16.5523 10 16 10C15.4477 10 15 9.55228 15 9V8.5V7C15 6.64834 14.9091 6.35386 14.7929 6.1797C14.6966 6.03518 14.6121 6 14.5 6C14.3879 6 14.3034 6.03518 14.2071 6.1797C14.0909 6.35386 14 6.64834 14 7V8.5C14 9.05228 13.5523 9.5 13 9.5C12.4477 9.5 12 9.05228 12 8.5V7V6.5C12 6.14834 11.9091 5.85386 11.7929 5.6797C11.6966 5.53518 11.6121 5.5 11.5 5.5C11.3879 5.5 11.3034 5.53518 11.2071 5.6797ZM13.2855 4.34094C13.6245 4.12954 14.0313 4 14.5 4C15.3879 4 16.0534 4.46482 16.4571 5.0703C16.573 5.24423 16.6684 5.42998 16.7452 5.62242C16.975 5.54395 17.227 5.5 17.5 5.5C18.3879 5.5 19.0534 5.96482 19.4571 6.5703C19.8409 7.14614 20 7.85166 20 8.5V14C20 17.749 16.3325 20.5 12 20.5C9.80613 20.5 7.6125 19.8185 5.9453 18.7071C4.29943 17.6098 3 15.967 3 14V10C3 9.35166 3.15906 8.64614 3.54295 8.0703C3.9466 7.46482 4.61209 7 5.5 7C5.67545 7 5.84222 7.01815 6 7.05195V7C6 6.35166 6.15906 5.64614 6.54295 5.0703C6.9466 4.46482 7.61209 4 8.5 4C8.96874 4 9.37549 4.12954 9.71446 4.34094C10.1243 3.85131 10.7281 3.5 11.5 3.5C12.2719 3.5 12.8757 3.85131 13.2855 4.34094Z" fill="currentColor"/>
                                            </svg>
                                        <span class="sr-only">Icon description</span>
                                    </button>

                                    <button type="button" on:click={() => scaleUp() } class=" text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-1.5 text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500 {mode==='grab' ? 'dark:text-white' : ''}" class:text-white={mode === 'grab'}>
                                        <svg xmlns="http://www.w3.org/2000/svg"  class="h-4 w-7" viewBox="0 0 16 16" fill="none">
                                            <path d="M10 1H6V6L1 6V10H6V15H10V10H15V6L10 6V1Z" fill="currentColor"/>
                                            </svg>
                                        <span class="sr-only">Icon description</span>
                                    </button>

                                    <button type="button" on:click={() => scaleDown() } class=" text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-1.5 text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500 {mode==='grab' ? 'dark:text-white' : ''}" class:text-white={mode === 'grab'}>
                                        <svg xmlns="http://www.w3.org/2000/svg"  class="h-4 w-7" viewBox="0 0 16 16" fill="none">
                                            <path d="M1 10L1 6L15 6V10L1 10Z" fill="currentColor"/>
                                            </svg>
                                        <span class="sr-only">Icon description</span>
                                    </button>
                                </div>
                                <div bind:this={canvasContainer} class="grow w-full max-h-max">
                                    {#if squareSize}
                                        <canvas on:mousedown={e => canvasClick(e)} on:mousemove={e => drag(e)} on:mouseup={() => stopDragging()} id="canvas" width="1024" height="720" bind:this={canvas} ></canvas>
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
        width: 100%;
        height: 100%;
    }
</style>

