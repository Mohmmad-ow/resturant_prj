
// const moment = require("moment/moment")
function viewVoucher() {
    event.preventDefault()
    document.getElementById('voucher_button').classList.add('hidden')
    document.getElementById('view_voucher').classList.remove('hidden')
}
// <!-- thing[i] => [0] => [0] => [1] => [0] -->
function findFood() {
    let list = document.getElementById('foods').children
    for(let i = 0; i < list.length; i++) {
        let x = document.getElementById('findFood').value
        x  = x.length
        console.log(x)
        console.log(list[i].children[0].children[1].children[0].innerHTML.slice(0, x), document.getElementById('findFood').value)
        if (document.getElementById('findFood').value.slice(0, x) != list[i].children[0].children[1].children[0].innerHTML.slice(0, x)) {
            list[i].classList.add('hidden')
        } else {
            list[i].classList.remove('hidden')
        }
    }

}


function removeEle(id) {
    let div = document.getElementById(id).children[1]
    let price = Number(div.getElementsByClassName('hidden')[0].innerHTML)

    let amount = Number(div.getElementsByTagName('input')[0].value)
    let wholePrice = Number(document.getElementById('whole_price').value.slice(0,-1))
    document.getElementById('whole_price').value = (wholePrice - (price*amount)) + "$"
    document.getElementById(id).remove()
}

function findSum(id) {
    // children => [1] => [0] => [1]
    let itemPrice = document.getElementById(id).children[1].children[1].innerHTML
    console.log(itemPrice)
    let value = itemPrice.slice(0,-1)
    let wholePrice = document.getElementById("whole_price").value
    console.log(document.getElementById("whole_price"))
    
    wholePrice = Number(wholePrice.slice(0, -1)) + Number(value)
    document.getElementById("whole_price").value = wholePrice + "$"
    
    
}




function onUpKey(id){
    let add = Number(document.getElementById(id).children[1].children[1].innerHTML.slice(0, -1))
    let newVal = Number(document.getElementById('whole_price').value.slice(0,-1)) + add
    console.log(newVal)
    document.getElementById('whole_price').value = newVal + "$"
    return
}
function onDownKey(id){
    let sub = Number(document.getElementById(id).children[1].children[1].innerHTML.slice(0, -1))
    let newVal = Number(document.getElementById('whole_price').value.slice(0,-1)) - sub
    console.log(newVal)

    document.getElementById('whole_price').value = newVal + "$"
    return
}

