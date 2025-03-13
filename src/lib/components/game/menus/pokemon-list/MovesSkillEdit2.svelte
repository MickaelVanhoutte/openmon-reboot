<script lang="ts">
    import {MoveInstance, type PokemonInstance} from '$lib/js/pokemons/pokedex';
    import type { GameContext } from '$lib/js/context/gameContext';

    export let context: GameContext;

    export let selectedMons: PokemonInstance;
    export let moveEdit: boolean;

    export let zIndex: number;
    let mechanicRegex = /{[^}]*}/g;
    $: monstMoves = selectedMons.moves;
    $: tmp =
        context.POKEDEX.findById(selectedMons.id)
            ?.result?.moves?.filter((move) => move.level <= selectedMons.level)
            ?.filter((move) => !selectedMons.moves.find((m) => m.id === move.id)) || [];
    $: allMoves = [...new Map(tmp.map((item) => [item.id, item])).values()];

    function remove(idx: number){
        selectedMons.moves = selectedMons.moves.filter((_, i) => i !== idx);
    }

    function add(move){
        if(selectedMons.moves.length === 4) return;
        selectedMons.moves = [...selectedMons.moves,
            new MoveInstance(
                move.id,
                move.name,
                move.type,
                move.category,
                move.power,
                move.accuracy,
                move.pp,
                move.priority,
                move.target,
                move.effect,
                move.effectChance,
                move.description,
                move.level
            )
        ];
    }
</script>

<div class="_wrapper flex justify-between px-2" class:open={moveEdit} style="--zIndex:{zIndex}">
    <ul class="list bg-base-100 rounded-box shadow-md overflow-auto w-6/12" style="max-height: 99%">
        {#each allMoves as move, index (move.id)}
        <li class="list-row w-full items-center" style="max-height: calc(100% / 4)">
            <div class="flex flex-col gap-2">
                <img
                        class="size-5"
                        src={`src/assets/types/${move?.type}-small.png`}
                        alt={move?.category}
                />
                <img
                        class="size-5"
                        src={`src/assets/moves-cat/${move?.category}.png`}
                        alt={move?.category}
                />
            </div>
            <div>
                <div class="text-xl flex justify-between w-full"><span>{move.name}</span> <span>{move.power || ''}</span></div>
                <p class="uppercase font-semibold opacity-60" style="font-size:.6rem">{move?.description?.replaceAll('$effect_chance', move?.effectChance + '')?.replace(mechanicRegex, '')}</p>
            </div>
            <button class="btn btn-square btn-ghost" class:btn-disabled={monstMoves?.length === 4} on:click={()=>add(move)} >
                <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"><path d="M6 3L20 12 6 21 6 3z"></path></g></svg>
            </button>
        </li>
        {/each}

    </ul>

    <ul class="list bg-base-100 rounded-box shadow-md overflow-auto w-6/12" style="max-height: 99%">
        {#each monstMoves as move, index (move.id)}
        <li class="list-row w-full"  style="max-height: calc(100% / 4)">

            <div class="flex flex-col gap-2 order-3">
                <img
                        class="size-5"
                        src={`src/assets/types/${move?.type}-small.png`}
                        alt={move?.category}
                />
                <img
                        class="size-5"
                        src={`src/assets/moves-cat/${move?.category}.png`}
                        alt={move?.category}
                />
            </div>
            <div class="order-2 flex items-end flex-col">
                <div class="text-xl flex justify-between w-full"><span>{move.power || ''}</span><span>{move.name}</span></div>
                <p class="uppercase font-semibold opacity-60 text-end" style="font-size:.6rem">{move?.description?.replaceAll('$effect_chance', move?.effectChance + '')?.replace(mechanicRegex, '')}</p>
            </div>
            <button class="btn btn-square btn-ghost order-1" class:btn-disabled={monstMoves?.length === 1} on:click={() => remove(index)}>
                <svg class="size-[1.2em] rotate-180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"><path d="M6 3L20 12 6 21 6 3z"></path></g></svg>
            </button>
        </li>
        {/each}
    </ul>
</div>

<style lang="scss">
  ._wrapper {
    background: rgba(84, 80, 108, 0.85);
    height: calc(100% - 2rem);
    width: 100%;
    box-sizing: border-box;
    position: absolute;

    z-index: var(--zIndex, 11);
    left: 0;
    bottom: -100%;
    transition: bottom 0.5s ease-in-out;

    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 2%;
    text-shadow: 1px 1px 1px black;

    &.open {
      bottom: 0;
    }
  }

  .type {
    color: white;
    text-shadow: 1px 1px 1px black;
    background-color: var(--bg);
    border-radius: 8px;
    padding: 4px;
    font-size: 22px;
  }
</style>