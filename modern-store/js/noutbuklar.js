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

  const laptopsGrid = document.getElementById("laptops-grid")
  const laptopsGrid2 = document.getElementById("laptops-grid-2")
  const notificationClose = document.getElementById("notification-close")
  const warningClose = document.getElementById("warning-close")
  const recommendedGrid = document.getElementById("recommended-grid")
  const laptopLinks = document.querySelectorAll(".laptop-link")

  let currentFilter = "all"

  // Laptop data
  const laptops = [
    {
      id: 1,
      name: "MacBook Pro 16\" M3 Max",
      image: "/placeholder.svg?height=250&width=250",
      price: "32 999 000 so'm",
      originalPrice: "35 999 000 so'm",
      rating: 4.9,
      reviewCount: 156,
      isNew: true,
      isPopular: true,
      category: "premium"
    },
    {
      id: 2,
      name: "Dell XPS 15 OLED",
      image: "/placeholder.svg?height=250&width=250",
      price: "28 999 000 so'm",
      originalPrice: "31 999 000 so'm",
      rating: 4.7,
      reviewCount: 124,
      isNew: true,
      isPopular: true,
      category: "premium"
    },
    {
      id: 3,
      name: "ASUS ROG Strix G15",
      image: "/placeholder.svg?height=250&width=250",
      price: "18 999 000 so'm",
      originalPrice: "21 999 000 so'm",
      rating: 4.6,
      reviewCount: 98,
      isNew: false,
      isPopular: true,
      category: "gaming"
    },
    {
      id: 4,
      name: "HP Pavilion 15",
      image: "/placeholder.svg?height=250&width=250",
      price: "12 999 000 so'm",
      originalPrice: "14 999 000 so'm",
      rating: 4.3,
      reviewCount: 87,
      isNew: false,
      isPopular: false,
      category: "mid-range"
    },
    {
      id: 5,
      name: "Lenovo ThinkPad X1 Carbon",
      image: "/placeholder.svg?height=250&width=250",
      price: "24 999 000 so'm",
      originalPrice: "26 999 000 so'm",
      rating: 4.8,
      reviewCount: 142,
      isNew: true,
      isPopular: true,
      category: "business"
    },
    {
      id: 6,
      name: "Acer Nitro 5",
      image: "/placeholder.svg?height=250&width=250",
      price: "15 999 000 so'm",
      originalPrice: "17 999 000 so'm",
      rating: 4.4,
      reviewCount: 76,
      isNew: false,
      isPopular: false,
      category: "gaming"
    },
    {
      id: 7,
      name: "Microsoft Surface Laptop 5",
      image: "/placeholder.svg?height=250&width=250",
      price: "22 999 000 so'm",
      originalPrice: "24 999 000 so'm",
      rating: 4.5,
      reviewCount: 89,
      isNew: true,
      isPopular: true,
      category: "premium"
    },
    {
      id: 8,
      name: "ASUS VivoBook 15",
      image: "/placeholder.svg?height=250&width=250",
      price: "8 999 000 so'm",
      originalPrice: "9 999 000 so'm",
      rating: 4.1,
      reviewCount: 65,
      isNew: false,
      isPopular: false,
      category: "budget"
    },
    {
      id: 9,
      name: "MacBook Air M2",
      image: "/placeholder.svg?height=250&width=250",
      price: "16 999 000 so'm",
      originalPrice: "18 999 000 so'm",
      rating: 4.8,
      reviewCount: 203,
      isNew: false,
      isPopular: true,
      category: "premium"
    },
    {
      id: 10,
      name: "Lenovo IdeaPad 3",
      image: "/placeholder.svg?height=250&width=250",
      price: "7 999 000 so'm",
      originalPrice: "8 999 000 so'm",
      rating: 4.0,
      reviewCount: 54,
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

    // Render laptops
    renderLaptops()
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
          renderLaptops()
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

    // Laptop links
    laptopLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        document.querySelector(".laptops-section").scrollIntoView({
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

    const laptop = laptops.find(p => p.id === productId)
    if (!laptop) return

    // Create breadcrumb
    breadcrumbContainer.innerHTML = `
      <div class="breadcrumb">
        <a href="#" onclick="closeProductDetailModal()">Bosh sahifa</a>
        <span class="breadcrumb-separator">&gt;</span>
        <a href="#" onclick="closeProductDetailModal()">Noutbuklar</a>
        <span class="breadcrumb-separator">&gt;</span>
        <span class="breadcrumb-current">${laptop.name}</span>
      </div>
    `

    // Create product detail content
    productDetailContent.innerHTML = `
      <div class="product-detail">
        <div class="product-detail-gallery">
          <div class="product-detail-badges">
            ${laptop.isNew ? '<span class="product-badge badge-new">Yangi</span>' : ''}
            ${laptop.originalPrice ? '<span class="product-badge badge-sale">Chegirma</span>' : ''}
          </div>
          <div class="product-detail-main-image">
            <img src="${laptop.image}" alt="${laptop.name}">
          </div>
          <div class="product-detail-thumbnails">
            <div class="product-detail-thumbnail active">
              <img src="${laptop.image}" alt="${laptop.name}">
            </div>
            <div class="product-detail-thumbnail">
              <img src="${laptop.image}" alt="${laptop.name}">
            </div>
            <div class="product-detail-thumbnail">
              <img src="${laptop.image}" alt="${laptop.name}">
            </div>
            <div class="product-detail-thumbnail">
              <img src="${laptop.image}" alt="${laptop.name}">
            </div>
          </div>
        </div>
        <div class="product-detail-info">
          <h1 class="product-detail-title">${laptop.name}</h1>
          <div class="product-detail-rating">
            <div class="rating-stars">
              ${generateStars(laptop.rating, true)}
            </div>
            <span class="rating-count">(${laptop.reviewCount})</span>
            <span class="product-detail-reviews">Sharhlar (${laptop.reviewCount})</span>
          </div>
          <div class="product-detail-price">
            <span class="current-price">${laptop.price}</span>
            ${laptop.originalPrice ? `<span class="original-price">${laptop.originalPrice}</span>` : ''}
          </div>
          <div class="product-detail-description">
            <h3>Mahsulot tavsifi</h3>
            <p>Bu noutbuk haqida batafsil ma'lumot. Mahsulotning asosiy xususiyatlari, afzalliklari va qo'shimcha ma'lumotlar.</p>
            <ul class="product-detail-features">
              <li><i class="fas fa-check"></i> Yuqori unumdorlik</li>
              <li><i class="fas fa-check"></i> Zamonaviy dizayn</li>
              <li><i class="fas fa-check"></i> Uzoq muddatli batareya</li>
              <li><i class="fas fa-check"></i> Yengil va nozik</li>
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
                <div class="attribute-option active">256GB</div>
                <div class="attribute-option">512GB</div>
                <div class="attribute-option">1TB</div>
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
            <span class="product-detail-stock">Omborda: 25 dona</span>
          </div>
          <div class="product-detail-actions">
            <button class="detail-add-to-cart" data-id="${laptop.id}">Savatga qo'shish</button>
            <button class="detail-buy-now" data-id="${laptop.id}">Hozir sotib olish</button>
            <button class="detail-wishlist" data-id="${laptop.id}"><i class="far fa-heart"></i></button>
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
                <p>24 oy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="product-detail-tabs">
        <div class="tabs-header">
          <button class="tab-btn active" data-tab="description">Tavsif</button>
          <button class="tab-btn" data-tab="specifications">Xususiyatlar</button>
          <button class="tab-btn" data-tab="reviews">Sharhlar (${laptop.reviewCount})</button>
        </div>
        <div class="tabs-content">
          <div class="tab-panel active" id="description">
            <h3>Mahsulot tavsifi</h3>
            <p>Bu noutbuk haqida batafsil ma'lumot. Mahsulotning asosiy xususiyatlari, afzalliklari va qo'shimcha ma'lumotlar.</p>
            <p>Zamonaviy dizayn va yuqori sifatli materiallar bilan ishlab chiqarilgan. Barcha zamonaviy funksiyalar va texnologiyalar mavjud.</p>
          </div>
          <div class="tab-panel" id="specifications">
            <h3>Texnik xususiyatlar</h3>
            <ul>
              <li><strong>Brend:</strong> ${laptop.name.split(' ')[0]}</li>
              <li><strong>Model:</strong> ${laptop.name}</li>
              <li><strong>Protsessor:</strong> Intel Core i7 / AMD Ryzen 7</li>
              <li><strong>RAM:</strong> 16GB/32GB</li>
              <li><strong>Xotira:</strong> 512GB/1TB SSD</li>
              <li><strong>Ekran:</strong> 15.6" Full HD/4K</li>
              <li><strong>Videokarta:</strong> Integrated/Dedicated</li>
              <li><strong>Operatsion tizim:</strong> Windows 11/macOS</li>
            </ul>
          </div>
          <div class="tab-panel" id="reviews">
            <h3>Foydalanuvchi sharhlari</h3>
            <div class="review">
              <div class="review-header">
                <h4>Sardor Aliyev</h4>
                <div class="rating-stars">
                  ${generateStars(5)}
                </div>
              </div>
              <p>Ajoyib noutbuk! Tezkor ishlaydi, dizayni chiroyli. Ishda va o'qishda juda qulay.</p>
            </div>
            <div class="review">
              <div class="review-header">
                <h4>Nilufar Karimova</h4>
                <div class="rating-stars">
                  ${generateStars(4)}
                </div>
              </div>
              <p>Yaxshi noutbuk, lekin narxi biroz qimmat. Sifati esa zo'r, tavsiya qilaman.</p>
            </div>
          </div>
        </div>
      </div>
    `

    // Add event listeners for product detail modal
    addProductDetailEventListeners(laptop)

    // Render recommended products
    renderRecommendedProducts(laptop.id)

    // Show product detail modal
    productDetailModal.classList.add("show")
    document.body.style.overflow = "hidden"
  }

  function addProductDetailEventListeners(laptop) {
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
        addToCart(laptop.id, quantity)
        showNotification()
      })
    }

    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", () => {
        const quantity = parseInt(quantityInput.value)
        addToCart(laptop.id, quantity)
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

  function renderRecommendedProducts(currentLaptopId) {
    if (!recommendedGrid) return

    // Get 4 random laptops excluding the current one
    const otherLaptops = laptops.filter(laptop => laptop.id !== currentLaptopId)
    const shuffled = otherLaptops.sort(() => 0.5 - Math.random())
    const recommended = shuffled.slice(0, 4)

    recommendedGrid.innerHTML = ""
    recommended.forEach(laptop => {
      const laptopCard = createLaptopCard(laptop)
      laptopCard.classList.add("recommended-card")
      recommendedGrid.appendChild(laptopCard)
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

  function renderLaptops() {
    if (!laptopsGrid || !laptopsGrid2) return

    // Filter laptops
    let filteredLaptops = laptops
    
    if (currentFilter === "new") {
      filteredLaptops = laptops.filter(laptop => laptop.isNew)
    } else if (currentFilter === "discount") {
      filteredLaptops = laptops.filter(laptop => laptop.originalPrice)
    } else if (currentFilter === "popular") {
      filteredLaptops = laptops.filter(laptop => laptop.isPopular)
    }

    // Split laptops into two grids
    const firstHalf = filteredLaptops.slice(0, Math.ceil(filteredLaptops.length / 2))
    const secondHalf = filteredLaptops.slice(Math.ceil(filteredLaptops.length / 2))

    // Render first grid
    laptopsGrid.innerHTML = ""
    firstHalf.forEach(laptop => {
      const laptopCard = createLaptopCard(laptop)
      laptopsGrid.appendChild(laptopCard)
    })

    // Render second grid
    laptopsGrid2.innerHTML = ""
    secondHalf.forEach(laptop => {
      const laptopCard = createLaptopCard(laptop)
      laptopsGrid2.appendChild(laptopCard)
    })
  }

  function createLaptopCard(laptop) {
    const laptopCard = document.createElement("div")
    laptopCard.className = "product-card"
    laptopCard.dataset.id = laptop.id

    const badgeHTML = laptop.isNew ? '<span class="product-badge badge-new">Yangi</span>' : 
                     laptop.originalPrice ? '<span class="product-badge badge-sale">Chegirma</span>' : ''

    laptopCard.innerHTML = `
      <div class="product-image">
        ${badgeHTML}
        <button class="wishlist-btn">
          <i class="far fa-heart"></i>
        </button>
        <img src="${laptop.image}" alt="${laptop.name}">
      </div>
      <div class="product-details">
        <h3 class="product-title">${laptop.name}</h3>
        <div class="product-rating">
          <div class="rating-stars">
            ${generateStars(laptop.rating, true)}
          </div>
          <span class="rating-count">(${laptop.reviewCount})</span>
        </div>
        <div class="product-price">
          <span class="current-price">${laptop.price}</span>
          ${laptop.originalPrice ? `<span class="original-price">${laptop.originalPrice}</span>` : ''}
        </div>
        <div class="product-actions">
          <button class="add-to-cart">Savatga qo'shish</button>
        </div>
      </div>
    `

    return laptopCard
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