export class serverSynchronizer {
  constructor(_message: string) {
    this.stack = [];
    this.message = _message;
    this.initialize();
  }

  stack: Array<Function>;
  message: string;

  initialize() {
    setInterval(() => {
      //   console.log("interval");
    }, 5000);
  }
}
