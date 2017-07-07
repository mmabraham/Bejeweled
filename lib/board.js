import Jewel from './jewel';
import NullJewel from './null_jewel';
import Pos from './pos';

export default class Board {
  constructor(container) {
    this.container = container;
    this.cols = {};
    this.points = 0;
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
    // console.log(e.target.data)
    console.log(this.getJewel(new Pos(x, y)))
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

  handleSet(jewels) {
    let toRemove = [];
    jewels.forEach(jewel => {toRemove = toRemove.concat(this.anyPairs(jewel))} );
    toRemove = this.merge(toRemove); // in case of duplicate jewels
    this.remove(toRemove)
      .then(this.updateInCols.bind(this))
      .then(this.updatePoints.bind(this));

    return !!toRemove.length
  }

  checkForMatch(jewel1, jewel2) {
    if (!this.handleSet([jewel1, jewel2]))
      setTimeout(() => {
        // console.log('we are in check for match')
        this.switchPositions(jewel1, jewel2); // reverse swap
      }, 500)
    }



  anyPairs(jewel) {
    let result = false, pairs = [], toRemove = [];

    jewel.pos.allAdjacent().forEach((pos) => {
      if (this.getJewel(pos).matches(jewel)
      //  && !pairs.some((otherPair) => otherPair.sameRow(pos)) // to prevent duplicate row
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
      debugger
    })
    return toRemove
  }

  remove(row) {
    return new Promise(resolve => {
      const positions = row.map((jewel) => Object.assign(jewel.pos))
      .sort((a, b) => a.y < b.y ? -1 : 1)
      setTimeout(() => {
        row.forEach(jewel => {
          console.log(`removing jewel ${jewel.type} at ${jewel.pos.x}, ${jewel.pos.y}`)
          jewel.remove()
        });
        resolve(positions);
      }, 500)
    })
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

  merge(jewels) {
    return jewels.filter((jewel, i) => jewels.indexOf(jewel) === i)
  }

  switchPositions(jewel1, jewel2) {
    jewel1.switchWith(jewel2);
    this.updateCols(jewel1);
    this.updateCols(jewel2);
  }

  updateInCols(posRow) {
    return new Promise(resolve => {
      setTimeout(() => {
        posRow.forEach((pos) => {
          for (let y = pos.y - 1; y >= 0; y--) {
            const replacement = this.cols[pos.x][y];
            this.cols[pos.x][y + 1] = replacement;
            replacement.moveDown();
          }
          this.cols[pos.x][0] = Jewel.random(new Pos(pos.x, 0), this.container).place()
        })
        resolve(posRow.length);
      }, 500)
    })
  }

  updateCols(jewel) {
    this.cols[jewel.pos.x][jewel.pos.y] = jewel;
  }

  getJewel(pos) {
    return pos.isValid() ? this.cols[pos.x][pos.y] : new NullJewel(pos);
  }

  updatePoints(numJewels) {
    const newPoints = (numJewels * numJewels * numJewels) * 10
    this.points += newPoints;
    console.log(this.points);
  }

  select(jewel) {
    if (this.selected) {
      this.selected.reject();
    }
    this.selected = jewel;
    jewel.select();
  }
}
