// Firebase Authentication Integration
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyD-URtIHoLXPjht38NoFIuDdRgTRkISarA",
    authDomain: "chatgpt-21b6b.firebaseapp.com",
    projectId: "chatgpt-21b6b",
    storageBucket: "chatgpt-21b6b.firebasestorage.app",
    messagingSenderId: "895065749709",
    appId: "1:895065749709:web:e6d59b8138e3937d2ad184"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

// Signup Function
document.getElementById("signup-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("signup-username").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            localStorage.setItem("username", username);
            alert("Signup successful! Redirecting to login...");
            window.location.href = "login.html";
        })
        .catch(error => alert(error.message));
});

// Login Function
document.getElementById("login-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            const username = localStorage.getItem("username") || email;
            localStorage.setItem("loggedInUser", username);
            alert("Login successful! Redirecting to homepage...");
            window.location.href = "index.html";
        })
        .catch(error => alert(error.message));
});

// Monitor Auth State & Update UI
function monitorAuthState() {
    onAuthStateChanged(auth, (user) => {
        const loginBtn = document.getElementById("login-btn");
        const signupBtn = document.getElementById("signup-btn");
        const logoutBtn = document.getElementById("logout-btn");
        const userDisplay = document.getElementById("user-display");

        if (user) {
            const username = localStorage.getItem("loggedInUser") || user.email;
            if (loginBtn) loginBtn.style.display = "none";
            if (signupBtn) signupBtn.style.display = "none";
            if (logoutBtn) logoutBtn.style.display = "block";
            if (userDisplay) userDisplay.innerText = `Welcome, ${username}`;
        } else {
            if (loginBtn) loginBtn.style.display = "block";
            if (signupBtn) signupBtn.style.display = "block";
            if (logoutBtn) logoutBtn.style.display = "none";
            if (userDisplay) userDisplay.innerText = "";
        }
    });
}

document.addEventListener("DOMContentLoaded", monitorAuthState);

// Logout Function
document.getElementById("logout-btn")?.addEventListener("click", () => {
    signOut(auth).then(() => {
        alert("Logged out successfully!");
        localStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
    }).catch(error => alert(error.message));
});
