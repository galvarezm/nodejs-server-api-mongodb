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
const path = require('path');

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
const userRoutes = require('./routes/user');
const loginRoutes = require('./routes/login');
const categoryRoutes = require('./routes/categories');
app.use('/', userRoutes);
app.use('/', loginRoutes);
app.use('/', categoryRoutes);

// ==============================================
// :: habilitar paginas en el servidor
// ==============================================
app.use( express.static( path.resolve( __dirname, './public' ) ) );

// ==============================================
// :: conectar con base datos mongodb
// ==============================================
console.log(process.env.URI_DATA_BASE);
mongoose.connect(process.env.URI_DATA_BASE, 
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
    console.log(`Server listening on port ${process.env.PORT} on mode ${ process.env.NODE_ENV.toUpperCase() }.`);
});