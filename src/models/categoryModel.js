const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let categorySchema = new Schema({
    description: {
        type: String,
        required: [true, 'description field is required!'],
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'user field is required!'],
    },
});

module.exports = mongoose.model('category', categorySchema);