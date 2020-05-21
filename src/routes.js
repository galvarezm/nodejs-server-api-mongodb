const routes = require('express').Router();

// encriptador de contraseñas
const bcrypt = require('bcrypt');

// extención con utilidades para javascript
const _ = require('underscore');

// modelos base datos
const UserModel = require('./models/userModel');

// ruta: raiz
routes.get('/', function (req, res){
    res.json('*** NODE.JS - API SERVER WITH MONGODB ***!');
});

// ruta: listar todos los usuarios
routes.get('/user', function (req, res){

    // obtener parametros o filtros de paginas
    let page_from = req.query.page_from || 0; // opcional
    let page_to = req.query.page_to || 5; // opcional

    // consultar modelo de usuarios y retornar datos por página
    UserModel.find({}, 'name role img status google')
    .skip(parseInt(page_from))
    .limit(parseInt(page_to))
    .exec((err, users) => {

        // verificar existencia de errores
        if (err) {
            res.status(400).json({
                ok: false,
                msg: err,
            });
            return;
        }

        // responder: ok
        res.json({
            ok: true,
            records: users.length,
            data: users,
        });

    });
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
    // especificamos los campos que si deben ser actualizados
    let body = _.pick(req.body, ['name', 'role', 'email', 'img', 'status']);

    // actualizar el registro por su id interno
    UserModel.findByIdAndUpdate(prm.id, body, 
        { 
            new: true, // retornar el nuevo objeto con las modificaciones siempre
            runValidators: true, // verificar validaciones del modelo, antes de actualizar
            useFindAndModify: true,
        }, 
        (err, userDB) => {

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

        }
    );

});

// ruta: desactivar (eliminar) un usuario por su id
routes.delete('/user/:id', function (req, res){

    // recuperamos los parametros de entrada de la petición
    let prm = req.params;

    // desactivar el registro por su id interno
    UserModel.findByIdAndUpdate(prm.id, { status: false }, 
        { 
            new: true, // retornar el nuevo objeto con las modificaciones siempre
            runValidators: true, // verificar validaciones del modelo, antes de actualizar
            useFindAndModify: true,
        }, 
        (err, userDB) => {

            // verificar existencia de errores
            if (err){
                res.status(400).json({
                    ok: false,
                    msg: err,
                });
                return;
            }
            if (!userDB){
                res.status(400).json({
                    ok: false,
                    msg: 'User not found.',
                });
                return;
            }

            // responder: ok
            res.json({
                ok: true,
                data: userDB
            });

        }
    );

});

module.exports = routes;
