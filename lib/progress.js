export default class Progress {
  constructor() {
    this.bar = document.getElementById('progress');
    this.total = document.getElementById('total-points-display');
    this.flash = document.getElementById('points');
    this.totalPoints = 0;
  }

  reset(requiredPoints = 250000) {
    this.points = 0;
    this.ratio = 100 / requiredPoints;
    this.bar.style.width = '0%';
  }

  update(jewels) {
    if (!jewels.length) return;
    const numJewels = jewels.length;
    const newPoints = (numJewels * numJewels * numJewels) * 100
    this.points += newPoints;
    this.totalPoints += newPoints
    setTimeout(() => {
      this.display(jewels[1].pos, newPoints)
      this.bar.classList.add('changing');
      this.bar.style.width = `${Math.min(this.points * this.ratio, 100)}%`;
      this.total.innerHTML = this.totalPoints;
    }, 500) // wait for swap
    if (this.points * this.ratio >= 100 && !this.freeze) {
      this.incrementLevel();
      this.freeze = true;
    }

  }

  incrementLevel() {
    const event = new CustomEvent('incrementLevel', {});
    setTimeout(() => document.getElementById('grid').dispatchEvent(event), 1000);
  }

  display(pos, points) {
    this.flash.innerHTML = points;
    this.flash.style.top = `${pos.px().y}px`;
    this.flash.style.left = `${pos.px().x + 160}px`;
    this.flash.classList.add('showing');
    setTimeout(() => {
      this.bar.classList.remove('changing');
      this.flash.classList.remove('showing');
    }, 600);
  }
}
