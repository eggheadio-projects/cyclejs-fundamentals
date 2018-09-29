import { run } from "@cycle/run"
import { button, p, h1, h4, a, div, makeDOMDriver } from "@cycle/dom"
import { makeHTTPDriver } from "@cycle/http"
import xs from "xstream"

// READ DOM: button cick  
// WRITE HTTP: request sent
// READ HTTP: response received
// WRITE DOM: data displayed

function main(sources) {
    const click$ = sources.DOM.select('.get-first').events('click');
    
    const request$ = click$.map(ev =>
        ({
            url:'https://jsonplaceholder.typicode.com/users/1',
            method: 'GET',
            category: 'user-data',
        })
    );
    
    const response$ = sources.HTTP
        .select('user-data')
        .flatten()
        .map(res => res.body);
        
    const vdom$ = response$.startWith({}).map(response =>
        div([
          button('.get-first', 'Get first user'),
          div('.user-details', [
            h1('.user-name', response.name),
            h4('.user-email', response.email),
            a('.user-website', {attrs: {href: response.website}}, response.website)
          ])
        ])  
    )
    
    return {
      DOM: vdom$,
      HTTP: request$,
    }
}

const drivers = {
    DOM: makeDOMDriver('#main'), 
    HTTP: makeHTTPDriver(),
}

run(main, drivers);