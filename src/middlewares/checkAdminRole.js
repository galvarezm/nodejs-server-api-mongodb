// realiza la verificación del rol administrador de un usuario
let checkAdminRole = (req, res, next) => {

    // obtenemos los datos del usuario, desde el anterior middleware
    let userRole = req.user.role;

    // verificamos si se trata de un administrador
    if ( userRole != 'ADMIN_ROLE' ){
        return res.status(401).json({
            ok: false,
            err: 'Unautorize, you are not administrator.'
        });
    }

    // todo esta ok, continuamos
    next();

}

module.exports = {
    checkAdminRole
}