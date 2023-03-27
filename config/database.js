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


const ExpenseSchema = mongoose.Schema({
    name: String,
    amount: String,
    price: Number,
    date: {type: Date, default: new Date()},
    user: {type: UserSchema},
})

const Expense = mongoose.model('expense', ExpenseSchema)

const VoucherSchema = mongoose.Schema({
    code: String,
    value: Number,
    date: {type: Date, default: new Date()}
})

const Voucher = mongoose.model('voucher', VoucherSchema)

const InvoiceSchema = mongoose.Schema({
    orderFood: [{
        amount: Number,product: ProductSchema
    }],
    date: {type: Date, default: new Date()},
    user: {type: UserSchema},
    wholePrice: {type: Number},
    voucher: {type: Number},
    tableNumber: Number,
    isDone: Boolean
    
})
const Invoice = mongoose.model('Invoice', InvoiceSchema)

const CategorySchema = mongoose.Schema({
    category: String,
    
})

const Category = mongoose.model('category', CategorySchema)

const TableSchema = mongoose.Schema({
    tableNumber: {type: Number, unique: true},
    invoiceID: {type: mongoose.Schema.Types.ObjectId, ref: 'Invoice'},
    isFree: Boolean

})

const Table = mongoose.model('table', TableSchema)

module.exports = {User, Product, Invoice, Expense, Voucher, Category, Table}