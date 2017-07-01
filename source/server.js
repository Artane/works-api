'use strict';
const Express = require('express');
const app = new Express();

const EnvConfig = require('../config').server;

const parser = require('body-parser');

app.use(parser.json());
app.use(parser.urlencoded({ encoded: true }));

// Enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept, x-access-token');
    next();
});

const routes = require('./router.js');
app.use('/', routes);

app.listen(EnvConfig.port, () => console.log(`Listening on port ${EnvConfig.port}...`));
