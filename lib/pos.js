window.GAP = 100;

export default class Pos {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  diff(other) {
    return {x: this.x -other.x, y: this.y -other.y };
  }

  nextPos(other) {
    const diff = this.diff(other);
    return {x:other.x + diff.x, y:other.y + diff.y};
  }

  isAdjacent(other) {
    const {x, y} = this;
    return (x === other.x || y === other.y) &&
      (x + 1 === other.x || x - 1 === other.x ||
        y + 1 === other.y || y -1 === other.y);
  }

  px() {
    return new Pos(this.x * GAP, this.y * GAP);
  }
}
