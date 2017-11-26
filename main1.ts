import {Observable, Observer} from 'rxjs'
// import {Observable} from 'rxjs/Observable'
// import {Observer} from 'rxjs/Observer'
// import "rxjs/add/operator/map"
// import "rxjs/add/operator/filter"

let numbers = [1,5,10];
//let source = Observable.from(numbers);
// let source = Observable.create(observer => {
//     for(let n of numbers) {
//         // if(n === 5) {
//         //     observer.error(`Something went wrong: ${n}`)
//         // }

//         observer.next(n)
//     }

//     observer.complete();
// })

let source = Observable.create(observer => {
    let index = 0;
    let produceValue = () => {
        observer.next(numbers[index++])

        if(index < numbers.length) {
            setTimeout(produceValue, 250)
        }else{
            observer.complete()
        }
    }

    produceValue();
}).map(n => n * 2)
    .filter(n => n > 4); // data processing pipeline


// class MyObserver implements Observer<number> {
//     next(value) {
//         console.log(`value is ${value}`);
//     }

//     error(e) {
//         console.error(`error: ${e}`)
//     }

//     complete() {
//         console.info('complete')
//     }
// }

// source.subscribe(new MyObserver());

source.subscribe(
    value => console.log(`value: ${value}`),
    e => console.error(`error: ${e}`),
    () => console.log('complete')
)