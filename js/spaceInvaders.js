// Game sizes
let gameSizes = {
  width: 800,
  height: 330,
};
let playerSizes = {
  width: 33,
  height: 24,
};
let bulletSizes = {
  width: 3,
  height: 21,
};
let enemyBulletSizes = {
  width: 9,
  height: 24,
};
let enemySizes = {
  width: 24,
  height: 24,
};

// HTML elements
let $gameContainer = document.getElementById("screen");
let $kills = document.getElementById("kills");
let $phase = document.getElementById("phase");
let $record = document.getElementById("record");
let $btnStart = document.getElementById("btnStart");
let $gameName = document.getElementById("gameName");

$record.innerHTML = localStorage.getItem("record") || 0;

$gameContainer.style.width = gameSizes.width + "px";
$gameContainer.style.height = gameSizes.height + "px";

// classes
let game = new Game();
let player = new Player(
  game,
  "player",
  (gameSizes.width - playerSizes.width) / 2,
  gameSizes.height - playerSizes.height,
  playerSizes.width,
  playerSizes.height
);
player.setButtonsControl(false, false, "btnLeft", "btnRight");
player.setBoundaries(0, 0, gameSizes.width, gameSizes.height);

game.bind(player.$entity, "entity:shot", function () {
  player.$entity.classList.add("dead");
  game.trigger(document.body, "game:over");
});

// audio
let bulletAudio = new Audio("audio/blast.mp3");
let killAudio = new Audio("audio/kill.mp3");
let gameOverAudio = new Audio("audio/game-over.mp3");

bulletAudio.loop = false;
killAudio.loop = false;
gameOverAudio.loop = false;

// global variables
let gamePadding = 15;
let firstColAt = 15;
let boxSize = 33;
let numberOfRows = 4;
let aliensPerRow = 13;
let phaseNumber = 0;
let totalKills = 0;
let countEnemies = numberOfRows * aliensPerRow;
let phaseKills = 0;
let enemies = [];

function startGame() {
  cleanUp();
  player.dead = false;
  player.$entity.classList.remove("dead");
  $gameContainer.focus();
  phaseNumber = 0;
  totalKills = 0;
  phaseKills = 0;
  enemies = [];
  initEnemies();
  $btnStart.innerHTML = "Pause";
  $gameName.classList.add("hide");
}

// init enemies
function initEnemies() {
  phaseKills = 0;
  phaseNumber++;
  $phase.innerHTML = phaseNumber;

  enemies = [];
  for (let row = 0; row < numberOfRows; row++) {
    enemies[row] = [];
    for (let col = 0; col < aliensPerRow; col++) {
      let x = gamePadding + boxSize * col;
      let y = 2 * gamePadding + boxSize * row;
      let from = { x: x, y, y };
      let to = { x: 2 * x, y: y };
      let enemy = new Enemy(
        game,
        "enemy-" + phaseNumber + "-" + row + "-" + col,
        x,
        y,
        enemySizes.width,
        enemySizes.height,
        $gameContainer,
        "enemy-" + row
      );
      enemy.setBoundaries(
        gamePadding,
        gamePadding,
        gameSizes.width - gamePadding,
        gameSizes.height - gamePadding
      );
      enemy.moveWithinBoundaries = true;
      enemy.moveTick = 40 - 3 * phaseNumber;
      if ((row == 0) & (col == 0)) {
        enemy.beforeNextMove = beforeNextMove.bind(enemy);
      } else if ((row == numberOfRows - 1) & (col == aliensPerRow - 1)) {
        enemy.afterNextMove = afterNextMove.bind(enemy);
      }
      enemy.moveFromTo(from, to, 2);
      enemies[row][col] = enemy;
      game.bind(enemy.$entity, "entity:shot", function () {
        killAudio.play();
        enemy.$entity.classList.add("dead");
      });
    }
  }
  game.trigger(document.body, "enemy:init");
}
// before/after move functions
function beforeNextMove() {
  let minRowIndex = -1;
  let minRightColIndex = 100;
  let minAlive;
  for (let row = 0; row < enemies.length; row++) {
    for (let col = 0; col < enemies[row].length; col++) {
      if (col < minRightColIndex && !enemies[row][col].dead) {
        minRowIndex = row;
        minRightColIndex = col;
      }
    }
  }
  if (minRightColIndex < 100) {
    minAlive = enemies[minRowIndex][minRightColIndex];
    if (this.stepIncrementX < 0 && minAlive.isLeftBoundaryTouch()) {
      for (let row = 0; row < enemies.length; row++) {
        for (let col = 0; col < enemies[row].length; col++) {
          enemies[row][col].stepIncrementX =
            enemies[row][col].stepIncrementX * -1;
          enemies[row][col].y = enemies[row][col].y + 16;
        }
      }
    }
  }
  return true;
}
function randomEnemyFire(enemy) {
  if (Math.floor(Math.random() * 1000) !== 1) {
    return false;
  }
  let from = {
    x: enemy.x + enemy.width / 2 - bulletSizes.width / 2,
    y: enemy.y + enemy.height,
  };
  let to = {
    x: from.x,
    y: gameSizes.height + bulletSizes.height,
  };
  let playerArray = [];
  playerArray[0] = [];
  playerArray[0][0] = player;
  let enemyBullet = new Bullet(
    game,
    from.x,
    from.y,
    enemyBulletSizes.width,
    enemyBulletSizes.height,
    $gameContainer,
    "enemy-bullet",
    playerArray
  );
  enemyBullet.move(from, to);
}
function afterNextMove() {
  let maxRowIndex = -1;
  let maxRightColIndex = -1;
  let maxAlive;
  for (let row = enemies.length - 1; row >= 0; row--) {
    for (let col = enemies[row].length - 1; col >= 0; col--) {
      if (!enemies[row][col].dead) {
        randomEnemyFire(enemies[row][col]);
      }
      if (maxRightColIndex < col && !enemies[row][col].dead) {
        maxRowIndex = row;
        maxRightColIndex = col;
      }
    }
  }

  if (maxRightColIndex > -1) {
    maxAlive = enemies[maxRowIndex][maxRightColIndex];
    if (this.stepIncrementX > 0 && maxAlive.isRightBoundaryTouch()) {
      for (let row = 0; row < enemies.length; row++) {
        for (let col = 0; col < enemies[row].length; col++) {
          enemies[row][col].stepIncrementX =
            enemies[row][col].stepIncrementX * -1;
          enemies[row][col].y = enemies[row][col].y + 16;
        }
      }
    }
    if (maxAlive.isBottomBoundaryTouch()) {
      game.trigger(document.body, "game:over");
      return false;
    }
  }

  return true;
}

