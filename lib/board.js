import Jewel from './jewel';
import NullJewel from './null_jewel';
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
        this.switchPositions(jewel1, jewel2);
      }, 550)
      return false;
    }
  }

  remove(row) {
    setTimeout(() => {
      row.forEach(jewel => {
        this.replace(jewel.pos);
        jewel.remove()
        this.cols[jewel.pos.x][jewel.pos.y] = new NullJewel(jewel.pos)
      });
    }, 500)
  }

  isMatch(jewel) {
    let result = false;
    const pairs = jewel.pos.allAdjacent().filter((pos) => {
      return this.getJewel(pos).matches(jewel);
    })
    pairs.forEach((pos) => {
      const row = this.getRow(jewel, this.getJewel(pos))

      if (row.length >= 3) {
        result = true;
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

  replace({x, y}) {
    const col = this.cols[x]
    for (let key in col) {
      if (key < y) {
        setTimeout(() => {
          col[key].moveDown();
          this.updateCols(col[key]);
        }, 500)
      }
    }
    // if (y > 0) {
    //   // if (!col[y - 1].pos)
    //   this.replace({x, y: y - 1})
    // } else {
    //   col[y] = Jewel.random(new Pos(x, y), this.container).place();
    //   return null;
    // }
    // col[y - 1].move(new Pos(x, y));
    // this.cols[x][y] = col[y - 1];



    // const col = this.cols[x];
    // if (y > 0) {
    //   // if (!col[y - 1].pos)
    //   this.replace({x, y: y - 1})
    // } else {
    //   col[y] = Jewel.random(new Pos(x, y), this.container).place();
    //   return null;
    // }
    // col[y - 1].move(new Pos(x, y));
    // this.cols[x][y] = col[y - 1];
  }

  updateCols(jewel) {
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
