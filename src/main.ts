import xs from 'xstream'
import fromEvent from 'xstream/extra/fromEvent'
import { run } from 'Cycle'

function main(sources) {
    const mouseover$ = sources.DOM.selectEvents('span', 'mouseover');
    return {
        DOM: mouseover$.startWith(null).map(() => 
            xs.periodic(1000)                       
             .fold(prev => prev + 1, 0)
          ).flatten()
           .map(i => ({
               tagName: 'H1',
               children: [
                    {
                        tagName: 'SPAN',
                        children: [
                            `Seconds elapsed: ${i}`
                        ]
                    },
                ]
           })),
        log: xs.periodic(2000)                       
           .fold(prev => prev + 1, 0)
    } 
}

// source = input (read) effect
// sink = output (write) effect

function domDriver(obj$) {
    function createElement(obj) {
        const element = document.createElement(obj.tagName);
        obj.children.forEach(child => {
            if (typeof child === 'object') {
                element.appendChild(createElement(child));
            } else {
              element.textContent = child;
            }
        })
        return element
    }
    
    
   obj$.subscribe({ next: obj => {
        const container = document.querySelector('#app');
        container.textContent = '';
        const element = createElement(obj);
        container.appendChild(element)
     }});  
     const domSource = {
         selectEvents: function (tagName, eventType) {
             return fromEvent(document, eventType)
                .filter(ev => ev.target.tagName === tagName.toUpperCase());
         }
     }
     return domSource;
}

function logDriver(msg$) {
    msg$.subscribe({ next: msg => { console.log(msg); }})
}

// Cycle.run
run(main, {
    DOM: domDriver,
    log: logDriver,
});



