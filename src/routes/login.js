const routes = require('express').Router();

// encriptador de contraseñas
const bcrypt = require('bcrypt');

// librerias de google para la autenticacion
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENTE_ID);

// json web tokens
const jwt = require('jsonwebtoken');

// modelos base datos
const UserModel = require('../models/userModel');

// ruta: login
routes.post('/login', function (req, res){

    // obtener datos del formulario de entrada
    let body = req.body;

    // construir objeto con las condiciones de busqueda
    let conditions = {
        email: body.email
    };

    // buscar un usuario con esas credenciales en mongodb
    UserModel.findOne(conditions, (err, userDB) => {

        // verificar existencia de errores
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: err,
            });
        }

        // verificar existencia del usuario con esas credenciales
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                msg: 'Email or password is invalid!',
            });
        }

        // verificar la contraseña proporcionada
        console.log(body.password, userDB.password);
        if ( !bcrypt.compareSync( body.password, userDB.password ) ){
            return res.status(400).json({
                ok: false,
                msg: 'Password or email is invalid!',
            });
        }

        // como todo esta ok, generamos un nuevo token
        let newToken = jwt.sign({
            user: userDB,
            currentDate: Date.now()
        }, process.env.TOKEN_SEED, {
            expiresIn: process.env.TOKEN_EXP
        });

        // responder: ok
        res.json({
            ok: true,
            userDB,
            token: newToken,
        });

    });

});

// ===============================================
// Verificar Tokens de Google Sign In
// ===============================================
async function verifyGoogleToken( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENTE_ID,
    });
    const payload = ticket.getPayload();
   return {
       name: payload.name, 
       email: payload.email, 
       img: payload.img, 
       google: true,
   }
}

// ruta: google sign in
routes.post('/google_signin', async (req, res) => {

    // obtener datos del formulario de entrada
    let body = req.body;

    // obtener el token de google asociado a la cuenta
    let token = body.idtoken;

    // obtener el usuario de google para futura creación
    let userGoogle = await verifyGoogleToken( token )
    .catch( err => {
        return res.status(403).json({
            ok: false,
            err
        });
    });

    // logica buscar usuario y retornar un token con jwt
    UserModel.findOne({email: userGoogle.email}, (err, userDB) => {

        // verificar existencia de errores
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: err,
            });
        }

        // verificar usuario encontrado
        if ( userDB ){
            // caso: usuario encontrado
console.log('userDB', userDB);
            // verificar si se trata de un usuario google anteriormente creado
            if ( !userDB.google ){
                // caso: debe hacer login por el sistema tradicional
                return res.status(403).json({
                    ok: false,
                    msg: 'You must authenticate by normal away.',
                });
            }else{
                // caso: todo ok, generar un jwtoken

                // como todo esta ok, generamos un nuevo token
                let newToken = jwt.sign({
                    user: userDB,
                    currentDate: Date.now()
                }, process.env.TOKEN_SEED, {
                    expiresIn: process.env.TOKEN_EXP
                });

                // responder: ok
                res.json({
                    ok: true,
                    userDB,
                    token: newToken,
                });

            }
        }else{
            // caso: usuario NO encontrado (crear)

            // crear usuario en base de datos
            let newUser = new UserModel();
            newUser.name = userGoogle.name;
            newUser.email = userGoogle.email;
            newUser.img = userGoogle.img;
            newUser.password = 'xxx-yyy-zzz';
            newUser.role = 'USER_ROLE';

            // guardar nuevo documento
            newUser.save((err, userSaved) => {

                // verificar existencia de errores
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        msg: err,
                    });
                }

                // como todo esta ok, generamos un nuevo token
                let newToken = jwt.sign({
                    user: userSaved,
                    currentDate: Date.now()
                }, process.env.TOKEN_SEED, {
                    expiresIn: process.env.TOKEN_EXP
                });

                // responder: ok
                res.json({
                    ok: true,
                    userSaved,
                    token: newToken,
                });

            });

        }

    });

});

module.exports = routes;