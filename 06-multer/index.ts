import express from 'express';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, './uploads');
    },
    filename: (request, file, cb) => {
        cb(null, file.originalname);
    }
})

const configureMulter = multer({
    storage,
})

const app = express();

app.use('/static', express.static(__dirname + '/uploads'));

app.get('/images', (request, response) => {
    response.sendFile(__dirname + "/index.html");
})

//use single quand la route s'attend à ne recevoir qu'un fichier
app.post('/uploads_file', configureMulter.single('my_super_file'), (request, response) => {
    console.log(request.file);
    console.log(request.body);
    response.redirect('/static/' + request.file?.originalname);
})

app.post('/sound_list', configureMulter.single('audio_file'), (request, response) => {
    console.log(request.file);
    console.log(request.body);
    response.redirect('/static/' + request.file?.originalname);
})

app.listen(8001, () =>{
    console.log("à l'abordageeee, uploader les fichiers !!!");
})