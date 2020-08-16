const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const productCartSchema = new mongoose.Schema({
    product: {
        type: ObjectId,
        ref: "Product"
    },
    name: {
        type : String
    },
    count: {
        type: Number
    },
    price : {
        type: Number
    }
});

const orderSchema = new mongoose.Schema({
    products : [productCartSchema],
    transaction_id : {},
    amount: {
        type: Number, 
        required: true
    },
    deliveryAddress : {
        type: String,
        maxlength: 2000
    },
    updated: {
        type: Date
    },
    user: {
        type: ObjectId,
        ref : "User"
    }

}, {timestamps: true});

const Order = mongoose.model("Order", orderSchema)
const Cart = mongoose.model("Cart", productCartSchema)

module.exports = {Order, Cart}
