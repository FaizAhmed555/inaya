 
import {DispalyProducts, SearchProducts} from "./script.js"

DispalyProducts()

const Search = document.querySelector("#search-input")
const searchBtn = document.querySelector("#search-btn")
searchBtn.addEventListener("click",() => {
    const value = Search.value.trim()
    if(value == "" || value.length == 0) {return}
   
    Search.value = ""
    window.location = "/assets/search-products.html?search=" + value
})

