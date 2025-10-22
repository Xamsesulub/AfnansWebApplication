/* ============================================================
   AfnanBakes - Frontend Script (Modern & Secure Version)
   Author: Afnan Ahmed
   Last updated: October 2025
   Description:
   Handles all interactive frontend logic for AfnanBakes:
   - Login / Signup / Contact / Payment forms
   - Cart updates & DOM validation
   - Secure input handling & storage
   ============================================================ */

"use strict";

/* ============================================================
   UTILITY FUNCTIONS
   ============================================================ */

/** Safely select an element */
const $ = (selector) => document.querySelector(selector);

/** Format as NOK currency */
const formatCurrency = (amount) => `${amount.toFixed(2)} NOK`;

/** Sanitize input to prevent XSS */
const sanitizeInput = (str) =>
    str.replace(/[<>"'`]/g, (m) => ({
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "`": "&#96;",
    }[m]));

/**
 * Display feedback below the form button
 * @param {string} message
 * @param {"error"|"success"} type
 */
const showMessage = (message, type = "error") => {
    const form = document.querySelector("form");
    if (!form) return;

    const oldMsg = form.querySelector(".error-message, .success-message");
    if (oldMsg) oldMsg.remove();

    const msg = document.createElement("div");
    msg.className = type === "error" ? "error-message" : "success-message";
    msg.textContent = message;

    const submitBtn = form.querySelector("button[type='submit']");
    if (submitBtn && submitBtn.parentNode) {
        submitBtn.parentNode.insertAdjacentElement("afterend", msg);
    } else {
        form.appendChild(msg);
    }

    setTimeout(() => msg.remove(), 5000);
};

/* ============================================================
   CART FUNCTIONS (LocalStorage-based)
   ============================================================ */

/** Update total dynamically */
const updateCartTotal = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = 0;
    cart.forEach((item) => (total += item.price * item.quantity));
    const totalDisplay = $("#total-price");
    if (totalDisplay) totalDisplay.textContent = formatCurrency(total);
};

/**
 * Add item to cart (called from product pages)
 */
