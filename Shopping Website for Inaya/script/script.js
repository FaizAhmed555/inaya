


const EmptyCardMsg = document.querySelector(".empty-cart-msg")
const Bill = document.querySelector(".bill")
const GrandTotal = document.querySelector(".grand-total")
const template = document.querySelector("template")
const cartsContainer = document.querySelector(".cart")



function CancelFromCart(e) {
    const product = e.target.parentElement
    const productId = product.getAttribute("productid")

    product.remove()
    deleteProduct(productId)
    updateGrandPrice(0)



}

function deleteProduct(id) {

    const products = JSON.parse(sessionStorage.getItem("cart"))
    products.splice(products.indexOf(id), 1)
    if (products.length == 0) { Bill.classList.add("hide"); EmptyCardMsg.classList.remove("hide") }
    sessionStorage.setItem("cart", JSON.stringify(products))

}
export function checkOut() {
    if (GetProducts().length > 0) {
        sessionStorage.clear()
        alert("Thank you for your purchase, see you Again")
        window.location = "/index.html"
    }
    else {
        alert("Sorry You haven't purchased anything yet!")
    }
}

export function AddToCart(e) {
    const productId = e.target.parentElement.getAttribute("productId")

    let cart = sessionStorage.getItem("cart")
    if (cart === null) {
        cart = [productId]
    }
    else {

        cart = JSON.parse(cart)
        if (cart.includes(productId)) {
            alert("Product Already Added!")
        }
        else {
            cart.push(productId)

        }

    }

    sessionStorage.setItem("cart", JSON.stringify(cart))

}

export function GetProducts() {
    const cart = sessionStorage.getItem("cart")
    if (cart === null) {
        return []
    }
    else {
        return JSON.parse(cart)
    }

}



export function DispalyProducts() {

    const cartsContainer = document.querySelector("#products .container")
    fetch("./Database/products.json")
        .then(res => res.json())
        .then((products) => {
            products.forEach((product) => {

                const productContainer = template.content.cloneNode(true).querySelector(".product-card-container")
                const img = productContainer.querySelector("img")
                const title = productContainer.querySelector(".title")
                const price = productContainer.querySelector(".price")
                const AddToCartBtn = productContainer.querySelector("#AddToCartBtn")
                const a = productContainer.querySelector("a")

                productContainer.setAttribute("productId", product["id"])
                a.setAttribute("href", "./assets/product-details.html?id=" + product['id'])
                AddToCartBtn.addEventListener("click", AddToCart)
                img.src = "./images/" + product['img']
                title.innerHTML = product['title']
                price.innerHTML = product['price']
                cartsContainer.append(productContainer)
            })

        })
}


export function getParameter(key) {
    const address = window.location.search
    const parameterList = new URLSearchParams(address)
    return parameterList.get(key)

}
export async function fetchProduct(id) {
    const res = await fetch("/Database/products.json")
    const products = await res.json()
    if(id == null) {
       return products 
    }
    else {
       return products[id - 1]  
    }
}

export function DispalyProductDetails(id) {
    fetchProduct(id)
        .then(product => {
            console.log(product)
            const row = document.querySelector("#product-details")
            const productContainer = template.content.cloneNode(true).querySelector(".product")
            const btnParent = productContainer.querySelector(".product-container")
            const img = productContainer.querySelector("img")
            const title = productContainer.querySelector(".title")
            const price = productContainer.querySelector(".price")
            const AddToCartBtn = productContainer.querySelector("#AddToCartBtn")
            const p = productContainer.querySelector("p")

            btnParent.setAttribute("productId", product["id"])
            p.innerHTML = product['des']
            AddToCartBtn.addEventListener("click", AddToCart)
            img.src = "/images/" + product['img']
            title.innerHTML = product['title']
            price.innerHTML = product['price']
            row.append(productContainer)
        })


}


export function DispalyCart() {
    if (GetProducts().length == 0) {
        EmptyCardMsg.classList.remove("hide")
        Bill.classList.add("hide")
    }
    else {
        EmptyCardMsg.classList.add("hide")
        Bill.classList.remove("hide")
        const productIds = GetProducts()

        productIds.forEach(productId => {

            fetchProduct(productId)

                .then(product => {

                    const productContainer = template.content.cloneNode(true).querySelector(".product")
                    const img = productContainer.querySelector("img")
                    const title = productContainer.querySelector(".title")
                    const price = productContainer.querySelector(".price")
                    const cancelBtn = productContainer.querySelector("#CancelBtn")
                    const a = productContainer.querySelector("a")
                    const total = productContainer.querySelector(".total")
                    const quantity = productContainer.querySelector("#quantity")


                    quantity.value = 1
                    productContainer.setAttribute("productId", product["id"])
                    a.setAttribute("href", "./product-details.html?id=" + product['id'])
                    cancelBtn.addEventListener("click", CancelFromCart)
                    quantity.addEventListener("change", function () { updatePrice(product['price'], productContainer) })
                    img.src = "/images/" + product['img']
                    title.innerHTML = product['title']
                    price.innerHTML = product['price']



                    total.innerHTML = product['price']

                    cartsContainer.append(productContainer)
                })
        })

    }

}

function updatePrice(price, product) {

    const total = product.querySelector(".total")
    let quantity = product.querySelector("#quantity").value
    total.innerHTML = price * quantity
    updateGrandPrice((price * quantity) - price)
}

async function getTotalPrice(id) {
    const res = await fetch("/Database/products.json")
    const products = await res.json()
    return products[id - 1]['price']

}


export function updateGrandPrice(qw) {
    let Tprice = 0
    const products = GetProducts()
    products.forEach(product => {
        getTotalPrice(product)
            .then(price => {
                Tprice += price
                GrandTotal.innerHTML = Tprice + qw
            })

    })

}

export function SearchProducts(value) {
    let Matches = []
    const cartsContainer = document.querySelector("#search-products .container")
    const msg = document.querySelector("#msg")
    fetchProduct()
    .then(products => {
        products.forEach(product => {
            if(product['title'].includes(value.toLowerCase())) {
               
                Matches.push(product["id"])
            }
            else {
                msg.classList.remove("hide")
            }
            
        })
        if(Matches.length > 1) {
            msg.classList.add("hide")
            Matches.forEach(match => {
                fetchProduct(match)
                .then(item => {
                    const productContainer = template.content.cloneNode(true).querySelector(".product-card-container")
                    const img = productContainer.querySelector("img")
                    const title = productContainer.querySelector(".title")
                    const price = productContainer.querySelector(".price")
                    const AddToCartBtn = productContainer.querySelector("#AddToCartBtn")
                    const a = productContainer.querySelector("a")
    
                    productContainer.setAttribute("productId", item["id"])
                    a.setAttribute("href", "/assets/product-details.html?id=" + item['id'])
                    AddToCartBtn.addEventListener("click", AddToCart)
                    img.src = "/images/" + item['img']
                    title.innerHTML = item['title']
                    price.innerHTML = item['price']
                    cartsContainer.append(productContainer)
                })
            })
        }
      
        
    })
 
}