let cart = [];

const products = [
    { id: 1, name: 'Chocolate Cake', price: 45.00, category: 'cakes', image: 'https://images.pexels.com/photos/1702373/pexels-photo-1702373.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Rich chocolate layers with creamy frosting' },
    { id: 2, name: 'Vanilla Cake', price: 40.00, category: 'cakes', image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Classic vanilla cake with buttercream' },
    { id: 3, name: 'Red Velvet Cake', price: 50.00, category: 'cakes', image: 'https://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Smooth red velvet with cream cheese frosting' },
    { id: 4, name: 'Strawberry Cake', price: 48.00, category: 'cakes', image: 'https://images.pexels.com/photos/2144112/pexels-photo-2144112.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Fresh strawberries and light cream' },
    { id: 5, name: 'Carrot Cake', price: 42.00, category: 'cakes', image: 'https://images.pexels.com/photos/1128005/pexels-photo-1128005.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Moist carrot cake with cream cheese icing' },
    { id: 6, name: 'Lemon Cake', price: 43.00, category: 'cakes', image: 'https://images.pexels.com/photos/6940997/pexels-photo-6940997.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Zesty lemon with light buttercream' },
    { id: 7, name: 'Chocolate Cupcakes', price: 18.00, category: 'cupcakes', image: 'https://images.pexels.com/photos/887853/pexels-photo-887853.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Rich chocolate with chocolate frosting (6 pack)' },
    { id: 8, name: 'Vanilla Cupcakes', price: 16.00, category: 'cupcakes', image: 'https://images.pexels.com/photos/1028714/pexels-photo-1028714.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Classic vanilla with buttercream (6 pack)' },
    { id: 9, name: 'Red Velvet Cupcakes', price: 20.00, category: 'cupcakes', image: 'https://images.pexels.com/photos/1395319/pexels-photo-1395319.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Red velvet with cream cheese frosting (6 pack)' },
    { id: 10, name: 'Strawberry Cupcakes', price: 19.00, category: 'cupcakes', image: 'https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Fresh strawberry flavor (6 pack)' },
    { id: 11, name: 'Chocolate Chip Cookies', price: 12.00, category: 'cookies', image: 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Classic chocolate chip (dozen)' },
    { id: 12, name: 'Oatmeal Raisin Cookies', price: 11.00, category: 'cookies', image: 'https://images.pexels.com/photos/1860202/pexels-photo-1860202.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Hearty oats with sweet raisins (dozen)' },
    { id: 13, name: 'Sugar Cookies', price: 13.00, category: 'cookies', image: 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Sweet and simple decorated cookies (dozen)' },
    { id: 14, name: 'Double Chocolate Cookies', price: 14.00, category: 'cookies', image: 'https://images.pexels.com/photos/5945805/pexels-photo-5945805.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Extra chocolatey goodness (dozen)' }
];

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCartCount();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }

    saveCart();
    updateCartCount();
    showToast(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity < 1) {
        item.quantity = 1;
    }

    saveCart();
    renderCart();
    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('#cart-count');
    cartCountElements.forEach(element => {
        element.textContent = count;
    });
}

function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCart = document.getElementById('empty-cart');
    const cartContent = document.getElementById('cart-content');

    if (cart.length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartContent) cartContent.style.display = 'none';
        return;
    }

    if (emptyCart) emptyCart.style.display = 'none';
    if (cartContent) cartContent.style.display = 'grid';

    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="price">$${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-controls">
                <div class="cart-item-quantity">
                    <button class="btn-quantity" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <input type="number" value="${item.quantity}" min="1" readonly>
                    <button class="btn-quantity" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="btn-remove" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');

    const total = calculateTotal();
    const subtotalElement = document.getElementById('cart-subtotal');
    const totalElement = document.getElementById('cart-total');

    if (subtotalElement) subtotalElement.textContent = `$${total.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
}

function renderCheckout() {
    const checkoutItemsContainer = document.getElementById('checkout-items');
    if (!checkoutItemsContainer) return;

    checkoutItemsContainer.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <span>${item.name} x ${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');

    const total = calculateTotal();
    const subtotalElement = document.getElementById('checkout-subtotal');
    const totalElement = document.getElementById('checkout-total');

    if (subtotalElement) subtotalElement.textContent = `$${total.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;

    const today = new Date();
    today.setDate(today.getDate() + 3);
    const minDate = today.toISOString().split('T')[0];
    const deliveryDateInput = document.getElementById('delivery-date');
    if (deliveryDateInput) {
        deliveryDateInput.min = minDate;
    }
}

function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    window.location.href = 'payment.html';
}

function submitOrder(event) {
    event.preventDefault();

    const deliveryDate = document.getElementById('delivery-date').value;
    const deliveryAddress = document.getElementById('delivery-address').value;
    const specialInstructions = document.getElementById('special-instructions').value;

    const orderNumber = 'ORD' + Date.now();

    localStorage.setItem('lastOrder', JSON.stringify({
        orderNumber,
        deliveryDate,
        total: calculateTotal()
    }));

    cart = [];
    saveCart();
    updateCartCount();

    window.location.href = 'confirmation.html';
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCart);
} else {
    loadCart();
}
