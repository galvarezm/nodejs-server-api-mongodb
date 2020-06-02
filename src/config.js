// puerto de nuestro servidor
process.env.PORT = process.env.PORT || 3000;

// jw-token: tiempo de expiracion
process.env.TOKEN_EXP = (60 * 60 * 24 * 30); // equivalente a => ( seg * min * horas * dias )

// cliente id para google sign in (si no esta definido ponemos uno por default)
process.env.GOOGLE_CLIENTE_ID = process.env.GOOGLE_CLIENTE_ID || '478179655855-u4iouq6il3i969cpf7aecl75rthfqnb8.apps.googleusercontent.com';

// entorno (desarrollo / produccion) *heroku usa esta variable de entorno.
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// variables de entorno del servidor según ambiente
let urlConnectionDB; // cadena de conexión a base de datos mongodb
let jwtSeed; // semilla secreta para generacion de nuevos tokens
if ( process.env.NODE_ENV === 'dev' ){
    // ambiente desarrollo
    urlConnectionDB = 'mongodb://localhost:27017/db-cafe';
    jwtSeed = 'VyIjp7-InJvbGU-iO-iJBRE1JTl-9STdDIxQHl-vcG1haWw1w-t56Y3f-gwnQ';
}else{
    // ambiente producción (cloud / heroku)
    urlConnectionDB = process.env.REMOTE_MONGO_URI;
    jwtSeed = process.env.REMOTE_TOKEN_SEED;
}
process.env.URI_DATA_BASE = urlConnectionDB;
process.env.TOKEN_SEED = jwtSeed;