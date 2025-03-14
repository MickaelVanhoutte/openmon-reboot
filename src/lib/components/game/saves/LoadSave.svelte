<script lang="ts">
	import { onMount } from 'svelte';
	import { SaveContext, SavesHolder } from '$lib/js/context/savesHolder';

	/**
	 * Saves loading  component
	 */

	export let savesHolder: SavesHolder;
	let selected: SaveContext;
	let sound: Howl;
	let soundPlaying: boolean;

	function handleSubmit(save: SaveContext) {
		savesHolder.selectSave(savesHolder.saves.indexOf(save));
	}

	function remove(save: SaveContext) {
		savesHolder.removeSave(savesHolder.saves.indexOf(save));
		selected = savesHolder.saves[0] || null;
	}

	function startNew() {
		savesHolder.requestNexGame$.set(true);
	}

	const listener = (e: KeyboardEvent) => {
		if (e.key === 'ArrowDown') {
			const index = savesHolder.saves.indexOf(selected);
			selected = savesHolder.saves[index + 1] || selected;
		} else if (e.key === 'ArrowUp') {
			const index = savesHolder.saves.indexOf(selected);
			selected = savesHolder.saves[index - 1] || selected;
		} else if (e.key === 'Enter') {
			handleSubmit(selected);
		} else if (e.key === 'Delete') {
			remove(selected);
		}
	};

	function loadSound() {
		sound = new Howl({
			src: ['src/static//audio/save.mp3'],
			autoplay: true,
			loop: true,
			volume: 0.5
		});
		setTimeout(() => {
			soundPlaying = sound.playing();
		}, 200);
		console.log(sound);
	}

	onMount(() => {
		loadSound();
		selected = savesHolder.saves[0] || null;
		window.addEventListener('keydown', listener);
		return () => {
			window.removeEventListener('keydown', listener);
			sound.fade(0.5, 0, 1000);
			setTimeout(() => {
				sound.stop();
			}, 1000);
		};
	});
</script>

<div class="flex flex-col items-end justify-between h-screen w-screen p-4 wrapper">

	<ul class="list bg-base-100 rounded-box shadow-md w-full">
		{#each savesHolder.saves as save}
		<li class="list-row items-center w-full" 
			on:focus={() => (selected = save)}
		>
			<div><img class="size-10 rounded-box" src="{save.player.sprite.face.source}"/></div>
			<div class="min-w-40">
			  <div>{save.id} - {save.player.name}</div>
			  <div class="text-xs uppercase font-semibold opacity-60">{new Date(save.updated).toUTCString()}</div>
			</div>
			<div class="flex flex-row gap-2 flex-wrap">
				{#each save.player.monsters as mon}
						<img class="md:max-h-16 max-h-8"
							src={mon.getSprite()}
							alt={mon.name}
						/>
					{/each}
			</div>
			<button class="btn btn-square btn-ghost" on:click={() => {
				selected === save ? handleSubmit(save) : (selected = save);
			}}>
			  <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"><path d="M6 3L20 12 6 21 6 3z"></path></g></svg>
			</button>
			<button class="btn btn-square btn-ghost" on:click={() => remove(save)}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-[1.2em]"
				><path
					d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM13.4142 13.9997L15.182 15.7675L13.7678 17.1817L12 15.4139L10.2322 17.1817L8.81802 15.7675L10.5858 13.9997L8.81802 12.232L10.2322 10.8178L12 12.5855L13.7678 10.8178L15.182 12.232L13.4142 13.9997ZM9 4V6H15V4H9Z"
				></path></svg
			>
			</button>
		  </li>
		{/each}
	</ul>



	<div class="new-game">
		<button class="btn btn-primary" on:click={() => startNew()}> Start a new game </button>
	</div>
</div>

<style lang="scss">

	.wrapper {
		background-image: repeating-linear-gradient(-45deg, var(--color-base-100), var(--color-base-100) 13px, var(--color-base-200) 13px, var(--color-base-200) 14px);
	}

	.preview {
		width: 100%;
		height: 30%;
		display: flex;
		flex-direction: row;
		gap: 8px;
		box-sizing: border-box;
		align-items: flex-end;
		justify-content: flex-start;

		:global(img) {
			width: calc(100% / 8);
			height: auto;
		}

		.images {
			flex-grow: 1;
		}
	}

	.load-screen {
		height: 100dvh;
		width: 100dvw;
		//color: #262626;
		box-sizing: border-box;
		padding: 2%;
		background: #0f0c29; /* fallback for old browsers */
		background: -webkit-linear-gradient(
			to right,
			#24243e,
			#302b63,
			#0f0c29
		); /* Chrome 10-25, Safari 5.1-6 */
		background: linear-gradient(
			to right,
			#24243e,
			#302b63,
			#0f0c29
		); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

		.new-game {
			// position: absolute;
			// bottom: 1%;
			// right: 1%;
		}
	}
</style>
