function calculateAmount() {
    let totalPrice = document.getElementById('totalPrice').innerHTML
    totalPrice =  Number(totalPrice.slice(0, -1))
    console.log(totalPrice, typeof(totalPrice))
    let receivedAmount = Number(document.getElementById('received').value)
    let returnAmount = document.getElementById('returned')
    returnAmount.value = totalPrice - receivedAmount + "$"

}



function viewCheckout(){

    let returnMoney = document.getElementById('returned')
    returnMoney = Number(returnMoney.value.slice(0, -1))
    console.log(returnMoney)
    if (returnMoney <= 0) {
        console.log("Yes")
        document.getElementById('print').classList.add('flex')
        document.getElementById('print').classList.remove('hidden')
    }
}


function printPDF(id) {
    console.log(id)
    let i = document.getElementById('send')
    i.action = "/api/invoice/checkout/" + id + "/print"
    i.submit()
}