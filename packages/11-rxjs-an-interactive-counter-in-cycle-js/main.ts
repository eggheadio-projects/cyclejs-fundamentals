import { run } from "@cycle/run"
import { button, p, label, div, makeDOMDriver } from "@cycle/dom"
import xs from "xstream"

function main(sources) {
    const decClick$ = sources.DOM.select('.dec').events('click');
    const incClick$ = sources.DOM.select('.inc').events('click');
    
    const dec$ = decClick$.map(() => -1); // --(-1)-----------(-1)-->
    const inc$ = incClick$.map(() => +1); // ---------(+1)---------->
    
    const delta$ = xs.merge(dec$, inc$);  // --(-1)---(+1)----(-1)-->
    
    const number$ = delta$.fold((prev, x) => prev + x, 0);
    
    return {
        DOM: number$.map(number =>
          div([
            button('.dec', 'Decrement'),
            button('.inc', 'Increment'),
            p([
              label('Counr: ' + number)
            ])
          ])
        )
    }
}

const drivers = {
    DOM: makeDOMDriver('#main')    
}

run(main, drivers);