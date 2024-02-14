// ... middlewares = arguments infinis
// eslint-disable-next-line @typescript-eslint/ban-types
function post(route: string, ...middlewares: Function[]) {
    console.log(route, middlewares);

    for (const fn of middlewares) {
        fn();
    }
}

post('/post', () => {
    console.log('fonction 1');
}, () => {
    console.log('fonction 2');
}, () => {
    console.log('fonction 3');
});

const tableauDeMiddlewares = [
    () => {
        console.log('fonction 1');
    },
    () => {
        console.log('fn 2');
    }
];

post('/post', ...tableauDeMiddlewares, () => {
    console.log('fn 3');
});

/* en interne =>
post('/post',
    () => {
            console.log('fonction 1');
    },
    () => {
            console.log('fn 2');
    },
    () => {
        console.log('fn 3');
    }
);
*/
