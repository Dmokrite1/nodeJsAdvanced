import Express from 'express';
import { router } from './router';

async function init() {
    const express = Express();

    express.use(Express.json());

    express.use(router);

    express.listen(5555, () => {
        console.log("Links listen");
    });
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
init();
