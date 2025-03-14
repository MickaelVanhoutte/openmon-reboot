import {SOUND} from '$lib/js/env';

export class SoundManager {

    playing: boolean = false;
    currentSoundSrc?: string;
    currentSound?: Howl;
    volume: number = 0.5;


    constructor() {
        this.playing = false;
    }

    playBattleSound() {
        this.fadeOutSound();
        this.playSound('battle/battle-start', false);
        setTimeout(() => {
            this.playSound('battle/battle2')
        }, 1500);
    }

    playSound(sound: string, loop: boolean = true) {
        if (SOUND) {
            if (this.playing) {
                this.fadeOutSound();
            }
            this.currentSoundSrc = sound;
            this.currentSound = new Howl({
                src: ['src/static/audio/' + sound + '.mp3'],
                autoplay: true,
                loop: loop,
                volume: this.volume,
                preload: true,
            });
            this.playing = true;
        }
    }

    fadeOutSound() {
        if (SOUND) {
            this.currentSound?.fade(0.5, 0, 500);
        }
    }

    stopSound() {
        if (SOUND) {
            this.currentSound?.stop();
            this.playing = false;
        }
    }

    toggleCurrentSound(){
        if (SOUND) {
            if (this.playing) {
                this.stopSound();
            } else {
                this.playSound(this.currentSoundSrc!);
            }
        }
    }
}