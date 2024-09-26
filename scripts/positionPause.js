class PausePosition {
  constructor(play) {
    
  }

  draw(play) {
    ctx.clearRect(0, 0, play.width, play.height);
    ctx.font = "68px Comic Sans MS";
    ctx.textAlign = "center";
  const gradient = ctx.createLinearGradient((play.width / 2 - 180), (play.height / 2), (play.width / 2 + 180), (play.height / 2));
      gradient.addColorStop("0", "pink");
      gradient.addColorStop("0.5", "cyan");
      gradient.addColorStop("1.0", "pink");
      ctx.fillStyle = gradient;
      ctx.fillText("GAME PAUSED", play.width / 2, play.height / 2 - 70);
     ctx.font = "40px Comic Sans MS";
      ctx.fillStyle = '#000000';
      ctx.fillText("Press P To Unpause.", play.width / 2, play.height / 2);
    }
  keyDown(play, keyboardCode){
  if (keyboardCode == 'KeyP')  {
    play.popPosition();
  }
  }
  }
