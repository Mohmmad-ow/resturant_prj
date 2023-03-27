// Required Packages and functions
const { render } = require('ejs');
// passport js is for user auth
const passport = require('passport');
// Router to create routs and export them for app.js
const router = require('express').Router();



// the User, product, invoice (checkout), expenses, voucher, category and table DB tables
const {User, Product, Invoice, Expense, Voucher, Category, Table} = require('../config/database');
// Genpass and ValidPass for creating and validating users
const {genPassword, validPassword} = require('../Utils/passwordVaild')
// makepdf to create a printed form of the checkout, isAdmin and isWorker is for user permissions
const {makePdf, isAdmin, isWorker} = require('./Middleware')
// file system to delete images when they are edited out
const fs = require("fs")

// we need path to go one level up when uploading pics
const path = require('path')


// Home page
router.get('/', isWorker,(req, res, next) => {
    Table.find().then((content) => {
        content = content.sort((a, b) => {return a.tableNumber - b.tableNumber})
        console.log(content)
        res.render("home", {tables: content, user: req.user, message: req.session.message})
        delete req.session.message
    }).catch(err => console.log(err))
})

router.get('/settings', (req, res) => {
    Voucher.find().then((voucher) => {

        Category.find().then((category) => {

            Table.find().then((table) => {
                table = table.sort((a, b) => {return a.tableNumber - b.tableNumber})
                console.log(table)
                res.render('settings', {vouchers: voucher, categories: category, tables: table})

            }).catch(err => console.log(err))

        }).catch(err => console.log(err))

    }).catch(err => console.log(err))
    
})

// table CRUD
router.post('/api/tables/create', (req, res) => {
    const number = req.body.tableNumber

    Table.create({tableNumber: number, isFree: true}).then((table) => {
        console.log(table)
        res.redirect('/settings')
    }).catch(err => console.log(err))
})

router.post('/api/tables/delete/:id', (req, res) => {
    const id = req.params.id

    Table.findByIdAndDelete(id).then((content) => {

        console.log(content)

        res.redirect('/settings')
    }).catch(err => console.log(err))
})

// Voucher CRUD
router.post('/api/voucher/create', (req, res) => {
    const {code, value} = req.body

    Voucher.create({code: code, value: value}).then((content) => {
        console.log(content)
        res.redirect('/settings')
    }).catch(err => console.log(err))

})

// Category CURD
router.post('/api/category/create', (req, res) => {
    console.log(req.body)
    const {category} = req.body

    Category.create({category: category}).then((content) => {
        console.log(content)
        res.redirect('/settings')
    }).catch(err => console.log(err))
})

// Products - CRUD 
router.get('/api/products/create', (req, res) => {
    Category.find().then((categories) => {

        res.render('product-create', {categories: categories})
    }).catch(err => console.log(err))
})


router.post('/api/products/create', (req, res) => {
    if (Object.keys(req.files).length == 0) {
        res.status(400).send("No file uploaded")

        return;
    } 
    console.log("here I'm")
    const file = req.files.product_image
    const date = Date.now()
    const filePath = path.join(__dirname,'../' + "public/uploaded_images/products/" + date + file.name);
    const {name, type, price} = req.body
    Product.create({name: name,type: type, price: price, pic_url: ("/uploaded_images/products/" + date + file.name)}).then(content => {
        if(content) {
            file.mv(filePath).then(() => {
                res.redirect('/api/products/view')
            }).catch((err) => {
                console.log(err)
            })
        }
    }).catch(err => {
        console.log(err)
    })
})

router.get('/api/products/view', (req, res) => {
    Product.find().then((content) => {
        res.render("product", {products: content, user: req.user})
    }).catch((err) => {
        console.log(err)
    })
})

