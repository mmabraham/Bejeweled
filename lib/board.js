import Jewel from './jewel';
import Pos from './pos';

export default class Board {
  constructor(container) {
    this.container = container;
    this.cols = {};
    this.container.addEventListener('mousedown', this.handleSelect.bind(this))
  }

  populate() {
    for (let x = 0; x < 8; x++) {
      this.cols[x] = {};
      for (let y = 0; y < 8; y++) {
        this.cols[x][y] = Jewel.random(new Pos(x, y), this.container).place()
      }
    }
  }

  handleSelect(e) {
    if (e.target.id === "grid") return;
    this.selectJewel(e.target.data);
  }

  selectJewel(pos) {
    const newJewel = this.getJewel(pos);
    if (this.selected && this.selected.pos.isAdjacent(newJewel.pos)) {
      this.switchPositions(newJewel, this.selected);
      this.selected.reject();
      this.selected = null;
    } else {
      debugger
      this.select(newJewel);
    }
  }

  // match(jewel) {
  //   const nextPos = jewel.adjacentPositions.filter((pos) => {
  //     if (this.getJewel(pos).type === jewel.type) {
  //       result += this.sides()
  //     }
  //   })
  // }

  getRow(jewels) {

  }

  switchPositions(jewel1, jewel2) {
    jewel1.switchWith(jewel2);
    this.updateCols(jewel1);
    this.updateCols(jewel2);
  }

  updateCols(jewel) {
    this.cols[jewel.pos.x][jewel.pos.y] = jewel;
  }

  getJewel(pos) {
    return this.cols[pos.x][pos.y]
  }

  select(jewel) {
    if (this.selected) {
      this.selected.reject();
    }
    this.selected = jewel;
    jewel.select();
  }
}
