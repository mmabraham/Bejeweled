const TYPES = ['blue', 'yellow', 'red', 'white', 'pink', 'green', 'orange'];

export default class Jewel {
  constructor(pos, grid, type) {
    this.type = type;
    this.pos = pos;
    this.grid = grid;
    this.div = document.createElement('div');
    this.div.style.left = `${this.pos.x * GAP}px`;
    this.div.style.top = `${this.pos.y * GAP - 1000}px`;
    this.div.className = `jewel ${type}`;
    this.div.data = this.pos
  }

  place() {
    grid.appendChild(this.div);
    setTimeout(() => {
      this.div.style.top = `${this.pos.y * GAP}px`;
    }, 1000 - (this.pos.y * 120) + this.pos.x % 3 * 30)
    return this;

    //debugging
    this.div.addEventListener('click', (e) => console.log(this.div.data))
  }

  remove() {
    this.div.classList.add('removed')
    console.log(`we are in remove with ${this.pos.x}, ${this.pos.y}`)
    // wait for shrinking transition
    setTimeout(() => {
      console.log(`removing ${this.type}`)
      this.div.remove();
    }, 500);
  }

  move(newPos) {
    this.pos = newPos
    this.div.data = newPos;
    this.div.style.left = `${newPos.px().x}px`;
    this.div.style.top = `${newPos.px().y}px`;
  }

  moveDown(delay) {
    setTimeout(() => {

      this.move(this.pos.down());
    }, delay)
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
    this.div.classList.remove('selected');
  }

  matches(other) {
    return this.type === other.type
  }

}

Jewel.random = (pos, grid, level = TYPES.length) => {
  return new Jewel(pos, grid, TYPES[Math.floor(Math.random() * level)]);
}