router.get("/api/products/edit/:id", (req, res) => {
    const id = req.params.id
    Product.findById(id).then(content => {
        res.render("product-edit", {product: content})
    }).catch(err => console.log(err))
})
router.post("/api/products/edit/:id", (req, res) => {
    console.log("you are editing")
    if (Object.keys(req.files).length == 0) {
        res.status(400).send("No file uploaded")

        return;
    } 
    const id = req.params.id
    const date = Date.now()
    const file = req.files.product_image
    const filePath =path.join(__dirname,'../' + "public/uploaded_images/products/" + date + file.name);
    const {name, type, price} = req.body
    
    Product.findOneAndUpdate({_id: id}, {$set: {name: name, price: price, type: type,  pic_url: ("/uploaded_images/products/" + date + file.name)}}).then(content => {
        if(content) {
            fs.unlinkSync(path.join(__dirname,'../' + "public", content.pic_url), (err) => {
                if(!err) {
                    console.log("deleted old image")
                } else {
                    console.log(err)
                }
            })
            file.mv(filePath).then(() => {
                res.redirect('/api/products/view')
            }).catch((err) => {
                console.log(err)
            })
        }
    }).catch(err => {
        console.log(err)
    })

})

router.get("/api/products/delete/:id", (req, res) => {
    const id = req.params.id;
    res.render("product-delete", {id: id})
})

router.post("/api/products/delete/:id", (req, res) => {
    const id = req.params.id
    Product.findByIdAndDelete(id).then(content => {
        fs.unlinkSync(path.join(__dirname,'../' + "public", content.pic_url), (err) => {
            if(!err) {
                console.log("worked")
            } else {
                console.log(err)
            }
        })
        res.redirect("/api/products/view")
    }).catch(err => console.log(err))
})

// Invoice - CRUD


router.get("/api/invoice/create/:tableNumber", (req, res) => {
    Product.find().then((content) => {
        Voucher.find().then((voucher) => {

            res.render("invoice-create", {products: content, vouchers: voucher, tableNumber: req.params.tableNumber})

        }).catch(err => {console.log(err)})

    }).catch(err => {
        console.log(err)
    })
})

// invoice is gonna be viewed by id at first but later by table number
router.get("/api/invoice/view/:id", (req, res) => {
    const id = req.params.id;
    Invoice.findById(id).then((invoice) => {
        res.render("invoice", {invoice: invoice})
    }).catch(err => {console.log(err)})
})


// view all invoices - as analytics
router.get("/api/invoice/analytics/", (req, res) => {
    Invoice.find().then(content => {
        
        content = content.reverse()
        res.render('analytics', {checkouts: content})
    }).catch(err => console.log(err))
})

router.post('/api/invoice/create/:tableNumber', (req, res) => {
    console.log(req.body)
    console.log(Object.keys(req.body))
    
   let ids = Object.keys(req.body).filter( (id) => {
        if (id != 'voucher' && id != 'wholePrice' && id != 'usedCode' && id !='finish') {
            return id
        }

    })
    const wholePrice = Number(req.body.wholePrice.slice(0, -1))
    const usedCode = req.body.usedCode

    Product.find({_id:{$in: ids}}).then((products) => {
        let orderObject = products.map((product) => {
            return {amount: req.body[product.id], product: product}
        })
        payment = orderObject.map(obj => {
            console.log(obj['product'].price*obj.amount)
            return obj['product'].price*obj.amount
          })
        Voucher.deleteMany({_id: {$in: usedCode}}).then((voucher) => {
            console.log("these have been removed: " + voucher)
            console.log(payment)
            console.log(orderObject)
            Invoice.create({tableNumber: req.params.tableNumber ,orderFood: orderObject, date: Date.now(), user: req.user, wholePrice: wholePrice, isDone: false, voucher: req.body.voucherValue}).then((content) => {
                console.log(content)
                if (req.body.finish == "Yes") {
                    console.log("table empty")
                    Table.findOneAndUpdate({tableNumber: req.params.tableNumber}, {invoiceID: content.id, isFree: false}).then((table) => {
                        console.log(table.invoiceID)
                        res.redirect('/api/invoice/checkout/'+content.id)
                    })
                } else {
                    res.redirect('/')
                    console.log("Table still in progress")
                }
            })

        }).catch(err => {console.log(err)})
    }).catch(err => {
        console.log(err)
    })
    
    
})

router.get('/api/invoice/edit/:tableNumber', (req, res) => {

    Table.findOne({tableNumber: req.params.tableNumber}).then((table) => {
        
        Invoice.findOne({_id: table.invoiceID}).then((content) => {

            Voucher.find().then((vouchers) => {
                Product.find().then((products) => {

                    res.render('invoice-edit', {order: content, vouchers: vouchers, tableNumber: req.params.tableNumber, products: products})
                }).catch(err => console.log(err))

            }).catch(err => console.log(err))
            console.log(content)

        }).catch(err => console.log(err))

    }).catch(err => console.log(err))
})

