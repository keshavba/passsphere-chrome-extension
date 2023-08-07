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
    const newAccountForm = document.getElementById('new-account-form');
    const newAccountMessage = document.getElementById('new-account-result');
    newAccountForm.style.display = "none";
    document.getElementById("new-account-header").style.display = "none";
    newAccountMessage.style.display = "none";
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
            newAccountForm.style.display = "none";
            document.getElementById("new-account-header").style.display = "none";
            newAccountMessage.style.display = "none";
          } else {
            displayMessage(data.message);
            document.cookie = 'display_login_div=true';
          }
        })
        .catch(error => {
          document.cookie = 'display_login_div=true';
          displayMessage('Error: ' + error);
        });
    }
  
      function getCurrentWebsite(website) {
      fetch('http://127.0.0.1:5000/account-credentials', {
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
              document.getElementById("form-group").style.display = "block";
              document.getElementById("login-btn-div").style.display = "flex";
              document.getElementById('message').style.display = "none";
            }
            else {
              newAccountForm.style.display = "flex";
              document.getElementById("new-account-header").style.display = "block";
              newAccountMessage.style.display = "block";
            }
          }
        })
        .catch(error => {
          currentWebsiteDiv.innerHTML = `<p>Error: ${error}</p>`
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

    function addAccount(website, username, password) {
      fetch('http://127.0.0.1:5000/add-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'website': website, 'username': username, 'password': password })
      })
        .then(response => response.json())
        .then(data => {
          newAccountMessage.innerHTML = `<p>${data.message}</p>`;
          if (data.success) {
            getCurrentWebsiteCredentials();
          }
        })
        .catch(error => {
          newAccountMessage.innerHTML = `<p>Error: ${error}</p>`;
        });
    }
  
    loginBtn.addEventListener('click', function () {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      handleLogin(email, password);
    });

    newAccountForm.addEventListener('submit', function (event) {
      event.preventDefault();
      
      chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let url = tabs[0].url;
        urlObj = new URL(url);
        let website = urlObj.host;
        const username = document.getElementById('new-account-username').value;
        const password = document.getElementById('new-account-password').value;
        addAccount(website, username, password);
      });
    });

    function getCurrentWebsiteCredentials() {
      chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let url = tabs[0].url;
        urlObj = new URL(url);
        getCurrentWebsite(urlObj.host);
      });
    }
});