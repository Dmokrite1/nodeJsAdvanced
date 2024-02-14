import express, { Application } from "express";

const app = express();

app.use('/assets', express.static(__dirname + '/assets'))

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html')
})

app.listen(8081, () => {
    console.log("i am ready");
})