function addEle(id) {
    let parent = document.getElementById("addStuffTo").children
    let hiddenPrice = document.createElement('h1')
    hiddenPrice.classList.add('hidden')
    hiddenPrice.innerHTML = Number(document.getElementById(id).children[1].children[1].innerHTML.slice(0, -1))
    
    for (let i = 0; i < parent.length; i++) {
        if (parent[i].id == "order_"+id) {
             let num = Number(parent[i].children[1].getElementsByTagName('input')[0].value)
             console.log(num)
             parent[i].children[1].getElementsByTagName('input')[0].value = num + 1
             findSum(id)
             return
        }} 
            let product = document.getElementById(id).children
    
    let returnEle = document.createElement("div")
    returnEle.id = ("order_" + id)

    let divArray = ["bg-white", "p-x","mt-3" ,"rounded-md", "text-center" ,"p-1", "flex" ,"flex-row", "w-72" ,"h-16"].map((ele) => {
        returnEle.classList.add(ele)
        
    })

    let div1 = document.createElement("div")
    div1.classList.add("basis-1/3")
    let div1Img = document.createElement("img")
    div1Img.classList.add("w-full")
    div1Img.classList.add("h-full")

    let src = product[0].children[0].src
    div1Img.src = src
        div1.appendChild(div1Img)
    


    let div2 = document.createElement("div")
    let div2Arr = ["basis-2/3" ,"flex","flex-row" ,"justify-between" ,"h-full"].map((eleClass) => {
        div2.classList.add(eleClass)
        
    })
    let ParentDiv2 = document.createElement("div")
    ParentDiv2.classList.add('mx-auto')
    let ChildDiv2 = document.createElement("h1")
    let count = document.createElement('input')
    count.classList.add('w-12', 'h-6')
count.type = 'number'
count.readOnly = true
count.name = id
count.min = '1'
count.value = '1'
count.style.appearance = 'textfield'

let decrementButton = document.createElement('button')
decrementButton.innerHTML = "-"
decrementButton.setAttribute("type", "button")
decrementButton.onclick = function() {
    var value = parseInt(count.value);
    value = isNaN(value) ? 1 : value;
    if (value > 1) { // Check if value is already at 1 before decreasing
        let whole_value = document.getElementById("whole_price").value
            whole_value = whole_value.slice(0, -1)
            document.getElementById('whole_price').value = (Number(whole_value) - Number(hiddenPrice.innerHTML)) + "$" 
            value--;
        }
        count.value = value;
}

let incrementButton = document.createElement('button')
incrementButton.innerHTML = "+"
incrementButton.setAttribute("type", "button")
incrementButton.onclick = function() {
    let whole_value = document.getElementById("whole_price").value
        whole_value = whole_value.slice(0, -1)
        document.getElementById('whole_price').value = (Number(whole_value) + Number(hiddenPrice.innerHTML)) + "$" 
    var value = parseInt(count.value);
    value = isNaN(value) ? 1 : value;
    value++;
    count.value = value;
}

let group = document.createElement('div')
group.classList.add('flex', 'flex-row', 'justify-center')

let leftGroup = document.createElement('div')
leftGroup.classList.add('input-group-prepend')
leftGroup.appendChild(decrementButton)

let rightGroup = document.createElement('div')
rightGroup.classList.add('input-group-append')
rightGroup.appendChild(incrementButton)

group.appendChild(leftGroup)
group.appendChild(count)
group.appendChild(rightGroup)



   
    
    ChildDiv2.innerHTML = product[1].children[0].innerHTML
    ParentDiv2.appendChild(ChildDiv2)
    ParentDiv2.appendChild(group)
    
    div2.appendChild(ParentDiv2)

   

    let div3 = document.createElement("div")
    let div3Array = ["flex" ,"flex-col" ,"items-center" ,"justify-center"].map(eleClass => {
        div3.classList.add(eleClass)
    })
    
    let ogDiv3 = document.createElement("button")
    ogDiv3.innerHTML = "X"
    ogDiv3.classList.add('bg-black-900')
    ogDiv3.onclick = () => { removeEle("order_" + id); }
    if (document.getElementById('premissions').innerHTML == "isAdmin") {
        div3.appendChild(ogDiv3)    
    }

    div2.appendChild(div3)
    div2.appendChild(hiddenPrice)
    returnEle.appendChild(div1)
    returnEle.appendChild(div2)
    
    
    document.getElementById("addStuffTo").appendChild(returnEle)
    findSum(id)

}


function increment(e) {
    let input = e.target.parentElement.parentElement.children[1]
    
    input.value = Number(input.value) + 1
    let price = Number(e.target.parentElement.parentElement.parentElement.getElementsByTagName('h1')[1].innerHTML)
    let whole_value = document.getElementById("whole_price").value
        whole_value = whole_value.slice(0, -1)
        document.getElementById('whole_price').value = (Number(whole_value) + price) + "$"
    
    
}
function decrement(e) {
    let input = e.target.parentElement.parentElement.children[1]
    if (input.value != '1') {
        input.value = Number(input.value) - 1
        let price = Number(e.target.parentElement.parentElement.parentElement.getElementsByTagName('h1')[1].innerHTML)   
        let whole_value = document.getElementById("whole_price").value
        whole_value = whole_value.slice(0, -1)
        document.getElementById('whole_price').value = (Number(whole_value) - price) + "$"      

    }
}

