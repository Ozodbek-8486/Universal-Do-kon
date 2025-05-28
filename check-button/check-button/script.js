// Toifalar ro'yxati
const cuisines = [
  "Elektronika", "Kiyim-kechak", "Poyabzalar", "Aksessuarlar",
  "Go'zalik va parvarish", "Uy anjomlari", "Oshxona buyumlari",
  "Bolalar mahsulotlari", "Sport jihozlari", "Avto ehtiyot qisimlari",
  "Qurilish va ta'mirlash", "Oziq-ovqat", "Ichimliklar", "Kitoblar",
  "Kantselyariya", "O‘yinchoqlar", "Zargarlik buyumlari", "Sovg‘alar", "Gullar"
];

const MAX_SELECTIONS = 6;
let selectedCuisines = [];

// DOM elementlar
const cuisineGrid = document.getElementById('cuisine-grid');
const limitMessage = document.getElementById('limit-message');
const selectionCount = document.getElementById('selection-count');
const nextButton = document.getElementById('next-button');
const themeToggleBtn = document.getElementById('theme-toggle-btn');

// Toifa tugmalarini yaratish
function createCuisineButtons() {
  cuisines.forEach(cuisine => {
    const button = document.createElement('button');
    button.className = 'cuisine-button';
    button.dataset.cuisine = cuisine;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'cuisine-content';

    const nameSpan = document.createElement('span');
    nameSpan.textContent = cuisine;
    contentDiv.appendChild(nameSpan);

    const checkIcon = document.createElement('div');
    checkIcon.className = 'check-icon';
    checkIcon.innerHTML = `
      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;
    contentDiv.appendChild(checkIcon);

    button.appendChild(contentDiv);
    button.addEventListener('click', () => toggleCuisine(cuisine, button));
    cuisineGrid.appendChild(button);
  });
}

// Tanlash
function toggleCuisine(cuisine, button) {
  const index = selectedCuisines.indexOf(cuisine);

  if (index === -1) {
    if (selectedCuisines.length >= MAX_SELECTIONS) return;
    selectedCuisines.push(cuisine);
    button.classList.add('selected');
  } else {
    selectedCuisines.splice(index, 1);
    button.classList.remove('selected');
  }

  updateUI();
}

// UI yangilash
function updateUI() {
  selectionCount.textContent = `${selectedCuisines.length}/${MAX_SELECTIONS}`;
  const limitReached = selectedCuisines.length >= MAX_SELECTIONS;

  limitMessage.classList.toggle('limit-reached', limitReached);

  document.querySelectorAll('.cuisine-button').forEach(button => {
    const cuisine = button.dataset.cuisine;
    const isSelected = selectedCuisines.includes(cuisine);
    button.classList.toggle('disabled', limitReached && !isSelected);
  });

  nextButton.disabled = selectedCuisines.length === 0;
}

// Keyingi sahifaga o'tish
function handleNextButtonClick() {
  if (selectedCuisines.length > 0) {
    localStorage.setItem('selectedCuisines', JSON.stringify(selectedCuisines));

    // Eslatma: URL to‘g‘riligiga ishonch hosil qiling
window.location.href = "/modern-store/index.html";
  }
}

// Mavzu almashtirish
function toggleTheme() {
  const html = document.documentElement;
  const isLight = html.classList.contains('light-theme');
  html.classList.toggle('light-theme', !isLight);
  html.classList.toggle('dark-theme', isLight);
  localStorage.setItem('theme', isLight ? 'dark' : 'light');
}

// Mavzuni boshlanishda o‘rnatish
function setInitialTheme() {
  const savedTheme = localStorage.getItem('theme');
  const html = document.documentElement;
  html.classList.add('light-theme');
  if (savedTheme === 'dark') {
    html.classList.replace('light-theme', 'dark-theme');
  }
}

// Boshlang‘ich yuklash
function init() {
  setInitialTheme();
  createCuisineButtons();
  updateUI();
  nextButton.addEventListener('click', handleNextButtonClick);
  themeToggleBtn.addEventListener('click', toggleTheme);
}

document.addEventListener('DOMContentLoaded', init);
