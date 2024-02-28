document.addEventListener('DOMContentLoaded', () => {
    fetch('productos.json')
        .then(response => response.json())
        .then(products => {
            displayProducts(products);
            // Almacena los productos en una variable global para acceder a ellos
            window.productsData = products;
        })
        .catch(error => console.error(error));

    // Cargar el carrito desde el localStorage si existe
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
});

function displayProducts(products) {
    const productsContainer = document.getElementById('products');

    // Agrupar los productos en filas de tres
    for (let i = 0; i < products.length; i += 3) {
        const row = document.createElement('div');
        row.className = 'row';

        for (let j = i; j < i + 3 && j < products.length; j++) {
            const product = products[j];
            const productElement = document.createElement('div');
            productElement.className = 'col';
            productElement.innerHTML = `
                <p>${product.name} - $${product.price}</p>
                <button onclick="addToCart(${product.id})">Agregar al Carrito</button>
            `;
            row.appendChild(productElement);
        }

        productsContainer.appendChild(row);
    }
}

function addToCart(productId) {
    const product = getProductById(productId);

    if (product) {
        cart.push(product);
        updateCartUI();
        // Guardar el carrito en el localStorage
        saveCartToLocalStorage();
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
    console.log('Realizando proceso de compra...');

    // Realizar aquí la lógica de procesamiento de compra si es necesario
    alert('¡Gracias por tu compra! Monto total: $' + document.getElementById('total').textContent);

    // Limpia el carrito después de la compra
    clearCart();
    console.log('Proceso de compra completado.');
}

function clearCart() {
    cart = [];
    updateCartUI();
    // Limpiar el carrito en el localStorage
    localStorage.removeItem('cart');
}

function saveCartToLocalStorage() {
    // Guardar el carrito en el localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}