// Parol ko‘rsatish/berkitish funksiyasi
document.getElementById('toggle-password').addEventListener('click', function () {
  const passwordInput = document.getElementById('password');
  const passwordIcon = document.getElementById('password-icon');

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    passwordIcon.classList.remove('fa-eye');
    passwordIcon.classList.add('fa-eye-slash');
  } else {
    passwordInput.type = 'password';
    passwordIcon.classList.remove('fa-eye-slash');
    passwordIcon.classList.add('fa-eye');
  }
});

// Tema almashtirish funksiyasi
const themeToggle = document.getElementById('themeToggle');
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');

themeToggle.addEventListener('click', () => {
  const htmlEl = document.documentElement;
  if (htmlEl.getAttribute('data-theme') === 'light') {
    htmlEl.setAttribute('data-theme', 'dark');
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'inline';
  } else {
    htmlEl.setAttribute('data-theme', 'light');
    sunIcon.style.display = 'inline';
    moonIcon.style.display = 'none';
  }
});

// Sahifa ochilganda default Light rejimga o‘tish
window.addEventListener('DOMContentLoaded', () => {
  document.documentElement.setAttribute('data-theme', 'light');
  sunIcon.style.display = 'inline';
  moonIcon.style.display = 'none';
});