router.post("/api/invoice/edit/:tableNumber", (req, res) => {
    console.log(req.body)
    console.log(Object.keys(req.body))
    
   let ids = Object.keys(req.body).filter( (id) => {
        if (id != 'voucher' && id != 'wholePrice' && id != 'usedCode' && id !='finish' && id != 'voucherValue') {
            return id
        }

    })
    const wholePrice = Number(req.body.wholePrice.slice(0, -1))
    const usedCode = req.body.usedCode


    Product.find({_id:{$in: ids}}).then((products) => {
        let orderObject = products.map((product) => {
            return {amount: req.body[product.id], product: product}
        })
        payment = orderObject.map(obj => {
            console.log(obj['product'].price*obj.amount)
            return obj['product'].price*obj.amount
          })
        Voucher.deleteMany({_id: {$in: usedCode}}).then((voucher) => {
            console.log("these have been removed: " + voucher)
            console.log(payment)
            console.log(orderObject)
            Table.findOne({tableNumber: req.params.tableNumber}).then((table) => {

                Invoice.findOneAndUpdate({_id: table.invoiceID},{tableNumber: req.params.tableNumber ,orderFood: orderObject, date: Date.now(), user: req.user, wholePrice: wholePrice, isDone: false, voucher: req.body.voucherValue}).then((content) => {
                    console.log(content)
                    if (req.body.finish == "Yes") {
                        console.log("table empty")
                        Table.findOneAndUpdate({tableNumber: req.params.tableNumber}, {invoiceID: content.id, isFree: false}).then((table) => {
                            console.log(table.invoiceID)
                            res.redirect('/api/invoice/checkout/'+content.id)
                        })
                    } else {
                        res.redirect('/')
                        console.log("Table still in progress")
                    }
                }).catch(err => console.log(err))
            
            }).catch(err => console.log(err))

        }).catch(err => {console.log(err)})
    }).catch(err => {
        console.log(err)
    })
    
})

// checkout to view and print
router.get('/api/invoice/checkout/:id', (req, res) => {
    const id = req.params.id
    Invoice.findById(id).then((content) => {
        res.render('checkout', {order: content})
    })
})

// only checkout and make the table free
router.post('/api/invoice/checkout/:id', (req, res) => {
    Invoice.findOne({_id: req.params.id}).then((order) => {

        Table.findOneAndUpdate({tableNumber: order.tableNumber}, {isFree: true}).then((no) => {
            console.log("table is free")
            res.redirect('/')
        })
    })
})

// print the order
router.post('/api/invoice/checkout/:id/print', (req, res) => {
    const id = req.params.id
        
        console.log(req.body)
        let {received, returned} = req.body
        returned = returned.slice(0, -1)
        Invoice.findById(id).then((order) => {

            Table.findOneAndUpdate({tableNumber: order.tableNumber}, {isFree: true}).then((content) => {

                makePdf(order, res, received, returned)
            })
        }).catch(err => console.log(err))
    

})

// View profits 
router.get('/profits', (req, res) => {
    console.log(req.body)
    Invoice.find().then((checkouts) => {
        Expense.find().then((expenses) => {
            const totalSold = checkouts.map((checkout) => {
            
                return checkout.wholePrice
            
            }).reduce((a, b) => a+b, 0)

            const totalExpenses = expenses.map((expense) => {
            
                return expense.price
            }).reduce((a, b) => a+b, 0)

            res.render('profits-selected-date', {totalExpenses: totalExpenses, totalSold: totalSold, totalProfit: totalSold-totalExpenses})

        }).catch(err => console.log(err))

    }).catch(err => console.log(err))
})

