
import { updateGrandPrice, DispalyCart, checkOut} from "/script/script.js"
 
DispalyCart()
updateGrandPrice(0)

const checkoutBtn = document.getElementById("checkoutBtn")

checkoutBtn.addEventListener("click", checkOut)

 



 

