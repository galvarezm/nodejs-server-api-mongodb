// ==============================================
// :: configuración del servidor
// ==============================================
require('./config');

// ==============================================
// :: node.js / express
// ==============================================
const express = require('express');
const app = express();

// ==============================================
// :: definición de middlewares
// :: -------------------------------------------
// :: funciones que se disparan cada vez que
// :: existen peticiones hacia nuestro server.
// ==============================================

// preparar los formularios de entreada en cada petición
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ==============================================
// :: rutas del servidor
// ==============================================
const routes = require('./routes');
app.use('/', routes);

// ==============================================
// :: iniciar servidor
// ==============================================
app.listen(process.env.PORT, () => {
    console.log('***');
    console.log(`Server listening on port ${process.env.PORT}...`);
});