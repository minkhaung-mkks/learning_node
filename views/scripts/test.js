import getGoogleOAuthURL from '../../utlis/getGoogleOAuthURL.js'; // Assuming the file is named getGoogleOAuthURL.js

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    loginButton.href = getGoogleOAuthURL();
});
