const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = 4000;

const bodyParser = require('body-parser');
const playerRoute = require('./routes/player.route');
const path = require('path');
const metaDataModel = require("./models/metadata.model")

/////////////
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

///////////
app.use('/', playerRoute);

io.on('connection', async (socket) => {
    const getMetaData = await metaDataModel.findAll({
        raw: true
    })

    socket.emit('metaData', {
        allMetaData: getMetaData,
    });
})


server.listen(port, () => {
    console.log('App is online at port: ' + port);
})