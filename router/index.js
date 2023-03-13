// Required Packages and functions
const { render } = require('ejs');
const passport = require('passport');
const router = require('express').Router();
// the User product and o
const {User, Product, Invoice} = require('../config/database');
const {genPassword} = require('../Utils/passwordVaild')

// we need path to go one level up when uploading pics
const path = require('path')

router.get('/', (req, res, next) => {
    res.render("index")
})

// upload images

router.get('/api/products/view', (req, res) => {
    Product.find().then((content) => {
        res.send(content)
    }).catch((err) => {
        console.log(err)
    })
})

router.get('/api/products/create', (req, res) => {
    res.render('create-product')
})

router.post('/api/products/create', (req, res) => {
    if (Object.keys(req.files).length == 0) {
        res.status(400).send("No file uploaded")

        return;
    } 
    
    const file = req.files.product_image
    const filePath = path.join(__dirname,'../' + "public/uploaded_images/products/" + Date.now() + file.name);
    const {name, type, price} = req.body
    Product.create({name: name,type: type, price: price, pic_url: filePath}).then(content => {
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

// Ordering inVoice
router.post('/test', (req, res) => {
    console.log(req.body)
})
router.get("/api/invoice/create", (req, res) => {
    Product.find().then((products) => {
        res.render('invoice-create', {products: products})
    })
})

router.post('/api/invoice/create', (req, res) => {
   let ids = Object.keys(req.body).filter( (id) => {
       return req.body[id][0] == "yes"
    })
    Product.find({_id:{$in: ids}}).then((products) => {
        let ay = products.map((product) => {
            return {amount: req.body[product.id][1], product: product}
        })
        Invoice.create({orderFood: ay, date: Date.now()}).then((content) => {
            console.log(content)
        }).catch(err => {console.log(err)})
    }).catch(err => {
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

router.post('/api/user/login', passport.authenticate('local', {failureRedirect: '/login-failure', successRedirect: '/login-success'}));

router.get('/login-success', (req, res) => {
    res.send("You logged in!")
})
router.get('/login-failure', (req, res) => {
    res.send("You didn't login!")
})
module.exports = {router}