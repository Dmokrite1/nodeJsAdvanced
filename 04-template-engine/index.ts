import express from "express";
import mustacheExpress from "mustache-express";
//ctrl + shift + p and select tsserver ==> restart
import movies from './Data/movies.json';

const app = express();

//on ajoute mustache à la liste de template engine
app.engine('mustache', mustacheExpress());

//on définit l'engine à use par défaut pour l'app
app.set('view engine', 'mustache');

//on définit le folder dans lequel se trouve nos templates
app.set('views', './views');

app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', (request, response) => {
    //1er argument nom du fichier .mustache dans le folder views et le 2ieme les données dynamiques
    response.render('movie-list', {
        movies, isChartreuse: () => function (index:number, render: Function) {
            if (render(index) % 2 === 0) {
                return "burlywood"
            }
            return "chartreuse";
        }
    })
})

app.listen(8001, () => {
    console.log('Le lundi au soleil');
})