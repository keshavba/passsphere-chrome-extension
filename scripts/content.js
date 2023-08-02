// Function to send a message to the background script to request autofill credentials
function requestAutofill(username, password) {
    chrome.runtime.sendMessage({ action: 'autofill', username, password });
}
  
// Function to extract login fields and autofill credentials if applicable
function autofillLogin() {
    const loginForm = document.querySelector('form[action*="login"], form[action*="signin"], form[action*="auth"]');
    if (!loginForm) return;

    // Modify these selectors to match the actual login fields on the page
    const usernameInput = loginForm.querySelector('input[name="username"]');
    const passwordInput = loginForm.querySelector('input[name="password"]');

    if (!usernameInput || !passwordInput) return;

    // Get the username and password from your password manager (assuming you have implemented this functionality in the background.js)
    const username = 'your_username_here'; // Replace with actual code to get the username from your password manager
    const password = 'your_password_here'; // Replace with actual code to get the password from your password manager

    if (username && password) {
        // Autofill the login fields
        usernameInput.value = username;
        passwordInput.value = password;

        // Submit the form automatically if needed
        // loginForm.submit();

        // Optionally, you can request autofill credentials to the background script
        requestAutofill(username, password);
    }
}
  
// Call the autofillLogin function when the content script is executed
autofillLogin();