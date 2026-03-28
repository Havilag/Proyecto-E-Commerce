
let products = [];

const savedCart = localStorage.getItem("cart");
let cart = savedCart ? JSON.parse(savedCart) : [];

const ProductsContainer = document.getElementById("products-container");

async function displayProducts(category = "all") {

    try {

        if (category === "men") {
            const res = await fetch("https://fakestoreapi.com/products/category/men's clothing");
            products = await res.json();

        } else if (category === "women") {
            const res = await fetch("https://fakestoreapi.com/products/category/women's clothing");
            products = await res.json();

        } else if (category === "accessories") {
            const res = await fetch("https://fakestoreapi.com/products/1");
            const product = await res.json();

            products = [product];

        } else {
            const resMen = await fetch("https://fakestoreapi.com/products/category/men's clothing");
            const resWomen = await fetch("https://fakestoreapi.com/products/category/women's clothing");

            const men = await resMen.json();
            const women = await resWomen.json();

            products = [...men, ...women];
        }

        ProductsContainer.innerHTML = products.map(product =>
            `<article class="product-card">
            <img src="${product.image}" class="image">
            <div class="product-men">
                <h1>${product.title}</h1>
                <div class="price-row">
                    <p>$${product.price}</p>
                </div>
                <button class="product-add" onclick="AddtoCart(${product.id})">
                    Add
                </button>
            </div>
        </article>`
        ).join("");
    } catch (error) {
        console.error("Error cargando productos:", error);
    }

}


function AddtoCart(ProductoID) {
    const product = products.find(x => x.id === ProductoID);
    const exists = cart.find(i => i.id === ProductoID);

    if (!exists) {
        cart.push({ ...product, quantity: 1 });
    }
    else {
        exists.quantity = exists.quantity + 1;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}




const Bag = document.getElementById("bag");
const BotonBag = document.getElementById("bag-btn");
const BagTotal = document.getElementById("bag-total");
const BagItems = document.getElementById("bag-items");

BotonBag.addEventListener("click", (e) => {

    e.preventDefault();

    if (Bag.style.display === "block") {
        Bag.style.display = "none";
    } else {
        Bag.style.display = "block";
        displayCart();
    }

});


const Buy = document.getElementById("buy");

Buy.addEventListener("click", () => {
    window.location.href = "../Modulo-2/Pagina%20de%20Compra/checkout.html";
});


function displayCart() {

    if (cart.length === 0) {
        BagItems.innerHTML = "<li>No hay productos agregados </li>";
        BagTotal.textContent = 0;
        return;
    }

    BagItems.innerHTML = cart.map(item =>
        `<li class="cart-item">
            <div class="image-container">
                <img src="${item.image}" class="cart-image">
            </div>
            <div class="cart-info">
                <p>${item.title}</p>
                <div class="botton-quantity">
                    <p>Cantidad: ${item.quantity}</p>
                    <button class="button-plus" onClick="UpdateQTY('${item.id}', 1)"> + </button>
                    <button class="button-less" onClick="UpdateQTY('${item.id}', -1)"> − </button>
                </div>
            </div>
        </li>`
    ).join("");

    const total = cart.reduce((acc, item) => {
        return acc + item.price * item.quantity;
    }, 0);

    BagTotal.textContent = total.toFixed(2);

}


function UpdateQTY(id, cambio) {
    const SearchProduct = cart.find(p => p.id == id);

    if (SearchProduct) {
        SearchProduct.quantity += cambio;

        if (SearchProduct.quantity < 1) {
            cart = cart.filter(p => p.id != id);
        }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

function ClearCart() {
    cart = [];
    localStorage.removeItem("cart");
    displayCart();
}

window.addEventListener("scroll", () => {
    const BtnBag = document.querySelector(".botton-bag");
    if (window.scrollY > 655) {
        BtnBag.style.color = "withe";
        BtnBag.style.border = "1px solid black";
        BtnBag.style.borderRadius = "15px";
        BtnBag.style.backgroundColor = "black";
        BtnBag.style.padding = "10px 35px";
    } else {
        // Cuando estás arriba del todo, vuelve a ser transparente/normal
        BtnBag.style.color = "white";
        BtnBag.style.border = "none";
        BtnBag.style.borderRadius = "0px";
        BtnBag.style.backgroundColor = "transparent";
        BtnBag.style.padding = "0px";
    }
});

displayProducts();
displayCart();
