export default class Progress {
  constructor() {
    this.bar = document.getElementById('progress');
    this.flash = document.getElementById('points');
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
    setTimeout(() => {
      this.display(jewels[1].pos, newPoints)
      this.bar.classList.add('changing');
      this.bar.style.width = `${this.points * this.ratio}%`;
    }, 500)
    if (this.points * this.ratio >= 100 && !this.freeze) {
      this.incrementLevel();
      this.freeze = true;
    }

  }

  incrementLevel() {
    this.bar.style.width = '100%';
    const event = new CustomEvent('incrementLevel', {});
    // setTimeout(
      // () =>
      document.getElementById('grid').dispatchEvent(event)
      // , 1000);
  }

  display(pos, points) {
    this.flash.innerHTML = points;
    this.flash.style.top = `${pos.px().y}px`;
    this.flash.style.left = `${pos.px().x}px`;
    this.flash.classList.add('showing');
    setTimeout(() => {
      this.bar.classList.remove('changing');
      this.flash.classList.remove('showing');
    }, 600);
  }
}