// View the profits by the day. month, year and choose between the dates
router.post('/profits', (req, res) => {
    
    let selectedDate, momentJsStart, startDate, momentJsEnd, endDate
    if (req.body.date != undefined) {
        selectedDate = req.body.date
        momentJsStart = moment(selectedDate, "YYYY-MM-DD")
        startDate = momentJsStart.toDate()
        momentJsEnd = momentJsStart.add(1, 'day')
        endDate = momentJsEnd.toDate()
        
        
    } else if (req.body.month != undefined) {
        selectedDate = req.body.month
        momentJsStart = moment(new Date().getFullYear() +'-'+ selectedDate, "YYYY-MM")
        startDate = momentJsStart.toDate()
        momentJsEnd = momentJsStart.add(1, 'months')
        endDate = momentJsEnd.toDate()
        
        
    } else if (req.body.year != undefined) {
        selectedDate = req.body.year
        momentJsStart = moment(selectedDate, "YYYY")
        startDate = momentJsStart.toDate()
        momentJsEnd = momentJsStart.add(1, 'year')
        endDate = momentJsEnd.toDate()
        
    } else {
        selectedDate = req.body.chooseBetween
        momentJsStart = moment(selectedDate[0], "YYYY-MM-DD")
        startDate = momentJsStart.toDate()
        momentJsEnd = moment(selectedDate[1])
        endDate = momentJsEnd.toDate()
        
    }

    Invoice.find({ date:  {
        '$gt':  startDate,
        '$lt':  endDate
    } }).then((checkouts) => {
        Expense.find({ date:  {
            '$gt':  startDate,
            '$lt':  endDate
        } }).then((expenses) => {
            const totalSold = checkouts.map((checkout) => {
            
                return checkout.wholePrice
            
            }).reduce((a, b) => a+b, 0)

            const totalExpenses = expenses.map((expense) => {
            
                return expense.price
            }).reduce((a, b) => a+b, 0)
            console.log(totalExpenses, totalSold, totalExpenses - totalSold)
            res.render('profits-selected-date', {totalExpenses: totalExpenses, totalSold: totalSold, totalProfit: totalExpenses-totalSold})

        }).catch(err => console.log(err))

    }).catch(err => console.log(err))


})

// expresses
// viewing expenses
router.get("/api/expenses/view", (req, res) => {
    Expense.find().then((content) => {

        res.render("expenses", {expenses: content})
    }).catch(err => {console.log(err)})
})
// creating expenses
router.post("/api/expenses/create", (req, res) => {
    const {name, price, amount} = req.body
    Expense.create({name: name, price: price, amount: amount, date: Date.now(), user: req.user}).then((content) => {
        if(content) {
            console.log(content)
            res.redirect("/api/expenses/view")
        }
    }).catch((err) => {
        console.log(err)
    })
})

router.get('/api/expenses/delete/:id', (req, res) => {
    res.render('expenses-delete', {id: req.params.id, user: req.user})
})

router.post('/api/expenses/delete/:id', (req, res) => {
    Expense.findOneAndDelete({_id: req.params.id}).then((expense) => {
        console.log(expense)
        res.redirect('/api/expenses/view')
    }).catch(err => console.log(err))
})

router.get('/api/expenses/edit/:id', (req, res) => {
    res.render('expenses-edit', {id: req.params.id, user: req.user})
})

router.post('/api/expenses/edit/:id', (req, res) => {
    const {item, quantity, price} = req.body
    Expense.findByIdAndUpdate({_id: req.params.id}, {name: item, amount: quantity, price: price, user: req.user, date: Date.now()}).then((expense) => {
        console.log(expense)
        res.redirect('/api/expenses/view')
    }).catch(err => console.log(err))
})


router.post("/api/category/delete/:id", (req, res) => {
    const id = req.params.id
    Category.findByIdAndDelete(id).then((content) => {
        console.log(content)
        res.redirect('/settings')
    }).catch(err => console.log(err))
})

router.post("/api/voucher/delete/:id", (req, res) => {
    const id = req.params.id
    Voucher.findByIdAndDelete(id).then((content) => {
        console.log(content)
        res.redirect('/settings')
    }).catch(err => console.log(err))
})


// User - CRUD and methods
router.get('/api/users/register', (req, res) => {
    res.render("register")
})

