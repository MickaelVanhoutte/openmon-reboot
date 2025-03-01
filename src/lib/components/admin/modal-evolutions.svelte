<script lang="ts">
    import type { FullDexEntry } from "$lib/pokedex/fulldex";

    export let originalPokedex: FullDexEntry[];
    export let pokeForm: FullDexEntry;

    let previous: FullDexEntry[] = [];
    let next: FullDexEntry[] = [];
    let multipleNext: FullDexEntry[] = [];
   
    function update(){
        previous = [];
        next = [];
        multipleNext = [];

        let current: FullDexEntry = pokeForm;
        while(current && current.evolution.prev){
            console.log(current.evolution.prev[0]);
            let found = originalPokedex.find((entry) => entry.id === parseInt(current.evolution.prev[0]))
            if(found){
                current = found;
                previous = [found, ...previous];
            }else {
                break;
            }
        }
        current = pokeForm;
        if(current.evolution.next?.length > 1){
            multipleNext = current.evolution.next.map((next) => {
                let found = originalPokedex.find((entry) => entry.id === parseInt(next[0]))
                    return found;
            }).filter((entry) => entry);
        }else {
            while(current && current.evolution.next){
                console.log(current.evolution.next[0]);
                let found = originalPokedex.find((entry) => entry.id === parseInt(current.evolution.next[0]))
                if(found){
                    current = found;
                    next = [...next, found];
                }else {
                    break;
                }
            }
        }
        console.log(next, multipleNext);
    }

    $: pokeForm, update();
    

</script>

<div class="flex flex-col items-center gap-5">
    {#each previous as prev}
        <div class="min-w-1/2 flex flex-col items-center gap-5">
            <p>{prev.name.english}</p>
            <img class="grayscale" src={prev.image.thumbnail} alt="" />
            <p>{prev.evolution.next[0][1]}</p>
            <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="32" height="32" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 298.04"><path fill-rule="nonzero" d="M12.08 70.78c-16.17-16.24-16.09-42.54.15-58.7 16.25-16.17 42.54-16.09 58.71.15L256 197.76 441.06 12.23c16.17-16.24 42.46-16.32 58.71-.15 16.24 16.16 16.32 42.46.15 58.7L285.27 285.96c-16.24 16.17-42.54 16.09-58.7-.15L12.08 70.78z"/></svg>
        </div>
    {/each}

    <div class="min-w-1/2 flex flex-col items-center gap-5">
        <p>{pokeForm.name.english}</p>
        <img src={pokeForm.image.thumbnail} alt="" />
    </div>

    {#if multipleNext?.length > 0}
    <svg class="block mt-0 ml-auto mr-auto" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="32" height="32" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 298.04"><path fill-rule="nonzero" d="M12.08 70.78c-16.17-16.24-16.09-42.54.15-58.7 16.25-16.17 42.54-16.09 58.71.15L256 197.76 441.06 12.23c16.17-16.24 42.46-16.32 58.71-.15 16.24 16.16 16.32 42.46.15 58.7L285.27 285.96c-16.24 16.17-42.54 16.09-58.7-.15L12.08 70.78z"/></svg>
        <div class="w-full flex flex-wrap justify-center gap-1">
            {#each multipleNext as nex, index}
                <div class="flex flex-col items-center gap-5 mt-10 min-w-1/4 lg:min-w-1/5">
            
                    <p>{nex.name.english}</p>
                    <img class="grayscale" src={nex.image.thumbnail} alt="" />
                    {#if index < next.length - 1}
                    <p>{pokeForm.evolution.next[0][1]}</p>
                    <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="32" height="32" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 298.04"><path fill-rule="nonzero" d="M12.08 70.78c-16.17-16.24-16.09-42.54.15-58.7 16.25-16.17 42.54-16.09 58.71.15L256 197.76 441.06 12.23c16.17-16.24 42.46-16.32 58.71-.15 16.24 16.16 16.32 42.46.15 58.7L285.27 285.96c-16.24 16.17-42.54 16.09-58.7-.15L12.08 70.78z"/></svg>
                    {/if}
                    <input type="text" class="w-full text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5" bind:value={pokeForm.evolution.next[index][1]} />
                </div>
            {/each}
        </div>
    {:else}
        {#each next as nex, index}
            <div class="min-w-1/2 flex flex-col items-center gap-5">
                {#if index === 0}
                <input type="text" class="w-32 text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5" bind:value={pokeForm.evolution.next[0][1]} />
                <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="32" height="32" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 298.04"><path fill-rule="nonzero" d="M12.08 70.78c-16.17-16.24-16.09-42.54.15-58.7 16.25-16.17 42.54-16.09 58.71.15L256 197.76 441.06 12.23c16.17-16.24 42.46-16.32 58.71-.15 16.24 16.16 16.32 42.46.15 58.7L285.27 285.96c-16.24 16.17-42.54 16.09-58.7-.15L12.08 70.78z"/></svg>
                {/if}

                <p>{nex.name.english}</p>
                <img class="grayscale" src={nex.image.thumbnail} alt="" />
                {#if index < next.length - 1}
                <p>{nex.evolution.next[0][1]}</p>
                <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="32" height="32" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 298.04"><path fill-rule="nonzero" d="M12.08 70.78c-16.17-16.24-16.09-42.54.15-58.7 16.25-16.17 42.54-16.09 58.71.15L256 197.76 441.06 12.23c16.17-16.24 42.46-16.32 58.71-.15 16.24 16.16 16.32 42.46.15 58.7L285.27 285.96c-16.24 16.17-42.54 16.09-58.7-.15L12.08 70.78z"/></svg>
                {/if}
            </div>
        {/each}
    {/if}
</div>