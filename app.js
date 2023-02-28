const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()
const port = 3000

// bodyparser initialization
app.use(bodyParser.json());
app.use(bodyParser .urlencoded({extended: false}));

// database connection
const config = require (path.resolve('config/connection.js'));
const client = config.data;
(async () => {
    await client.connect().then(() => {
        console.log('connection has been established successfully');
    })
    .catch(err => {
        console.error('unable to connect to the database:', err);
    })
})();

// route
require('./routes/routes')(app);

// server connection
(async () => {
    app.listen(port, () => {
        console.log(`example app listening at http://localhost:${port}`);
    });
})();