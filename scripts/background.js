chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'autofill') {
      // Handle autofill request from content.js
      const username = request.username;
      const password = request.password;
  
      // Implement autofill logic (e.g., programmatically fill login fields)
      // For security reasons, Chrome extension cannot access the content of password input fields directly.
      // You can use browser's native autofill functionality if available, or navigate to the login URL with pre-filled credentials.
      // For example:
      chrome.tabs.update(sender.tab.id, { url: 'https://example.com/login?username=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password) });
  
      // Optionally, you can also send a message to the content script to confirm autofill completion.
      // For example:
      // sendResponse({ success: true });
    }
  });
  
// Function to handle messages from the popup UI
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'login' || request.action === 'register') {
      // Handle login or registration request from popup.js
      const action = request.action;
      const username = request.username;
      const password = request.password;
  
      // Implement code to make HTTP requests to your backend API for login or registration
      fetch('http://your-backend-url/api/login-or-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action, username, password })
      })
        .then(response => response.json())
        .then(data => {
          // Send the response back to the popup.js script
          sendResponse(data);
        })
        .catch(error => {
          // Handle error (e.g., network error)
          console.error('Error:', error);
          // Send an error response back to the popup.js script
          sendResponse({ success: false, message: 'An error occurred during login or registration.' });
        });
  
      // Return true to indicate that the response will be sent asynchronously
      return true;
    }
});