class GameOverPosition {
  constructor() {
    
  }

  draw(play){
      // Draw the opening screen
      ctx.clearRect(0, 0, play.width, play.height); // Clear the canvas

      // Draw the title
      ctx.font = "80px Comic Sans MS";
      ctx.textAlign = "center";
      const gradient = ctx.createLinearGradient((play.width / 2 - 180), (play.height / 2), (play.width / 2 + 180), (play.height / 2));
      gradient.addColorStop("0", "black");
      gradient.addColorStop("0.5", "white");
      gradient.addColorStop("1.0", "black");
      ctx.fillStyle = gradient;
      ctx.fillText("YOU GOT HIT!😢", play.width / 2, play.height / 2 - 70);

      // Draw start game instruction
      ctx.font = "40px Comic Sans MS";
      ctx.fillStyle = '#D7DF01';
      ctx.fillText("Press 'Space' To Retry.", play.width / 2, play.height / 2);

      // Draw game controls instruction
      ctx.fillStyle = '#000000';
      ctx.fillText("Results!", play.width / 2, play.height / 2 + 210);
      ctx.fillText("Your level:" + play.level, play.width / 2, play.height / 2 + 260);
      ctx.fillText("Your Score:" + play.score, play.width / 2, play.height / 2 + 300);
    }

  keyDown(play, keyboardCode) {
        // Start the game when the space bar is pressed
        if (keyboardCode == 'Space') {
            play.level = 1;
            play.score = 0;
            play.shields = 2;
            play.setting.bulletSpeed = 130 ;
            play.setting.bombSpeed = 75 ;
            play.goToPosition(new TransferPosition(play.level));
        }
      }

}

