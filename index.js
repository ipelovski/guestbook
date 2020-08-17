'use strict';

const createApp = require('./app');

const port = 8080;

const app = createApp();
app.listen(port, () => console.log('app started on port ' + port));
