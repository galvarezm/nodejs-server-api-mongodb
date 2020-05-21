// ==============================================
// :: configuración del servidor
// ==============================================
require('./config');

// ==============================================
// :: node.js / express / mongoose
// ==============================================
const express = require('express');
const app = express();
const mongoose = require('mongoose');

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
// :: conectar con base datos mongodb
// ==============================================
mongoose.connect('mongodb://localhost:27017/db-cafe', 
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true, 
    }, 
    (err, res) => {
        if (err) throw err;
        console.log('Data base mongodb is online.');
    }
);

// ==============================================
// :: iniciar servidor
// ==============================================
app.listen(process.env.PORT, () => {
    console.log('***');
    console.log(`Server listening on port ${process.env.PORT}...`);
});