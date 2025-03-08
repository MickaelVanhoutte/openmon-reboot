<script lang="ts">
  import type { GameData } from "$lib/game/data.model";


    export let debug = false;
    export let gameData: GameData;
</script>

<div class="h-screen w-screen bg-blue-500 overflow-hidden relative wrapper-title">
  <div class="flex flex-col items-center justify-center h-full">
    <h1 class="text-4xl font-bold text-white">Welcome to the game</h1>
    <button class="mt-4 px-4 py-2 text-white opacity-25 animate-pulse" on:click={() => console.log(gameData)}>TOUCH TO START</button>
  </div>


<!-- From 0 to 20 -->
  {#each Array.from({ length: 30 }, (_, i) => i) as item}
    <div class="snow"></div>
  {/each}
</div>


<style lang="scss">
    @function random_range($min, $max) {
        $rand: random();
        $random_range: $min + floor($rand * (($max - $min) + 1));
        @return $random_range;
    }

.wrapper-title {
    background: #0f0c29;
    background: -webkit-linear-gradient(to right, #24243e, #5b53b2, #0f0c29);
    background: linear-gradient(to right, #24243e, #5b53b2, #0f0c29);
}

.snow {
  $total: 31;
  position: absolute;
  width: 0.4vw;
  height: 0.4vw;
  top:0;
 // background: white;
  border-radius: 50%;
  z-index: 2;

@keyframes flash {

  0%,
  30%,
  100% {
    opacity: 0;
    box-shadow: 0 0 0vw 0vw yellow;
  }

  5% {
    opacity: 1;
    box-shadow: 0 0 2vw 0.4vw yellow;
  }
}


  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    transform-origin: -10vw;
  }

  &::after {
    background: white;
    opacity: 0;
    box-shadow: 0 0 0vw 0vw yellow;
    animation:
      drift ease alternate infinite,
      flash ease infinite;
    will-change: box-shadow, transform, opacity;
  }

  

  @for $i from 1 through $total {
    $random-x: random(1000000) * 0.0001vw;
    $random-offset: random_range(-100000, 100000) * 0.0001vw;
    $random-x-end: $random-x + $random-offset;
    $random-x-end-yoyo: $random-x + ($random-offset / 2);
    $random-yoyo-time: random_range(30000, 80000) / 100000;
    $random-yoyo-y: $random-yoyo-time * 100vh;
    $random-scale: random(10000) * 0.0001;
    $fall-duration: random_range(10, 30) * 1s;
    $fall-delay: random(30) * -1s;

    &:nth-child(#{$i}) {
      opacity: random(10000) * 0.0001;
      transform: translate($random-x, -10px) scale($random-scale);
      animation: fall-#{$i} $fall-duration $fall-delay linear infinite;

      &::after{
        animation-duration: random(10) + 8s, random(6000)+5000ms;
        animation-delay:
            0ms,
            random(8000) + 500ms;
        }
    }

    @keyframes fall-#{$i} {
      #{percentage($random-yoyo-time)} {
        transform: translate($random-x-end, $random-yoyo-y) scale($random-scale);
      }

      to {
        transform: translate($random-x-end-yoyo, 100vh) scale($random-scale);
      }
    }
}
}
</style>