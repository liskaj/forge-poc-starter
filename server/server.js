const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');

const app = express();

app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
app.use(bodyParser.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, '../app')));
app.use('/api/auth', require('./auth'));
app.use('/api/data', require('./data'));
app.use('/api/storage', require('./storage'));
app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}...`);
});
