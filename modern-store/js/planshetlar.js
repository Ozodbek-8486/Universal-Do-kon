document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle")
  const categoriesBtn = document.getElementById("categories-btn")
  const mainCategoriesMenu = document.getElementById("main-categories-menu")

  const mobileMenuBtn = document.getElementById("mobile-menu-btn")
  const mainNav = document.getElementById("main-nav")

  const heroSlider = document.getElementById("hero-slider")
  const sliderDots = document.querySelectorAll(".dot")
  const prevArrow = document.querySelector(".slider-arrow.prev")
  const nextArrow = document.querySelector(".slider-arrow.next")

  const productsGrid = document.getElementById("products-grid")
  const newProductsGrid = document.getElementById("new-products-grid")
  const filterBtns = document.querySelectorAll(".filter-btn")
  const loadMoreBtn = document.querySelector(".load-more-btn")

  const productModal = document.getElementById("product-modal")
  const modalClose = document.getElementById("modal-close")
  const modalBody = document.getElementById("modal-body")

  const productDetailModal = document.getElementById("product-detail-modal")
  const productDetailClose = document.getElementById("product-detail-close")
  const productDetailContent = document.getElementById("product-detail-content")
  const breadcrumbContainer = document.getElementById("breadcrumb-container")

  const cartCount = document.getElementById("cart-count")
  const cartNotification = document.getElementById("cart-notification")
  const cartContent = document.getElementById("cart-content")
  const emptyCart = document.getElementById("empty-cart")
  const cartItemsList = document.getElementById("cart-items-list")
  const cartTotalCount = document.getElementById("cart-total-count")
  const cartSubtotal = document.getElementById("cart-subtotal")
  const cartDiscount = document.getElementById("cart-discount")
  const cartTotal = document.getElementById("cart-total")
  const clearCartBtn = document.getElementById("clear-cart")
  const checkoutBtn = document.getElementById("checkout-btn")

  const backToTopBtn = document.getElementById("back-to-top")

  const contactForm = document.getElementById("contact-form")

  const welcomeOverlay = document.getElementById("welcome-overlay"); // Declare welcomeOverlay variable

  let currentSlide = 0
  let cart = []
  let currentLang = localStorage.getItem("language") || "uz"
  let currentBreadcrumb = []

  // Declare languageBtn, languageOptions, and translations
  const languageBtn = document.getElementById("language-btn")
  const languageOptions = document.querySelectorAll(".language-option")

  const tabletsGrid = document.getElementById("tablets-grid")
  const tabletsGrid2 = document.getElementById("tablets-grid-2")
  const notificationClose = document.getElementById("notification-close")
  const warningClose = document.getElementById("warning-close")
  const recommendedGrid = document.getElementById("recommended-grid")
  const tabletLinks = document.querySelectorAll(".tablet-link")

  let currentFilter = "all"

  // Tablet data
  const tablets = [
    {
      id: 1,
      name: "iPad Pro 12.9\" M2",
      image: "/placeholder.svg?height=250&width=250",
      price: "18 999 000 so'm",
      originalPrice: "21 999 000 so'm",
      rating: 4.9,
      reviewCount: 234,
      isNew: true,
      isPopular: true,
      category: "premium"
    },
    {
      id: 2,
      name: "Samsung Galaxy Tab S9 Ultra",
      image: "/placeholder.svg?height=250&width=250",
      price: "16 999 000 so'm",
      originalPrice: "19 999 000 so'm",
      rating: 4.7,
      reviewCount: 189,
      isNew: true,
      isPopular: true,
      category: "premium"
    },
    {
      id: 3,
      name: "iPad Air 5th Gen",
      image: "/placeholder.svg?height=250&width=250",
      price: "9 999 000 so'm",
      originalPrice: "11 999 000 so'm",
      rating: 4.6,
      reviewCount: 156,
      isNew: false,
      isPopular: true,
      category: "mid-range"
    },
    {
      id: 4,
      name: "Samsung Galaxy Tab A8",
      image: "/placeholder.svg?height=250&width=250",
      price: "3 999 000 so'm",
      originalPrice: "4 999 000 so'm",
      rating: 4.2,
      reviewCount: 98,
      isNew: false,
      isPopular: false,
      category: "budget"
    },
    {
      id: 5,
      name: "Microsoft Surface Pro 9",
      image: "/placeholder.svg?height=250&width=250",
      price: "14 999 000 so'm",
      originalPrice: "16 999 000 so'm",
      rating: 4.5,
      reviewCount: 142,
      isNew: true,
      isPopular: true,
      category: "premium"
    },
    {
      id: 6,
      name: "Lenovo Tab P11 Plus",
      image: "/placeholder.svg?height=250&width=250",
      price: "4 999 000 so'm",
      originalPrice: "5 999 000 so'm",
      rating: 4.1,
      reviewCount: 76,
      isNew: false,
      isPopular: false,
      category: "budget"
    },
    {
      id: 7,
      name: "Huawei MatePad Pro",
      image: "/placeholder.svg?height=250&width=250",
      price: "8 999 000 so'm",
      originalPrice: "9 999 000 so'm",
      rating: 4.4,
      reviewCount: 89,
      isNew: true,
      isPopular: false,
      category: "mid-range"
    },
    {
      id: 8,
      name: "Xiaomi Pad 5",
      image: "/placeholder.svg?height=250&width=250",
      price: "5 999 000 so'm",
      originalPrice: "6 999 000 so'm",
      rating: 4.3,
      reviewCount: 124,
      isNew: false,
      isPopular: true,
      category: "mid-range"
    },
    {
      id: 9,
      name: "iPad 10th Generation",
      image: "/placeholder.svg?height=250&width=250",
      price: "6 999 000 so'm",
      originalPrice: "7 999 000 so'm",
      rating: 4.5,
      reviewCount: 203,
      isNew: false,
      isPopular: true,
      category: "mid-range"
    },
    {
      id: 10,
      name: "Amazon Fire HD 10",
      image: "/placeholder.svg?height=250&width=250",
      price: "2 999 000 so'm",
      originalPrice: "3 499 000 so'm",
      rating: 3.9,
      reviewCount: 67,
      isNew: false,
      isPopular: false,
      category: "budget"
    }
  ]

  function init() {
    setTimeout(() => {
      if (welcomeOverlay) {
        welcomeOverlay.style.opacity = "0"
        setTimeout(() => {
          welcomeOverlay.style.display = "none"
        }, 500)
      }
    }, 3000)

    // Load cart from localStorage
    loadCart()

    // Check for saved theme
    const savedTheme = localStorage.getItem("theme") || "dark-mode"
    document.body.className = savedTheme

    // Check for saved language
    updateLanguageUI()

    // Initialize event listeners
    initEventListeners()

    // Apply translations
    updateLanguage()

    // Initialize breadcrumbs
    initBreadcrumbs()

    // Check current page
    const currentPath = window.location.pathname

    if (currentPath.includes("cart.html")) {
      renderCart()
    }

    // Initialize cart preview on homepage
    const cartContentPreview = document.getElementById("cart-content-preview")
    const emptyCartPreview = document.getElementById("empty-cart-preview")
    const cartItemsListPreview = document.getElementById("cart-items-list-preview")
    const cartTotalCountPreview = document.getElementById("cart-total-count-preview")
    const cartSubtotalPreview = document.getElementById("cart-subtotal-preview")
    const cartDiscountPreview = document.getElementById("cart-discount-preview")
    const cartTotalPreview = document.getElementById("cart-total-preview")
    const clearCartBtnPreview = document.getElementById("clear-cart-preview")
    const checkoutBtnPreview = document.getElementById("checkout-btn-preview")

    // Add event listeners for cart preview
    if (clearCartBtnPreview) {
      clearCartBtnPreview.addEventListener("click", clearCart)
    }

    // Update the cart preview on homepage
    updateCartPreview()

    // Render tablets
    renderTablets()
  }

  // Initialize event listeners
  function initEventListeners() {
    // Theme toggle
    if (themeToggle) {
      themeToggle.addEventListener("click", toggleTheme)
    }

    // Categories menu
    if (categoriesBtn && mainCategoriesMenu) {
      categoriesBtn.addEventListener("click", (e) => {
        e.stopPropagation()
        mainCategoriesMenu.classList.toggle("show")
      })

      document.addEventListener("click", (e) => {
        if (!mainCategoriesMenu.contains(e.target) && e.target !== categoriesBtn) {
          mainCategoriesMenu.classList.remove("show")
        }
      })
    }

    // Mobile menu
    if (mobileMenuBtn && mainNav) {
      mobileMenuBtn.addEventListener("click", toggleMobileMenu)
    }

    // Back to top button
    window.addEventListener("scroll", () => {
      if (backToTopBtn) {
        if (window.pageYOffset > 300) {
          backToTopBtn.classList.add("show")
        } else {
          backToTopBtn.classList.remove("show")
        }
      }
    })

    if (backToTopBtn) {
      backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      })
    }

    // Filter buttons
    if (filterBtns) {
      filterBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          filterBtns.forEach((b) => b.classList.remove("active"))
          btn.classList.add("active")

          currentFilter = btn.dataset.filter
          renderTablets()
        })
      })
    }

    // Load more button
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", loadMoreProducts)
    }

    // Product modal
    if (modalClose) {
      modalClose.addEventListener("click", closeProductModal)
    }

    // Close modal when clicking outside
    if (productModal) {
      productModal.addEventListener("click", (e) => {
        if (e.target === productModal) {
          closeProductModal()
        }
      })
    }

    // Product detail modal
    if (productDetailClose) {
      productDetailClose.addEventListener("click", closeProductDetailModal)
    }

    // Close product detail modal when clicking outside
    if (productDetailModal) {
      productDetailModal.addEventListener("click", (e) => {
        if (e.target === productDetailModal || e.target.classList.contains("modal-overlay")) {
          closeProductDetailModal()
        }
      })
    }

    // Add to cart buttons (delegated event)
    document.addEventListener("click", (e) => {
      // Product card click
      if (e.target.closest(".product-card")) {
        const productCard = e.target.closest(".product-card")

        // If clicked on add to cart button
        if (e.target.classList.contains("add-to-cart")) {
          e.preventDefault()
          e.stopPropagation()

          const productId = Number.parseInt(productCard.dataset.id)
          addToCart(productId, 1)
          showNotification()
          return
        }

        // If clicked on wishlist button
        if (e.target.closest(".wishlist-btn")) {
          e.preventDefault()
          e.stopPropagation()
          toggleWishlist(e.target.closest(".wishlist-btn"))
          return
        }

        // If clicked on star rating
        if (e.target.closest(".rating-stars")) {
          e.preventDefault()
          e.stopPropagation()
          handleStarRating(e.target.closest(".rating-stars"), e.target)
          return
        }

        // Otherwise open product detail modal
        const productId = Number.parseInt(productCard.dataset.id)
        openProductDetailModal(productId)
      }
    })

    // Cart functionality
    if (clearCartBtn) {
      clearCartBtn.addEventListener("click", clearCart)
    }

    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", checkout)
    }

    // Language switcher
    if (languageOptions) {
      languageOptions.forEach((option) => {
        option.addEventListener("click", (e) => {
          e.preventDefault()

          languageOptions.forEach((opt) => opt.classList.remove("active"))
          option.classList.add("active")

          currentLang = option.dataset.lang
          localStorage.setItem("language", currentLang)

          updateLanguageUI()
          updateLanguage()
        })
      })
    }

    // Contact form
    if (contactForm) {
      contactForm.addEventListener("submit", handleContactFormSubmit)
    }

    // Warning close
    if (warningClose) {
      warningClose.addEventListener("click", () => {
        document.querySelector(".new-warning-section").style.display = "none"
      })
    }

    // Notification close
    if (notificationClose) {
      notificationClose.addEventListener("click", () => {
        cartNotification.classList.remove("show")
      })
    }

    // Tablet links
    tabletLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        document.querySelector(".tablets-section").scrollIntoView({
          behavior: "smooth"
        })
      })
    })
  }

  // Initialize breadcrumbs
  function initBreadcrumbs() {
    const breadcrumbContainer = document.getElementById("breadcrumb-container")
    if (!breadcrumbContainer) return

    // Default breadcrumb (Home)
    currentBreadcrumb = [{ text: "Bosh sahifa", url: "index.html" }]

    updateBreadcrumbDisplay()

    // Add event listeners to category links
    document.querySelectorAll(".category-link").forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault()

        const categoryName = this.textContent.trim()
        const categoryUrl = this.getAttribute("href")

        // Add category to breadcrumb
        addToBreadcrumb(categoryName, categoryUrl)

        // Here you would normally navigate to the category page
        // For demo purposes, we'll just update the breadcrumb
      })
    })
  }

  // Add item to breadcrumb
  function addToBreadcrumb(text, url) {
    // Check if this category is already in the breadcrumb
    const existingIndex = currentBreadcrumb.findIndex((item) => item.text === text)

    if (existingIndex !== -1) {
      // If it exists, remove all items after it
      currentBreadcrumb = currentBreadcrumb.slice(0, existingIndex + 1)
    } else {
      // Otherwise add it to the end
      currentBreadcrumb.push({ text, url })
    }

    // Save to localStorage
    localStorage.setItem("breadcrumb", JSON.stringify(currentBreadcrumb))

    // Update display
    updateBreadcrumbDisplay()
  }

  // Update breadcrumb display
  function updateBreadcrumbDisplay() {
    const breadcrumbContainer = document.getElementById("breadcrumb-container")
    if (!breadcrumbContainer) return

    breadcrumbContainer.innerHTML = ""

    currentBreadcrumb.forEach((item, index) => {
      const breadcrumbItem = document.createElement("li")
      breadcrumbItem.className = "breadcrumb-item"

      const link = document.createElement("a")
      link.href = item.url
      link.textContent = item.text

      breadcrumbItem.appendChild(link)
      breadcrumbContainer.appendChild(breadcrumbItem)

      // Add separator except for the last item
      if (index < currentBreadcrumb.length - 1) {
        const separator = document.createElement("li")
        separator.className = "breadcrumb-separator"
        separator.innerHTML = '<i class="fas fa-chevron-right"></i>'
        breadcrumbContainer.appendChild(separator)
      }
    })
  }

  // Update language UI
  function updateLanguageUI() {
    if (!languageBtn || !languageOptions) return

    // Update language button
    const langImg = languageBtn.querySelector("img")
    const langText = languageBtn.querySelector("span")

    if (currentLang === "uz") {
      langImg.src = "https://placehold.co/20x20/333/fff?text=UZ"
      langImg.alt = "O'zbekcha"
      langText.textContent = "O'zbekcha"
    } else if (currentLang === "ru") {
      langImg.src = "https://placehold.co/20x20/333/fff?text=RU"
      langImg.alt = "Русский"
      langText.textContent = "Русский"
    } else if (currentLang === "en") {
      langImg.src = "https://placehold.co/20x20/333/fff?text=EN"
      langImg.alt = "English"
      langText.textContent = "English"
    }

    // Update active language option
    languageOptions.forEach((option) => {
      if (option.dataset.lang === currentLang) {
        option.classList.add("active")
      } else {
        option.classList.remove("active")
      }
    })
  }

  // Update language
  function updateLanguage() {
    // This function would contain translation logic
    // For now, we'll keep it simple since the main content is in Uzbek
  }

  // Toggle theme
  function toggleTheme() {
    if (document.body.classList.contains("light-mode")) {
      document.body.classList.remove("light-mode")
      document.body.classList.add("dark-mode")
      localStorage.setItem("theme", "dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
      document.body.classList.add("light-mode")
      localStorage.setItem("theme", "light-mode")
    }
  }

  function toggleMobileMenu() {
    mainNav.classList.toggle("show")

    if (mainNav.classList.contains("show")) {
      mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>'
      document.body.style.overflow = "hidden"
    } else {
      mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>'
      document.body.style.overflow = ""
    }
  }

  // Load more products
  function loadMoreProducts() {
    const message = "Ko'proq mahsulotlar yuklash funksiyasi ishlab chiqilmoqda"
    alert(message)
  }

  // Product modal
  function openProductModal(productId) {
    // Implementation for product modal
  }

  function closeProductModal() {
    if (!productModal) return

    productModal.classList.remove("show")
    document.body.style.overflow = ""
  }

  // Product detail modal
  function openProductDetailModal(productId) {
    if (!productDetailModal || !productDetailContent || !breadcrumbContainer) return

    const tablet = tablets.find(p => p.id === productId)
    if (!tablet) return

    // Create breadcrumb
    breadcrumbContainer.innerHTML = `
      <div class="breadcrumb">
        <a href="#" onclick="closeProductDetailModal()">Bosh sahifa</a>
        <span class="breadcrumb-separator">&gt;</span>
        <a href="#" onclick="closeProductDetailModal()">Planshetlar</a>
        <span class="breadcrumb-separator">&gt;</span>
        <span class="breadcrumb-current">${tablet.name}</span>
      </div>
    `

    // Create product detail content
    productDetailContent.innerHTML = `
      <div class="product-detail">
        <div class="product-detail-gallery">
          <div class="product-detail-badges">
            ${tablet.isNew ? '<span class="product-badge badge-new">Yangi</span>' : ''}
            ${tablet.originalPrice ? '<span class="product-badge badge-sale">Chegirma</span>' : ''}
          </div>
          <div class="product-detail-main-image">
            <img src="${tablet.image}" alt="${tablet.name}">
          </div>
          <div class="product-detail-thumbnails">
            <div class="product-detail-thumbnail active">
              <img src="${tablet.image}" alt="${tablet.name}">
            </div>
            <div class="product-detail-thumbnail">
              <img src="${tablet.image}" alt="${tablet.name}">
            </div>
            <div class="product-detail-thumbnail">
              <img src="${tablet.image}" alt="${tablet.name}">
            </div>
            <div class="product-detail-thumbnail">
              <img src="${tablet.image}" alt="${tablet.name}">
            </div>
          </div>
        </div>
        <div class="product-detail-info">
          <h1 class="product-detail-title">${tablet.name}</h1>
          <div class="product-detail-rating">
            <div class="rating-stars">
              ${generateStars(tablet.rating, true)}
            </div>
            <span class="rating-count">(${tablet.reviewCount})</span>
            <span class="product-detail-reviews">Sharhlar (${tablet.reviewCount})</span>
          </div>
          <div class="product-detail-price">
            <span class="current-price">${tablet.price}</span>
            ${tablet.originalPrice ? `<span class="original-price">${tablet.originalPrice}</span>` : ''}
          </div>
          <div class="product-detail-description">
            <h3>Mahsulot tavsifi</h3>
            <p>Bu planshet haqida batafsil ma'lumot. Mahsulotning asosiy xususiyatlari, afzalliklari va qo'shimcha ma'lumotlar.</p>
            <ul class="product-detail-features">
              <li><i class="fas fa-check"></i> Yuqori sifatli ekran</li>
              <li><i class="fas fa-check"></i> Tezkor protsessor</li>
              <li><i class="fas fa-check"></i> Uzoq muddatli batareya</li>
              <li><i class="fas fa-check"></i> Yengil va nozik dizayn</li>
            </ul>
          </div>
          <div class="product-detail-attributes">
            <div class="attribute-group">
              <h4 class="attribute-title">Rang</h4>
              <div class="attribute-options">
                <div class="attribute-option active">Kumush</div>
                <div class="attribute-option">Qora</div>
                <div class="attribute-option">Oq</div>
              </div>
            </div>
            <div class="attribute-group">
              <h4 class="attribute-title">Xotira</h4>
              <div class="attribute-options">
                <div class="attribute-option active">64GB</div>
                <div class="attribute-option">128GB</div>
                <div class="attribute-option">256GB</div>
              </div>
            </div>
          </div>
          <div class="product-detail-quantity">
            <span class="quantity-label">Miqdori:</span>
            <div class="quantity-control">
              <button class="quantity-btn minus">-</button>
              <input type="number" class="quantity-input" value="1" min="1" max="100">
              <button class="quantity-btn plus">+</button>
            </div>
            <span class="product-detail-stock">Omborda: 35 dona</span>
          </div>
          <div class="product-detail-actions">
            <button class="detail-add-to-cart" data-id="${tablet.id}">Savatga qo'shish</button>
            <button class="detail-buy-now" data-id="${tablet.id}">Hozir sotib olish</button>
            <button class="detail-wishlist" data-id="${tablet.id}"><i class="far fa-heart"></i></button>
          </div>
          <div class="product-detail-delivery">
            <div class="delivery-option">
              <i class="fas fa-truck"></i>
              <div class="delivery-info">
                <h4>Tezkor yetkazib berish</h4>
                <p>1-3 kun ichida</p>
              </div>
            </div>
            <div class="delivery-option">
              <i class="fas fa-undo"></i>
              <div class="delivery-info">
                <h4>Oson qaytarish</h4>
                <p>14 kun ichida</p>
              </div>
            </div>
            <div class="delivery-option">
              <i class="fas fa-shield-alt"></i>
              <div class="delivery-info">
                <h4>Kafolat</h4>
                <p>12 oy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="product-detail-tabs">
        <div class="tabs-header">
          <button class="tab-btn active" data-tab="description">Tavsif</button>
          <button class="tab-btn" data-tab="specifications">Xususiyatlar</button>
          <button class="tab-btn" data-tab="reviews">Sharhlar (${tablet.reviewCount})</button>
        </div>
        <div class="tabs-content">
          <div class="tab-panel active" id="description">
            <h3>Mahsulot tavsifi</h3>
            <p>Bu planshet haqida batafsil ma'lumot. Mahsulotning asosiy xususiyatlari, afzalliklari va qo'shimcha ma'lumotlar.</p>
            <p>Zamonaviy dizayn va yuqori sifatli materiallar bilan ishlab chiqarilgan. Barcha zamonaviy funksiyalar va texnologiyalar mavjud.</p>
          </div>
          <div class="tab-panel" id="specifications">
            <h3>Texnik xususiyatlar</h3>
            <ul>
              <li><strong>Brend:</strong> ${tablet.name.split(' ')[0]}</li>
              <li><strong>Model:</strong> ${tablet.name}</li>
              <li><strong>Protsessor:</strong> A15 Bionic / Snapdragon 8 Gen 2</li>
              <li><strong>RAM:</strong> 8GB/12GB</li>
              <li><strong>Xotira:</strong> 64GB/128GB/256GB</li>
              <li><strong>Ekran:</strong> 10.9" / 12.9" Liquid Retina</li>
              <li><strong>Kamera:</strong> 12MP asosiy kamera</li>
              <li><strong>Operatsion tizim:</strong> iPadOS/Android</li>
            </ul>
          </div>
          <div class="tab-panel" id="reviews">
            <h3>Foydalanuvchi sharhlari</h3>
            <div class="review">
              <div class="review-header">
                <h4>Aziza Rahimova</h4>
                <div class="rating-stars">
                  ${generateStars(5)}
                </div>
              </div>
              <p>Ajoyib planshet! Ekrani juda sifatli, tezkor ishlaydi. O'qish va video ko'rish uchun juda qulay.</p>
            </div>
            <div class="review">
              <div class="review-header">
                <h4>Bobur Karimov</h4>
                <div class="rating-stars">
                  ${generateStars(4)}
                </div>
              </div>
              <p>Yaxshi planshet, lekin narxi biroz qimmat. Sifati esa zo'r, tavsiya qilaman.</p>
            </div>
          </div>
        </div>
      </div>
    `

    // Add event listeners for product detail modal
    addProductDetailEventListeners(tablet)

    // Render recommended products
    renderRecommendedProducts(tablet.id)

    // Show product detail modal
    productDetailModal.classList.add("show")
    document.body.style.overflow = "hidden"
  }

  function addProductDetailEventListeners(tablet) {
    const quantityInput = productDetailContent.querySelector(".quantity-input")
    const minusBtn = productDetailContent.querySelector(".quantity-btn.minus")
    const plusBtn = productDetailContent.querySelector(".quantity-btn.plus")
    const addToCartBtn = productDetailContent.querySelector(".detail-add-to-cart")
    const buyNowBtn = productDetailContent.querySelector(".detail-buy-now")
    const wishlistBtn = productDetailContent.querySelector(".detail-wishlist")
    const attributeOptions = productDetailContent.querySelectorAll(".attribute-option")
    const thumbnails = productDetailContent.querySelectorAll(".product-detail-thumbnail")
    const tabBtns = productDetailContent.querySelectorAll(".tab-btn")
    const tabPanels = productDetailContent.querySelectorAll(".tab-panel")

    if (minusBtn) {
      minusBtn.addEventListener("click", () => {
        if (quantityInput.value > 1) {
          quantityInput.value = parseInt(quantityInput.value) - 1
        }
      })
    }

    if (plusBtn) {
      plusBtn.addEventListener("click", () => {
        quantityInput.value = parseInt(quantityInput.value) + 1
      })
    }

    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", () => {
        const quantity = parseInt(quantityInput.value)
        addToCart(tablet.id, quantity)
        showNotification()
      })
    }

    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", () => {
        const quantity = parseInt(quantityInput.value)
        addToCart(tablet.id, quantity)
        alert("Buyurtma berish sahifasiga o'tkazilmoqda...")
      })
    }

    if (wishlistBtn) {
      wishlistBtn.addEventListener("click", () => {
        toggleWishlist(wishlistBtn)
      })
    }

    attributeOptions.forEach((option) => {
      option.addEventListener("click", () => {
        const parent = option.parentElement
        parent.querySelectorAll(".attribute-option").forEach((opt) => {
          opt.classList.remove("active")
        })
        option.classList.add("active")
      })
    })

    thumbnails.forEach((thumbnail) => {
      thumbnail.addEventListener("click", () => {
        const mainImage = productDetailContent.querySelector(".product-detail-main-image img")
        const thumbnailImage = thumbnail.querySelector("img")

        mainImage.src = thumbnailImage.src

        thumbnails.forEach((t) => t.classList.remove("active"))
        thumbnail.classList.add("active")
      })
    })

    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tab = btn.dataset.tab

        tabBtns.forEach((b) => b.classList.remove("active"))
        btn.classList.add("active")

        tabPanels.forEach((panel) => panel.classList.remove("active"))
        const targetPanel = productDetailContent.querySelector(`#${tab}`)
        if (targetPanel) {
          targetPanel.classList.add("active")
        }
      })
    })
  }

  function renderRecommendedProducts(currentTabletId) {
    if (!recommendedGrid) return

    // Get 4 random tablets excluding the current one
    const otherTablets = tablets.filter(tablet => tablet.id !== currentTabletId)
    const shuffled = otherTablets.sort(() => 0.5 - Math.random())
    const recommended = shuffled.slice(0, 4)

    recommendedGrid.innerHTML = ""
    recommended.forEach(tablet => {
      const tabletCard = createTabletCard(tablet)
      tabletCard.classList.add("recommended-card")
      recommendedGrid.appendChild(tabletCard)
    })
  }

  function closeProductDetailModal() {
    if (!productDetailModal) return

    productDetailModal.classList.remove("show")
    document.body.style.overflow = ""
  }

  // Cart functions
  function addToCart(productId, quantity) {
    const existingProduct = cart.find((item) => item.id === productId)

    if (existingProduct) {
      existingProduct.quantity += quantity
    } else {
      cart.push({ id: productId, quantity })
    }

    saveCart()
    updateCartCount()

    // Render cart
    renderCart()

    // Update cart preview on homepage
    updateCartPreview()
  }

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart))
  }

  function loadCart() {
    const savedCart = localStorage.getItem("cart")
    cart = savedCart ? JSON.parse(savedCart) : []
    updateCartCount()
  }

  function updateCartCount() {
    if (!cartCount) return

    let totalCount = 0
    cart.forEach((item) => {
      totalCount += item.quantity
    })

    cartCount.textContent = totalCount
  }

  function showNotification(message = "Mahsulot savatga qo'shildi!") {
    if (!cartNotification) return

    const notificationContent = cartNotification.querySelector(".notification-content span")
    if (notificationContent) {
      notificationContent.textContent = message
    }

    cartNotification.classList.add("show")

    setTimeout(() => {
      cartNotification.classList.remove("show")
    }, 3000)
  }

  function renderCart() {
    // Cart rendering logic would go here
  }

  function clearCart() {
    cart = []
    saveCart()
    updateCartCount()
    renderCart()
    updateCartPreview()
  }

  function checkout() {
    alert("Buyurtma qabul qilindi!")
    clearCart()
  }

  function updateCartPreview() {
    // Cart preview update logic would go here
  }

  function generateStars(rating, interactive = false) {
    let starsHTML = ''
    for (let i = 1; i <= 5; i++) {
      const filled = i <= rating
      const starClass = interactive ? 'star interactive' : 'star'
      starsHTML += `<i class="fas fa-star ${starClass}" data-rating="${i}" style="color: ${filled ? '#fbbf24' : '#d1d5db'}"></i>`
    }
    return starsHTML
  }

  function handleStarRating(starsContainer, clickedStar) {
    if (!clickedStar.classList.contains("interactive")) return
    
    const rating = parseInt(clickedStar.dataset.rating)
    const stars = starsContainer.querySelectorAll(".star")
    
    stars.forEach((star, index) => {
      if (index < rating) {
        star.style.color = "#fbbf24"
      } else {
        star.style.color = "#d1d5db"
      }
    })
    
    // Show feedback
    showNotification("Baholash uchun rahmat!")
  }

  function toggleWishlist(wishlistBtn) {
    const icon = wishlistBtn.querySelector("i")
    if (icon.classList.contains("far")) {
      icon.classList.remove("far")
      icon.classList.add("fas")
      icon.style.color = "#ef4444"
      showNotification("Sevimlilar ro'yxatiga qo'shildi!")
    } else {
      icon.classList.remove("fas")
      icon.classList.add("far")
      icon.style.color = ""
      showNotification("Sevimlilar ro'yxatidan olib tashlandi!")
    }
  }

  function renderTablets() {
    if (!tabletsGrid || !tabletsGrid2) return

    // Filter tablets
    let filteredTablets = tablets
    
    if (currentFilter === "new") {
      filteredTablets = tablets.filter(tablet => tablet.isNew)
    } else if (currentFilter === "discount") {
      filteredTablets = tablets.filter(tablet => tablet.originalPrice)
    } else if (currentFilter === "popular") {
      filteredTablets = tablets.filter(tablet => tablet.isPopular)
    }

    // Split tablets into two grids
    const firstHalf = filteredTablets.slice(0, Math.ceil(filteredTablets.length / 2))
    const secondHalf = filteredTablets.slice(Math.ceil(filteredTablets.length / 2))

    // Render first grid
    tabletsGrid.innerHTML = ""
    firstHalf.forEach(tablet => {
      const tabletCard = createTabletCard(tablet)
      tabletsGrid.appendChild(tabletCard)
    })

    // Render second grid
    tabletsGrid2.innerHTML = ""
    secondHalf.forEach(tablet => {
      const tabletCard = createTabletCard(tablet)
      tabletsGrid2.appendChild(tabletCard)
    })
  }

  function createTabletCard(tablet) {
    const tabletCard = document.createElement("div")
    tabletCard.className = "product-card"
    tabletCard.dataset.id = tablet.id

    const badgeHTML = tablet.isNew ? '<span class="product-badge badge-new">Yangi</span>' : 
                     tablet.originalPrice ? '<span class="product-badge badge-sale">Chegirma</span>' : ''

    tabletCard.innerHTML = `
      <div class="product-image">
        ${badgeHTML}
        <button class="wishlist-btn">
          <i class="far fa-heart"></i>
        </button>
        <img src="${tablet.image}" alt="${tablet.name}">
      </div>
      <div class="product-details">
        <h3 class="product-title">${tablet.name}</h3>
        <div class="product-rating">
          <div class="rating-stars">
            ${generateStars(tablet.rating, true)}
          </div>
          <span class="rating-count">(${tablet.reviewCount})</span>
        </div>
        <div class="product-price">
          <span class="current-price">${tablet.price}</span>
          ${tablet.originalPrice ? `<span class="original-price">${tablet.originalPrice}</span>` : ''}
        </div>
        <div class="product-actions">
          <button class="add-to-cart">Savatga qo'shish</button>
        </div>
      </div>
    `

    return tabletCard
  }

  function handleContactFormSubmit(e) {
    e.preventDefault()

    const name = document.getElementById("contact-name").value
    const surname = document.getElementById("contact-surname").value
    const email = document.getElementById("contact-email").value
    const message = document.getElementById("contact-message").value

    if (!name || !surname || !email || !message) {
      alert("Iltimos, barcha maydonlarni to'ldiring!")
      return
    }

    setTimeout(() => {
      const successMessage = document.getElementById("contact-success")
      if (successMessage) {
        successMessage.style.display = "block"
        contactForm.reset()

        setTimeout(() => {
          successMessage.style.display = "none"
        }, 5000)
      }
    }, 1000)
  }

  init()
})