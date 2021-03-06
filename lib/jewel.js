const TYPES = ['blue', 'yellow', 'red', 'white', 'pink', 'green', 'orange'];
import Sounds from './sounds';

export default class Jewel {
  constructor(pos, grid, type) {
    this.type = type;
    this.pos = pos;
    this.grid = grid;
    this.div = document.createElement('div');
    this.div.style.left = `${this.pos.px().x}px`;
    this.div.style.top = `${this.pos.y * GAP - 1000}px`;
    this.div.className = `jewel ${type}`;
    this.div.data = this.pos
  }

  place(delay = 1000) {
    grid.appendChild(this.div);
    Jewel.movedJewels.push(this);
    setTimeout(() => {
      this.div.style.top = `${this.pos.px().y}px`;
    }, delay - (this.pos.y * 120) + this.pos.x % 3 * 30)

    return this;
  }

  remove(delay) {
    Jewel.movedJewels.splice(Jewel.movedJewels.indexOf(this), 1)
    // wait for shrinking transition
    setTimeout(() => {
      Sounds.match();
      this.div.classList.add('removed')
      setTimeout(() => {
        this.div.remove();
      }, 300)
    }, delay);
  }

  move(newPos, delay) {
    this.pos = newPos;
    this.div.data = newPos;
    Jewel.movedJewels.push(this);
    this.animateMove(newPos, delay);
  }

  animateMove(newPos, delay) {
    setTimeout(() => {
      this.div.style.left = `${newPos.px().x}px`;
      this.div.style.top = `${newPos.px().y}px`;
    }, delay);
  }

  moveDown(delay) {
    this.move(this.pos.down(), delay);
  }

  switchWith(other, delay) {
    const ownPos = this.pos;
    this.move(other.pos, delay);
    other.move(ownPos, delay);
  }

  select() {
    this.div.classList.add('selected');
  }

  reject(delay) {
    setTimeout(() => {
      this.div.classList.remove('selected');
    }, delay)
  }

  matches(other) {
    return this.type === other.type
  }

}

Jewel.random = (pos, grid, level = TYPES.length) => {
  level = TYPES.length;
  return new Jewel(pos, grid, TYPES[Math.floor(Math.random() * level) % 7]);
}

Jewel.movedJewels = [];

Jewel.getMovedJewels = () => {
  const result = Jewel.movedJewels;
  Jewel.movedJewels = [];
  return result;
}
