const routes = require('express').Router();

// encriptador de contraseñas
const bcrypt = require('bcrypt');

// modelos base datos
const UserModel = require('./models/userModel');

// ruta: raiz
routes.get('/', function (req, res){
    res.json('*** NODE.JS - API SERVER WITH MONGODB ***!');
});

// ruta: listar todos los usuarios
routes.get('/user', function (req, res){
    res.json('get user list');
});

// ruta: crear un usuario
routes.post('/user', function (req, res){

    // recuperamos el formulario enviado gracias a body-parser
    let body = req.body;

    // verificar campos de entrada necesarios
    if ( body.name === undefined ){
        res.status(400).json({
            ok: false,
            msg: 'bad request, name field is required.'
        });
        return;
    }
    if ( body.email === undefined ){
        res.status(400).json({
            ok: false,
            msg: 'bad request, email field is required.'
        });
        return;
    }
    if ( body.password === undefined ){
        res.status(400).json({
            ok: false,
            msg: 'bad request, password field is required.'
        });
        return;
    }

    // nueva instancia del modelo de usuarios
    let User = new UserModel({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
    });

    // guardar nuevo usuario en la base de datos
    User.save((err, userDB) => {

        // verificar existencia de errores
        if (err){
            res.status(400).json({
                ok: false,
                msg: err,
            });
            return;
        }

        // responder: ok
        res.json({
            ok: true,
            data: userDB
        });

    });


});

// ruta: actualizar datos de un usuario en particular
routes.put('/user/:id', function (req, res){

    // recuperamos los parametros de entrada de la petición
    let prm = req.params;

    // recuperamos el formulario enviado gracias a body-parser
    let body = req.body;

    // responder la petición
    res.json({
        id: prm.id,
        body
    });

});

// ruta: desactivar (eliminar) un usuario por su id
routes.delete('/user/:id', function (req, res){

    // recuperamos los parametros de entrada de la petición
    let prm = req.params;

    // responder la petición
    res.json({
        id: prm.id,
    });

});

module.exports = routes;
