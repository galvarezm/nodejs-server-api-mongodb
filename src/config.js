// puerto de nuestro servidor
process.env.PORT = process.env.PORT || 3000;

// entorno (desarrollo / produccion) *heroku usa esta variable de entorno.
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// cadena de conexión a base de datos!
let urlConnectionDB;
const passwordCloud = 'dDJyP1gX1KAFlFmT'; // clave de cada cluster en mongodb cloud
if ( process.env.NODE_ENV === 'dev' ){
    urlConnectionDB = 'mongodb://localhost:27017/db-cafe';
}else{
    urlConnectionDB = `mongodb+srv://root:${passwordCloud}@herculescluster-0jd1d.gcp.mongodb.net/cafe-api`;
}
process.env.URI_DATA_BASE = urlConnectionDB;
