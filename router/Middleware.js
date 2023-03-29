const PDFDocument = require('pdfkit')

function makePdf(order, res, received, returned) {
    let voucher = order.voucher
    if (order.voucher == null) {
        voucher = 0
    }
    let doc = new PDFDocument

    res.type('pdf');
    doc.pipe(res);
    
    doc.fontSize(12).text(order.date)
    doc.text("Waiter: "+order.user.fullName)
    doc.text("Table #" +order.tableNumber)
    doc.moveDown()
   .font('Helvetica-BoldOblique')
   .text('Name')
   .moveUp()
   .text('Qyt', 140)
   .moveUp()
   .text("Price", 200)
   .moveDown()
   .fontSize(10)
   for (let i = 0; i < order.orderFood.length; i++) 
   {
doc
   .text(order.orderFood[i].product.name, 72)
   .moveUp()
   .text(order.orderFood[i].amount, 140)
   .moveUp()
   .text(order.orderFood[i].product.price + "$", 200)
}
   doc
   
   .moveDown()
   .text('Voucher', 72)
   .moveUp()
   .text(voucher + "$", 200)
   .moveDown()
   .fontSize(14)
   .text("Total", 72)
   .moveUp()
   .text(order.wholePrice + "$", 200)
   .fontSize(10)
   .text('Received', 72)
   .moveUp()
   .text(received + "$", 200)
   .text('Returned', 72)
   .moveUp()
   .text(returned + "$", 200)
// end and display the document in the iframe to the right
    doc.end()
}


function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin) {
        next()
    } else {
        req.session.message = {message: "You aren't allowed to access this page", bgColor: 'bg-red-300', textColor: "text-red-700"}
        res.redirect('/')
    }
}

function isWorker(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        req.session.message = {message: "You can't access the page without being logged in", bgColor: 'bg-red-300', textColor: "text-red-700"}
        res.redirect('/api/users/login')
    }
}

module.exports = {makePdf, isAdmin, isWorker}