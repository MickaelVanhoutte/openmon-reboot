<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { backInOut } from 'svelte/easing';
	import { PokemonInstance } from '$lib/js/pokemons/pokedex';
	import type { GameContext } from '$lib/js/context/gameContext';
	import MovesSkillEdit2 from '$lib/components/game/menus/pokemon-list/MovesSkillEdit2.svelte';

	export let context: GameContext;
	export let selected: number;

	export let zIndex: number;
	export let selectedMove: number;
	let movableMove: number = -1;
	export let pkmnList: PokemonInstance[];
	//let pkmnList: PokemonInstance[] = context.player.monsters;

	export let moveEdit: boolean;

	let nextZIndex = zIndex + 1;

	let mechanicRegex = /{[^}]*}/g;

	$: selectedMons = pkmnList[selected];
	$: description = selectedMons.moves[selectedMove].description
		?.replace('$effect_chance', selectedMons?.moves[selectedMove]?.effectChance)
		?.replace(mechanicRegex, '');

	function handleSelect(idx: number){
		if(movableMove !== -1 && selectedMove === idx){
			movableMove = -1;
			return;
		}
		if(movableMove === -1 && selectedMove === idx){
			movableMove = idx;
			return;
		}
		selectedMove = idx;
		if(movableMove !== -1 && selectedMove !== movableMove){
			// swap
			let tmp = selectedMons.moves[selectedMove];
			pkmnList[selected].moves[selectedMove] = selectedMons.moves[movableMove];
			pkmnList[selected].moves[movableMove] = tmp;
			selectedMons= pkmnList[selected];
			movableMove = -1;
		}

	}
</script>

<div
	class="skills"
	style="--zIndex:{zIndex}"
	in:slide={{ duration: 500, delay: 100, axis: 'x', easing: backInOut }}
	out:fade
