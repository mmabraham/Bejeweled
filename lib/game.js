
import Board from './board';
import Timer from './timer';
import Jewel from './jewel';

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
    this.grid.addEventListener('timeout', this.gameOver.bind(this));
    this.level = 5;
    this.timer = new Timer();
    this.modalContent.innerHTML = `Level ${this.level - 4}`
    this.board = new Board(this, this.level);
    this.startLevel();
    this.pause();
  }

  startLevel() {
    this.levels.innerHTML = `Level ${this.level - 4}`;
    this.board.reset();
    this.timer.reset(120 * 1000);
    this.board.frozen = false;
  }

  pause() {
    this.timer.stop();
    this.modal.style.display = 'block';
  }

  play() {
    if (this.board.frozen) return;
    this.modal.style.display = 'none';
    this.board.start();
    this.timer.start();
  }

  gameOver() {
    this.levelOver(3000);
    this.modalContent.innerHTML = `Game Over <br /> Play again?`;
    this.board.progress.totalPoints = 0;
    this.board.level = 5;
  }

  levelOver(delay) {
    this.board.frozen = true;
    this.pause();
    this.board.clear();
    setTimeout(() => this.startLevel(), delay)
  }

  incrementLevel() {
    this.levelOver(3000);
    this.level += 1;
    this.modalContent.innerHTML = `Level ${this.level - 4}`
  }
}
