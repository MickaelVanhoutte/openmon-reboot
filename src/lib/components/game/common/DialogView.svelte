<script lang="ts">
    import {onMount} from 'svelte';
    import type {Dialog} from '$lib/js/scripting/scripts';
    import type {Unsubscriber} from 'svelte/store';
    import type {GameContext} from '$lib/js/context/gameContext';
    import {CHARACTER_SPRITES} from '$lib/js/sprites/sprites';

    export let dialog: Dialog | undefined;
    export let context: GameContext;
    export let animate: boolean = true;

    let text: HTMLDivElement;
    let unsubscribe: Unsubscriber;

    $: current = dialog?.current || undefined;
    $: if (current?.speaker) {
        if (current.speaker === 'follower' && context.player.follower) {
            //let id = ('00' + context.player.follower.pokemon.id).slice(-3);
            src =  context.player.follower.pokemon.getSprite() //'$static/monsters/pokedex/' + id + '.png';
        } else if (current.speaker !== 'self' && Number(current.speaker)) {
            console.log('getting sprite', current.speaker)
            let sprite = CHARACTER_SPRITES.getSprite(Number.parseInt(current.speaker));
            src = sprite.full.source;
            npcName = sprite.name;
        }
    }
    let selectedOption = 0;
    let src: string = '';
    let npcName = '';

    function next() {
        let tmp = dialog?.next();
        if (tmp) {
            current = tmp;
            text.classList?.remove('animate');
            setTimeout(() => {
                if (animate) text.classList?.add('animate');
            }, 100);
        }
    }

    const listener = (e: KeyboardEvent) => {
        console.log(current);
        if (e.key === 'Enter') {
            if (current?.options?.length) {
                console.log('selecting option', selectedOption);
                dialog?.selectOption(selectedOption);
                next();
            } else if (animate) {
                next();
            }
        } else if (e.key === 'ArrowUp' && current?.options?.length) {
            selectedOption = Math.max(0, selectedOption - 1);
        } else if (e.key === 'ArrowDown' && current?.options?.length) {
            selectedOption = Math.min(current?.options?.length - 1, selectedOption + 1);
        }
    };

    onMount(() => {
        window.addEventListener('keydown', listener);
        setTimeout(() => {
            unsubscribe = context.overWorldContext.keys.a?.subscribe((value) => {
                if (value) {
                    if (current?.options?.length) {
                        console.log('selecting option', selectedOption);
                        dialog?.selectOption(selectedOption);
                        next();
                    } else if (animate) {
                        next();
                    }
                }
            });
        }, 200);

        return () => {
            window.removeEventListener('keydown', listener);
            unsubscribe && unsubscribe();
        };
    });
</script>


