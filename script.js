// Logic
function main() {
    return xs.periodic(1000)                       
            .fold(prev => prev + 1, 0)        
            .map(i => `Seconds elapsed: ${i}`)
}

function domDriver(text$) {
   text$.subscribe({
    next: str => {
        const elem = document.querySelector('#app');
        elem.textContent = str;
     }
    })  
}

function logDriver(msg$) {
    msg$.subscribe({
        next: msg => {
            console.log(msg);
        }
    })
}

const sink = main();
domDriver(sink);
logDriver(sink);