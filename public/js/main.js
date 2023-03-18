// const moment = require("moment/moment")



function removeEle(id) {
    console.log("you tried to remove me")
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

function sumForItem(id) {

}

function addEle(id) {
    let parent = document.getElementById("addStuffTo").children

    for (let i = 0; i < parent.length; i++) {
        if (parent[i].id == "order_"+id) {
             let num = Number(parent[i].children[1].children[0].children[1].value)
             parent[i].children[1].children[0].children[1].value = num + 1
             findSum(id)
             return
        }} 
            let product = document.getElementById(id).children
    
    let returnEle = document.createElement("div")
    returnEle.id = ("order_" + id)

    let divArray = ["bg-green-800", "rounded-md", "text-center" ,"p-1", "flex" ,"flex-row", "w-72" ,"h-16"].map((ele) => {
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
    let ChildDiv2 = document.createElement("h1")
    let count = document.createElement('input')
    count.classList.add('w-16')
    count.classList.add('h-6')
    count.type = 'number'
    count.name = id
    count.value = '1'
    count.min = '1'
    
    ChildDiv2.innerHTML = product[1].children[0].innerHTML
    ParentDiv2.appendChild(ChildDiv2)
    ParentDiv2.appendChild(count)
    div2.appendChild(ParentDiv2)

   

    let div3 = document.createElement("div")
    let div3Array = ["flex" ,"flex-col" ,"items-center" ,"justify-center"].map(eleClass => {
        div3.classList.add(eleClass)
    })
    
    let ogDiv3 = document.createElement("button")
    ogDiv3.innerHTML = "X"
    ogDiv3.classList.add('bg-black-900')
    ogDiv3.onclick = () => { removeEle("order_" + id); }
        div3.appendChild(ogDiv3)
    
    div2.appendChild(div3)
    returnEle.appendChild(div1)
    returnEle.appendChild(div2)
    
    
    document.getElementById("addStuffTo").appendChild(returnEle)
    findSum(id)

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