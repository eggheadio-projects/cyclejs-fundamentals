import xs from "xstream";
import fromEvent from "xstream/extra/fromEvent";
import { run } from "Cycle";

function main(sources) {
  const click$ = sources.DOM;
  return {
    DOM: click$
      .startWith(null)
      .map(() => xs.periodic(1000).fold(prev => prev + 1, 0))
      .flatten()
      .map(i => `Seconds elapsed: ${i}`),
    log: xs.periodic(2000).fold(prev => prev + 1, 0)
  };
}

// source = input (read) effect
// sink = output (write) effect

function domDriver(text$) {
  text$.subscribe({
    next: str => {
      const elem = document.querySelector("#app");
      elem.textContent = str;
    }
  });
  const domSource = fromEvent(document, "click");
  return domSource;
}

function logDriver(msg$) {
  msg$.subscribe({
    next: msg => {
      console.log(msg);
    }
  });
}

// fakeA = ...
// b = f(fakeA)
// a = g(b)
// fakeA.behaveLike(a)

/*function run(mainFn, drivers) {
    const fakeSinks = {};
    Object.keys(drivers).forEach(key => {
       fakeSinks[key] = xs.create(); 
    });
    
    const sources = {};
    Object.keys(drivers).forEach(key => {
        sources[key] = drivers[key](fakeSinks[key]);
    });
    
    const sinks = mainFn(sources);
    
    Object.keys(sinks).forEach(key => {
        fakeSinks[key].imitate(sinks[key]);
    });
    
    //const fakeDOMSink = xs.create();
    //const domSource = domDriver(fakeDOMSink);
    //const sinks = mainFn({DOM: domSource});
    //fakeDOMSink.imitate(sinks.DOM)
    
}

run(main, {
    DOM: domDriver,
    log: logDriver,
    
});*/

// Cycle.run
run(main, {
  DOM: domDriver,
  log: logDriver
});
