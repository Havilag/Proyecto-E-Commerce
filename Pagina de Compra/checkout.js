
const checkoutItems = document.getElementById("checkout-items");

function displayCheckout() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        checkoutItems.innerHTML = "<p>No hay productos</p>";
        return;
    }

    checkoutItems.innerHTML = cart.map(item =>
        `<div class="checkout-item">
            <div class="item-image">
                <img src="${item.image}">
            </div>
            <div class="item-content">
                <div class="item-info">
                    <p>${item.title}</p>
                    <div class="item-quantity">
                        <button onclick="updateCheckoutQty('${item.id}', -1)">−</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateCheckoutQty('${item.id}', 1)">+</button>
                    </div>
                </div>
                </div>
                <p>$ ${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            
        </div>
    `).join("");

    const subtotal = cart.reduce((acc, item) => {
        return acc + item.price * item.quantity;
    }, 0);

    const shipping = subtotal > 200 ? 0 : 20;

    const taxes = subtotal * 0.1;

    const total = subtotal + shipping + taxes;

    document.getElementById("subtotal").textContent = "$" + subtotal.toFixed(2);
    document.getElementById("shipping").textContent = "$" + shipping.toFixed(2);
    document.getElementById("taxes").textContent = "$" + taxes.toFixed(2);
    document.getElementById("total").textContent = "$" + total.toFixed(2);

}

function updateCheckoutQty(id, cambio) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const product = cart.find(p => p.id == id);

    if (product) {
        product.quantity += cambio;

        if (product.quantity < 1) {
            cart = cart.filter(p => p.id != id);
        }
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    displayCheckout();
}


async function LoadCountry() {
    const response = await fetch("./assets/CiudadesPeru.json");
    const country = await response.json();

    country.forEach(city => {
        const option = document.createElement("option");
        option.value = city.name;
        option.textContent = city.name;
        document.querySelector(".form-countries").appendChild(option);
    });
}


const RadioCart = document.getElementById("card-option");
const CardInput = document.querySelectorAll(".card-body input");

function CardInputs() {
    CardInput.forEach(input => {
        input.disabled = !RadioCart.checked;

    });
}

document.querySelector(".payment-box").addEventListener("click", () => {
    RadioCart.checked = true;
    CardInputs();
})


const checkoutForm = document.querySelector(".form-container");

checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();

    alert("Compra realizada");
    localStorage.removeItem("cart");
    window.location.href="../Pagina%20Principal/index.html";
});


LoadCountry();
displayCheckout();