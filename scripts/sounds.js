class Sounds {
  constructor() {
    
  }
init() {
  this.soundsSource = [
    'sounds/explosion.mp3',
    'sounds/shot.mp3', 
    'sounds/ufoDeath.mp3',
    'sounds/bomb.mp3',
    'sounds/warning.mp3'
  ];
  this.allSounds = [];
  for (let i = 0; i < this.soundsSource.length; i++) {
    const audio = new Audio();
    audio.src = this.soundsSource[i];
    audio.setAttribute('preload', 'auto');
    this.allSounds.push(audio);
  }

}
  playSound(soundName) {
    let soundNumber;

    switch (soundName) {
      case 'shot':
        soundNumber = 1;
        break;
      case 'ufoDeath':
        soundNumber = 2;
        break;
      case 'explosion':
        soundNumber = 0;
        break;
      case 'bomb':
        soundNumber = 3;
        break;
      case 'warning':
        soundNumber = 4;
        break;
      default:
        return;
    }
    this.allSounds[soundNumber].play();
    this.allSounds[soundNumber].currentTime = 0;
  }
}