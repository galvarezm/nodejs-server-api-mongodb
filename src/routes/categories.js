const routes = require('express').Router();

// modelos base datos
const CategoryModel = require('../models/categoryModel');

// funciones middlewares a utilizar en las rutas
const { authToken } = require('../middlewares/authToken');
const { checkAdminRole } = require('../middlewares/checkAdminRole');

// ruta: listar todos las categorias
routes.get('/category', authToken, function (req, res){

    // retornar todas las categorias
    CategoryModel.find({})
    .sort('description')
    .populate('user', 'name email') // inner join con la tabla de usuarios
    .exec((err, categoryList) => {

        // verificar existencia de errores
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        // responder: ok
        res.json({
            ok: true,
            data: categoryList,
        });

    });

});

// ruta: mostrar una categoria por su id
routes.get('/category/:id', authToken, function (req, res){

    // obtener el id de la categoria que se esta consultando
    let categoryId = req.params.id;

    // retornar todas las categorias
    CategoryModel.findById(categoryId, (err, categoryDB) => {

        // verificar existencia de errores
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        // verificar creacion de la nueva categoria
        if ( !categoryDB ) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'error consulting this category.'
                },
            });
        }

        // responder: ok
        res.json({
            ok: true,
            category: categoryDB,
        });

    });

});

// ruta: crear una nueva categoria
routes.post('/category', authToken, function (req, res){

    // obtener datos del cuerpo de la peticion
    let body = req.body;

    // creamos nueva instancia de categoria
    let categoryItem = new CategoryModel({
        description: body.description,
        user: req.user._id, // recordar que esto lo proporciona el middleware en la validacion del token
    });

    categoryItem.save((err, categoryDB) => {
        
        // verificar existencia de errores
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        // verificar creacion de la nueva categoria
        if ( !categoryDB ) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'error creating the new category.'
                },
            });
        }

        // responder: ok
        res.json({
            ok: true,
            category: categoryDB,
        });

    });

});

// ruta: actualizar datos de una categoria (solo un admin)
routes.put('/category/:id', [authToken, checkAdminRole], function (req, res){

    // obtener datos del cuerpo de la peticion
    let body = req.body;

    // obtener el id de la categoria que se necesita actualizar
    let categoryId = req.params.id;

    // construir objeto con los datos para actualizar
    let data = {
        description: body.description,
    }

    // actualizar datos de la categoria
    CategoryModel.findByIdAndUpdate(
        categoryId,
        data,
        { new: true, runValidators: true },
        (err, categoryDB) => {
            
            // verificar existencia de errores
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            // verificar creacion de la nueva categoria
            if ( !categoryDB ) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'error updating this category.'
                    },
                });
            }

            // responder: ok
            res.json({
                ok: true,
                category: categoryDB,
            });

        }
    );

});

// ruta: eliminar una categoria (solo un admin)
routes.delete('/category/:id', [authToken, checkAdminRole], function (req, res){

    // obtener el id de la categoria que se necesita eliminar
    let categoryId = req.params.id;

    // realizar la eliminación
    CategoryModel.findByIdAndRemove(categoryId, (err, categoryDB) => {

        // verificar existencia de errores
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        // verificar creacion de la nueva categoria
        if ( !categoryDB ) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'error deleting this category.'
                },
            });
        }

        // responder: ok
        res.json({
            ok: true,
            category: categoryDB,
        });

    });


});

module.exports = routes;