import xs from "xstream";

function main() {
  return {
    DOM: xs
      .periodic(1000)
      .fold(prev => prev + 1, 0)
      .map(i => `Seconds elapsed: ${i}`),
    log: xs.periodic(2000).fold(prev => prev + 1, 0)
  };
}

function domDriver(text$) {
  text$.subscribe({
    next: str => {
      const elem = document.querySelector("#app");
      elem.textContent = str;
    }
  });
}

function logDriver(msg$) {
  msg$.subscribe({
    next: msg => {
      console.log(msg);
    }
  });
}

function run(mainFn, drivers) {
  const sinks = mainFn();
  Object.keys(drivers).forEach(key => {
    if (sinks[key]) {
      drivers[key](sinks[key]);
    }
  });
}

run(main, {
  DOM: domDriver,
  log: logDriver
});
