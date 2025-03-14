<script lang="ts">
	import { onMount } from 'svelte';
	import { SavesHolder } from '$lib/js/context/savesHolder';
	import { CHARACTER_SPRITES } from '$lib/js/sprites/sprites';

	/**
	 * Player creation component
	 * lots todo here (design, classes, etc)
	 */

	let selected = 1;
	let templates = [1, 2];
	$:sprite = CHARACTER_SPRITES.getSprite(selected);
	let playerName = '';

	export let savesHolder: SavesHolder;
	let sound: Howl;
	let soundPlaying: boolean;

	function loadSound() {
		sound = new Howl({
			src: ['src/static/audio/save.mp3'],
			autoplay: true,
			loop: true,
			volume: 0.5
		});
		setTimeout(() => {
			soundPlaying = sound.playing();
		}, 200);
	}

	function handleSubmit() {
		savesHolder.newGame(selected, playerName, selected === 0 ? 'MALE' : 'FEMALE');
	}

	onMount(() => {
		loadSound();
		return () => {
			sound.fade(0.5, 0, 1000);
			setTimeout(() => {
				sound.stop();
			}, 1000);
		};
	});
</script>

<div class="create">
	{#each Array.from({ length: 15 }) as i}
		<div class="firefly"></div>
	{/each}

	<img src={sprite.full.source} alt="player" class="preview"/>
	<img src="src/static/monsters/pokedex/050.png" alt="player" class="preview-poke"/>

	<form on:submit|preventDefault={handleSubmit}>
		<h1 class="text-2xl font-bold">New game</h1>
		<label for="template">Are you a</label>
		<select id="template" class="select w-full" bind:value={selected}>
			{#each templates as template}
				<option value={template}>
					{template === 1 ? 'Boy' : 'Girl'}
				</option>
			{/each}
		</select>

		<label for="name">What's your name?</label>
		<input id="name" class="input w-full" placeholder={sprite.name} bind:value={playerName} />

		<button type="submit" class="btn btn-primary mt-4" disabled={playerName?.length === 0}>Start</button>
	</form>
</div>

<style lang="scss">
	.create {
		position: absolute;
		top: 0;
		left: 0;
		width: 100dvw;
		height: 100dvh;
		padding: 2%;

		color: #e0e0e0;
		background-color: var(--color-base-100);
		background-image: repeating-linear-gradient(-45deg, var(--color-base-100), var(--color-base-100) 13px, var(--color-base-200) 13px, var(--color-base-200) 14px);
		h1 {
			margin: .35em 0;
		}

		form {
			max-width: 40%;
			margin: 0 auto;
			display: flex;
			flex-direction: column;
			gap: 16px;
			position: relative;
			z-index: 2;
		}

		.preview {
			position: absolute;
			right: -7%;
			top: 0;
			z-index: 0;
			height: 100%;
		}

		.preview-poke {
			position: absolute;
			left: 0;
			bottom: 10%;
			z-index: 0;
			height: 60%;
			filter: blur(1px);
		}
	}
</style>
