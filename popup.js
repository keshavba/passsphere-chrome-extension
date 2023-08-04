document.addEventListener('DOMContentLoaded', function () {
    const loginBtn = document.getElementById('login-btn');
    const currentWebsiteDiv = document.getElementById('current-website');
  
    function displayMessage(message) {
      const messageDiv = document.getElementById('message');
      messageDiv.textContent = message;
    }
  
    function handleLogin(email, password) {
      fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'email': email, 'password': password })
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            displayMessage('Login successful!');
            document.getElementById("form-group").style.display = "none";
            document.getElementById("login-btn-div").style.display = "none";
          } else {
            displayMessage(data.message);
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  
      function getCurrentWebsite(website) {
      fetch('http://127.0.0.1:5000/website-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'website': website })
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            displayCurrentWebsiteInfo(data);
          } else {
            currentWebsiteDiv.innerHTML = "<p>No credentials found.</p>"
          }
        })
        .catch(error => {
          currentWebsiteDiv.innerHTML = `<p>Error!</p>`
        });
    }
  
    function displayCurrentWebsiteInfo(data) {
      currentWebsiteDiv.innerHTML = '';
      currentWebsiteDiv.innerHTML = `<p>${data}</p>`
  
      const websiteDiv = document.createElement('div');
      websiteDiv.innerHTML = `
      <p><strong>${data.website}</strong></p>
      <p>Username: ${data.username}</p>
      <p>Password: ${data.password}</p>
      <hr>`;
      currentWebsiteDiv.appendChild(websiteDiv);
    }
  
    loginBtn.addEventListener('click', function () {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      handleLogin(email, password);
    });
  
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
      getCurrentWebsite(tabs[0].url);
    });
  });