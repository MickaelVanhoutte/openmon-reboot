<script lang="ts">
    import {onMount} from 'svelte';
    import type {Map} from '$lib/maps/map.model';
    import MapLayers from './map-layers.svelte';

    interface TilesetConfig {
        name: string;
        tileSize: number;
        x: number;
        y: number;
    }

    let maps: Map[] = [];
    let tilesetConfig: TilesetConfig | undefined;
    let edited: Map;
    let selectedLayerIdx: number = 0;
    let selectedTile: { x: number; y: number } | undefined;
    let translatePos: { x: number; y: number } = {x: 0, y: 0};
    let startDragOffset: { x: number; y: number } = {x: 0, y: 0};
    let dragging = false;
    let tiling = false;
    let showMapModal = false;
    let closedModal = true;
    let closedLayersModal = true;
    let optimized = false;
    let showLayers = false;
    let canvas: HTMLCanvasElement;
    let selectedTilePreview: HTMLCanvasElement;
    let spriteImg: HTMLImageElement;
    let spriteSizeReference: HTMLDivElement;
    let canvasContainer: HTMLDivElement;
    let squareSize = 32;
    let scale = 1;
    let mode: 'tile' | 'grab' = 'tile';
    let selectedTab: 'tiles' | 'objects' = 'tiles';

    const toggleModal = () => {
        showMapModal = !showMapModal;
        setTimeout(() => {
            closedModal = !closedModal;
        }, 500);
    };

    const toggleLayers = () => {
        showLayers = !showLayers;
        setTimeout(() => {
            closedLayersModal = !closedLayersModal;
        }, 500);
    };

    function initMapGrid() {
        edited.layers = [
            {
                label: 'base',
                visible: true,
                grid: [],
            },
        ];
        for (let i = 0; i < edited.width; i++) {
            edited.layers[0].grid[i] = [];
            for (let j = 0; j < edited.height; j++) {
                edited.layers[0].grid[i][j] = {x: -1, y: -1};
            }
        }
    }

    function updateGrid() {
        // grid height or width has changed, keep existing values if possible

        edited.layers = edited.layers?.map((layer) => {
            let newLayer = {
                label: layer.label,
                visible: layer.visible,
                grid: [],
            };
            for (let i = 0; i < edited.width; i++) {
                newLayer.grid[i] = [];
                for (let j = 0; j < edited.height; j++) {
                    newLayer.grid[i][j] = layer.grid[i]?.[j] || {x: -1, y: -1};
                }
            }
            return newLayer;
        });
    }

    function newMap() {
        edited = {id: '0', label: 'new map', width: 25, height: 25, layers: []};
        // init grid arrays
        initMapGrid();
        selectedLayerIdx = 0;
        toggleModal();
    }

    function edit(map: Map) {
        edited = map;
        selectedLayerIdx = 0;
        toggleModal();
    }

    function optimizeCanvas(ctx: CanvasRenderingContext2D) {
        if (canvas && ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            optimized = true;
        }
    }

    function remove(map: Map) {
        maps = maps.filter((entry) => entry.id !== map.id);
    }

    function selectTile(x: number, y: number) {
        selectedTile = {x, y};
        mode = 'tile';

        if (selectedTilePreview && tilesetConfig) {
            const ctx = selectedTilePreview.getContext('2d');
            if (ctx && spriteImg) {
                const tileSize = tilesetConfig.tileSize;
                const sourceStart = {
                    x: x * tileSize,
                    y: y * tileSize,
                };
                ctx.clearRect(0, 0, selectedTilePreview.width, selectedTilePreview.height);
                ctx.drawImage(
                    spriteImg,
                    sourceStart.x,
                    sourceStart.y,
                    tileSize,
                    tileSize,
                    0,
                    0,
                    selectedTilePreview.width,
                    selectedTilePreview.height,
                );
            }
        }
    }

    function scaleUp() {
        if (scale < 5) {
            scale += 0.3;
        }
    }

    function scaleDown() {
        if (scale > 0.3) {
            scale -= 0.3;
        }
    }

    function canvasClick(e) {
        if (mode === 'tile') {
            tiling = true;
            setTile(e);
        } else {
            dragging = true;
            startDragOffset = {
                x: e.clientX - translatePos.x,
                y: e.clientY - translatePos.y,
            };
        }
    }

    function stopDragging() {
        dragging = false;
        tiling = false;
    }

    function canvasMove(e) {
        if (mode === 'grab' && dragging) {
            translatePos = {
                x: e.clientX - startDragOffset.x,
                y: e.clientY - startDragOffset.y,
            };
        }
        if (selectedTile && tiling) {
            setTile(e);
        }
    }

    function drawCanvasGrid() {
        const ctx = canvas.getContext('2d');
        if (!optimized && ctx) {
            optimizeCanvas(ctx);
        }
        canvas.width = canvasContainer.offsetWidth;
        canvas.height = canvasContainer.offsetHeight;
        const refWidth = spriteSizeReference?.offsetWidth;
        const refHeight = spriteSizeReference?.offsetHeight;
        squareSize = refWidth || refHeight;
        //const smaller = canvas.height < canvas.width ? canvas.height : canvas.width;
        //const tileWidth = smaller / edited.width;
        if (ctx && tilesetConfig && spriteSizeReference) {
            const tileSize = tilesetConfig.tileSize;
            const x = edited.width;
            const y = edited.height;
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 0.5;

            ctx.scale(scale, scale);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.translate(translatePos.x, translatePos.y);

            const visibleLayers = edited.layers?.filter((layer) => layer.visible);
            console.log(visibleLayers?.length);
            if (visibleLayers?.length === 0) {
                for (let i = 0; i < x; i++) {
                    for (let j = 0; j < y; j++) {
                        // draw rect borders
                        ctx.strokeRect(i * refWidth, j * refHeight, refWidth, refHeight);
                    }
                }
            } else {
                visibleLayers?.forEach((layer, index) => {
                    for (let i = 0; i < x; i++) {
                        for (let j = 0; j < y; j++) {
                            // draw rect borders
                            if (index === 0) {
                                ctx.strokeRect(i * refWidth, j * refHeight, refWidth, refHeight);
                            }
                            // draw tile
                            const tile = layer.grid[i][j];

                            if (tile.x >= 0 && tile.y >= 0) {
                                const sourceStart = {
                                    x: tile.x * tileSize,
                                    y: tile.y * tileSize,
                                };
                                const destStart = {
                                    x: i * refWidth,
                                    y: j * refHeight,
                                };
                                ctx.drawImage(
                                    spriteImg,
                                    sourceStart.x,
                                    sourceStart.y,
                                    tileSize,
                                    tileSize,
                                    destStart.x,
                                    destStart.y,
                                    refWidth,
                                    refHeight,
                                );
                            }
                        }
                    }
                });
            }
        }
    }

    function editWidth(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
        edited = {...edited, width: parseInt(e.currentTarget.value)};
        updateGrid();
    }

    function editHeight(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
        edited = {...edited, height: parseInt(e.currentTarget.value)};
        updateGrid();
    }

    function setTile(e: MouseEvent & { currentTarget: EventTarget & HTMLCanvasElement }) {
        // detect x,y position on canvas grid
        let tilePosition = {
            x: Math.floor((e.offsetX / scale - translatePos.x) / spriteSizeReference.offsetWidth),
            y: Math.floor((e.offsetY / scale - translatePos.y) / spriteSizeReference.offsetHeight),
        };
        let isInGrid =
            tilePosition.x >= 0 &&
            tilePosition.x < edited.width &&
            tilePosition.y >= 0 &&
            tilePosition.y < edited.height;

        if (!isInGrid || !selectedTile) {
            return;
        }
        //set in edited grid
        edited = {
            ...edited,
            layers: edited.layers.map((layer, index) => {
                if (index === selectedLayerIdx) {
                    layer.grid[tilePosition.x][tilePosition.y] = {x: selectedTile.x, y: selectedTile.y};
                }
                return layer;
            }),
        };
        drawCanvasGrid();
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
    >New map
    </button>
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
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>

                    <div class="flex h-full max-h-full flex-col overflow-y-hidden bg-white shadow-xl">
                        <div class="px-4 sm:px-6 p-2">
                            <h2 class="text-3xl font-semibold text-gray-900" id="slide-over-title">Map editor</h2>
                        </div>
                        <div class="relative flex-1 px-1 h-full">
                            <!-- Drawer content -->

                            {#if tilesetConfig}
                                <div class="w-full h-full flex gap-2">
                                    <div class="w-1/4 h-full overflow-hidden relative">

                                        <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200">
                                            <li class="me-2">
                                                <a href="#" on:click={()=> selectedTab = 'tiles'} aria-current="page"
                                                   class="inline-block p-4 rounded-t-lg {selectedTab === 'tiles' ? 'active text-blue-600 bg-gray-100' : 'hover:text-gray-600 hover:bg-gray-50'}">Tiles</a>
                                            </li>
                                            <li class="me-2">
                                                <a href="#" on:click={()=> selectedTab = 'objects'}
                                                   class="inline-block p-4 rounded-t-lg {selectedTab === 'objects' ? 'active text-blue-600 bg-gray-100' : 'hover:text-gray-600 hover:bg-gray-50'}">Objects</a>
                                            </li>
                                        </ul>
                                        {#if selectedTab === 'tiles'}
                                            <div class="relative h-full w-full overflow-y-scroll">
                                                <img
                                                        bind:this={spriteImg}
                                                        class="w-full h-auto aspect-auto mb-8"
                                                        src="final/tileset.png"
                                                        alt=""
                                                />

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
                                        {/if}
                                    </div>
                                        <div class="w-3/4 h-full flex flex-col gap-4 pb-8 relative">
                                            {#if edited}
                                                <div class="w-full flex flex-wrap justify-between gap-4">
                                                    <div class="flex flex-wrap content-start gap-4">
                                                        <div id="selectedTile" class="border-1 border-black w-10 h-10">
                                                            <canvas class="w-full h-full"
                                                                    bind:this={selectedTilePreview}></canvas>
                                                        </div>
                                                        <button
                                                                type="button"
                                                                on:click={() => (mode = mode === 'grab' ? 'tile' : 'grab')}
                                                                class:bg-blue-700={mode === 'grab'}
                                                                class=" text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-1.5 text-center inline-flex items-center"
                                                                class:text-white={mode === 'grab'}
                                                        >
                                                            {#if mode === 'tile'}
                                                                <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        class="h-4 w-7"
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                >
                                                                    <path
                                                                            fill-rule="evenodd"
                                                                            clip-rule="evenodd"
                                                                            d="M11.2071 5.6797C11.0909 5.85386 11 6.14834 11 6.5V7V8C11 8.55228 10.5523 9 10 9C9.44772 9 9 8.55228 9 8V7C9 6.64834 8.90906 6.35386 8.79295 6.1797C8.6966 6.03518 8.61209 6 8.5 6C8.38791 6 8.3034 6.03518 8.20705 6.1797C8.09094 6.35386 8 6.64834 8 7V10V12C8 12.5523 7.55228 13 7 13C6.44772 13 6 12.5523 6 12V10C6 9.64834 5.90906 9.35386 5.79295 9.1797C5.6966 9.03518 5.61209 9 5.5 9C5.38791 9 5.3034 9.03518 5.20705 9.1797C5.09094 9.35386 5 9.64834 5 10V14C5 15.033 5.70057 16.1402 7.0547 17.0429C8.3875 17.9315 10.1939 18.5 12 18.5C15.6675 18.5 18 16.251 18 14V8.5C18 8.14834 17.9091 7.85386 17.7929 7.6797C17.6966 7.53518 17.6121 7.5 17.5 7.5C17.3879 7.5 17.3034 7.53518 17.2071 7.6797C17.0909 7.85386 17 8.14834 17 8.5V9C17 9.55228 16.5523 10 16 10C15.4477 10 15 9.55228 15 9V8.5V7C15 6.64834 14.9091 6.35386 14.7929 6.1797C14.6966 6.03518 14.6121 6 14.5 6C14.3879 6 14.3034 6.03518 14.2071 6.1797C14.0909 6.35386 14 6.64834 14 7V8.5C14 9.05228 13.5523 9.5 13 9.5C12.4477 9.5 12 9.05228 12 8.5V7V6.5C12 6.14834 11.9091 5.85386 11.7929 5.6797C11.6966 5.53518 11.6121 5.5 11.5 5.5C11.3879 5.5 11.3034 5.53518 11.2071 5.6797ZM13.2855 4.34094C13.6245 4.12954 14.0313 4 14.5 4C15.3879 4 16.0534 4.46482 16.4571 5.0703C16.573 5.24423 16.6684 5.42998 16.7452 5.62242C16.975 5.54395 17.227 5.5 17.5 5.5C18.3879 5.5 19.0534 5.96482 19.4571 6.5703C19.8409 7.14614 20 7.85166 20 8.5V14C20 17.749 16.3325 20.5 12 20.5C9.80613 20.5 7.6125 19.8185 5.9453 18.7071C4.29943 17.6098 3 15.967 3 14V10C3 9.35166 3.15906 8.64614 3.54295 8.0703C3.9466 7.46482 4.61209 7 5.5 7C5.67545 7 5.84222 7.01815 6 7.05195V7C6 6.35166 6.15906 5.64614 6.54295 5.0703C6.9466 4.46482 7.61209 4 8.5 4C8.96874 4 9.37549 4.12954 9.71446 4.34094C10.1243 3.85131 10.7281 3.5 11.5 3.5C12.2719 3.5 12.8757 3.85131 13.2855 4.34094Z"
                                                                            fill="currentColor"
                                                                    />
                                                                </svg>
                                                            {:else}
                                                                <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        viewBox="0 0 24 24"
                                                                        class="h-4 w-7"
                                                                        fill="none"
                                                                >
                                                                    <path
                                                                            d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
                                                                            stroke="currentColor"
                                                                            stroke-width="1.5"
                                                                            stroke-linecap="round"
                                                                            stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                            d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
                                                                            stroke="currentColor"
                                                                            stroke-width="1.5"
                                                                            stroke-linecap="round"
                                                                            stroke-linejoin="round"
                                                                    />
                                                                </svg>
                                                            {/if}
                                                            <span class="sr-only">Icon description</span>
                                                        </button>

                                                        <button
                                                                type="button"
                                                                on:click={() => scaleUp()}
                                                                class=" text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-1.5 text-center inline-flex items-center"
                                                        >
                                                            <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    class="h-4 w-7"
                                                                    viewBox="0 0 16 16"
                                                                    fill="none"
                                                            >
                                                                <path
                                                                        d="M10 1H6V6L1 6V10H6V15H10V10H15V6L10 6V1Z"
                                                                        fill="currentColor"
                                                                />
                                                            </svg>
                                                            <span class="sr-only">Icon description</span>
                                                        </button>

                                                        <button
                                                                type="button"
                                                                on:click={() => scaleDown()}
                                                                class=" text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-1.5 text-center inline-flex items-center"
                                                        >
                                                            <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    class="h-4 w-7"
                                                                    viewBox="0 0 16 16"
                                                                    fill="none"
                                                            >
                                                                <path d="M1 10L1 6L15 6V10L1 10Z" fill="currentColor"/>
                                                            </svg>
                                                            <span class="sr-only">Icon description</span>
                                                        </button>

                                                        <button
                                                                type="button"
                                                                on:click={toggleLayers}
                                                                class=" text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-1.5 text-center inline-flex items-center"
                                                        >
                                                            <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    class="h-4 w-7"
                                                            >
                                                                <path
                                                                        fill-rule="evenodd"
                                                                        clip-rule="evenodd"
                                                                        d="M12 4.75C10.9396 4.75 10.0907 5.07796 8.06584 5.88789L5.25737 7.01128C4.24694 7.41545 3.54677 7.69659 3.09295 7.93451C3.0486 7.95776 3.00863 7.97959 2.97267 8C3.00863 8.02041 3.0486 8.04224 3.09295 8.06549C3.54677 8.30341 4.24694 8.58455 5.25737 8.98872L8.06584 10.1121C10.0907 10.922 10.9396 11.25 12 11.25C13.0604 11.25 13.9093 10.922 15.9342 10.1121L18.7426 8.98872C19.7531 8.58455 20.4532 8.30341 20.9071 8.06549C20.9514 8.04224 20.9914 8.02041 21.0273 8C20.9914 7.97959 20.9514 7.95776 20.9071 7.93451C20.4532 7.69659 19.7531 7.41545 18.7426 7.01128L15.9342 5.88789C13.9093 5.07796 13.0604 4.75 12 4.75ZM7.62442 4.4489C9.50121 3.69796 10.6208 3.25 12 3.25C13.3792 3.25 14.4988 3.69796 16.3756 4.4489C16.4138 4.4642 16.4524 4.47962 16.4912 4.49517L19.3451 5.6367C20.2996 6.01851 21.0728 6.32776 21.6035 6.60601C21.8721 6.74683 22.1323 6.90648 22.333 7.09894C22.5392 7.29668 22.75 7.59658 22.75 8C22.75 8.40342 22.5392 8.70332 22.333 8.90106C22.1323 9.09352 21.8721 9.25317 21.6035 9.39399C21.2519 9.57835 20.7938 9.77632 20.247 10C20.7938 10.2237 21.2519 10.4216 21.6035 10.606C21.8721 10.7468 22.1323 10.9065 22.333 11.0989C22.5392 11.2967 22.75 11.5966 22.75 12C22.75 12.4034 22.5392 12.7033 22.333 12.9011C22.1323 13.0935 21.8721 13.2532 21.6035 13.394C21.2519 13.5784 20.7938 13.7763 20.247 14C20.7938 14.2237 21.2519 14.4216 21.6035 14.606C21.8721 14.7468 22.1323 14.9065 22.333 15.0989C22.5392 15.2967 22.75 15.5966 22.75 16C22.75 16.4034 22.5392 16.7033 22.333 16.9011C22.1323 17.0935 21.8721 17.2532 21.6035 17.394C21.0728 17.6722 20.2997 17.9815 19.3451 18.3633L16.4912 19.5048C16.4524 19.5204 16.4138 19.5358 16.3756 19.5511C14.4988 20.302 13.3792 20.75 12 20.75C10.6208 20.75 9.50121 20.302 7.62443 19.5511C7.58619 19.5358 7.54763 19.5204 7.50875 19.5048L4.6549 18.3633C3.70034 17.9815 2.9272 17.6722 2.39647 17.394C2.12786 17.2532 1.86765 17.0935 1.66701 16.9011C1.46085 16.7033 1.25 16.4034 1.25 16C1.25 15.5966 1.46085 15.2967 1.66701 15.0989C1.86765 14.9065 2.12786 14.7468 2.39647 14.606C2.74813 14.4216 3.20621 14.2237 3.75299 14C3.20621 13.7763 2.74813 13.5784 2.39647 13.394C2.12786 13.2532 1.86765 13.0935 1.66701 12.9011C1.46085 12.7033 1.25 12.4034 1.25 12C1.25 11.5966 1.46085 11.2967 1.66701 11.0989C1.86765 10.9065 2.12786 10.7468 2.39647 10.606C2.74813 10.4216 3.20621 10.2237 3.75299 10C3.20621 9.77632 2.74813 9.57835 2.39647 9.39399C2.12786 9.25317 1.86765 9.09352 1.66701 8.90106C1.46085 8.70332 1.25 8.40342 1.25 8C1.25 7.59658 1.46085 7.29668 1.66701 7.09894C1.86765 6.90648 2.12786 6.74683 2.39647 6.60601C2.92721 6.32776 3.70037 6.01851 4.65496 5.63669L7.50875 4.49517C7.54763 4.47962 7.58618 4.4642 7.62442 4.4489ZM5.76613 10.8078L5.25737 11.0113C4.24694 11.4154 3.54677 11.6966 3.09295 11.9345C3.0486 11.9578 3.00863 11.9796 2.97268 12C3.00863 12.0204 3.0486 12.0422 3.09295 12.0655C3.54677 12.3034 4.24694 12.5845 5.25737 12.9887L8.06584 14.1121C10.0907 14.922 10.9396 15.25 12 15.25C13.0604 15.25 13.9093 14.922 15.9342 14.1121L18.7426 12.9887C19.7531 12.5845 20.4532 12.3034 20.9071 12.0655C20.9514 12.0422 20.9914 12.0204 21.0273 12C20.9914 11.9796 20.9514 11.9578 20.9071 11.9345C20.4532 11.6966 19.7531 11.4154 18.7426 11.0113L18.2339 10.8078L16.4912 11.5048C16.4524 11.5204 16.4138 11.5358 16.3756 11.5511C14.4988 12.302 13.3792 12.75 12 12.75C10.6208 12.75 9.50121 12.302 7.62443 11.5511C7.58619 11.5358 7.54763 11.5204 7.50875 11.5048L5.76613 10.8078ZM5.76613 14.8078L5.25737 15.0113C4.24694 15.4154 3.54678 15.6966 3.09295 15.9345C3.0486 15.9578 3.00863 15.9796 2.97268 16C3.00863 16.0204 3.0486 16.0422 3.09295 16.0655C3.54677 16.3034 4.24694 16.5845 5.25737 16.9887L8.06584 18.1121C10.0907 18.922 10.9396 19.25 12 19.25C13.0604 19.25 13.9093 18.922 15.9342 18.1121L18.7426 16.9887C19.7531 16.5845 20.4532 16.3034 20.9071 16.0655C20.9514 16.0422 20.9914 16.0204 21.0273 16C20.9914 15.9796 20.9514 15.9578 20.9071 15.9345C20.4532 15.6966 19.7531 15.4154 18.7426 15.0113L18.2339 14.8078L16.4912 15.5048C16.4524 15.5204 16.4138 15.5358 16.3756 15.5511C14.4988 16.302 13.3792 16.75 12 16.75C10.6208 16.75 9.50121 16.302 7.62443 15.5511C7.58619 15.5358 7.54763 15.5204 7.50875 15.5048L5.76613 14.8078Z"
                                                                        fill="currentColor"
                                                                />
                                                            </svg>
                                                            <span class="sr-only">Icon description</span>
                                                        </button>
                                                    </div>
                                                    <div class="flex flex-wrap content-start gap-4">
                                                        <input
                                                                type="text"
                                                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                                                                placeholder="Map label"
                                                                bind:value={edited.label}
                                                        />
                                                        <input
                                                                type="number"
                                                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                                                                placeholder="Map width"
                                                                on:change={(e) => editWidth(e)}
                                                                value={edited.width}
                                                        />
                                                        <input
                                                                type="number"
                                                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                                                                placeholder="Map height"
                                                                on:change={(e) => editHeight(e)}
                                                                value={edited.height}
                                                        />
                                                    </div>
                                                </div>
                                                <div bind:this={canvasContainer} class="grow w-full max-h-max">
                                                    {#if squareSize}
                                                        <canvas
                                                                class:cursor-grab={mode === 'grab'}
                                                                class:cursor-grabbing={mode === 'grab' && dragging}
                                                                class:cursor-cell={mode === 'tile'}
                                                                on:mousedown={(e) => canvasClick(e)}
                                                                on:mousemove={(e) => canvasMove(e)}
                                                                on:mouseup={() => stopDragging()}
                                                                id="canvas"
                                                                width="1024"
                                                                height="720"
                                                                bind:this={canvas}
                                                        ></canvas>
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

<div
        class={showLayers
    ? 'relative ease-linear z-10'
    : closedLayersModal
      ? 'relative ease-linear -z-10'
      : 'relative ease-linear z-10'}
        aria-labelledby="slide-over-title"
        role="dialog"
        aria-modal="true"
>
    <div
            class={showLayers
      ? 'fixed ease-in-out duration-500 inset-0 bg-gray-500/75 transition-opacity opacity-100'
      : 'fixed ease-in-out duration-500 inset-0 bg-gray-500/75 transition-opacity opacity-0'}
            aria-hidden="true"
    ></div>

    <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
            <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-1/2 w-auto pl-10">
                <div
                        class={showLayers
            ? 'pointer-events-auto relative w-screen max-w-screen h-screen transform transition ease-in-out duration-500 sm:duration-700 translate-x-0'
            : 'pointer-events-auto relative w-screen max-w-md transform transition ease-in-out duration-500 sm:duration-700 translate-x-full'}
                >
                    <div
                            class={showLayers
              ? 'absolute top-0 left-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4 opacity-100'
              : 'absolute top-0 left-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4 opacity-0'}
                    >
                        <button
                                on:click={toggleLayers}
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
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>

                    <div class="flex h-full max-h-full flex-col overflow-y-hidden bg-white shadow-xl">
                        <div class="px-4 sm:px-6 p-2">
                            <h2 class="text-3xl font-semibold text-gray-900" id="slide-over-title">Layers</h2>
                        </div>
                        <div class="relative flex-1 px-1 h-full">
                            <!-- Drawer content -->
                            <MapLayers
                                    bind:map={edited}
                                    bind:selectedLayerIdx
                                    bind:showLayers
                                    bind:closedLayersModal
                            />
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
