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
        // Mostrar modal de Bootstrap con el mensaje de compra exitosa
        const modalContent = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">¡Compra Exitosa!</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>¡Gracias por tu compra! Monto total: $${totalAmount.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        `;

        const modal = new bootstrap.Modal(document.getElementById('checkoutModal'));
        document.getElementById('modalContent').innerHTML = modalContent;
        modal.show();

        // Limpia el carrito después de la compra
        clearCart();
        console.log('Proceso de compra completado.');
    } else {
        alert('El carrito está vacío. Agrega productos antes de comprar.');
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