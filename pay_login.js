function validateLogin() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var errorMessage = document.getElementById("error-message");
  
    // Simple validation, you can add more complex validation as needed
    if (username === "" || password === "") {
      errorMessage.textContent = "Username and password are required.";
    } else if (username !== "example" || password !== "password123") {
      errorMessage.textContent = "Invalid username or password.";
    } else {
      errorMessage.textContent = "";
      alert("Login successful!");
      // You can redirect or perform other actions upon successful login
    }
  }
  