const routes = require('express').Router();

// encriptador de contraseñas
const bcrypt = require('bcrypt');

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

module.exports = routes;