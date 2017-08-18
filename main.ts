import { run } from "@cycle/run"
import { div, label, input, h2, makeDOMDriver } from "@cycle/dom"
import { makeHTTPDriver } from "@cycle/http"
import xs from "xstream"

// DOM READ: detect sliding event
// recalculate BMI = w / h*h
// DOM WRITE: display BMI

function main(sources) {
    const changeWeight$ = sources.DOM.select('.weight').events('input')
      .map(ev => ev.target.value)
    const changeHeight$ = sources.DOM.select('.height').events('input')
      .map(ev => ev.target.value)
    
    const state$ = xs.combine(changeWeight$.startWith(70), changeHeight$.startWith(179))
        .map(([weight, height]) => {
            const heightMeters = height * 0.01;
            const bmi = Math.round(weight / (heightMeters * heightMeters))
            return {bmi, weight, height};
        })
    
    const vdom$ = state$.map(state =>
        div([
          div([
            label('Weight: ' + state.weight + 'kg'),
            input('.weight', {attrs: {type: 'range', min: 40, max: 150, value: state.weight}})
          ]),
          div([
            label('Height: ' + state.height + 'cm'),
            input('.height', {attrs: {type: 'range', min: 150, max: 220, value: state.height}})
          ]),
          h2('BMI is ' + state.bmi)
        ])    
    )
    return {
        DOM: vdom$,
    }
}

const drivers = {
    DOM: makeDOMDriver('#main'), 
}

run(main, drivers);