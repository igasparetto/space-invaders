class Bullet extends Entity {
  $gameContainer;
  constructor(game, x, y, w, h, $gameContainer, className, enemies) {
    super(game, "bullet-" + +new Date(), x, y, w, h);
    this.enemies = enemies
    this.$gameContainer = $gameContainer;
    this.setEntityBasicStyles();
    if (className) {
      this.$entity.classList.add(className);
    }
    this.appendTo($gameContainer);
    // when the entity is out of the area and stops moving
    this.bind(this.$entity, "entity:stopMove", this.destroy.bind(this));
  }
  destroy() {
    this.$entity.remove();
  }
  move(from, to) {
    this.moveFromTo(from, to, 1);
  }
  canMakeNextMove() {
    let deadEnemy = this.hitEnemy();
    return !deadEnemy && !(
      this.x + this.stepIncrementX < 0 ||
      this.y + this.stepIncrementY >
        parseInt(this.$gameContainer.style.height) ||
      this.y + this.stepIncrementY < 0 ||
      this.x + this.stepIncrementX > parseInt(this.$gameContainer.style.width)
    );
  }
  hitEnemy() {
    for(let row = 0; row < this.enemies.length; row++) {
      for(let col = 0; col < this.enemies[row].length; col++) {
        if(this.enemies[row] && this.enemies[row][col] && !this.enemies[row][col].dead && this.isOverlap(this.enemies[row][col], this)) {
          this.enemies[row][col].kill();
          return this.enemies[row][col];
        }
      }
    }
    return false;
  }
}
