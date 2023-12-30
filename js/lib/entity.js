class Entity extends GameEvent {
  moveByPixels = 1;
  boundaries = {
    minX: 0,
    minY: 0,
    maxX: 0,
    maxY: 0,
  };
  stepNumber = 0;
  steps = 0;
  stepIncrementX = 0;
  stepIncrementY = 0;
  moveInterval = false;
  constructor(game, entityId, x, y, w, h) {
    super();
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.entityId = entityId;
    this.$entity = document.getElementById(entityId);
    if(!this.$entity) {
      this.createEntity();
    }
  }

  createEntity() {
    this.$entity = document.createElement("div");
    this.$entity.id = this.entityId;
    this.$entity.classList.add(this.constructor.name);
  }

  setBoundaries(minX, minY, maxX, maxY) {
    this.boundaries = {
      minX: minX,
      minY: minY,
      maxX: maxX,
      maxY: maxY,
    };
    this.moveWithinBoundaries = true;
  }
  action(foo, param) {
    foo(param);
  }
  actionUp() {
    if(this.isTopBoundaryTouch())
      return false;
    return this.moveUD(-this.moveByPixels);
  }
  actionDown() {
    if(this.isBottomBoundaryTouch())
      return false;
    return this.moveUD(this.moveByPixels);
  }
  actionRight() {
    if(this.isRightBoundaryTouch())
      return false;
    return this.moveRL(this.moveByPixels);
  }
  actionLeft() {
    if(this.isLeftBoundaryTouch())
      return false;
    return this.moveRL(-this.moveByPixels);
  }
  moveUD(direction) {
    if(!this.game.playing || this.game.paused) {
      return false;
    }
    this.y += direction;
    this.$entity.style.top = this.y + "px";
    return true;
  }
  moveRL(direction) {
    if(!this.game.playing || this.game.paused) {
      return false;
    }
    this.x += direction;
    this.$entity.style.left = this.x + "px";
    return true;
  }
  appendTo($container) {
    $container.appendChild(this.$entity);
  }
  setEntityBasicStyles() {
    this.setEntityPositions();
    this.setEntitySizes();
  }
  setEntityPositions() {
    this.$entity.style.left = this.x + "px";
    this.$entity.style.top = this.y + "px";
  }
  setEntitySizes() {
    this.$entity.style.width = this.width + "px";
    this.$entity.style.height = this.height + "px";
  }
  moveFromTo(from, to, pixelsPerTick) {
    let deltaX = to.x - from.x;
    let deltaY = to.y - from.y;
    let distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    this.stepNumber = 0;
    this.steps = distance / pixelsPerTick;
    this.stepIncrementX = deltaX / this.steps;
    this.stepIncrementY = deltaY / this.steps;
    this.x = from.x;
    this.y = from.y;
    this.startMove();
  }
  startMove() {
    if (!this.moveInterval) {
      this.trigger(this.$entity, "entity:startMove");
      this.moveInterval = setInterval(
        this.doNextMove.bind(this),
        this.moveTick
      );
    }
  }
  beforeNextMove() {
  }
  doNextMove() {
    if(!this.game.playing || this.game.paused) {
      return false;
    }
    this.beforeNextMove();
    this.x += this.stepIncrementX;
    this.y += this.stepIncrementY;
    this.setEntityPositions();
    this.afterNextMove();
    if(!this.canMakeNextMove()) {
      this.stopMove();
    }
  }
  afterNextMove() {
  }
  canMakeNextMove() {
    return true;
  }
  stopMove() {
    clearInterval(this.moveInterval);
    this.moveInterval = false;
    this.trigger(this.$entity, "entity:stopMove");
  }

  // boundaries touch
  isTopBoundaryTouch() {
    if (this.moveWithinBoundaries) {
      return this.y - this.moveByPixels < this.boundaries.minY;
    }
    return false;
  }
  isRightBoundaryTouch() {
    if (this.moveWithinBoundaries) {
      return this.x + this.width + this.moveByPixels > this.boundaries.maxX;
    }
    return false;
  }
  isBottomBoundaryTouch() {
    if (this.moveWithinBoundaries) {
      return this.y + this.height + this.moveByPixels > this.boundaries.maxY;
    }
    return false;
  }
  isLeftBoundaryTouch() {
    if (this.moveWithinBoundaries) {
      return this.x - this.moveByPixels < this.boundaries.minX;
    }
    return false;
  }
  isOverlap(a, b) {
    return !(
      b.x > a.x + a.width ||
      b.y > a.y + a.height ||
      a.x > b.x + b.width ||
      a.y > b.y + b.height
    );
  }
}
