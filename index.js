import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-a59c4-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListDB = ref(database, "shoppingList")

const inputEl = document.getElementById("input-field")
const addBtn = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

addBtn.addEventListener("click", function() {
    const inputValue = inputEl.value
    push(shoppingListDB, inputValue)
    clearInputEl()
})

onValue(shoppingListDB, function(snapshot) {
    if (snapshot.exists()) {
        const shoppingListItems = Object.entries(snapshot.val())
        clearShoppingListEl()
        for (let i=0; i<shoppingListItems.length; i++) {
            const currentItem = shoppingListItems[i]
            const currentItemID = currentItem[0]
            const currentItemValue = currentItem[1]
            appendItemToShoppingListEl(currentItem)
        }
    } else {
        shoppingListEl.innerHTML = "No items here... yet"
    }
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputEl() {
    inputEl.value = ""
}

function appendItemToShoppingListEl(item) {
    const itemID = item[0]
    const itemValue = item[1]
    const newEl = document.createElement("li")
    newEl.textContent = itemValue
    newEl.addEventListener("click", function() {  
        const exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        remove(exactLocationOfItemInDB)
    })
    shoppingListEl.append(newEl)
}
