class Input extends GameEvent {

  inputTick = 300;
  inputInterval = false;

  constructor(name, game) {
    super();
    this.name = name;
    this.game = game;
  }

  start() {
    if (this.game.playing && !this.game.paused && !this.inputInterval) {
      this.inputInterval = setInterval(this.input.bind(this), this.inputTick);
    }
  }
  input() {
    this.trigger(document.body, this.name); // "player:fire"
  }
  stop() {
    clearInterval(this.inputInterval);
    this.inputInterval = false;
  }
}
