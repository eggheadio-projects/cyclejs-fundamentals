import { run } from "@cycle/run"
import { div, label, input, h2, makeDOMDriver } from "@cycle/dom"
import isolate from "@cycle/isolate"
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
  }).flatten().remember();
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
        value: state$.map(state => state.value),
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
  const weightSlider = isolate(labeledSlider, '.weight');
  const weightSinks = weightSlider({
    ...sources, props: weightProps$
  });
  
  const heightProps$ = xs.of({
      label: 'Height',
      unit: 'cm',
      min: 140,
      max: 220,
      init: 140,
    })
  const heightSlider = isolate(labeledSlider, '.height');
  const heightSinks = heightSlider({
    ...sources, props: heightProps$
  });
  
  const bmi$ = xs.combine(weightSinks.value, heightSinks.value)
    .map(([weight, height]) => {
      const heightMeters = height * 0.01;
      const bmi = Math.round(weight / (heightMeters * heightMeters))
      return bmi;
    });

  const vdom$ = xs.combine(bmi$, weightSinks.DOM, heightSinks.DOM)
    .map(([bmi, weightVDOM, heightVDOM]) => 
      div([
        weightVDOM,
        heightVDOM,
        h2('BMI: ' + bmi)
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