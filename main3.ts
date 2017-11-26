import {Observable, Observer} from 'rxjs'
import { load, loadWithFetch } from './loader';

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

// let source = Observable.create(observer => {
//     observer.next(1)
//     observer.next(2)
//     observer.error("Stop!")
//     observer.next(3)
//     observer.complete()
// })

let source = Observable.merge(
    Observable.of(1),
    Observable.from([2,3,4]),
    Observable.of(5)
)

source.subscribe(
    value => console.log(`value: ${value}`),
    error => console.log(`Error is: ${error}`),
    () => console.log("merges complete")
)



// let circle = document.getElementById("circle");
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


let output = document.getElementById("output");
let button = document.getElementById("button");
let click = Observable.fromEvent(button, "click");

function renderMovies(movies) {
    movies.forEach(m => {
        let div = document.createElement("div")
        div.innerText = m.title
        output.appendChild(div)
    })
}

let moviesUrl = "movies.json";
let subscripton$ = load(moviesUrl)
    .subscribe(
        renderMovies,
        e => console.error(`error: ${e}`),
        () => console.info('movies complete!')
    );

console.log(subscripton$);

// subscroption$.unsubscribe();

click.flatMap(e => loadWithFetch(moviesUrl))
    .subscribe(
        renderMovies,
        e => console.error(`An error occurred while processing movies: ${e}`),
        () => console.info("complete")
    );


