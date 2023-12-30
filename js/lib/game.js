class Game extends GameEvent {
  playing = false;
  paused = false;

  constructor() {
    super();
  }
  pauseToggle() {
    if (this.paused) this.unpause();
    else this.pause();
  }
  pause() {
    this.paused = true;
    this.trigger(document.body, "game:pause");
  }
  unpause() {
    this.paused = false;
    this.trigger(document.body, "game:unpause");
  }
  startPause() {
    if (!this.playing) {
      this.start();
    } else if (this.paused) {
      this.unpause();
    } else {
      this.pause();
    }
  }
  start() {
    this.playing = true;
    this.paused = false;
    this.trigger(document.body, "game:start");
  }
  stop() {
    this.playing = false;
    this.paused = false;
    this.trigger(document.body, "game:stop");
  }
}
