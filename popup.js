document.addEventListener('DOMContentLoaded', function () {
    const loginBtn = document.getElementById('login-btn');
    const trackedWebsitesDiv = document.getElementById('tracked-websites');
    const newAccountForm = document.getElementById('new-account-form');
  
    function displayMessage(message) {
      const messageDiv = document.getElementById('message');
      messageDiv.textContent = message;
      setTimeout(function () {
        messageDiv.textContent = '';
      }, 3000);
    }
  
    function handleLogin(email, password) {
      // Implement code to make HTTP requests to your backend API for login or registration
      fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            // Display a success message
            displayMessage('Login successful!');
          } else {
            // Login or registration failed
            // Display an error message to the user
            displayMessage(data.message);
          }
        })
        .catch(error => {
          // Handle error (e.g., network error)
          console.error('Error:', error);
        });
    }
  
    // Function to fetch tracked websites from the backend
    function getTrackedWebsites() {
      // Implement code to make a GET request to your backend API to get tracked websites
      fetch('http://your-backend-url/api/tracked-websites')
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            displayTrackedWebsites(data.trackedWebsites);
          } else {
            // Handle error or no tracked websites found
          }
        })
        .catch(error => {
          // Handle error (e.g., network error)
          console.error('Error:', error);
        });
    }
  
    // Function to display tracked websites and credentials
    function displayTrackedWebsites(trackedWebsites) {
      trackedWebsitesDiv.innerHTML = ''; // Clear previous content
  
      // Display each tracked website with credentials
      trackedWebsites.forEach(website => {
        const websiteDiv = document.createElement('div');
        websiteDiv.innerHTML = `
          <p><strong>${website.url}</strong></p>
          <p>Username: ${website.username}</p>
          <p>Password: ${website.password}</p>
          <hr>
        `;
        trackedWebsitesDiv.appendChild(websiteDiv);
      });
    }
  
    // Function to handle tracking a new website
    function trackWebsite(website, username, password) {
      // Implement code to make a POST request to your backend API to track the website with the given credentials
      fetch('http://your-backend-url/api/track-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ website, username, password })
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            // Website tracking successful
            // Display success message or update the displayed list of tracked websites
            displayMessage('Website tracking successful!');
            getTrackedWebsites(); // Update the list of tracked websites after tracking
          } else {
            // Website tracking failed
            // Display an error message to the user
            displayMessage(data.message);
          }
        })
        .catch(error => {
          // Handle error (e.g., network error)
          console.error('Error:', error);
        });
    }
  
    // Event listener for login button
    loginBtn.addEventListener('click', function () {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      handleLogin(email, password);
    });
  
    // Event listener for new account form submission
    newAccountForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const website = document.getElementById('new-account-url').value;
      const username = document.getElementById('new-account-username').value;
      const password = document.getElementById('new-account-password').value;
      trackWebsite(website, username, password);
    });
  
    // Call the function to fetch tracked websites when the popup is opened
    getTrackedWebsites();
  });