>
	<div class="img-skillDesc" class:enlarge={moveEdit}>
		<div class="img-wrapper">
			<div class="img-bg">
				<img
					src={selectedMons.getSprite()}
					alt="{selectedMons.name} img"
				/>
			</div>
		</div>

		<div class="skillDesc">
			{description}
		</div>
	</div>

	<div class="moves">
		<div class="__wrapper">
			<button class="edit" on:click={() => (moveEdit = !moveEdit)}>
				<span class="svg">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
						><path
							d="M5.33409 4.54491C6.3494 3.63637 7.55145 2.9322 8.87555 2.49707C9.60856 3.4128 10.7358 3.99928 12 3.99928C13.2642 3.99928 14.3914 3.4128 15.1245 2.49707C16.4486 2.9322 17.6506 3.63637 18.6659 4.54491C18.2405 5.637 18.2966 6.90531 18.9282 7.99928C19.5602 9.09388 20.6314 9.77679 21.7906 9.95392C21.9279 10.6142 22 11.2983 22 11.9993C22 12.7002 21.9279 13.3844 21.7906 14.0446C20.6314 14.2218 19.5602 14.9047 18.9282 15.9993C18.2966 17.0932 18.2405 18.3616 18.6659 19.4536C17.6506 20.3622 16.4486 21.0664 15.1245 21.5015C14.3914 20.5858 13.2642 19.9993 12 19.9993C10.7358 19.9993 9.60856 20.5858 8.87555 21.5015C7.55145 21.0664 6.3494 20.3622 5.33409 19.4536C5.75952 18.3616 5.7034 17.0932 5.0718 15.9993C4.43983 14.9047 3.36862 14.2218 2.20935 14.0446C2.07212 13.3844 2 12.7002 2 11.9993C2 11.2983 2.07212 10.6142 2.20935 9.95392C3.36862 9.77679 4.43983 9.09388 5.0718 7.99928C5.7034 6.90531 5.75952 5.637 5.33409 4.54491ZM13.5 14.5974C14.9349 13.7689 15.4265 11.9342 14.5981 10.4993C13.7696 9.0644 11.9349 8.57277 10.5 9.4012C9.06512 10.2296 8.5735 12.0644 9.40192 13.4993C10.2304 14.9342 12.0651 15.4258 13.5 14.5974Z"
						></path></svg
					>
				</span>
			</button>
			<ul class="list bg-base-100 rounded-box shadow-md overflow-hidden w-10/12" style="max-height: 99%; height: calc(25% * {selectedMons.moves?.length})">
			{#each selectedMons.moves as move, index (move.id)}
				<li class="list-row w-full justify-end"  style="max-height: calc(100% / ${selectedMons.moves.length});"
					class:selected={index === selectedMove}
					class:moveable={index === movableMove}
					on:click={() => handleSelect(index)}
				>

					<div class="flex items-start flex-col">
						<span>pwr. {move.power ? move.power : ' /'}</span>
						<span>pp. {move.currentPp} / {move.pp}</span>
					</div>
					<div>
						<div class="text-xl flex justify-between w-full"><span>{move.name}</span></div>
					</div>
					<div class="flex flex-col gap-2 w-5">
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
				</li>
			{/each}
			</ul>

		</div>
	</div>
</div>

<div class="edit" class:opened={moveEdit}>
	{#if moveEdit}
		<MovesSkillEdit2 bind:context bind:moveEdit bind:selectedMons bind:zIndex={nextZIndex} />
	{/if}
</div>

<style lang="scss">
	.skills {
		height: 100%;
		width: 100%;
		box-sizing: border-box;
		position: relative;
		display: flex;
		flex-direction: row;
		color: #fff;

		text-shadow: 1px 1px 1px black;
		z-index: var(--zIndex, 11);

		.img-skillDesc {
			display: flex;
			flex-direction: column;
			width: 40%;
			height: 100%;

			&.enlarge {
				.skillDesc {
					height: 0;
					opacity: 0;
					padding: 0;
				}

				.img-wrapper {
					height: 100%;
				}
			}

			.img-wrapper {
				height: 50%;
				width: 100%;
				display: flex;
				flex-direction: column;
				background-color: rgba(44, 56, 69, 0.65);
				justify-content: space-between;

				transition: all 0.5s ease-in-out;

				.img-bg {
					display: flex;
					justify-content: center;
					height: 100%;
					width: 100%;

					img {
						width: auto;
						height: 50%;
						margin: auto;
					}
				}
			}

			.skillDesc {
				border-top: 1px solid rgba(255, 255, 255, 0.2);
				background-color: rgba(44, 56, 69, 0.65);
				height: 50%;
				width: 100%;
				display: flex;
				flex-direction: column;
				box-sizing: border-box;
				padding: 2%;
				color: white;
				justify-content: space-around;
				align-items: flex-start;

				transition: all 0.5s ease-in-out;

				font-size: 22px;
			}
		}

		.moves {
			width: 60%;
			height: 100%;
			box-sizing: border-box;
			padding: 1%;
			background-color: rgba(44, 56, 69, 0.3);

			.__wrapper {
				display: flex;
				flex-direction: column;
				position: relative;
				gap: 4%;
				padding: 1% 3%;
				height: 100%;
				box-sizing: border-box;
				align-items: flex-end;

				.edit {
					position: absolute;
					left: 0;
					top: 0;

					background-color: transparent;
					border: none;
					cursor: pointer;
					padding: 0;
					margin: 0;
					width: 20%;
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: center;
					font-family: pokemon, serif;
					font-size: 22px;
					text-shadow: 1px 1px 1px black;
					gap: 2%;
					color: white;
					outline: none;
					-webkit-touch-callout: none;
					-webkit-user-select: none;
					-khtml-user-select: none;
					-moz-user-select: none;
					-ms-user-select: none;
					user-select: none;
					-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
					touch-action: pan-x pan-y;

					svg {
						width: 32px;
						height: 32px;
					}
				}
			}
		}
	}

	.selected{
		background: var(--color-secondary);
	}
	.moveable{
		background: var(--color-primary);
	}
</style>
