let cart = [];

// PRODUCT LIST
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

// LOAD CART
function loadCart() {
    const saved = localStorage.getItem("cart");
    cart = saved ? JSON.parse(saved) : [];
    updateCartCount();
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// ADD TO CART
function addToCart(id, qty = 1) {
    const product = products.find(p => p.id === id);
    const item = cart.find(i => i.id === id);

    if (item) item.quantity += qty;
    else cart.push({ ...product, quantity: qty });

    saveCart();
    updateCartCount();
}

// UPDATE CART COUNT IN NAV
function updateCartCount() {
    const count = cart.reduce((t, i) => t + i.quantity, 0);
    document.querySelectorAll("#cart-count").forEach(el => el.textContent = count);
}

// PRODUCT PAGE LOAD
function loadProductPage() {
    const id = parseInt(localStorage.getItem("selectedProduct"));
    const product = products.find(p => p.id === id);

    if (!product) return;

    document.getElementById("product-image").src = product.image;
    document.getElementById("product-name").textContent = product.name;
    document.getElementById("product-description").textContent = product.description;
    document.getElementById("product-price").textContent = `$${product.price.toFixed(2)}`;
}

// QUANTITY BUTTONS
function increaseQuantity() {
    const q = document.getElementById("quantity");
    q.value = Number(q.value) + 1;
}

function decreaseQuantity() {
    const q = document.getElementById("quantity");
    q.value = Math.max(1, Number(q.value) - 1);
}

function addToCartFromProduct() {
    const id = parseInt(localStorage.getItem("selectedProduct"));
    const qty = Number(document.getElementById("quantity").value);
    addToCart(id, qty);
}

// REMOVE ITEM
function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    renderCart();
    updateCartCount();
}

// CLEAR CART
function clearCart() {
    cart = [];
    saveCart();
    renderCart();
    updateCartCount();
}

document.addEventListener("DOMContentLoaded", () => {
    loadCart();
    if (document.getElementById("product-image")) loadProductPage();
});
