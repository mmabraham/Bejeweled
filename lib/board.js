import Jewel from './jewel';
import NullJewel from './null_jewel';
import Pos from './pos';

export default class Board {
  constructor(container) {
    this.container = container;
    this.cols = {};
    this.container.addEventListener('mousedown', this.handleSelect.bind(this))

    // for debugging
    window.board = this;
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
    const {x, y} = e.target.data
    this.selectJewel(new Pos(x, y));
  }

  selectJewel(pos) {
    const newJewel = this.getJewel(pos);

    if (this.selected && this.selected.pos.isAdjacent(newJewel.pos)) {
      this.switchPositions(newJewel, this.selected);
      this.checkForMatch(newJewel, this.selected);
      this.selected.reject();
      this.selected = null;
    } else {
      this.select(newJewel);
    }
  }

  checkForMatch(jewel1, jewel2) {
    if ( [jewel1, jewel2].some(jewel => this.isMatch(jewel)) ) {
      console.log('found');
    } else {
      setTimeout(() => {
        console.log('we are in check for match')
        this.switchPositions(jewel1, jewel2);
      }, 500)
    }
  }

  remove(row) {
    setTimeout(() => {
      row.forEach(jewel => {
        console.log(`removing jewel ${jewel.type} at ${jewel.pos.x}, ${jewel.pos.y}`)
        this.cols[jewel.pos.x][jewel.pos.y] = new NullJewel(jewel.pos)
        jewel.remove()
        this.replace(jewel.pos);
      });
    }, 500)
  }

  isMatch(jewel) {
    let result = false;
    const pairs = [];
    jewel.pos.allAdjacent().forEach((pos) => {
      if (this.getJewel(pos).matches(jewel) &&
        !pairs.some((otherPair) => otherPair.sameRow(pos)) ) {
         pairs.push(pos);
      }
    })

    pairs.forEach((pos) => {
      const row = this.getRow(jewel, this.getJewel(pos))
      if (row.length >= 3) {
        result = true;
        console.log(row)
        this.remove(row);
      }
    })
    return result;
  }

  getRow(jewel1, jewel2) {
    const start = this.getEnd([jewel1, jewel2]);
    const end = this.getEnd([jewel2, jewel1]).slice(2)
    end.reverse();
    return start.concat(end);
  }

  getEnd(jewels = []) {
    const nextJewel = this.getJewel(
      jewels[jewels.length - 2].pos.next(jewels[jewels.length - 1].pos)
    );
    if (nextJewel.matches(jewels[jewels.length - 2])) {
      jewels.push(nextJewel);
      return this.getEnd(jewels)
    }
    return jewels
  }

  switchPositions(jewel1, jewel2) {
    jewel1.switchWith(jewel2);
    this.updateCols(jewel1);
    this.updateCols(jewel2);
  }

  replace(pos) {
    const col = this.cols[pos.x];
    for (let y = pos.y - 1; y >= 0; y--) {
      setTimeout(() => {
        console.log(`we are in replace ${pos.x}, ${pos.y} with item ${y}`)

        const replacement = col[y];
        replacement.moveDown();
        this.updateCols(replacement);
      }, 500)
    }
  }

  updateCols(jewel) {
    // const oldJewel = this.cols[jewel.pos.x][jewel.pos.y];
    // console.log(oldJewel);
    // console.log(`${this.cols[jewel.pos.x][jewel.pos.y].pos.x}, ${this.cols[jewel.pos.x][jewel.pos.y].pos.y} --- ${jewel.pos.x}, ${jewel.pos.y}`)
    // console.log(`${this.cols[jewel.pos.x][jewel.pos.y].div.data.x}, ${this.cols[jewel.pos.x][jewel.pos.y].div.data.y} --- ${jewel.pos.x}, ${jewel.pos.y}`)
    // console.log(`${jewel.pos.x}, ${jewel.pos.y}  was ${this.cols[jewel.pos.x][jewel.pos.y].type} --> ${jewel.type}`)


    this.cols[jewel.pos.x][jewel.pos.y] = jewel;
  }


  getJewel(pos) {
    return pos.isValid() ? this.cols[pos.x][pos.y] : new NullJewel(pos);
  }

  select(jewel) {
    if (this.selected) {
      this.selected.reject();
    }
    this.selected = jewel;
    jewel.select();
  }
}
