<script lang="ts">
  import type { GameData } from "$lib/game/data.model";

    export let data: GameData;
</script>

<div class="grid md:grid-cols-2 grid-cols-1 gap-8 w-full">

    <div class="w-full flex flex-col gap-8">
        <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Game name</label>
        <input type="text" id="name" bind:value={data.options.name} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
    
    
        <label class="inline-flex items-center mb-5 cursor-pointer">
            <input type="checkbox" value="" class="sr-only peer" bind:checked={data.options.gDriveSync}>
            <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span class="ms-3 text-sm font-medium text-gray-900">Use Google drive to synchronize game data</span>
        </label>
    </div>
    
    <div class="w-full flex flex-col gap-8">

        <div class="relative mb-6">
            <label for="labels-range-input">Difficulty</label>
            <input id="labels-range-input" type="range" bind:value={data.options.difficulty} min="0" max="2" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
            <span class="text-sm text-gray-500 absolute start-0 -bottom-6">Easy</span>
            <span class="text-sm text-gray-500 absolute start-1/2 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6">Standard</span>
            <span class="text-sm text-gray-500 absolute start-2/2 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6">Hard</span>
        </div>
        <!-- Difficulty explaination -->
         {#if data.options.difficulty === 0}
            <p class="text-sm text-gray-500">Easy mode: The game is easier than classical games. Trainers use random moves and have no or low IVs/EVs.</p>
        {:else if data.options.difficulty === 1}
            <p class="text-sm text-gray-500">Standard mode: The game is balanced. Trainers will use their best moves and IVs/EVs increase toward the end.</p>
        {:else if data.options.difficulty === 2}
            <p class="text-sm text-gray-500">Hard mode: The game is harder than standard mode. Trainers uses advanced strategies and have full IVs/EVs.</p>
        {/if}

       
        <div class="relative mb-6">
            <label for="labels-range-input">Shiny Rate</label>
            <input id="labels-range-input" type="range" bind:value={data.options.shinyRate} min="0" max="4" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
            <span class="text-sm text-gray-500 absolute start-0 -bottom-6">Default (1/8192)</span>
            <span class="text-sm text-gray-500 absolute start-1/4 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6">1/2048</span>
            <span class="text-sm text-gray-500 absolute start-2/4 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6">1/512</span>
            <span class="text-sm text-gray-500 absolute start-3/4 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6">1/128</span>
            <span class="text-sm text-gray-500 absolute end-0 -bottom-6">Max (100%)</span>
        </div>

        
    </div>
</div>