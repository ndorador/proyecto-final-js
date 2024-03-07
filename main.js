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
    let currentRow;

    for (let i = 0; i < products.length; i++) {
        const product = products[i];

        // Comienza una nueva fila después de cada 4 productos
        if (i % 4 === 0) {
            currentRow = document.createElement('div');
            currentRow.className = 'row';
            productsContainer.appendChild(currentRow);
        }

        const productElement = document.createElement('div');
        productElement.className = 'col-md-3';
        productElement.innerHTML = `
            <div class="card mb-3">
                <img src="${product.image}" alt="${product.name}" class="card-img-top product-image">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">$${product.price}</p>
                    <button onclick="addToCart(${product.id})" class="btn btn-primary">Agregar al Carrito</button>
                </div>
            </div>
        `;

        // Agrega la tarjeta al contenedor de la fila actual
        currentRow.appendChild(productElement);
    }
}



function addToCart(productId) {
    const product = getProductById(productId);

    if (product) {
        const quantity = prompt(`¿Cuántos "${product.name}" deseas agregar al carrito?`, 1);

        if (quantity !== null && !isNaN(quantity) && quantity > 0) {
            // Agrega el producto con la cantidad al carrito
            const cartProduct = { ...product, quantity: parseInt(quantity, 10) };
            window.cart.push(cartProduct);
            updateCartUI(window.cart);
            // Guarda el carrito en el localStorage
            saveCartToLocalStorage(window.cart);
        } else {
            console.error('Cantidad inválida o cancelada.');
        }
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
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    
    cartList.innerHTML = '';
    
    let total = 0;

    if (cart.length > 0) {
        emptyCartMessage.style.display = 'none';

        cart.forEach(product => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${product.name}</span>
                <span>Precio: $${product.price}</span>
                <span>Cantidad: ${product.quantity}</span>
                <button onclick="removeFromCart(${product.id})" class="remove-btn">Eliminar</button>
            `;
            cartList.appendChild(listItem);
            total += product.price * product.quantity;
        });

        totalSpan.textContent = total.toFixed(2);
    } else {
        // Si el carrito está vacío, mostrar el mensaje
        emptyCartMessage.style.display = 'block';
        totalSpan.textContent = '0.00';
    }

    
}

function removeFromCart(productId) {
    window.cart = window.cart.filter(product => product.id !== productId);
    updateCartUI(window.cart);
    // Guarda el carrito actualizado en el localStorage
    saveCartToLocalStorage(window.cart);
}

function checkout() {
    // Mostrar el formulario de datos del cliente
    document.getElementById('customerDataForm').style.display = 'block';
}

function submitCustomerData() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;

    const totalAmount = parseFloat(document.getElementById('total').textContent);

    if (totalAmount > 0 && name && phone && email && address) {
        const thankYouMessage = `¡Gracias por tu compra, ${name}!\nMonto total: $${totalAmount.toFixed(2)}\nLos productos se enviarán a la siguiente dirección: ${address}`;

        // Mostrar alerta personalizada
        showCustomAlert(thankYouMessage);

        // Limpiar el carrito después de la compra
        clearCart();

        // Ocultar el formulario y restablecer su contenido
        document.getElementById('customerForm').reset();
        document.getElementById('customerDataForm').style.display = 'none';
    } else {
        // Mostrar un cuadro de diálogo indicando que falta información del cliente o el carrito está vacío
        window.alert('Falta información del cliente o el carrito está vacío.');
    }
}
function showCustomAlert(message) {
    // Crear un div para la alerta personalizada
    const alertDiv = document.createElement('div');
    alertDiv.className = 'custom-alert';
    alertDiv.textContent = message;

    // Establecer el estilo
    alertDiv.style.backgroundColor = '#d67244'; // Fondo verde
    alertDiv.style.color = '#fff'; // Texto blanco

    // Agregar la alerta al cuerpo del documento
    document.body.appendChild(alertDiv);

    // Agregar un evento de clic para cerrar la alerta al hacer clic en ella
    alertDiv.addEventListener('click', function () {
        document.body.removeChild(alertDiv);
    });

    // Opcional: cerrar la alerta automáticamente después de un tiempo (ejemplo: 15 segundos)
    setTimeout(() => {
        document.body.removeChild(alertDiv);
    }, 15000); // Mostrar la alerta por 15 segundos
}

function closeCustomModal() {
    // Cerrar el modal al hacer clic en la "X"
    document.getElementById('customModal').style.display = 'none';
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