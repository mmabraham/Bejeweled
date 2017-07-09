export default class Progress {
  constructor(requiredPoints = 250000) {
    this.points = 0;
    this.ratio = 100 / requiredPoints;
    this.bar = document.getElementById('progress');
    this.flash = document.getElementById('points');
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
    if (this.points * this.ratio >= 100) {
      this.incrementLevel();
    }
  }

  incrementLevel() {
    this.bar.style.width = '0%';
    const event = new CustomEvent('incrementLevel', {});
    document.getElementById('grid').dispatchEvent(event);
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
