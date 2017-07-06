
import Board from './board';

export default class Game {
  constructor() {
    this.grid = document.getElementById('grid');
    this.board = new Board(this.grid);
    this.board.populate();
  }
}
