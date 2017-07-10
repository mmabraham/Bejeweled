export default class Timer {
  constructor(alottedTime) {
    this.clock = document.getElementById('clock');
  }

  start(alottedTime = this.alottedTime) {
    this.alottedTime = alottedTime;
    this.startTime = new Date().getTime();
    this.ref = setInterval(this.updateTime.bind(this), 1000);
    this.updateTime();
  }

  pause() {
    this.alottedTime = this.remainingTime();
    this.stop();
  }

  stop() {
    clearInterval(this.ref);
  }

  remainingTime() {
    return this.alottedTime - (new Date().getTime() - this.startTime);
  }

  updateTime() {
    const remainingTime = Math.floor(this.remainingTime() / 1000);
    this.clock.innerHTML = remainingTime;
    if (remainingTime <= 0) {
      this.stop();
      document.getElementById('grid').dispatchEvent(new CustomEvent('timeOut', {}));
    }
  }
}
