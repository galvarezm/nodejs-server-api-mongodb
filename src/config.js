// puerto de nuestro servidor
process.env.PORT = process.env.PORT || 3000;

// entorno (desarrollo / produccion) *heroku usa esta variable de entorno.
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// cadena de conexión a base de datos!
let urlConnectionDB;
if ( process.env.NODE_ENV === 'dev' ){
    urlConnectionDB = 'mongodb://localhost:27017/db-cafe';
}else{
    urlConnectionDB = process.env.MONGO_URI;
}
process.env.URI_DATA_BASE = urlConnectionDB;
