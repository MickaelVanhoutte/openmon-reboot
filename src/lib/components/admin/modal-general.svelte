<script lang="ts">
    import type { FullDexEntry } from "$lib/pokedex/fulldex";

    export let pokeForm: FullDexEntry;
</script>


<div class="w-full mt-1">
    <h2 class="text-2xl font-bold">{pokeForm?.name?.english}</h2>
    <div class="flex gap-x-2 mt-2 items-end">
        {#each pokeForm.type as type, index}
            <div class="max-w-1/2">
                <label for="price" class="block text-sm/6 font-medium text-gray-900">Type {index + 1}</label>
                <div class="mt-2">
                    <div class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                        <input type="text"  value="{type}"  class="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6" placeholder="Type">
                    </div>
                </div>
            </div>
        {/each}
        {#if pokeForm.type.length < 2}
            <button on:click={() => pokeForm.type = [...pokeForm.type, 'Normal']} class="rounded-md bg-indigo-600 px-3 py-2 text-[0.8125rem]/5 font-semibold text-white hover:bg-indigo-500 h-fit">Add Type</button>
        {/if}
    </div>

    <div class="flex-1 mt-2">
        
        <label for="HP" class="block mb-1 text-sm font-medium text-gray-900">HP ({pokeForm.base?.HP})</label>
        <input id="HP" type="range" min="5" max="255" bind:value="{pokeForm.base.HP}" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ">

        <label for="attack" class="block mb-1 text-sm font-medium text-gray-900">Attack  ({pokeForm.base?.attack})</label>
        <input id="attack" type="range" min="5" max="255" bind:value="{pokeForm.base.attack}" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ">
        
        <label for="defense" class="block mb-1 text-sm font-medium text-gray-900">Defense ({pokeForm.base?.defense})</label>
        <input id="defense" type="range" min="5" max="255" bind:value="{pokeForm.base.defense}" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">

        <label for="spAttack" class="block mb-1 text-sm font-medium text-gray-900">Sp.Attack ({pokeForm.base?.spAttack})</label>
        <input id="spAttack" type="range" min="5" max="255" bind:value="{pokeForm.base.spAttack}" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ">

        <label for="spDefense" class="block mb-1 text-sm font-medium text-gray-900">Sp.Defense ({pokeForm.base?.spDefense})</label>
        <input id="spDefense" type="range" min="5" max="255" bind:value="{pokeForm.base.spDefense}" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ">

        <label for="speed" class="block mb-1 text-sm font-medium text-gray-900">Speed ({pokeForm.base?.speed})</label>
        <input id="speed" type="range" min="5" max="255" bind:value="{pokeForm.base.speed}" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
    </div>
</div>