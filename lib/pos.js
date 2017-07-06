window.GAP = 60;

export default class Pos {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  diff(other) {
    return {x: other.x - this.x, y: other.y - this.y };
  }

  next(other) {
    const diff = this.diff(other);
    return new Pos(diff.x + other.x, diff.y + other.y);
  }

  allAdjacent() {
    const {x, y} = this;
    return [
      new Pos(x - 1, y),
      new Pos(x + 1, y),
      new Pos(x, y - 1),
      new Pos(x, y + 1)
    ].filter(pos => pos.isValid())
  }

  isAdjacent(other) {
    const {x, y} = this;
    return (x === other.x || y === other.y) &&
      (x + 1 === other.x || x - 1 === other.x ||
        y + 1 === other.y || y -1 === other.y);
  }

  down() {
    return new Pos(this.x, this.y + 1)
  }

  px() {
    return new Pos(this.x * GAP, this.y * GAP);
  }

  isValid() {
    return (this.x >= 0 && this.x < 8 && this.y >= 0 && this.y < 8)
  }
}
