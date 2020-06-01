// libreria jwtoken
const jwt = require('jsonwebtoken');

// autorización de tokens en las llamadas
let authToken = (req, res, next) => {

    // obtener el token string desde la petición (header)
    let userToken = req.get('token');

    // validacion del token
    jwt.verify( userToken, process.env.TOKEN_SEED, (err, decoded) => {

        // verificar la existencia de errores
        if ( err ){
            return res.status(401).json({
                ok: false,
                err
            });
        }

        // pasamos los datos del usuario que estan almacenados en el token
        // para poder usarlos en el requerimiento u otros middlewares.
        // estos datos se almacenan cuando se hace login y se crea este token.
        req.user = decoded.user

        // todo ok, se permite el paso con la ejecución de la petición del usuario
        next();

    });

}

module.exports = {
    authToken
}