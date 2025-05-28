document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const paymentForm = document.getElementById('payment-form');
    const cardNumber = document.getElementById('card-number');
    const cardHolder = document.getElementById('card-holder');
    const expiryMonth = document.getElementById('expiry-month');
    const expiryYear = document.getElementById('expiry-year');
    const cvv = document.getElementById('cvv');
    const billingAddress = document.getElementById('billing-address');
    const city = document.getElementById('city');
    const postalCode = document.getElementById('postal-code');
    const phone = document.getElementById('phone');
    
    // Card display elements
    const cardNumberDisplay = document.getElementById('card-number-display');
    const cardHolderDisplay = document.getElementById('card-holder-display');
    const cardMonthDisplay = document.getElementById('card-month-display');
    const cardYearDisplay = document.getElementById('card-year-display');
    const cardCvvDisplay = document.getElementById('card-cvv-display');
    
    // Error message elements
    const cardNumberError = document.getElementById('card-number-error');
    const cardHolderError = document.getElementById('card-holder-error');
    const expiryDateError = document.getElementById('expiry-date-error');
    const cvvError = document.getElementById('cvv-error');
    const billingAddressError = document.getElementById('billing-address-error');
    const cityError = document.getElementById('city-error');
    const postalCodeError = document.getElementById('postal-code-error');
    const phoneError = document.getElementById('phone-error');
    
    // Buttons
    const closePaymentBtn = document.getElementById('close-payment');
    const backToCartBtn = document.getElementById('back-to-cart');
    const completePaymentBtn = document.getElementById('complete-payment');
    const continueShoppingBtn = document.getElementById('continue-shopping');
    
    // Summary elements
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryDiscount = document.getElementById('summary-discount');
    const summaryShipping = document.getElementById('summary-shipping');
    const summaryTotal = document.getElementById('summary-total');
    
    // Credit card element
    const creditCard = document.querySelector('.credit-card');
    
    // Success message
    const paymentSuccess = document.getElementById('payment-success');
    
    // Card type icon
    const cardIcon = document.querySelector('.card-icon');
    
    // Initialize with cart data from localStorage
    initializePaymentPage();
    
    // Event listeners for real-time card display updates
    cardNumber.addEventListener('input', function(e) {
      formatCardNumber(e.target);
      updateCardNumberDisplay();
      detectCardType();
    });
    
    cardHolder.addEventListener('input', function() {
      updateCardHolderDisplay();
    });
    
    expiryMonth.addEventListener('change', function() {
      updateCardMonthDisplay();
    });
    
    expiryYear.addEventListener('change', function() {
      updateCardYearDisplay();
    });
    
    cvv.addEventListener('input', function() {
      updateCardCvvDisplay();
    });
    
    cvv.addEventListener('focus', function() {
      creditCard.classList.add('flipped');
    });
    
    cvv.addEventListener('blur', function() {
      creditCard.classList.remove('flipped');
    });
    
    // Phone number formatting
    phone.addEventListener('input', function(e) {
      formatPhoneNumber(e.target);
    });
    
    // Form submission
    paymentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (validateForm()) {
        processPayment();
      }
    });
    
    // Close payment modal
    closePaymentBtn.addEventListener('click', function() {
      window.location.href = 'index.html';
    });
    
    // Back to cart
    backToCartBtn.addEventListener('click', function() {
      window.location.href = 'cart.html';
    });
    
    // Continue shopping after successful payment
    continueShoppingBtn.addEventListener('click', function() {
      window.location.href = 'index.html';
    });
    
    // Functions
    
    // Initialize payment page with cart data
    function initializePaymentPage() {
      let cart = [];
      const savedCart = localStorage.getItem('cart');
      
      if (savedCart) {
        cart = JSON.parse(savedCart);
      }
      
      // Calculate totals
      let subtotal = 0;
      let discount = 0;
      const shipping = 20000; // Fixed shipping cost
      
      cart.forEach(item => {
        subtotal += item.price * item.quantity;
        
        // If we have product data with original price, calculate discount
        if (item.originalPrice) {
          discount += (item.originalPrice - item.price) * item.quantity;
        }
      });
      
      const total = subtotal - discount + shipping;
      
      // Update summary
      summarySubtotal.textContent = formatPrice(subtotal);
      summaryDiscount.textContent = formatPrice(discount);
      summaryShipping.textContent = formatPrice(shipping);
      summaryTotal.textContent = formatPrice(total);
    }
    
    // Format card number with spaces
    function formatCardNumber(input) {
      let value = input.value.replace(/\D/g, '');
      let formattedValue = '';
      
      for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
          formattedValue += ' ';
        }
        formattedValue += value[i];
      }
      
      input.value = formattedValue;
    }
    
    // Format phone number
    function formatPhoneNumber(input) {
      let value = input.value.replace(/\D/g, '');
      
      if (value.length > 0) {
        if (value.length <= 3) {
          value = '+' + value;
        } else if (value.length <= 5) {
          value = '+' + value.substring(0, 3) + ' ' + value.substring(3);
        } else if (value.length <= 7) {
          value = '+' + value.substring(0, 3) + ' ' + value.substring(3, 5) + ' ' + value.substring(5);
        } else if (value.length <= 9) {
          value = '+' + value.substring(0, 3) + ' ' + value.substring(3, 5) + ' ' + value.substring(5, 7) + ' ' + value.substring(7);
        } else {
          value = '+' + value.substring(0, 3) + ' ' + value.substring(3, 5) + ' ' + value.substring(5, 8) + ' ' + value.substring(8);
        }
      }
      
      input.value = value;
    }
    
    // Detect card type based on first digits
    function detectCardType() {
      const number = cardNumber.value.replace(/\D/g, '');
      
      // Reset card icon
      cardIcon.className = 'card-icon';
      
      if (number.startsWith('4')) {
        cardIcon.classList.add('fab', 'fa-cc-visa');
      } else if (/^5[1-5]/.test(number)) {
        cardIcon.classList.add('fab', 'fa-cc-mastercard');
      } else if (/^3[47]/.test(number)) {
        cardIcon.classList.add('fab', 'fa-cc-amex');
      } else if (/^6(?:011|5)/.test(number)) {
        cardIcon.classList.add('fab', 'fa-cc-discover');
      } else {
        cardIcon.classList.add('far', 'fa-credit-card');
      }
    }
    
    // Update card display functions
    function updateCardNumberDisplay() {
      if (cardNumber.value) {
        cardNumberDisplay.textContent = cardNumber.value;
      } else {
        cardNumberDisplay.textContent = '•••• •••• •••• ••••';
      }
    }
    
    function updateCardHolderDisplay() {
      if (cardHolder.value) {
        cardHolderDisplay.textContent = cardHolder.value.toUpperCase();
      } else {
        cardHolderDisplay.textContent = 'ISM FAMILIYA';
      }
    }
    
    function updateCardMonthDisplay() {
      if (expiryMonth.value) {
        cardMonthDisplay.textContent = expiryMonth.value;
      } else {
        cardMonthDisplay.textContent = 'MM';
      }
    }
    
    function updateCardYearDisplay() {
      if (expiryYear.value) {
        cardYearDisplay.textContent = expiryYear.value;
      } else {
        cardYearDisplay.textContent = 'YY';
      }
    }
    
    function updateCardCvvDisplay() {
      if (cvv.value) {
        cardCvvDisplay.textContent = cvv.value;
      } else {
        cardCvvDisplay.textContent = '•••';
      }
    }
    
    // Validate form
    function validateForm() {
      let isValid = true;
      
      // Reset all error messages
      cardNumberError.textContent = '';
      cardHolderError.textContent = '';
      expiryDateError.textContent = '';
      cvvError.textContent = '';
      billingAddressError.textContent = '';
      cityError.textContent = '';
      postalCodeError.textContent = '';
      phoneError.textContent = '';
      
      // Validate card number (Luhn algorithm)
      const cardNumberValue = cardNumber.value.replace(/\s/g, '');
      if (!cardNumberValue) {
        cardNumberError.textContent = 'Karta raqamini kiriting';
        isValid = false;
      } else if (!/^\d{16}$/.test(cardNumberValue)) {
        cardNumberError.textContent = 'Karta raqami 16 raqamdan iborat bo\'lishi kerak';
        isValid = false;
      } else if (!isValidCardNumber(cardNumberValue)) {
        cardNumberError.textContent = 'Noto\'g\'ri karta raqami';
        isValid = false;
      }
      
      // Validate card holder
      if (!cardHolder.value) {
        cardHolderError.textContent = 'Karta egasining ismini kiriting';
        isValid = false;
      } else if (!/^[a-zA-Z\s]+$/.test(cardHolder.value)) {
        cardHolderError.textContent = 'Faqat harflar va bo\'shliqlar ruxsat etilgan';
        isValid = false;
      }
      
      // Validate expiry date
      if (!expiryMonth.value || !expiryYear.value) {
        expiryDateError.textContent = 'Amal qilish muddatini kiriting';
        isValid = false;
      } else {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
        const currentMonth = currentDate.getMonth() + 1; // January is 0
        
        const selectedYear = parseInt(expiryYear.value);
        const selectedMonth = parseInt(expiryMonth.value);
        
        if (selectedYear < currentYear || (selectedYear === currentYear && selectedMonth < currentMonth)) {
          expiryDateError.textContent = 'Karta muddati tugagan';
          isValid = false;
        }
      }
      
      // Validate CVV
      if (!cvv.value) {
        cvvError.textContent = 'CVV/CVC kodini kiriting';
        isValid = false;
      } else if (!/^\d{3,4}$/.test(cvv.value)) {
        cvvError.textContent = 'CVV/CVC 3 yoki 4 raqamdan iborat bo\'lishi kerak';
        isValid = false;
      }
      
      // Validate billing address
      if (!billingAddress.value) {
        billingAddressError.textContent = 'Manzilni kiriting';
        isValid = false;
      }
      
      // Validate city
      if (!city.value) {
        cityError.textContent = 'Shaharni kiriting';
        isValid = false;
      }
      
      // Validate postal code
      if (!postalCode.value) {
        postalCodeError.textContent = 'Pochta indeksini kiriting';
        isValid = false;
      } else if (!/^\d{6}$/.test(postalCode.value)) {
        postalCodeError.textContent = 'Pochta indeksi 6 raqamdan iborat bo\'lishi kerak';
        isValid = false;
      }
      
      // Validate phone
      if (!phone.value) {
        phoneError.textContent = 'Telefon raqamini kiriting';
        isValid = false;
      } else if (!/^\+998 \d{2} \d{3} \d{2} \d{2}$/.test(phone.value)) {
        phoneError.textContent = 'Noto\'g\'ri telefon raqami formati';
        isValid = false;
      }
      
      return isValid;
    }
    
    // Luhn algorithm for card validation
    function isValidCardNumber(number) {
      let sum = 0;
      let shouldDouble = false;
      
      // Loop through values starting from the rightmost digit
      for (let i = number.length - 1; i >= 0; i--) {
        let digit = parseInt(number.charAt(i));
        
        if (shouldDouble) {
          digit *= 2;
          if (digit > 9) {
            digit -= 9;
          }
        }
        
        sum += digit;
        shouldDouble = !shouldDouble;
      }
      
      return (sum % 10) === 0;
    }
    
    // Process payment
    function processPayment() {
      // Show loading state
      completePaymentBtn.textContent = 'Yuklanmoqda...';
      completePaymentBtn.disabled = true;
      
      // Simulate payment processing
      setTimeout(() => {
        // Clear cart
        localStorage.removeItem('cart');
        
        // Show success message
        paymentSuccess.classList.add('show');
        
        // Reset button state
        completePaymentBtn.textContent = 'To\'lovni yakunlash';
        completePaymentBtn.disabled = false;
      }, 2000);
    }
    
    // Format price
    function formatPrice(price) {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm";
    }
  });