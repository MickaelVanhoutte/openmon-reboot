<script lang="ts">
  import type { Save } from '$lib/db';
  import type { GameData } from '$lib/game/data.model';
  import { offset } from '@popperjs/core';
  import { onMount } from 'svelte';
  import { FrameOptions } from '$lib/game/overworld-context';

  export let debug = false;
  export let gameData: GameData;
  export let selectedSave: Save | undefined;

  let canvas: HTMLCanvasElement;
  let canvasCtx: CanvasRenderingContext2D | null;
  let frameOptions: FrameOptions = new FrameOptions();

/*
Game loop
    */
function mainLoop() {
    let now = Date.now();
    let elapsed = now - frameOptions.then;

    if (elapsed > frameOptions.fpsInterval) {
        frameOptions.then = now - (elapsed % frameOptions.fpsInterval);
        drawElements();
    }
    frameOptions.frameId = window.requestAnimationFrame(mainLoop);
}

function drawElements() {
    if (!canvasCtx) return;
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
}

  onMount(() => {
    canvasCtx = canvas.getContext('2d');
    if(!canvasCtx) return;
    canvasCtx.imageSmoothingEnabled = true;
    canvasCtx.imageSmoothingQuality = 'high';
    canvasCtx.fillStyle = 'black';
    mainLoop();
  });
</script>

<div class="world-wrapper w-screen h-screen overflow-hidden">
    <canvas bind:this={canvas} id="main" width="1024" height="1024"></canvas>
</div>

<style lang="scss">
    .world-wrapper {
        position: absolute;
		width: 100dvw;
		height: 100dvh;
		overflow: hidden;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
    }

    #main {
        z-index: -1;
		height: auto;
		overflow: hidden;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
    }
</style>