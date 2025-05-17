// DOM Elements
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeIcon = document.getElementById('theme-icon');
const togglePasswordBtn = document.getElementById('toggle-password');
const passwordIcon = document.getElementById('password-icon');
const passwordInput = document.getElementById('password');
const signinForm = document.getElementById('signin-form');
const emailInput = document.getElementById('email');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');
const backButton = document.getElementById('back-button');

// Theme Settings
const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';
let currentTheme = DARK_THEME; // Default theme

// Add theme transition class to body
document.body.classList.add('theme-transition');

// Check for saved theme in localStorage
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    currentTheme = savedTheme;
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
  }
}

// Update theme icon based on current theme
function updateThemeIcon() {
  if (currentTheme === DARK_THEME) {
    themeIcon.className = 'fas fa-moon';
  } else {
    themeIcon.className = 'fas fa-sun';
  }
}

// Toggle theme function
function toggleTheme() {
  currentTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
  
  // Apply theme
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  // Save theme to localStorage
  localStorage.setItem('theme', currentTheme);
  
  // Update theme icon
  updateThemeIcon();
  
  // Add subtle animation
  themeToggleBtn.classList.add('rotating');
  setTimeout(() => {
    themeToggleBtn.classList.remove('rotating');
  }, 300);
}

// Toggle password visibility function
function togglePasswordVisibility() {
  const type = passwordInput.type === 'password' ? 'text' : 'password';
  passwordInput.type = type;
  
  // Update password icon
  passwordIcon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
}

// Validate email function
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

// Validate password function (at least 6 characters)
function validatePassword(password) {
  return password.length >= 6;
}

// Show error message
function showError(input, errorElement, message) {
  errorElement.textContent = message;
  input.classList.add('error');
  input.classList.remove('success');
}

// Show success
function showSuccess(input, errorElement) {
  errorElement.textContent = '';
  input.classList.remove('error');
  input.classList.add('success');
}

// Handle form submission
function handleSubmit(e) {
  e.preventDefault();
  let isValid = true;
  
  // Validate email
  if (!validateEmail(emailInput.value)) {
    showError(emailInput, emailError, 'Please enter a valid email address');
    isValid = false;
  } else {
    showSuccess(emailInput, emailError);
  }
  
  // Validate password
  if (!validatePassword(passwordInput.value)) {
    showError(passwordInput, passwordError, 'Password must be at least 6 characters');
    isValid = false;
  } else {
    showSuccess(passwordInput, passwordError);
  }
  
  // If form is valid, proceed with sign in
  if (isValid) {
    // Normally you would send this to a server
    console.log('Sign in successful!');
    console.log({
      email: emailInput.value,
      password: passwordInput.value,
      rememberMe: document.getElementById('remember-me').checked
    });
    
    // Show success animation
    const button = document.querySelector('.signin-button');
    button.textContent = 'Signed In ✓';
    button.style.backgroundColor = 'var(--success)';
    
    // Reset after 2 seconds
    setTimeout(() => {
      button.textContent = 'Sign In';
      button.style.backgroundColor = '';
    }, 2000);
  }
}

// Back button functionality
function handleBack() {
  // This would typically navigate back to the previous page
  console.log('Back button clicked');
  // For demo purposes, just trigger an animation
  backButton.classList.add('clicked');
  setTimeout(() => {
    backButton.classList.remove('clicked');
    alert('This would navigate back to the previous page.');
  }, 300);
}

// Event Listeners
themeToggleBtn.addEventListener('click', toggleTheme);
togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
signinForm.addEventListener('submit', handleSubmit);
backButton.addEventListener('click', handleBack);

// Input field event listeners for real-time validation
emailInput.addEventListener('blur', () => {
  if (!validateEmail(emailInput.value) && emailInput.value !== '') {
    showError(emailInput, emailError, 'Please enter a valid email address');
  } else if (emailInput.value !== '') {
    showSuccess(emailInput, emailError);
  }
});

passwordInput.addEventListener('blur', () => {
  if (!validatePassword(passwordInput.value) && passwordInput.value !== '') {
    showError(passwordInput, passwordError, 'Password must be at least 6 characters');
  } else if (passwordInput.value !== '') {
    showSuccess(passwordInput, passwordError);
  }
});

// Social sign in buttons
document.querySelectorAll('.social-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const provider = this.classList.contains('google') ? 'Google' : 'Facebook';
    console.log(`Sign in with ${provider} clicked`);
    alert(`Sign in with ${provider} functionality would be integrated here.`);
  });
});

// Forgot password link
document.querySelector('.forgot-password').addEventListener('click', (e) => {
  e.preventDefault();
  console.log('Forgot password clicked');
  alert('Password reset functionality would be implemented here.');
});

// Sign up link
document.querySelector('.signup-link').addEventListener('click', (e) => {
  e.preventDefault();
  console.log('Sign up clicked');
  alert('This would navigate to the sign up page.');
});

// Initialize theme on page load
initTheme();

// CSS Animation classes
const cssAnimations = `
@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.rotating {
  animation: rotating 0.5s ease-in-out;
}
.clicked {
  animation: pulse 0.3s ease-in-out;
}
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); }
}
.error {
  border-color: var(--error) !important;
}
.success {
  border-color: var(--success) !important;
}
`;

// Add animations to the document
const style = document.createElement('style');
style.textContent = cssAnimations;
document.head.appendChild(style);