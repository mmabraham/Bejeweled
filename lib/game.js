
import Board from './board';
import Timer from './timer';

export default class Game {
  constructor() {
    this.grid = document.getElementById('grid');
    this.levels = document.getElementById('level-display');
    this.startButton = document.getElementById('start-button');
    this.modal = document.getElementById('modal');

    this.startButton.addEventListener('click', this.togglePause.bind(this));
    this.grid.addEventListener('incrementLevel', this.incrementLevel.bind(this));
    this.level = 5;
    this.board = new Board(this, this.level);
    this.timer = new Timer()
    this.startLevel();
  }

  startLevel() {
    this.startButton.innerHTML = 'Pause'
    this.board.populate();
    this.startButton.style.disabled = true;
    this.timer.start(120 * 1000);
  }

  togglePause() {
    if (this.paused) {
      this.modal.style.display = 'none';
      this.timer.start();
    } else {
      this.timer.pause();
      this.modal.style.display = 'block';
      this.modal.innerHTML = `You have reached level ${this.level - 4}`
    }
    this.paused = !this.paused;
  }

  incrementLevel() {
    this.togglePause();
    this.level += 1;
    this.levels.innerHTML = `Level ${this.level - 4}`
    this.board.clear();
    setTimeout(() => {
      this.board = new Board(this.grid, this.level);
      alert(`You have reached level ${this.level - 4}`)
      this.startLevel();
      this.startButton.disabled = false;
    }, 5000)
  }
}
