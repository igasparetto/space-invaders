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
let enemySizes = {
  width: 24,
  height: 24,
};

// HTML elements
let $gameContainer = document.getElementById("screen");
let $kills = document.getElementById("kills");
let $phase = document.getElementById("phase");
let $btnStart = document.getElementById("btnStart");
let $gameName = document.getElementById("gameName");

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
      enemy.moveTick = 40 - 5 * phaseNumber;
      if ((row == 0) & (col == 0)) {
        enemy.beforeNextMove = beforeNextMove.bind(enemy);
      } else if ((row == numberOfRows - 1) & (col == aliensPerRow - 1)) {
        enemy.afterNextMove = afterNextMove.bind(enemy);
      }
      enemy.moveFromTo(from, to, 2);
      enemies[row][col] = enemy;
      game.bind(enemy.$entity, "enemy:kill", function () {
        killAudio.play();
        enemy.$entity.classList.add("dead");
      });
    }
  }
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
function afterNextMove() {
  let maxRowIndex = -1;
  let maxRightColIndex = -1;
  let maxAlive;
  for (let row = enemies.length - 1; row >= 0; row--) {
    for (let col = enemies[row].length - 1; col >= 0; col--) {
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
  for (let row = 0; row < enemies.length; row++) {
    for (let col = 0; col < enemies[row].length; col++) {
      enemies[row][col].stopMove();
    }
  }
  game.playing = false;
  gameOverAudio.play();
  $btnStart.innerHTML = "Start";
  $gameName.classList.add("hide");
});

// Event: enemy kill
game.bind(document.body, "enemy:kill", function () {
  phaseKills++;
  totalKills++;
  $kills.innerHTML = totalKills;
  if (phaseKills == countEnemies) {
    game.trigger(document.body, "phase:win");
    setTimeout(initEnemies, 1500);
  }
});

// Event: phase win
game.bind(document.body, "phase:win", function () {
  for (let row = 0; row < enemies.length; row++) {
    for (let col = 0; col < enemies[row].length; col++) {
      enemies[row][col].stopMove();
      enemies[row][col].$entity.remove();
      delete enemies[row][col];
    }
  }
});

// Event: Start/Pause
game.bindKeyboardEvent("s", "keydown", game.startPause.bind(game));
game.bindKeyboardEvent("p", "keydown", game.pause.bind(game));
game.bind($btnStart, "click", game.startPause.bind(game));
game.bind(document.body, "game:start", startGame);

// Event: fire!
game.bindKeyboardEvent("Space", "keydown", player.fireStart.bind(player));
game.bindKeyboardEvent("Space", "keyup", player.fireStop.bind(player));
game.bind(
  document.getElementById("btnFire"),
  "mousedown",
  player.fireStart.bind(player)
);
game.bind(
  document.getElementById("btnFire"),
  "mouseup",
  player.fireStop.bind(player)
);
game.bind(
  document.getElementById("btnFire"),
  "touchstart",
  player.fireStart.bind(player)
);
game.bind(
  document.getElementById("btnFire"),
  "touchend",
  player.fireStop.bind(player)
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
    "bullet-1",
    enemies
  );
  bullet.fire(from, to);
  bulletAudio.play();
});
