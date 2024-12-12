function toggleForm() {
    document.getElementById("login-form").style.display =
      document.getElementById("login-form").style.display === "none" ? "block" : "none";
    document.getElementById("signup-form").style.display =
      document.getElementById("signup-form").style.display === "none" ? "block" : "none";
  }
  
  document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
  
    const response = await fetch("http://localhost:5500/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  
    const data = await response.json();
    if (data.success) {
      showProfile(data.user);
    } else {
      alert(data.message);
    }
  });
  
  document.getElementById("signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
  
    const response = await fetch("http://localhost:5500/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
  
    const data = await response.json();
    if (data.success) {
      showProfile(data.user);
    } else {
      alert(data.message);
    }
  });
  
  function showProfile(user) {
    document.getElementById("form-container").style.display = "none";
    document.getElementById("profile-section").style.display = "block";
    document.getElementById("profile-name").textContent = user.name;
    document.getElementById("profile-email").textContent = user.email;
  }
  
  function logout() {
    document.getElementById("form-container").style.display = "block";
    document.getElementById("profile-section").style.display = "none";
  }
  