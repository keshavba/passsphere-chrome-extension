document.addEventListener('DOMContentLoaded', function () {
    let cookie = document.cookie
    let cookieArr = cookie.split('=');
    if(cookieArr[1] == "false") {
      displayMessage('Login successful!');
      document.getElementById("form-group").style.display = "none";
      document.getElementById("login-btn-div").style.display = "none";
    }
    const loginBtn = document.getElementById('login-btn');
    const currentWebsiteDiv = document.getElementById('current-website');
    getCurrentWebsiteCredentials();
  
    function displayMessage(message) {
      const messageDiv = document.getElementById('message');
      messageDiv.innerHTML = `<p>${message}</p>`;
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
            document.cookie = 'display_login_div=false';
            document.getElementById("form-group").style.display = "none";
            document.getElementById("login-btn-div").style.display = "none";
            getCurrentWebsiteCredentials();
          } else {
            displayMessage(data.message);
            document.cookie = 'display_login_div=true';
          }
        })
        .catch(error => {
          document.cookie = 'display_login_div=true';
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
            currentWebsiteDiv.innerHTML = `<p>${data.message}</p>`;
            if(data.message == 'Please log in.') {
              document.cookie = 'display_login_div=true';
            }
          }
        })
        .catch(error => {
          currentWebsiteDiv.innerHTML = `<p>Error!</p>`
        });
    }
  
    function displayCurrentWebsiteInfo(data) {
      currentWebsiteDiv.innerHTML = '';
      const websiteDiv = document.createElement('div');
      websiteDiv.innerHTML = `
      <p><strong>Website</strong>: ${data.website}</p>
      <p><strong>Username</strong>: ${data.username}</p>
      <p><strong>Password</strong>: ${data.password}</p>`;
      currentWebsiteDiv.appendChild(websiteDiv);
    }
  
    loginBtn.addEventListener('click', function () {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      handleLogin(email, password);
    });

    function getCurrentWebsiteCredentials() {
      chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        getCurrentWebsite(tabs[0].url);
      });
    }
});