<div class="w-9/12 absolute left-1/12 bottom-1/12 z-5 h-4/12">
    <div class="chat {current?.speaker !== 'self' ? 'chat-end' : 'chat-start'} relative text-xl h-full">
        <div class="chat-image avatar h-full">
            <div class="rounded-full h-full">
                {#if current?.speaker && current?.speaker === 'self'}
                    <img
                            alt="Your avatar"
                            class="h-full"
                            src="{context.player.sprite.face.source}"/>
                {:else if current?.speaker && current?.speaker === 'follower'}
                    <img src={src.replaceAll('"', '')} alt="speaker" class="h-full" style="scale:1.5"/>
                {:else if current?.speaker === 'System'}
                {:else if !Number.isNaN(current?.speaker)}
                    <img {src} alt="speaker" class="h-full"/>
                {/if}
            </div>
        </div>
        <div class="chat-header text-gray-800 text-xl">
            {#if current?.speaker && current?.speaker === 'self'}
                {context.player.name}
            {:else if current?.speaker && current?.speaker === 'follower'}
                {context.player.monsters[0].name}
            {:else if current?.speaker === 'System'}
                System
            {:else if !Number.isNaN(current?.speaker)}
                {npcName}
            {/if}
        </div>
        <div class="chat-bubble min-w-20 text-xl" class:animate bind:this={text}>
            <div>{current?.text}</div>
        </div>
    </div>
</div>


<!--<div class="dialog">
	<div class="dialog-content">
		<div class="dialog-text" class:animate bind:this={text}>
			<div>{current?.text}</div>
		</div>
	</div>
</div>-->

{#if current?.options?.length}
    <div class="options" class:hidden={!current?.options?.length}>
        <ul>
            {#each current.options as option, index}
                <li
                        class:selected={selectedOption === index}
                        on:click={() => {
						dialog?.selectOption(index);
					}}
                >
                    {option}
                </li>
            {/each}
        </ul>
    </div>
{/if}

<style lang="scss">

    .chat-start, .chat-end {
      .chat-bubble {
        &::before {
          inset-inline-start: -0.56rem;
          bottom: -.2rem;
        }

        display: inline-block;

        div {
          opacity: 0;
          overflow: hidden;
          white-space: nowrap;
        }

        &.animate div {
          opacity: 1;
          border-right: 0.15em solid orange;
          animation: typing 1s steps(20, end) forwards,
          blink-caret 0.5s step-end infinite;

          @keyframes typing {
            from {
              width: 0;
            }
            to {
              width: 100%;
            }
          }

          /* The typewriter cursor effect */
          @keyframes blink-caret {
            from,
            to {
              border-color: transparent;
            }
            50% {
              border-color: orange;
            }
          }
        }
      }
    }
    .chat-end {
      .chat-bubble {
        &::before {
          inset-inline-start: calc(100% - .2rem);
          bottom: -.2rem;
        }
      }
    }



  .options {
    position: absolute;
    font-size: 32px;
    font-weight: 500;
    text-align: left;
    bottom: 27%;
    right: 1%;
    padding: 22px 36px 22px 36px;
    background: rgb(220, 231, 233);
    background: linear-gradient(
                    180deg,
                    rgba(220, 231, 233, 1) 0%,
                    rgba(255, 255, 255, 1) 50%,
                    rgba(220, 231, 233, 0.713344712885154) 100%
    );
    border: 2px solid #54506c;
    border-radius: 8px;
    box-sizing: border-box;
    transition: bottom 0.3s ease-in-out;
    z-index: 8;

    &.hidden {
      bottom: -100dvh;
    }

    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 16px;

      li {
        &.selected::before {
          content: '';
          width: 0;
          height: 0;
          border-top: 12px solid transparent;
          border-bottom: 12px solid transparent;
          border-left: 12px solid #262626;
          position: absolute;
          left: 5px;
          margin-top: 2px;
        }
      }
    }
  }

  .speaker-img {
    position: absolute;
    bottom: 20dvh;
    left: 1dvw;
    height: 50dvh;
    z-index: 5;
    border-radius: 8px;
    border: 1px solid black;
    background: rgba(0, 0, 0, 0.5);
  }

  .speaker-name {
    position: absolute;
    bottom: 27dvh;
    left: 1dvw;
    z-index: 7;
    font-size: 32px;
    font-weight: 500;
    color: black;
    border: 1px solid #262626;
    border-radius: 0 8px 8px 0;
    padding: 4px;
    min-width: 20dvw;
    text-align: center;
    background: rgba(220, 231, 233, 1);
  }

  .dialog {
    position: absolute;
    bottom: 1dvh;
    left: 1dvw;
    width: calc(92dvw - 110px);
    height: 25dvh;
    z-index: 7;

    background: rgb(220, 231, 233);
    border: 2px solid #54506c;
    border-radius: 0 8px 8px 8px;
    box-sizing: border-box;
    padding: 2%;
    font-size: 32px;
    font-weight: 500;
    color: black;

    .dialog-content {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .dialog-text {
        display: inline-block;

        &.animate div {
          opacity: 1;
          border-right: 0.15em solid orange;
          animation: typing 1s steps(20, end) forwards,
          blink-caret 0.5s step-end infinite;
        }

        div {
          opacity: 0;
          overflow: hidden;
          white-space: nowrap;
        }
      }

      @keyframes typing {
        from {
          width: 0;
        }
        to {
          width: 100%;
        }
      }

      /* The typewriter cursor effect */
      @keyframes blink-caret {
        from,
        to {
          border-color: transparent;
        }
        50% {
          border-color: orange;
        }
      }
    }
  }


</style>
