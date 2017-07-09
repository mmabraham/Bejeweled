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

  place(delay = 1000) {
    grid.appendChild(this.div);
    Jewel.movedJewels.push(this);
    setTimeout(() => {
      this.div.style.top = `${this.pos.y * GAP}px`;
    }, delay - (this.pos.y * 120) + this.pos.x % 3 * 30)

    return this;

    //debugging
    // this.div.addEventListener('click', (e) => console.log(this.div.data))
  }

  remove(delay) {
    Jewel.movedJewels.splice(Jewel.movedJewels.indexOf(this), 1)
    console.log(`we are in remove with ${this.pos.x}, ${this.pos.y}`)
    // wait for shrinking transition
    setTimeout(() => {
      console.log(`removing ${this.type}`)
      this.div.classList.add('removed')
      setTimeout(() => {
        this.div.remove();
      }, 300)
    }, delay);
  }

  move(newPos, delay) {
    this.pos = newPos
    this.div.data = newPos;
    Jewel.movedJewels.push(this);
    setTimeout(() => {
      this.div.style.left = `${newPos.px().x}px`;
      this.div.style.top = `${newPos.px().y}px`;
    }, delay)
  }

  animateMove(newPos, delay) {
    setTimeout(() => {
      this.div.style.left = `${newPos.px().x}px`;
      this.div.style.top = `${newPos.px().y}px`;
    }, delay)
  }

  moveDown(delay) {
    console.log(`moving down ${this.type} from ${this.pos.x}, ${this.pos.y}`)
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
  return new Jewel(pos, grid, TYPES[Math.floor(Math.random() * level)]);
}

Jewel.movedJewels = [];

Jewel.retrieveMovedJewels = () => {
  const result = Jewel.movedJewels;
  Jewel.movedJewels = [];
  return result;
}

window.Jewel = Jewel;
