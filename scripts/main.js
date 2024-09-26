const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resize() {
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  const canvasRatio = canvas.height / canvas.width;

  // Subtract 20 pixels from the window height for margin
  const newCanvasHeight = windowHeight - 20;
  const newCanvasWidth = newCanvasHeight / canvasRatio;

  canvas.style.height = newCanvasHeight + "px";
  canvas.style.width = newCanvasWidth + "px";
}

// Call the resize function initially to set the canvas size
resize();

// Add an event listener to handle resizing when the window size changes
window.addEventListener("resize", resize);

class GameBasics {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.playBoundaries = {
      top: 150,
      bottom: 650,
      left: 100,
      right: 800
    };
    this.setting = {
      updateSeconds: 1 / 60,
      spaceshipSpeed: 200,
      bulletSpeed: 130,
      bulletMaxFrequency: 500,
      scorePerUfo: 1,
      ufoRows : 4,
      ufoColumns: 8,
      ufoSpeed: 35,
      ufoSinkingValue: 30,
      bombSpeed: 75,
      bombFrequency: 0.05,
    };
    this.positionContainer = [];
    this.pressedKeys = {};
    this.level = 1;
    this.score = 1;
    this.shields = 2;
  }

  //  Return to current game position and status. Always returns the top element of positionContainer.
  presentPosition() {
    if (this.positionContainer.length === 0) {
      return null;
    } else {
      return this.positionContainer[this.positionContainer.length - 1];
    }
  }

  goToPosition(position) {
    if (this.presentPosition() !== null) {
      this.positionContainer = [];
    }

    if (typeof position.entry === 'function') {
      position.entry(this);
    }

    this.positionContainer.push(position);
  }

  pushPosition(position) {
    this.positionContainer.push(position);
  }

  popPosition() {
    return this.positionContainer.pop();
  }

  start() {
    const updateSeconds = this.setting.updateSeconds;
    setInterval(() => {
      gameLoop(play);
    }, updateSeconds * 1000);

    this.goToPosition(new OpeningPosition()); // Assuming OpeningPosition is defined in another file
  }
  // Notifies the game when a key is pressed
  keyDown(keyboardCode) {
    // store the pressed key in 'pressedKeys'
    this.pressedKeys[keyboardCode] = true;
    //  it calls the present position's keyDown function
    if (this.presentPosition() && this.presentPosition().keyDown) {
      this.presentPosition().keyDown(this, keyboardCode);
    }
  }
  //  Notifies the game when a key is released
  keyUp(keyboardCode) {
    // delete the released key from 'pressedKeys'
    delete this.pressedKeys[keyboardCode];
  }
}

const play = new GameBasics(canvas);
play.sounds = new Sounds();
play.sounds.init();
play.start();

// Game Loop
function gameLoop(play) {
  let presentPosition = play.presentPosition();

  if (presentPosition) {
    // update
    if (presentPosition.update) {
      presentPosition.update(play);
    }
    // draw
    if (presentPosition.draw) {
      presentPosition.draw(play);
    }
  }
}


document.addEventListener('keydown', function(event) {
  // Retrieve the event code
  var keyCode = event.code;

  // Check if the space button, left arrow, or right arrow is pressed
  if (keyCode === 'Space' || keyCode === 'ArrowLeft' || keyCode === 'ArrowRight') {
    // Prevent the default behavior
    event.preventDefault();
  }
  play.keyDown(keyCode)
});

document.addEventListener("keyup", function(e) {
  const keyboardCode = e.code; // Get the event code
  play.keyUp(keyboardCode);
});