export class FrameOptions {
    frameId: number = 0;
    then: number = Date.now();
    fpsInterval: number = 1000 / 24;
    debug: boolean = false;
    imageScale: number = 2.5;
    playerScale: number = 1;

    constructor() {}

}