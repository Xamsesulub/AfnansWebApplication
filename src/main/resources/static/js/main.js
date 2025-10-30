let currentUser = null;

// Load user session from localStorage
function loadUser() {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
    updateAuthNav();
}

// Update navbar authentication links
function updateAuthNav() {
    const authNav = document.getElementById("auth-nav");
    if (!authNav) return;

    if (currentUser) {
        authNav.innerHTML = `
            <a href="account.html">${currentUser.name}</a>
            <a href="#" onclick="logout()" class="logout-link">Logout</a>
        `;
    } else {
        authNav.innerHTML = `
            <a href="login.html">Login</a>
            <a href="signup.html">Sign Up</a>
        `;
    }
}

// Signup handler
function handleSignup(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
        showError("signup-error", "Passwords do not match!");
        return;
    }

    const user = { name, email, password };
    localStorage.setItem("user:" + email, JSON.stringify(user));
    window.location.href = "login.html";
}

// Login handler
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const savedUser = localStorage.getItem("user:" + email);

    if (!savedUser) return showError("login-error", "Account not found.");
    const user = JSON.parse(savedUser);

    if (password !== user.password) return showError("login-error", "Incorrect password.");

    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "account.html";
}

// Show error helper
function showError(id, message) {
    const el = document.getElementById(id);
    el.innerText = message;
    el.style.display = "block";
}

// Logout
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

// Account page display
function loadAccountPage() {
    if (!currentUser) return;
    document.getElementById("user-name").textContent = currentUser.name;
    document.getElementById("user-email").textContent = currentUser.email;
}

// VIEW PRODUCT
function viewProduct(id) {
    localStorage.setItem("selectedProduct", id);
    window.location.href = "product.html";
}

document.addEventListener("DOMContentLoaded", () => {
    loadUser();
    loadAccountPage();
});
