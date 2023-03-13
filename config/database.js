const mongoose = require('mongoose')


// user schema
const UserSchema = mongoose.Schema({
    email: {type: String, required: true},
    salt: {type: String, required: true},
    hash: {type: String, required: true},
    fullName: String,
    date: { type: Date, required: true, default: Date() },
    updateDate: {type: Date, default: Date()},
    isAdmin: {type: Boolean, default: false},
    isWorker: {type: Boolean, default: true}

})

const User = mongoose.model('User', UserSchema)

// Product schema
const ProductSchema = mongoose.Schema({
    name: String,
    type: String,
    pic_url: String,
    price: Number
})

const Product = mongoose.model('Product', ProductSchema)

const InvoiceSchema = mongoose.Schema({
    orderFood: [{
        amount: Number,product: ProductSchema
    }],
    date: {type: Date, default: Date.now},
    
})
const Invoice = mongoose.model('Invoice', InvoiceSchema)


module.exports = {User, Product, Invoice}