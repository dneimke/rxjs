import {Observable, Observer} from 'rxjs'

/* Creation - http://reactivex.io/documentation/operators.html#creating
------------------------------
- arrays, events, create method
- fromPromise - projects a Promise into an Observable
- defer - factory method for making Observables lazy

*/


/* Operators - http://reactivex.io/documentation/operators.html
------------------------------
- map, filter, delay
- flatMap - projects an Observable onto a single output Observable stream
- retry, retryWhen
- take, takeWhile
- delay
*/


// let circle = document.getElementById("circle");
let output = document.getElementById("output");
let button = document.getElementById("button");
// let source = Observable.fromEvent(document, "mousemove")
//                 .map((e: MouseEvent) => {
//                     return {
//                         x: e.clientX,
//                         y: e.clientY
//                     }
//                 })
//                 .filter(value => value.x < 500)
//                 .delay(300);

// source.subscribe(onNext)
// function onNext(value) {
//     circle.style.left = value.x;
//     circle.style.top = value.y;
// }

function load(url: string) {
    return Observable.create(observer => {
        let xhr = new XMLHttpRequest();
        
            xhr.addEventListener("load", () => {
                if(xhr.status === 200) {
                    let data = JSON.parse(xhr.responseText);
                    observer.next(data);
                    observer.complete();
                }else{
                    observer.error(xhr.statusText);
                }
                
            })
            
            xhr.open("GET", url);
            xhr.send();
    }).retryWhen(retryStrategy({attempts: 3, delay: 1500}))
    // .retry(3);
};


function loadWithFetch(url: string) {
    return Observable.defer(() => {
        return Observable.fromPromise(fetch(url).then(r => {
            return r.json()
        }));
    }) 
}


function retryStrategy({attempts = 3, delay = 1500}) {
    return function(errors) {
        return errors.scan((accumulator, err) => {
            console.log(`${accumulator}`);
            return accumulator + 1
        }, 0)
        .takeWhile(acc => acc < attempts)
        .delay(delay);
    }
}

let click = Observable.fromEvent(button, "click");

function renderMovies(movies) {
    movies.forEach(m => {
        let div = document.createElement("div")
        div.innerText = m.title
        output.appendChild(div)
    })
}

let moviesUrl = "movies.json";
loadWithFetch(moviesUrl).subscribe()

click.flatMap(e => loadWithFetch(moviesUrl))
    .subscribe(
        renderMovies,
        e => console.error(`An error occurred while processing movies: ${e}`),
        () => console.info("complete")
    );


