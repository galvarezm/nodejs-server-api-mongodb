const routes = require('express').Router();

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

    // verificar datos del usuario
    if ( body.name === undefined ){
        // responder: ok
        res.status(400).json({
            msg: 'bad request, the name is required.'
        });
    }else{
        // responder: error
        res.json({
            body
        });
    }

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
