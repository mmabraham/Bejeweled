export default class Timer {
  constructor(alottedTime) {
    this.clock = document.getElementById('clock');
    setInterval(this.updateTime.bind(this), 100);
  }

  start(alottedTime = this.alottedTime) {
    this.alottedTime = alottedTime;
    this.startTime = new Date().getTime();
    this.paused = false;
  }

  stop() {
    this.alottedTime = this.remainingTime();
    this.stop();
  }

  stop() {
    this.paused = true;
  }

  remainingTime() {
    return this.alottedTime - (new Date().getTime() - this.startTime);
  }

  updateTime() {
    if (this.paused) return;

    const remainingTime = Math.ceil(this.remainingTime() / 1000);
    this.clock.innerHTML = remainingTime;
    if (remainingTime <= 0) {
      console.log('game over')
      this.stop();
      this.alottedTime = 1000;
      this.startTime = new Date().getTime();
      document.getElementById('grid').dispatchEvent(new CustomEvent('timeout', {}));
    }
  }
}
