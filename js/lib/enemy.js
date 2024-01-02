class Enemy extends Entity {
  dead = false;
  constructor(game, enemyId, x, y, w, h, $gameContainer, className) {
    super(game, enemyId, x, y, w, h);
    this.$gameContainer = $gameContainer;
    this.setEntityBasicStyles();
    if (className) {
      this.$entity.classList.add(className);
    }
    this.appendTo($gameContainer);
  }
}
