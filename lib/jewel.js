const TYPES = ['blue', 'yellow', 'red', 'white', 'purple', 'green', 'orange'];

export default class Jewel {
  constructor(pos, grid, type) {
    this.type = type;
    this.pos = pos;
    this.grid = grid;
    this.div = document.createElement('div');
    this.div.style.left = `${this.pos.x * GAP}px`;
    this.div.style.top = `${this.pos.y * GAP}px`;
    this.div.className = `jewel ${type}`;
    this.div.data = this.pos
  }

  place() {
    grid.appendChild(this.div);
    return this;
  }

  move(newPos) {

    this.pos = newPos
    this.div.data = newPos;
    this.div.style.left = `${newPos.px().x}px`;
    this.div.style.top = `${newPos.px().y}px`;
  }

  switchWith(other) {
    const ownPos = this.pos;
    this.move(other.pos);
    other.move(ownPos);
  }

  select() {
    this.div.classList.add('selected');
  }

  reject() {
    debugger
    this.div.classList.remove('selected');
  }

}

Jewel.random = (pos, grid, level = TYPES.length) => {
  return new Jewel(pos, grid, TYPES[Math.floor(Math.random() * level)]);
}