function cleanUp() {
  bullets = document.getElementsByClassName("Bullet");
  for (var i = 0; i < bullets.length; i++) {
    bullets[i].remove();
  }
  for (let row = 0; row < enemies.length; row++) {
    for (let col = 0; col < enemies[row].length; col++) {
      if (enemies[row][col]) {
        enemies[row][col].stopMove();
        enemies[row][col].$entity.remove();
        delete enemies[row][col];
      }
    }
  }
}

game.bind(document.body, "game:pause", function () {
  $btnStart.innerHTML = "Go";
  $gameName.classList.remove("hide");
});
game.bind(document.body, "game:unpause", function () {
  $btnStart.innerHTML = "Pause";
  $gameName.classList.add("hide");
  $gameContainer.focus();
});

// Event: game over
game.bind(document.body, "game:over", function () {
  let record = localStorage.getItem("record");
  game.playing = false;
  gameOverAudio.play();
  $btnStart.innerHTML = "Start";
  $gameName.classList.remove("hide");
  if (record < totalKills) {
    $record.innerHTML = totalKills;
    localStorage.setItem("record", totalKills);
  }
  shoot.stop();
});

// Event: enemy kill
game.bind(document.body, "entity:shot", function () {
  phaseKills++;
  totalKills++;
  $kills.innerHTML = totalKills;
  if (phaseKills == countEnemies) {
    game.trigger(document.body, "phase:win");
    setTimeout(initEnemies, 2000);
  }
});

// Event: phase win
game.bind(document.body, "phase:win", cleanUp);

// Event: Start/Pause
game.bindKeyboardEvent("s", "keydown", game.startPause.bind(game));
game.bindKeyboardEvent("p", "keydown", game.pause.bind(game));
game.bind($btnStart, "click", game.startPause.bind(game));
game.bind(document.body, "game:start", startGame);

// Event: fire!
shoot = new Input("player:fire", game);
game.bindKeyboardEvent("Space", "keydown", shoot.start.bind(shoot));
game.bindKeyboardEvent("Space", "keyup", shoot.stop.bind(shoot));
game.bind(
  document.getElementById("btnFire"),
  "mousedown",
  shoot.start.bind(shoot)
);
game.bind(
  document.getElementById("btnFire"),
  "mouseup",
  shoot.stop.bind(shoot)
);
game.bind(
  document.getElementById("btnFire"),
  "touchstart",
  shoot.start.bind(shoot)
);
game.bind(
  document.getElementById("btnFire"),
  "touchend",
  shoot.stop.bind(shoot)
);
game.bind(document.body, "player:fire", function () {
  let from = {
    x: player.x + player.width / 2 - bulletSizes.width / 2,
    y: player.y - bulletSizes.height,
  };
  let to = {
    x: from.x,
    y: -bulletSizes.height,
  };
  let bullet = new Bullet(
    game,
    from.x,
    from.y,
    bulletSizes.width,
    bulletSizes.height,
    $gameContainer,
    "hero-bullet",
    enemies
  );
  // refresh, if needed

  bullet.bind(document.body, "game:over", function () {
    bullet.stopMove();
  })
  bullet.bind(document.body, "enemy:init", function() {
    bullet.enemies = enemies;
  });
  bullet.move(from, to);
  bulletAudio.play();
});
