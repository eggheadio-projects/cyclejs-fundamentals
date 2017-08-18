import { run } from "@cycle/run"
import { div, label, input, h2, makeDOMDriver } from "@cycle/dom"
import { makeHTTPDriver } from "@cycle/http"
import xs from "xstream"

function intent(domSource) {
  const changeValue$ = domSource.select('.slider').events('input')
      .map(ev => ev.target.value)
      
  return { changeValue$ };
}

function model(actions, props$) {
  const {changeValue$} = actions;
  return props$.map(props => {
    return changeValue$.startWith(props.init)
      .map(value => {
        return {
          value, 
          label: props.label, 
          unit: props.unit, 
          max: props.max, 
          min: props.min
        }
      })
  }).flatten();
}

function view(state$){
  return state$.map(state =>
    div('.labeled-slider', [
      label('.label', state.label + ': ' + state.value + state.unit),
      input('.slider', {attrs: {type: 'range', min: state.min, max: state.max, value: state.value}})
    ])
    )
  
}

function labeledSlider(sources) {
  const props$ = sources.props
  const actions = intent(sources.DOM);
  const state$ = model(actions, props$);
  const vdom$ = view(state$);
    
    return {
        DOM: vdom$,
    }
}

function main(sources) {
  const weightProps$ = xs.of({
      label: 'Weight',
      unit: 'kg',
      min: 40,
      max: 150,
      init: 40,
    })
  const weightDOMSource = sources.DOM.select('.weight')
  const weightSinks = labeledSlider({
    ...sources, DOM: weightDOMSource, props: weightProps$
  });
  const weightVDOM$ = weightSinks.DOM.map(vdom => {
    vdom.sel += '.weight';
    return vdom;
  })
  const heightProps$ = xs.of({
      label: 'Height',
      unit: 'cm',
      min: 140,
      max: 220,
      init: 440,
    })
  const heightDOMSource = sources.DOM.select('.height')
  const heightSinks = labeledSlider({
    ...sources, DOM: heightDOMSource, props: heightProps$
  });
  const heightVDOM$ = heightSinks.DOM.map(vdom => {
    vdom.sel += '.height';
    return vdom;
  })
  const vdom$ = xs.combine(weightVDOM$, heightVDOM$)
    .map(([weightVDOM, heightVDOM]) => 
      div([
        weightVDOM,
        heightVDOM
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