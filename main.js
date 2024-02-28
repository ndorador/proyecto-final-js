document.addEventListener('DOMContentLoaded', () => {
    fetch('productos.json')
        .then(response => response.json())
        .then(products => {
            displayProducts(products);
            // Almacena los productos en una variable global para acceder a ellos
            window.productsData = products;
        })
        .catch(error => console.error(error));
});

let cart = [];

function displayProducts(products) {
    const productsContainer = document.getElementById('products');

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.innerHTML = `
            <p>${product.name} - $${product.price}</p>
            <button onclick="addToCart(${product.id})">Agregar al Carrito</button>
        `;
        productsContainer.appendChild(productElement);
    });
}

function addToCart(productId) {
    const product = getProductById(productId);

    if (product) {
        cart.push(product);
        updateCartUI();
    } else {
        console.error('Producto no encontrado');
    }
}

function getProductById(productId) {
    // Implementación de la función para obtener el producto por ID desde la variable global
    return window.productsData.find(product => product.id === productId);
}

function updateCartUI() {
    const cartList = document.getElementById('cart-list');
    const totalSpan = document.getElementById('total');
    
    cartList.innerHTML = '';
    
    let total = 0;

    cart.forEach(product => {
        const listItem = document.createElement('li');
        listItem.textContent = `${product.name} - $${product.price}`;
        cartList.appendChild(listItem);
        total += product.price;
    });

    totalSpan.textContent = total.toFixed(2);
}

function checkout() {
    clearCart();
    alert('¡Gracias por tu compra! Monto total: $' + document.getElementById('total').textContent);
}

function clearCart() {
    cart = [];
    updateCartUI();
}