function queryTime() {
    let [yearOg, monthOg, dayOg] = document.getElementById('date').value.split('-')
    
    let selectedDate = moment(yearOg + "-" + monthOg + '-' + dayOg, "YYYY-MM-DD")
    
    let times = document.getElementById('dates').children
    for (const key in times) {
        if (key == "item") {
            return
        } 

        let [month, day, year] = times[key].children[0].children[0].innerHTML.split('/')
        year = year.split(',')[0]
        let i = moment(year + '-' + month + '-' + day, "YYYY-MM-DD")
        if (!i.isSame(selectedDate)) {
            console.log(times[key])
            times[key].classList.add('hidden')
        } else {
            times[key].classList.remove('hidden')
        }
    }
}


function thisDay() {

    let today = new Date()
    today = today.toLocaleDateString(undefined , { year:"numeric", month:"numeric", day:"numeric"})
    console.log(today)
    let selectedDate = moment(today,'MM-DD-YYYY')
    console.log(selectedDate)
    let times = document.getElementById('dates').children
    for (const key in times) {
        if (key == "item") {
            return
        } 

        let [month, day, year] = times[key].children[0].children[0].innerHTML.split('/')
        console.log(times[key].children[0].children[0].innerHTML)
        year = year.split(',')[0]
        console.log(year + " " + month + " " + day)
        let i = moment(year + '-' + month + '-' + day, "YYYY-MM-DD")
        console.log("This is :"+ i)
        if (!i.isSame(selectedDate)) {
            console.log("Add hidden")

            times[key].classList.add('hidden')
        } else {
            times[key].classList.remove('hidden')
            console.log("remove hidden")
        }
    }
}
function thisMonth() {

    
    let thisMonth = moment()
    
    thisMonth.subtract(1, 'months')
    let times = document.getElementById('dates').children
    for (const key in times) {
        if (key == "item") {
            return
        } 

        let [month, day, year] = times[key].children[0].children[0].innerHTML.split('/')
        year = year.split(',')[0]
        let i = moment(year + '-' + month + '-' + day, "YYYY-MM-DD")
        if (!i.isAfter(thisMonth)) {
            
            console.log(times[key])
            times[key].classList.add('hidden')
        } else {
            times[key].classList.remove('hidden')
        }
    }
}
function allTime() {

    
    
    let times = document.getElementById('dates').children
    for (const key in times) {
        if (key == "item") {
            return
        }
        times[key].classList.remove('hidden')
    }
}



function addVoucher(id, value){
        let whole_value = document.getElementById("whole_price").value
        whole_value = whole_value.slice(0, -1)

        document.getElementById('whole_price').value = (Number(whole_value) - Number(value)) + "$" 
        console.log(whole_value,  value)
        let ele = document.createElement('input')
        ele.type = 'text'
        ele.name = 'usedCode'
        ele.value = id
        ele.classList.add('hidden')
        document.getElementById('form').appendChild(ele)
        let selectedVoucher = document.getElementById('voucherValue')
        selectedVoucher.value = Number(value)
        let x = document.getElementById('voucher')
        x.value = ""
}

function checkVoucher() {
    event.preventDefault()
    let selectedVoucher = document.getElementById('voucher')
    let codes = document.getElementById('codes').children
    for (let i = 0; i < codes.length; i++) {
        if(selectedVoucher.value == codes[i].innerHTML) {
            console.log("This code works: " + selectedVoucher.value, codes[i].id.split('|'))
            addVoucher(...codes[i].id.split('|'))
            codes[i].remove()
        } else {
            console.log("this code doesn't work")
        }
    }
}



function viewHidden(viewId) {
    let list = ['chooseDate', 'selectMonth', 'selectYear', 'chooseBetween'].map((id) => {
        if (id == viewId)
        {
            document.getElementById(id).classList.remove('hidden')
        } else {
            document.getElementById(id).classList.add('hidden')
        }
    })
}


function goBack() {
    let form = document.getElementById('form')
    document.getElementById('finish').value = 'No'
    console.log(document.createElement('finish').value)
    form.submit()
}

