class Player extends Entity {
  moveTick = 5;
  moveUpInterval = false;
  moveDownInterval = false;
  moveLeftInterval = false;
  moveRightInterval = false;

  moveWithinBoundaries = false;

  allowMoveUp = false;
  allowMoveDown = false;
  allowMoveLeft = false;
  allowMoveRight = false;

  constructor(game, playerId, x, y, w, h, bulletSizes) {
    super(game, playerId, x, y, w, h);
    this.bulletSizes = bulletSizes;
    this.setEntityBasicStyles();
  }

  setButtonsControl(btnUpId, btnDownId, btnLeftId, btnRightId) {
    // mouse controls
    if (btnUpId) {
      this.allowMoveUp = true;
      this.bind(
        document.getElementById(btnUpId),
        "mousedown",
        this.startMoveUp.bind(this)
      );
      this.bind(
        document.getElementById(btnUpId),
        "mouseup",
        this.stopMoveUp.bind(this)
      );
      this.bind(
        document.getElementById(btnUpId),
        "touchstart",
        this.startMoveUp.bind(this)
      );
      this.bind(
        document.getElementById(btnUpId),
        "touchend",
        this.stopMoveUp.bind(this)
      );
    }

    if (btnDownId) {
      this.allowMoveDown = true;
      this.bind(
        document.getElementById(btnDownId),
        "mousedown",
        this.startMoveDown.bind(this)
      );
      this.bind(
        document.getElementById(btnDownId),
        "mouseup",
        this.stopMoveDown.bind(this)
      );
      this.bind(
        document.getElementById(btnDownId),
        "touchstart",
        this.startMoveDown.bind(this)
      );
      this.bind(
        document.getElementById(btnDownId),
        "touchend",
        this.stopMoveDown.bind(this)
      );
    }

    if (btnLeftId) {
      this.allowMoveLeft = true;
      this.bind(
        document.getElementById(btnLeftId),
        "mousedown",
        this.startMoveLeft.bind(this)
      );
      this.bind(
        document.getElementById(btnLeftId),
        "mouseup",
        this.stopMoveLeft.bind(this)
      );
      this.bind(
        document.getElementById(btnLeftId),
        "touchstart",
        this.startMoveLeft.bind(this)
      );
      this.bind(
        document.getElementById(btnLeftId),
        "touchend",
        this.stopMoveLeft.bind(this)
      );
    }

    if (btnRightId) {
      this.allowMoveRight = true;
      this.bind(
        document.getElementById(btnRightId),
        "mousedown",
        this.startMoveRight.bind(this)
      );
      this.bind(
        document.getElementById(btnRightId),
        "mouseup",
        this.stopMoveRight.bind(this)
      );
      this.bind(
        document.getElementById(btnRightId),
        "touchstart",
        this.startMoveRight.bind(this)
      );
      this.bind(
        document.getElementById(btnRightId),
        "touchend",
        this.stopMoveRight.bind(this)
      );
    }

    this.keyboardArrowControls();
  }
  keyboardArrowControls() {
    // keyboard controls
    if (this.allowMoveUp) {
      this.bindKeyboardEvent("ArrowUp", "keydown", this.startMoveUp.bind(this));
      this.bindKeyboardEvent("ArrowUp", "keyup", this.stopMoveUp.bind(this));
    }
    if (this.allowMoveUp) {
      this.bindKeyboardEvent(
        "ArrowDown",
        "keydown",
        this.startMoveDown.bind(this)
      );
      this.bindKeyboardEvent(
        "ArrowDown",
        "keyup",
        this.stopMoveDown.bind(this)
      );
    }
    if (this.allowMoveLeft) {
      this.bindKeyboardEvent(
        "ArrowLeft",
        "keydown",
        this.startMoveLeft.bind(this)
      );
      this.bindKeyboardEvent(
        "ArrowLeft",
        "keyup",
        this.stopMoveLeft.bind(this)
      );
    }
    if (this.allowMoveRight) {
      this.bindKeyboardEvent(
        "ArrowRight",
        "keydown",
        this.startMoveRight.bind(this)
      );
      this.bindKeyboardEvent(
        "ArrowRight",
        "keyup",
        this.stopMoveRight.bind(this)
      );
    }
  }
  startMoveUp() {
    this.stopMoveDown();
    if (!this.moveUpInterval) {
      this.moveUpInterval = setInterval(
        this.actionUp.bind(this),
        this.moveTick
      );
      this.trigger(document.body, "player:startMoveUp");
    }
  }
  stopMoveUp() {
    clearInterval(this.moveUpInterval);
    this.moveUpInterval = false;
    this.trigger(document.body, "player:stopMoveUp");
  }
  startMoveDown() {
    this.stopMoveUp();
    if (!this.moveDownInterval) {
      this.moveDownInterval = setInterval(
        this.actionDown.bind(this),
        this.moveTick
      );
      this.trigger(document.body, "player:startMoveDown");
    }
  }
  stopMoveDown() {
    clearInterval(this.moveDownInterval);
    this.moveDownInterval = false;
    this.trigger(document.body, "player:stopMoveDown");
  }
  startMoveLeft() {
    this.stopMoveRight();
    if (!this.moveLeftInterval) {
      this.moveLeftInterval = setInterval(
        this.actionLeft.bind(this),
        this.moveTick
      );
      this.trigger(document.body, "player:startMoveLeft");
    }
  }
  stopMoveLeft() {
    clearInterval(this.moveLeftInterval);
    this.moveLeftInterval = false;
    this.trigger(document.body, "player:stopMoveLeft");
  }
  startMoveRight() {
    this.stopMoveLeft();
    if (!this.moveRightInterval) {
      this.moveRightInterval = setInterval(
        this.actionRight.bind(this),
        this.moveTick
      );
      this.trigger(document.body, "player:startMoveRight");
    }
  }
  stopMoveRight() {
    clearInterval(this.moveRightInterval);
    this.moveRightInterval = false;
    this.trigger(document.body, "player:stopMoveRight");
  }
}
