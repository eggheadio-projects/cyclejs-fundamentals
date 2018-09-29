import { run } from "@cycle/run"
import { div, label, input, hr, h1, makeDOMDriver } from "@cycle/dom"
import xs from "xstream"

function main(sources) {
    
    // -------------------->
    // ''---w---wo---wor----->
    // div--div--div--div---->
    
    const inputEv$ = sources.DOM.select('.field').events('input');
    const name$ = inputEv$.map(ev => ev.target.value).startWith('')
    
    return {
        DOM: name$.map(name => 
          div([
            label(['Name:']),
            input('.field', {attrs: {type: 'text'}}),
            hr(),
            h1('Hello ' + name +'!')
          ])
        )
    }
}

const drivers = {
    DOM: makeDOMDriver('#main')    
}

run(main, drivers);