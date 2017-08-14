xs.periodic(1000)                  // ---!---!---!---!---
.fold(prev => prev + 1, 0)         // 0--1---2---3---4---
.map(i => `Seconds elapsed: ${i}`)
.subscribe({
    next: str => {
        const elem = document.querySelector('#app');
        elem.textContent = str;
    }
})