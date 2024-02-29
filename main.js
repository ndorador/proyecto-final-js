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
    let cart = savedCart ? JSON.parse(savedCart) : [];
    updateCartUI(cart);
    
    // Asignar el carrito a la variable global para que sea accesible desde otras funciones
    window.cart = cart;
});

function displayProducts(products) {
    const productsContainer = document.getElementById('products');

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const productElement = document.createElement('div');
        productElement.className = 'col'; // Utilizamos col para especificar el estilo de la columna
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <p>${product.name} - $${product.price}</p>
            <button onclick="addToCart(${product.id})">Agregar al Carrito</button>
        `;
        productsContainer.appendChild(productElement);

        // Agregar un salto de línea después de cada 4 productos para crear nuevas filas
        if ((i + 1) % 4 === 0) {
            const lineBreak = document.createElement('br');
            productsContainer.appendChild(lineBreak);
        }
    }
}



function addToCart(productId) {
    const product = getProductById(productId);

    if (product) {
        window.cart.push(product);
        updateCartUI(window.cart);
        // Guardar el carrito en el localStorage
        saveCartToLocalStorage(window.cart);
    } else {
        console.error('Producto no encontrado');
    }
}

function getProductById(productId) {
    // Implementación de la función para obtener el producto por ID desde la variable global
    return window.productsData.find(product => product.id === productId);
}

function updateCartUI(cart) {
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
    const totalAmount = parseFloat(document.getElementById('total').textContent);

    if (totalAmount > 0) {
        // Crear un div para el mensaje estilizado
        const messageDiv = document.createElement('div');
        messageDiv.className = 'success-message';
        messageDiv.innerHTML = `
            <p>¡Gracias por tu compra! Monto total: $${totalAmount.toFixed(2)}</p>
        `;

        // Añadir el div al cuerpo del documento
        document.body.appendChild(messageDiv);

        // Limpia el carrito después de la compra después de un breve retraso
        setTimeout(() => {
            clearCart();
            console.log('Proceso de compra completado.');
            // Remover el mensaje después de limpiar el carrito
            document.body.removeChild(messageDiv);
        }, 3000);  // Mostrar el mensaje por 3 segundos
    } else {
        // Mostrar mensaje de carrito vacío
        const emptyCartMessage = document.getElementById('emptyCartMessage');
        emptyCartMessage.style.display = 'block';

        // Ocultar el mensaje después de un breve retraso
        setTimeout(() => {
            emptyCartMessage.style.display = 'none';
        }, 3000);  // Mostrar el mensaje por 3 segundos
        console.log('Intento de compra con carrito vacío.');
    }
}

function clearCart() {
    window.cart = [];
    updateCartUI(window.cart);
    // Limpiar el carrito en el localStorage
    localStorage.removeItem('cart');
}

function saveCartToLocalStorage(cart) {
    // Guardar el carrito en el localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}