import Progress from './progress';
import Jewel from './jewel';
import NullJewel from './null_jewel';
import Pos from './pos';

export default class Board {
  constructor(game, level) {
    this.game = game;
    this.cols = {};
    this.progress = new Progress(level * 70000);
    this.level = level;
    game.grid.addEventListener('mousedown', this.handleSelect.bind(this))

    // for debugging
    window.board = this;
  }

  populate() {
    for (let x = 0; x < 8; x++) {
      this.cols[x] = {};
      for (let y = 0; y < 8; y++) {
        this.cols[x][y] = Jewel.random(new Pos(x, y), this.game.grid, this.level).place()
      }
    }
    setTimeout(() => this.handleSet(Jewel.retrieveMovedJewels()), 1200);
  }

  handleSelect(e) {
    if (e.target.id === "grid") return;
    const {x, y} = e.target.data
    this.selectJewel(new Pos(x, y));
  }

  selectJewel(pos) {
    const newJewel = this.getJewel(pos);

    if (this.selected && this.selected.pos.isAdjacent(newJewel.pos)) {
      // this.handleSwitch(newJewel, this.selected);
      this.checkForMatch(newJewel, this.selected);
      this.selected.reject(500);
      this.selected = null;
    } else {
      this.select(newJewel);
    }
  }

  handleSet(jewels) {
    // debugger
    if (jewels.length === 0) return false;

    let toRemove = [];
    jewels.forEach(jewel => {toRemove = toRemove.concat(this.anyPairs(jewel))} );
    toRemove = this.merge(toRemove); // in case of duplicate jewels
    const posRow = this.remove(toRemove);
    this.updateInCols(posRow);
    this.progress.update(toRemove);
    setTimeout(() => { this.handleSet(Jewel.retrieveMovedJewels()) }, 1000);

    return !!toRemove.length
  }

  checkForMatch(jewel1, jewel2) {
    this.switchPositions(jewel1, jewel2, 0);

    if (!this.handleSet([jewel1, jewel2])) {
      this.switchPositions(jewel1, jewel2, 500); // swap back
    }
  }



  anyPairs(jewel) {
    let result = false, pairs = [], toRemove = [];

    jewel.pos.allAdjacent().forEach((pos) => {
      if (this.getJewel(pos).matches(jewel)
       && !pairs.some((otherPair) => otherPair.sameRow(pos)) // to prevent duplicate row
      ) {
         pairs.push(pos);
      }
    })
    pairs.forEach((pos) => {
      const row = this.getRow(jewel, this.getJewel(pos))
      if (row.length >= 3) {
        result = true;
        toRemove = this.merge(toRemove.concat(row));
      }
    })
    return result ? toRemove : [];
  }

  remove(row) {
    const positions = row.map((jewel) => Object.assign(jewel.pos))
      .sort((a, b) => a.y < b.y ? -1 : 1);
    row.forEach(jewel => jewel.remove(500) );
    return positions;
  }

  getRow(jewel1, jewel2) {
    const start = this.getEnd([jewel1, jewel2]);
    const end = this.getEnd([jewel2, jewel1]).slice(2);
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

  merge(jewels) {
    return jewels.filter((jewel, i) => jewels.indexOf(jewel) === i)
  }

  switchPositions(jewel1, jewel2, delay) {
    jewel1.switchWith(jewel2, delay);
    this.updateCols(jewel1, delay);
    this.updateCols(jewel2, delay);
  }

  updateInCols(posRow) {
    posRow.forEach((pos) => {
      for (let y = pos.y - 1; y >= 0; y--) {
        const replacement = this.cols[pos.x][y];
        this.cols[pos.x][y + 1] = replacement;
        replacement.moveDown(700);
      }
      this.cols[pos.x][0] = Jewel.random(new Pos(pos.x, 0), this.game.grid, this.level).place(500)
    })
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

  clear() {
    setTimeout(() => {
      const allJewels = [];
      for (let y = 7; y >= 0; y--) {
        for (let x = 0; x < 8; x++) {
          allJewels.push(this.cols[x][y])
        }
      }
      const downOneRow = (i = 0) => {
        if (i < 9) {
          setTimeout(() => {
            allJewels.forEach((jewel) => {
              if (jewel.pos.y === 7) {
                jewel.remove(0);
              } else {
                jewel.moveDown();
              }
            })
            downOneRow(i + 1)
          }, 500)
        }
      }
      downOneRow();
    }, 1000)
  }

  // for debugging
  toString() {
    let string = '';
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        string += this.cols[x][y].pos.x === x && this.cols[x][y].pos.y === y ? this.cols[x][y].type[0] + ' ' : 'X ';
      }
      string += '\n'
    }
    return string;
  }
}