router.post("/api/users/register", (req, res) => {
    const {email, password, fullName} = req.body;
    console.log(req.body)
    const {salt, hash} = genPassword(password)

    User.create({email: email, salt: salt, hash: hash, fullName: fullName}).then(user => {
        if (!user) {
            console.log("User didn't register")
        } else {
            console.log(`User ${user} has been created`)
            res.redirect('/api/users/manage-users')
        }
    }).catch(err => {
        console.log(`Email: ${user.email}
        salt: ${user.salt}
        hash: ${user.hash}
        Username: ${user.fullName}`)
    })
})
// login user
router.get('/api/users/login', (req, res) => {
    res.render('login', {message: req.session.message})
    delete req.session.message
})

router.post('/api/users/login', passport.authenticate('local', {failureRedirect: '/login-failure', successRedirect: '/'}));



router.get('/api/users/logout', (req, res) => {
    req.logOut((err) => {
        if(err) {
           console.log(err)
        }
        res.redirect('/api/user/login')
    })
})

router.get('/api/users/manage-users', (req, res) => {
    User.find().then((users) => {
        res.render('mangeUsers', {users: users})
    }).catch(err => console.log(err))
})

router.get('/api/users/manage-users/:id', (req, res) => {
    const oldPass = req.body.oldPass
    const newPass = req.body.newPass
    User.findById(id).then((user) => {
        if (validPassword(oldPass)) {
            const {salt, hash} = genPassword(newPass)
            User.findByIdAndUpdate(id, {salt: salt, hash, hash}).then()
        }
    
    })
})

router.get('/api/users/manage-users/edit/:id', (req, res) => {
    User.findOne({_id: req.params.id}).then((content) => {

        res.render('user-manager-edit', {user: content})

    }).catch(err => console.log(err))
})

router.post('/api/users/manage-users/edit/:id', (req, res) => {
    const email = req.body.email
    const fullName = req.body.fullName
    const id = req.params.id
    const isWorker = req.body.isWorker == "on" ? true : false
    const isAdmin = req.body.isAdmin == "on" ? true : false

    const password = req.body.password
    if (password != undefined || password == "") {
        const {hash, salt} = genPassword(password)
        
        
        User.findOneAndUpdate({_id: id}, {fullName: fullName, email: email, hash: hash, salt: salt, isAdmin: isAdmin, isWorker: isWorker}).then((content) => {
                console.log("Successfully updated the user: " + content)
                res.redirect('/api/users/manage-users')
        }).catch(err => console.log(err))
    } else {
        User.findOneAndUpdate({_id: id}, {fullName: fullName, email: email, isAdmin: isAdmin, isWorker: isWorker}).then((content) => {
            console.log("Successfully updated the user: " + content)
            res.redirect('/api/users/manage-users')
    }).catch(err => console.log(err))
    }

})

router.get('/api/users/manage-users/delete/:id', (req, res) => {

    const id = req.params.id

    User.findById(id).then((user) => {

        res.render('user-manager-delete.ejs', {user: user})

    }).catch(err => console.log(err))

})

router.post('/api/users/manage-users/delete/:id', (req, res) => {

    const id = req.params.id

    User.findByIdAndDelete(id).then((user) => {

        console.log(user)
        res.redirect('/api/users/manage-users')

    }).then(err => console.log(err))
})

router.get('/api/users/change-password', (req, res) => {
    const id = req.user.id
    User.findById(id).then((user) => {
        res.render('user-changePassword', {message: req.session.message, user: user})
        delete req.session.message
    })
})

router.post('/api/users/change-password/:id', (req, res) => {
    const oldPass = req.body.oldPassword
    const newPass = req.body.newPassword
    const id = req.params.id
    User.findById(id).then((user) => {
        const isValid = validPassword(oldPass, user.hash, user.salt)

        if(isValid) {
            const {hash, salt} = genPassword(newPass)
            User.findByIdAndUpdate(id, {salt: salt, hash: hash}).then((user) => {
                req.session.message = {message :"Password Changed Successfully", bgColor: "bg-green-400", textColor: "text-green-700"}
                res.redirect('/api/users/change-password')
            }).catch(err => console.log(err))
        } else {

            req.session.message = {message :"Old Password is Invalid", bgColor: "bg-red-300", textColor: "text-red-500"}
            res.redirect('/api/users/change-password')

        }
    }).catch((err) => {
        console.log(err)
    })

})

router.get('/login-failure', (req, res) => {
    res.send("You didn't login!")
})
module.exports = {router}