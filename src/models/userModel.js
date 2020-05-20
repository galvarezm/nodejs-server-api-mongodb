const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name field is required!'],
    },
    email: {
        type: String,
        required: [true, 'email field is required!'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'password field is required!'],
    },
    img: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: {
            values: ['ADMIN_ROLE', 'USER_ROLE'],
            message: '{VALUE} is not valid role!',
        }
    },
    status: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    },
});

// Evitar que el campo password sea retornado en las respuestas
// al usuario, alterando el metodo tojson del objeto de mongo.
userSchema.methods.toJSON = function () {
    let currentUser = this;
    let objUser = currentUser.toObject();
    delete objUser.password;
    return objUser;
}

module.exports = mongoose.model('user', userSchema);