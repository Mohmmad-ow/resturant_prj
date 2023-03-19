// Required Packages and functions
const { render } = require('ejs');
const passport = require('passport');
const router = require('express').Router();
// the User product and o
const {User, Product, Invoice, Expense, Voucher, Category} = require('../config/database');
const {genPassword} = require('../Utils/passwordVaild')

// file system to delete images when they are edited out
const fs = require("fs")

// we need path to go one level up when uploading pics
const path = require('path')

router.get('/', (req, res, next) => {
    console.log(req.user)
    res.render("home")
})

router.get('/settings', (req, res) => {
    Voucher.find().then((voucher) => {

        Category.find().then((category) => {

            res.render('settings', {vouchers: voucher, categories: category})

        }).catch(err => console.log(err))

    }).catch(err => console.log(err))
    
})

router.post('/api/voucher/create', (req, res) => {
    const {code, value} = req.body

    Voucher.create({code: code, value: value}).then((content) => {
        console.log(content)
        res.redirect('/settings')
    }).catch(err => console.log(err))

})

router.post('/api/category/create', (req, res) => {
    console.log(req.body)
    const {category} = req.body

    Category.create({category: category}).then((content) => {
        console.log(content)
        res.redirect('/settings')
    }).catch(err => console.log(err))
})

router.get("/test", (req, res) => {
    res.render('test')
})
// upload images
router.get('/api/products/create', (req, res) => {
    res.render('product-create')
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
        res.render("product", {products: content})
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

// Product delete
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

// Ordering inVoice


router.get("/api/invoice/view", (req, res) => {
    Product.find().then((content) => {
        Voucher.find().then((voucher) => {

            res.render("inTest", {products: content, vouchers: voucher})

        }).catch(err => {console.log(err)})

    }).catch(err => {
        console.log(err)
    })
})

// invoice is gonna be viewed by id at first but later by table number
router.get("/api/invoice/v/:id", (req, res) => {
    const id = req.params.id;
    Invoice.findById(id).then((invoice) => {
        res.render("invoice", {invoice: invoice})
    }).catch(err => {console.log(err)})
})


// view all invoices
router.get("/api/invoice/v/", (req, res) => {
    Invoice.find().then(content => {
        
        
        // res.render("invoice-view", {Invoices: content})
        res.render('analytics', {checkouts: content})
    }).catch(err => console.log(err))
})


router.get("/api/invoice/create", (req, res) => {
    Product.find().then((products) => {
        res.render('invoice-create', {products: products})
    })
})

router.post('/api/invoice/create', (req, res) => {
    console.log(req.body)
    let wholePrice = req.body.wholePrice
    wholePrice = Number(wholePrice.slice(0, -1))
   let ids = Object.keys(req.body).filter( (id) => {
       return req.body[id]
    })
    ids.pop()
    

    Product.find({_id:{$in: ids}}).then((products) => {
        let orderObject = products.map((product) => {
            return {amount: req.body[product.id], product: product}
        })
        payment = orderObject.map(obj => {
            console.log(obj['product'].price*obj.amount)
            return obj['product'].price*obj.amount
          })
        console.log(payment)
        console.log(orderObject)
        Invoice.create({orderFood: orderObject, date: Date.now(), user: req.user, wholePrice: wholePrice}).then((content) => {
            console.log(content)
        }).catch(err => {console.log(err)})
    }).catch(err => {
        console.log(err)
    })
    
    
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


// user api


// register user
router.get('/api/user/register', (req, res) => {
    res.render("register")
})

router.post("/api/user/register", (req, res) => {
    const {email, password, fullName} = req.body;
    console.log(req.body)
    const {salt, hash} = genPassword(password)

    User.create({email: email, salt: salt, hash: hash, fullName: fullName}).then(user => {
        if (!user) {
            console.log("User didn't register")
        } else {
            console.log(`User ${user} has been created`)
            res.redirect('login')
        }
    }).catch(err => {
        console.log(`Email: ${user.email}
        salt: ${user.salt}
        hash: ${user.hash}
        Username: ${user.fullName}`)
    })
})
// login user
router.get('/api/user/login', (req, res) => {
    res.render('login')
})

router.post('/api/user/login', passport.authenticate('local', {failureRedirect: '/login-failure', successRedirect: '/'}));


router.get('/api/user/logout', (req, res) => {
    res.render("logout")
})

router.post('/api/user/logout', (req, res) => {
    req.logOut((err) => {
        if(err) {
           console.log(err)
        }
        res.redirect('/api/user/login')
    })
})

router.get('/login-failure', (req, res) => {
    res.send("You didn't login!")
})
module.exports = {router}