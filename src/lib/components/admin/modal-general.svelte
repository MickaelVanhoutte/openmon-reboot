<script lang="ts">
    import type { FullDexEntry } from "$lib/pokedex/fulldex";
    import TypeSelect from "./type-select.svelte";

    export let pokeForm: FullDexEntry;
    export let baseEntry: FullDexEntry;


    $:total = Object.values(pokeForm.base).reduce((acc, curr) => acc + curr, 0);

    function selectType(e: CustomEvent, index: number){
        pokeForm.type[index] = e.detail;
    }

</script>


<div class="w-full mt-1">
    <h2 class="text-2xl font-bold">{pokeForm?.name?.english}</h2>
    <div class="flex gap-x-2 mt-2 items-end">
        {#each pokeForm.type as type, index}
            <div class="w-1/4">
                <label for="type1" class="block text-sm/6 font-medium text-gray-900">Type {index + 1}</label>
                <TypeSelect selected={type} on:typeSelect={(e:CustomEvent) => selectType(e, index)}/>
            </div>
        {/each}
        {#if pokeForm.type.length < 2}
            <button on:click={() => pokeForm.type = [...pokeForm.type, 'normal']} class="rounded-md bg-indigo-600 px-3 py-2 text-[0.8125rem]/5 font-semibold text-white hover:bg-indigo-500 h-fit">Add Type</button>
        {/if}
    </div>

    <div class="flex-1 mt-10">
        
        <label for="HP" class="block mb-1 text-sm font-medium text-gray-900">
            HP <span class="font-bold text-green-600">({pokeForm.base?.HP})</span>
            {#if baseEntry.base?.HP !== pokeForm.base?.HP}
                <span class="text-blue-600">(original : {baseEntry.base?.HP})</span>
            {/if}
        </label>
        <input id="HP" type="range" min="5" max="255" bind:value="{pokeForm.base.HP}" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ">

        <label for="attack" class="block mb-1 text-sm font-medium text-gray-900">
            Attack <span class="font-bold text-green-600">({pokeForm.base?.attack})</span>
            {#if baseEntry.base?.attack !== pokeForm.base?.attack}
                <span class="text-blue-600">(original : {baseEntry.base?.attack})</span>
            {/if}
        </label>
        <input id="attack" type="range" min="5" max="255" bind:value="{pokeForm.base.attack}" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ">
        
        <label for="defense" class="block mb-1 text-sm font-medium text-gray-900">
            Defense <span class="font-bold text-green-600">({pokeForm.base?.defense})</span>
            {#if baseEntry.base?.defense !== pokeForm.base?.defense}
                <span class="text-blue-600">(original : {baseEntry.base?.defense})</span>
            {/if}
        </label>
        <input id="defense" type="range" min="5" max="255" bind:value="{pokeForm.base.defense}" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">

        <label for="spAttack" class="block mb-1 text-sm font-medium text-gray-900">
            Sp.Attack<span class="font-bold text-green-600">({pokeForm.base?.spAttack})</span>
            {#if baseEntry.base?.spAttack !== pokeForm.base?.spAttack}
                <span class="text-blue-600">(original : {baseEntry.base?.spAttack})</span>
            {/if}
        </label>
        <input id="spAttack" type="range" min="5" max="255" bind:value="{pokeForm.base.spAttack}" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ">

        <label for="spDefense" class="block mb-1 text-sm font-medium text-gray-900">
            Sp.Defense<span class="font-bold text-green-600">({pokeForm.base?.spDefense})</span>
            {#if baseEntry.base?.spDefense !== pokeForm.base?.spDefense}
                <span class="text-blue-600">(original : {baseEntry.base?.spDefense})</span>
            {/if}
        </label>
        <input id="spDefense" type="range" min="5" max="255" bind:value="{pokeForm.base.spDefense}" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ">

        <label for="speed" class="block mb-1 text-sm font-medium text-gray-900">
            Speed<span class="font-bold text-green-600">({pokeForm.base?.speed})</span>
            {#if baseEntry.base?.speed !== pokeForm.base?.speed}
                <span class="text-blue-600">(original : {baseEntry.base?.speed})</span>
            {/if}
        </label>
        <input id="speed" type="range" min="5" max="255" bind:value="{pokeForm.base.speed}" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
    </div>
    <div>
        <p class="text-lg underline decoration-blue-600">Total: {total}</p>
    </div>
</div>