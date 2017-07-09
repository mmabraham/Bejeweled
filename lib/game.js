
import Board from './board';

export default class Game {
  constructor() {
    this.level = 5;
    this.grid = document.getElementById('grid');
    this.board = new Board(this.grid, 5);
    this.grid.addEventListener('incrementLevel', this.incrementLevel.bind(this));
    this.board.populate();
  }

  startLevel() {
  }

  incrementLevel() {
    this.level += 1;
    this.board.clear();
    setTimeout(() => {
      this.board = new Board(this.grid, this.level);
      alert(`You have reached level ${this.level - 4}`)
      this.board.populate();
    }, 5000)
  }
}
