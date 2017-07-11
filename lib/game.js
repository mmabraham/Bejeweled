
import Board from './board';
import Timer from './timer';

export default class Game {
  constructor() {
    this.grid = document.getElementById('grid');
    this.levels = document.getElementById('level-display');
    this.pauseButton = document.getElementById('pause-button');
    this.modal = document.getElementById('modal');
    this.modalContent = document.getElementById('modal-content');

    this.modal.addEventListener('click', this.play.bind(this))
    this.pauseButton.addEventListener('click', this.pause.bind(this));
    this.grid.addEventListener('incrementLevel', this.incrementLevel.bind(this));
    this.level = 5;
    this.board = new Board(this, this.level);
    this.timer = new Timer()
    this.startLevel();
  }

  startLevel() {
    this.levels.innerHTML = `Level ${this.level - 4}`
    this.board.populate();
    this.timer.start(120 * 1000);
    this.pause();
  }

  pause() {
    this.timer.pause();
    this.modal.style.display = 'block';
    this.modalContent.innerHTML = `Level ${this.level - 4}`
  }

  play() {
    this.modal.style.display = 'none';
    this.board.start();
    this.timer.start();
  }

  incrementLevel() {
    this.board.frozen = true;
    this.board.clear();
    this.level += 1;
    this.levels.innerHTML = `Level ${this.level - 4}`
    setTimeout(() => {
      this.board = new Board(this, this.level);
      this.startLevel();
    }, 6000)
  }
}
