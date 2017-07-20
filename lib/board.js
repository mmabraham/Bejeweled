import Progress from './progress';
import Jewel from './jewel';
import NullJewel from './null_jewel';
import Pos from './pos';
import Sounds from './sounds';

export default class Board {
  constructor(game, level) {
    this.game = game;
    this.progress = new Progress();
    game.grid.addEventListener('mousedown', this.handleSelect.bind(this))
    this.frozen = false;
  }

  reset() {
    this.level = this.game.level;
    this.progress.reset(this.level * 35000)
    this.game.grid.innerHTML = '';


    this.cols = {};
    for (let x = 0; x < 8; x++) {
      this.cols[x] = {};
      for (let y = 0; y < 8; y++) {
        this.cols[x][y] = Jewel.random(new Pos(x, y), this.game.grid, this.level).place()
      }
    }
  }

  start() {
    this.frozen = false;
    this.handleMatch(Jewel.getMovedJewels());
  }

  handleSelect(e) {
    if (e.target.id === "grid"  || this.frozen) return;
    const {x, y} = e.target.data
    this.selectJewel(new Pos(x, y));
  }

  selectJewel(pos) {
    const newJewel = this.getJewel(pos);
    Sounds.click();
    if (this.selected && this.selected.pos.isAdjacent(newJewel.pos)) {
      this.handleSwap(newJewel, this.selected);
      this.selected.reject(500);
      this.selected = null;
    } else {
      this.select(newJewel);
    }
  }

  handleMatch(jewels) {
    if (jewels.length === 0) return false;

    let matchedJewels = [];
    jewels.forEach(jewel => matchedJewels = matchedJewels.concat(this.getAllRows(jewel) ) );
    this.removeJewels(this.merge(matchedJewels));

    setTimeout(() => {
      if (!this.frozen) this.handleMatch(Jewel.getMovedJewels());
    }, 1000);

    return !!matchedJewels.length
  }

  handleSwap(jewel1, jewel2) {
    Sounds.swap();
    this.switchPositions(jewel1, jewel2, 0);
    this.handleMatch([jewel1, jewel2]) || this.switchPositions(jewel1, jewel2, 500); // swap back
  }

  getAllRows(jewel) {
    let result = false, pairs = [], toRemove = [];

    jewel.pos.allAdjacent().forEach((pos) => {
      if (this.getJewel(pos).matches(jewel)
        && !pairs.some((matchingJewel) => matchingJewel.sameRowAs(pos)) // to prevent duplicate row
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

  removeJewels(row) {
    const positions = row.map((jewel) => Object.assign(jewel.pos))
      .sort((a, b) => a.y < b.y ? -1 : 1);
    row.forEach(jewel => jewel.remove(500) ); // wait for swap animation

    this.replaceEmpty(positions);
    this.progress.update(row);
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

      if (jewels.length > 5) {debugger; 6}

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

  replaceEmpty(positions) {
    positions.forEach((pos) => {
      for (let y = pos.y - 1; y >= 0; y--) {
        const replacement = this.cols[pos.x][y];
        this.cols[pos.x][y + 1] = replacement;
        replacement.moveDown(700);
      }
      this.cols[pos.x][0] = Jewel.random(new Pos(pos.x, 0), this.game.grid, this.level).place(700) // wait for swap and removal animation
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
    Jewel.getMovedJewels(); // clear out last level's jewels
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
          }, 200) // wait for move down animation
        }
      }
      downOneRow();
    }, 1000) // wait for swap and replace animation
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
