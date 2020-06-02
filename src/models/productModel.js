const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name field is required!'],
    },
    unit_price: {
        type: Number,
        required: [true, 'unit price field is required!'],
    },
    description: {
        type: String,
        required: [true, 'description field is required!'],
    },
    enable: {
        type: Boolean,
        required: true,
        default: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: [true, 'categoryid field is required!'],
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'userid field is required!'],
    },
});

module.exports = mongoose.model('product', productSchema);