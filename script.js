function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    tabs.forEach(tab => tab.classList.add('hidden'));

    const selectedTab = document.getElementById(tabId);
    selectedTab.classList.remove('hidden');
    selectedTab.classList.add('active');
}

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert("Logged in successfully!");
});

// Handle registration form submission
document.getElementById('registrationForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert("Registration successful!");
});

// Handle upload form submission
document.getElementById('uploadForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert("Document uploaded successfully!");
});