const addToCart = (name, price, image) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find((item) => item.name === name);
    if (existing) existing.quantity += 1;
    else cart.push({ name, price: parseFloat(price), image, quantity: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${name} has been added to your cart! 🛒`);
};

/**
 * Render cart items from localStorage
 */
const renderCart = () => {
    const container = document.getElementById("cart-items-container");
    if (!container) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = `<p style="text-align:center; font-size:1.2rem; color:#777;">Your cart is empty 🧁</p>`;
        updateCartTotal();
        return;
    }

    cart.forEach((item, index) => {
        const itemEl = document.createElement("div");
        itemEl.className = "cart-item";
        itemEl.dataset.price = item.price;

        itemEl.innerHTML = `
      <img src="${item.image}" alt="${sanitizeInput(item.name)}" />
      <div class="cart-item-info">
          <h3>${sanitizeInput(item.name)}</h3>
          <p class="price">${formatCurrency(item.price)}</p>
      </div>
      <div class="cart-item-controls">
          <div class="quantity-controls">
              <button class="quantity-btn decrease" onclick="changeQuantity(${index}, -1)">-</button>
              <span class="quantity">${item.quantity}</span>
              <button class="quantity-btn increase" onclick="changeQuantity(${index}, 1)">+</button>
          </div>
          <p class="subtotal">Subtotal: <strong>${formatCurrency(
            item.price * item.quantity
        )}</strong></p>
          <button class="remove-btn" onclick="removeFromCart(${index})" title="Remove item">🗑️</button>
      </div>
    `;

        container.appendChild(itemEl);
    });

    updateCartTotal();
};

/** Change quantity of a product */
const changeQuantity = (index, delta) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (!cart[index]) return;
    cart[index].quantity += delta;
    if (cart[index].quantity < 1) cart[index].quantity = 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
};

/** Remove product entirely */
const removeFromCart = (index) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (confirm("Are you sure you want to remove this item?")) {
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    }
};

/** Empty the cart (used after checkout) */
const clearCart = () => {
    localStorage.removeItem("cart");
    renderCart();
};

/* ============================================================
   FORM HANDLERS (LOGIN, SIGNUP, CONTACT, PAYMENT)
   ============================================================ */

const handleLogin = (event) => {
    event.preventDefault();
    const email = sanitizeInput($("#email").value.trim());
    const password = $("#password").value.trim();

    if (!email || !password) {
        showMessage("Please enter both email and password.", "error");
        return;
    }

    const validUsers = [
        { email: "afnan@afnanbakes.com", password: "Afnan123" },
        { email: "test@user.com", password: "123456" },
    ];

    const user = validUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
        showMessage("No account found with that email address.", "error");
        return;
    }

    if (user.password !== password) {
        showMessage("Incorrect password. Please try again.", "error");
        return;
    }

    showMessage("Login successful! Redirecting...", "success");
    console.log(`✅ Logged in: ${email}`);
    setTimeout(() => (window.location.href = "account.html"), 1500);
};

const handleSignup = (event) => {
    event.preventDefault();
    const name = sanitizeInput($("#name").value.trim());
    const email = sanitizeInput($("#email").value.trim());
    const password = $("#password").value;
    const confirmPassword = $("#confirm-password").value;

    if (!name || !email || !password || !confirmPassword) {
        showMessage("Please fill in all required fields.", "error");
        return;
    }

    if (password !== confirmPassword) {
        showMessage("Passwords do not match!", "error");
        return;
    }

    showMessage("Account created successfully! Redirecting...", "success");
    console.log(`✅ Signup successful for: ${name} (${email})`);
    setTimeout(() => (window.location.href = "login.html"), 2000);
};

const handleContact = (event) => {
    event.preventDefault();
    const name = sanitizeInput($("#name").value.trim());
    const email = sanitizeInput($("#email").value.trim());
    const message = sanitizeInput($("#message").value.trim());

    if (!name || !email || !message) {
        showMessage("Please fill out all fields.", "error");
        return;
    }

    showMessage("Message sent successfully!", "success");
    console.log(`📩 Message from ${name}: ${message}`);
    event.target.reset();
};

const handlePayment = (event) => {
    event.preventDefault();
    const name = sanitizeInput($("#name").value.trim());
    const cardNumber = $("#card-number").value.replace(/\s+/g, "");
    const cvv = $("#cvv").value.trim();
    const expiry = $("#expiry").value.trim();

    if (!name || !cardNumber || !cvv || !expiry) {
        showMessage("Please fill in all payment details.", "error");
        return;
    }

    if (!/^\d{16}$/.test(cardNumber)) {
        showMessage("Invalid card number. Must be 16 digits.", "error");
        return;
    }
    if (!/^\d{3}$/.test(cvv)) {
        showMessage("Invalid CVV. Must be 3 digits.", "error");
        return;
    }

    showMessage("Payment successful! Redirecting...", "success");
    console.log(`💳 Payment processed by ${name}`);
    clearCart();
    setTimeout(() => (window.location.href = "confirmation.html"), 2000);
};

/* ============================================================
   ACCOUNT PAGE
   ============================================================ */

const showChangePassword = () => {
    const form = $("#change-password-form");
    if (form) form.style.display = form.style.display === "none" ? "block" : "none";
};

const handleChangePassword = (event) => {
    event.preventDefault();
    const oldPass = $("#old-password").value.trim();
    const newPass = $("#new-password").value.trim();

    if (!oldPass || !newPass) {
        showMessage("Please fill in all password fields.", "error");
        return;
    }

    if (newPass.length < 6) {
        showMessage("Password must be at least 6 characters long.", "error");
        return;
    }

    showMessage("Your password has been updated!", "success");
    console.log("🔒 Password updated successfully.");
    $("#change-password-form").style.display = "none";
};

const showEmailForm = () => {
    const form = $("#email-form");
    if (form) form.style.display = form.style.display === "none" ? "block" : "none";
};

const handleSendEmail = (event) => {
    event.preventDefault();
    const subject = sanitizeInput($("#subject").value.trim());
    const message = sanitizeInput($("#message").value.trim());

    if (!subject || !message) {
        showMessage("Please enter both subject and message.", "error");
        return;
    }

    showMessage("Email sent successfully!", "success");
    console.log(`📨 Email sent: ${subject} - ${message}`);
    event.target.reset();
    $("#email-form").style.display = "none";
};

/* ============================================================
   INITIALIZATION
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("cart-items-container")) renderCart();
    console.log("✅ AfnanBakes frontend loaded successfully");
});
