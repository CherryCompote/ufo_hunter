// --- positionInGame --- //
class InGamePosition {
  constructor(setting, level) {
    this.setting = setting;
    this.level = level;
    this.object = null;
    this.spaceship = null;
    this.bullets = []; 
    this.ufos = [];
    this.bombs = [];
    this.lastBulletTime = null;
  }

  entry(play) {
    this.spaceship_image = new Image(); // spaceship image
    this.ufo_image = new Image(); 
    this.upSec = this.setting.updateSeconds;
    this.spaceshipSpeed = this.setting.spaceshipSpeed;
    const rows = this.setting.ufoRows;
    const columns = this.setting.ufoColumns;
    const ufosInitial = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++){
        this.object = new Objects();
        let x = (play.width / 2) - ((columns - 1) * 25) + (col * 50);
        let y = (play.playBoundaries.top + 30) + (row * 30);
        ufosInitial.push(this.object.ufo(x, y, row, col, this.ufo_image, this.level));
      }
    }
    this.ufos = ufosInitial;
    this.object = new Objects();
    this.spaceship = this.object.spaceship((play.width / 2), play.playBoundaries.bottom, this.spaceship_image);
    this.direction = 1;
    this.horizontalMoving = 1;
    this.verticalMoving = 0;
    this.ufosAreSinking = false;
    this.ufoPresentSinkingValue = 0;
    const presentLevel = this.level;
    this.ufoSpeed = this.setting.ufoSpeed + (presentLevel * 7)
    this.bombSpeed = this.setting.bombSpeed + (presentLevel * 10) 
    this.bombFrequency = this.setting.bombFrequency + (presentLevel * 0.05)
  }

  draw(play) {
    ctx.clearRect(0, 0, play.width, play.height);
    ctx.drawImage(this.spaceship_image, this.spaceship.x - (this.spaceship.width / 2), this.spaceship.y - (this.spaceship.height / 2));

    // Draw Bullets 
    ctx.fillStyle = '#B7950B';
    for (let i = 0; i < this.bullets.length; i++) {
      let bullet = this.bullets[i];
      ctx.fillRect(bullet.x - 1, bullet.y - 9, 5, 9);
    }

    // Draw UFOs
    for (let i = 0; i < this.ufos.length; i++) {
      let ufo = this.ufos[i];
      ctx.drawImage(this.ufo_image, ufo.x - (ufo.width / 2), ufo.y - (ufo.height / 2));
    }

    //Draw Bombs
    ctx.fillStyle = '#000000'; for(let i = 0; i < this.bombs.length; i++) {
      let bomb = this.bombs[i];
      ctx.fillRect(bomb.x - 2, bomb.y, 6, 8);
    }
    
    ctx.fillStyle = '#34d5eb';
    ctx.font = "bold 24px Comic Sans MS";
    ctx.fillText("Score", play.playBoundaries.right, play.playBoundaries.top - 75);
    ctx.font = "bold 30px Comic Sans MS";
    ctx.fillText(play.score, play.playBoundaries.right, play.playBoundaries.top - 25);
    ctx.fillText("Level", play.playBoundaries.left, play.playBoundaries.top - 75);
    ctx.font = "bold 30px Comic Sans MS";
    ctx.fillText(play.level, play.playBoundaries.left, play.playBoundaries.top - 25);
    if (play.shields > 0) {
      ctx.fillStyle = '#BDBDBD';
      ctx.font = "bold 24px Comic Sans MS";
      ctx.fillText("Shields", play.width / 2, play.playBoundaries.top - 75);
      ctx.font = "bold 30px Comic Sans MS";
      ctx.fillText(play.shields, play.width / 2, play.playBoundaries.top - 25);
       ctx.fillText("Esc = Quit Game", play.playBoundaries.left + 50, play.playBoundaries.top + 5);
    }
    else {
      ctx.fillStyle = '#ff4d4d';
      ctx.font = "bold 24px Comic Sans MS";
      ctx.fillText("⚠️WARNING⚠️", play.width / 2, play.playBoundaries.top - 75);
      ctx.fillStyle = '#BDBDBD';
      ctx.fillText("No shields left", play.width / 2, play.playBoundaries.top - 25);
    }
  }
  update(play) {
    const spaceship = this.spaceship;
    const spaceshipSpeed = this.spaceshipSpeed;
    const upSec = this.setting.updateSeconds;
    const bullets = this.bullets;
    const ufos = this.ufos;
    const frontLineUFOs = [];

    if (play.pressedKeys.ArrowLeft) {
      spaceship.x -= spaceshipSpeed * upSec;
    }

    if (play.pressedKeys.ArrowRight) {
      spaceship.x += spaceshipSpeed * upSec;
    }
    
    spaceship.x = Math.max(play.playBoundaries.left, Math.min(spaceship.x, play.playBoundaries.right));

    if (play.pressedKeys.Space) {
      this.shoot();
    }

    for (let i = 0; i < bullets.length; i++) {
        let bullet = bullets[i];
        bullet.y -= upSec * this.setting.bulletSpeed;
        if (bullet.y < 0) {
            bullets.splice(i--, 1);
        }
    }

    let reachedSide = false;

    for (let i = 0; i < this.ufos.length; i++) {
      let ufo = this.ufos[i];
      let newX = ufo.x + this.ufoSpeed * upSec * this.direction * this.horizontalMoving;
      let newY = ufo.y + this.ufoSpeed * upSec * this.verticalMoving;
      if (newX > play.playBoundaries.right || newX < play.playBoundaries.left) {
        this.direction *= -1;
        reachedSide = true;
        this.horizontalMoving = 0;
        this.verticalMoving = 1;
        this.ufosAreSinking = true;
      }
      if (!reachedSide) {
        ufo.x = newX;
        ufo.y = newY;
      }
    }

    if (this.ufosAreSinking) {
      this.ufoPresentSinkingValue += this.ufoSpeed * upSec;
      if (this.ufoPresentSinkingValue >= this.setting.ufoSinkingValue) {
        this.ufosAreSinking = false;
        this.verticalMoving = 0;
        this.horizontalMoving = 1;
        this.ufoPresentSinkingValue = 0;
      }
    }
    // check if ufo is hit by bullet
    for (let i = 0; i < this.ufos.length; i++){
      let ufo = this.ufos[i];
      if (!frontLineUFOs[ufo.column] || frontLineUFOs[ufo.column].row < ufo.row){
        frontLineUFOs[ufo.column] = ufo;
      }
    }

    for (let i = 0; i < this.setting.ufoColumns; i++){
      let ufo = frontLineUFOs[i];
      if (!ufo) {
        continue;
      }  
      let chance = this.bombFrequency * upSec;

      this.object = new Objects(); 
      if (chance >Math.random()) {
        this.bombs.push(this.object.bomb(ufo.x, ufo.y + ufo.height / 2));
        console.log("UFO (column:" + ufo.column + ", row:" + ufo.row + ") is bombing.")
        play.sounds.playSound('bomb');
      }
    }

    for (let i = 0; i < this.bombs.length; i++) {
      let bomb = this.bombs[i];
      bomb.y += this.bombSpeed * upSec;
      if (bomb.y > play.height) {
        this.bombs.splice(i, 1);
        i--;
      }
    }

    for (let i = 0; i < this.bombs.length; i++) {
      let bomb = this.bombs[i];
      if (bomb.x + 3 >= (spaceship.x - (spaceship.width / 2)) &&
          bomb.x - 3 <= (spaceship.x + (spaceship.width / 2)) &&
          bomb.y + 8 >= (spaceship.y - (spaceship.height / 2)) && bomb.y <= (spaceship.y + (spaceship.height / 2))){
        this.bombs.splice(i, 1);
        i--;
        
        play.shields = play.shields -1;
        if (play.shields == 0) {
            play.sounds.playSound('warning');
          }else{
          play.sounds.playSound('explosion');
        }
        
      }
    }

    for (let i = 0; i < this.ufos.length; i++) {
      let ufo = this.ufos[i];
      let collision = false;
      for (let j = 0; j < this.bullets.length; j++) {
        let bullet = this.bullets[j];

        if (bullet.x >= (ufo.x - ufo.width / 2) &&
           bullet.x <= (ufo.x + ufo.width / 2) &&
           bullet.y >= (ufo.y - ufo.height / 2) &&
           bullet.y <= (ufo.y + ufo.height / 2)) {
          bullets.splice(j, 1);
          j--;
          collision = true;
          play.score += this.setting.scorePerUfo;  
        }
      }
      if (collision) {
        this.ufos.splice(i, 1);
        i--;

        play.sounds.playSound('ufoDeath')
      }
    }

    for (let i = 0; i < this.ufos.length; i++) {
      let ufo = this.ufos[i];
      if ((ufo.x + ufo.width / 2) >= (spaceship.x - (spaceship.width / 2)) &&
          (ufo.x - ufo.width / 2) <= (spaceship.x + (spaceship.width / 2)) &&
          (ufo.y + ufo.height / 2) >= (spaceship.y - (spaceship.height / 2)) &&
          (ufo.y - ufo.height / 2) <= (spaceship.y + (spaceship.height / 2))) {
        play.sounds.playSound('explosion');
        play.goToPosition(new GameOverPosition());
      }
    }
    console.log("shields: " + play.shields)
    if (play.shields <0) {
      play.goToPosition(new GameOverPosition());
    }

    if (this.ufos.length == 0){
      play.level++;
      play.shields = 2;
      play.setting.bulletSpeed = play.level * 50 + play.setting.bulletSpeed;
      play.setting.bombSpeed = play.level * 40 + play.setting.bombSpeed;
      play.goToPosition(new TransferPosition(play.level))
      
      
    }
  }
  shoot() {
    // Allows to shoot when there was no bullet shot or when the time between the last shot and now is more than the bullet frequency
    if (this.lastBulletTime === null 
        || ((new Date()).getTime() - this.lastBulletTime) > this.setting.bulletMaxFrequency) {
      this.object = new Objects();
      this.bullets.push(this.object.bullet(this.spaceship.x, this.spaceship.y - this.spaceship.height / 2, this.setting.bulletSpeed));
      this.lastBulletTime = (new Date()).getTime();
      play.sounds.playSound('shot');
    }
  }

  keyDown(play, keyboardCode) {
    if (keyboardCode == 'KeyP') {
      play.pushPosition(new PausePosition());
    }
    if (keyboardCode == 'Escape') {
      play.pushPosition(new GameOverPosition2());
    }
  }
}

