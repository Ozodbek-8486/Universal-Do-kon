document.addEventListener("DOMContentLoaded", () => {
  const welcomeOverlay = document.getElementById("welcome-overlay")

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

  let currentSlide = 0
  let cart = []
  let currentLang = localStorage.getItem("language") || "uz"
  let currentBreadcrumb = []

  // Declare languageBtn, languageOptions, and translations
  const languageBtn = document.getElementById("language-btn")
  const languageOptions = document.querySelectorAll(".language-option")

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

    // Hero slider
    if (heroSlider) {
      // Auto slide
      setInterval(() => {
        changeSlide(1)
      }, 5000)

      // Slider controls
      if (prevArrow) {
        prevArrow.addEventListener("click", () => changeSlide(-1))
      }

      if (nextArrow) {
        nextArrow.addEventListener("click", () => changeSlide(1))
      }

      if (sliderDots) {
        sliderDots.forEach((dot, index) => {
          dot.addEventListener("click", () => goToSlide(index))
        })
      }
    }

    // Filter buttons
    if (filterBtns) {
      filterBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          filterBtns.forEach((b) => b.classList.remove("active"))
          btn.classList.add("active")

          const filter = btn.textContent.toLowerCase()
          filterProducts(filter)
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
        if (e.target === productDetailModal) {
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
    if (!translations[currentLang]) return

    const trans = translations[currentLang]

    // Update navigation
    const navLinks = document.querySelectorAll(".nav-link")
    navLinks.forEach((link) => {
      const text = link.textContent.trim().toLowerCase()
      if (text === "bosh sahifa" || text === "главная" || text === "home") {
        link.textContent = trans.home
      } else if (text.includes("kategoriyalar") || text.includes("категории") || text.includes("categories")) {
        // Keep the chevron icon
        const hasChevron = link.innerHTML.includes("fa-chevron-down")
        link.textContent = trans.categories
        if (hasChevron) {
          link.innerHTML += ' <i class="fas fa-chevron-down"></i>'
        }
      } else if (text === "yangiliklar" || text === "новости" || text === "news") {
        link.textContent = trans.news
      } else if (text === "chegirmalar" || text === "скидки" || text === "discounts") {
        link.textContent = trans.discounts
      } else if (text === "ko'p sotilgan" || text === "бестселлеры" || text === "bestsellers") {
        link.textContent = trans.bestsellers
      } else if (text === "yangi kelgan" || text === "новинки" || text === "new arrivals") {
        link.textContent = trans.new_arrivals
      } else if (text === "aksiyalar" || text === "акции" || text === "promotions") {
        link.textContent = trans.promotions
      } else if (text === "biz haqimizda" || text === "о нас" || text === "about us") {
        link.textContent = trans.about_us
      } else if (text === "aloqa" || text === "контакты" || text === "contact") {
        link.textContent = trans.contact
      } else if (text === "kirish" || text === "вход" || text === "login") {
        link.textContent = trans.login
      }
    })

    // Update login and register buttons
    const loginBtn = document.getElementById("login-btn")
    const registerBtn = document.getElementById("register-btn")

    if (loginBtn) {
      loginBtn.textContent = trans.login
    }

    if (registerBtn) {
      registerBtn.textContent = trans.register
    }

    // Update dropdown titles
    const dropdownTitles = document.querySelectorAll(".dropdown-title")
    dropdownTitles.forEach((title) => {
      const text = title.textContent.trim().toLowerCase()
      if (text === "elektronika" || text === "электроника" || text === "electronics") {
        title.textContent = trans.electronics
      } else if (text === "kompyuter texnikasi" || text === "компьютерная техника" || text === "computer hardware") {
        title.textContent = trans.computer_hardware
      } else if (text === "maishiy texnika" || text === "бытовая техника" || text === "home appliances") {
        title.textContent = trans.home_appliances
      }
    })

    // Update dropdown lists
    const dropdownItems = document.querySelectorAll(".dropdown-list a")
    dropdownItems.forEach((item) => {
      const text = item.textContent.trim().toLowerCase()
      if (text === "smartfonlar" || text === "смартфоны" || text === "smartphones") {
        item.textContent = trans.smartphones
      } else if (text === "noutbuklar" || text === "ноутбуки" || text === "laptops") {
        item.textContent = trans.laptops
      } else if (text === "planshetlar" || text === "планшеты" || text === "tablets") {
        item.textContent = trans.tablets
      } else if (text === "televizorlar" || text === "телевизоры" || text === "tvs") {
        item.textContent = trans.tvs
      } else if (text === "kameralar" || text === "камеры" || text === "cameras") {
        item.textContent = trans.cameras
      } else if (text === "protsessorlar" || text === "процессоры" || text === "processors") {
        item.textContent = trans.processors
      } else if (text === "videokartalar" || text === "видеокарты" || text === "video cards") {
        item.textContent = trans.video_cards
      } else if (text === "monitorlar" || text === "мониторы" || text === "monitors") {
        item.textContent = trans.monitors
      } else if (text === "klaviaturalar" || text === "клавиатуры" || text === "keyboards") {
        item.textContent = trans.keyboards
      } else if (text === "sichqonchalar" || text === "мыши" || text === "mice") {
        item.textContent = trans.mice
      } else if (text === "muzlatgichlar" || text === "холодильники" || text === "refrigerators") {
        item.textContent = trans.refrigerators
      } else if (text === "kir yuvish mashinalari" || text === "стиральные машины" || text === "washing machines") {
        item.textContent = trans.washing_machines
      } else if (text === "gaz plitalari" || text === "плиты" || text === "stoves") {
        item.textContent = trans.stoves
      } else if (text === "konditsionerlar" || text === "кондиционеры" || text === "air conditioners") {
        item.textContent = trans.air_conditioners
      } else if (text === "changyutgichlar" || text === "пылесосы" || text === "vacuum cleaners") {
        item.textContent = trans.vacuum_cleaners
      }
    })

    // Update hero section
    const slideTitles = document.querySelectorAll(".slide-title")
    const slideDescriptions = document.querySelectorAll(".slide-description")
    const slideBtns = document.querySelectorAll(".slide-btn")

    if (slideTitles.length >= 3 && slideDescriptions.length >= 3 && slideBtns.length >= 3) {
      slideTitles[0].textContent = trans.latest_tech
      slideDescriptions[0].textContent = trans.modern_gadgets
      slideBtns[0].textContent = trans.shop_now

      slideTitles[1].textContent = trans.special_offers
      slideDescriptions[1].textContent = trans.discounts_promotions
      slideBtns[1].textContent = trans.shop_now

      slideTitles[2].textContent = trans.new_collection
      slideDescriptions[2].textContent = trans.latest_models
      slideBtns[2].textContent = trans.shop_now
    }

    // Update categories section
    const categoriesTitle = document.querySelector(".categories-section .section-title")
    if (categoriesTitle) {
      categoriesTitle.textContent = trans.main_categories
    }

    const categoryTitles = document.querySelectorAll(".category-title")
    categoryTitles.forEach((title) => {
      const text = title.textContent.trim().toLowerCase()
      if (text === "smartfonlar" || text === "смартфоны" || text === "smartphones") {
        title.textContent = trans.smartphones
      } else if (text === "noutbuklar" || text === "ноутбуки" || text === "laptops") {
        title.textContent = trans.laptops
      } else if (text === "planshetlar" || text === "планшеты" || text === "tablets") {
        title.textContent = trans.tablets
      } else if (text === "televizorlar" || text === "телевизоры" || text === "tvs") {
        title.textContent = trans.tvs
      } else if (text === "audio" || text === "аудио" || text === "audio") {
        title.textContent = trans.audio
      } else if (text === "kameralar" || text === "камеры" || text === "cameras") {
        title.textContent = trans.cameras
      }
    })

    // Update products section
    const productsTitle = document.querySelector(".products-section .section-title")
    if (productsTitle) {
      productsTitle.textContent = trans.popular_products
    }

    const filterButtons = document.querySelectorAll(".filter-btn")
    if (filterButtons.length >= 4) {
      filterButtons[0].textContent = trans.all
      filterButtons[1].textContent = trans.new
      filterButtons[2].textContent = trans.discount
      filterButtons[3].textContent = trans.best
    }

    const addToCartButtons = document.querySelectorAll(".add-to-cart")
    addToCartButtons.forEach((button) => {
      button.textContent = trans.add_to_cart
    })

    const loadMoreButton = document.querySelector(".load-more-btn")
    if (loadMoreButton) {
      loadMoreButton.textContent = trans.show_more
    }

    // Update banner section
    const bannerTitle = document.querySelector(".banner-title")
    const bannerDescription = document.querySelector(".banner-description")
    const bannerBtn = document.querySelector(".banner-btn")

    if (bannerTitle) bannerTitle.textContent = trans.new_iphone
    if (bannerDescription) bannerDescription.textContent = trans.powerful_processor
    if (bannerBtn) bannerBtn.textContent = trans.buy_now

    // Update new arrivals section
    const newArrivalsTitle = document.querySelector(".products-section:nth-of-type(4) .section-title")
    if (newArrivalsTitle) {
      newArrivalsTitle.textContent = trans.new_arrivals
    }

    // Update features section
    const featureTitles = document.querySelectorAll(".feature-title")
    const featureDescriptions = document.querySelectorAll(".feature-description")

    if (featureTitles.length >= 4 && featureDescriptions.length >= 4) {
      featureTitles[0].textContent = trans.fast_delivery
      featureDescriptions[0].textContent = trans.fast_delivery_desc

      featureTitles[1].textContent = trans.secure_payment
      featureDescriptions[1].textContent = trans.secure_payment_desc

      featureTitles[2].textContent = trans.support
      featureDescriptions[2].textContent = trans.support_desc

      featureTitles[3].textContent = trans.easy_return
      featureDescriptions[3].textContent = trans.easy_return_desc
    }

    // Update newsletter section
    const newsletterTitle = document.querySelector(".newsletter-title")
    const newsletterDescription = document.querySelector(".newsletter-description")
    const newsletterInput = document.querySelector(".newsletter-input")
    const newsletterBtn = document.querySelector(".newsletter-btn")

    if (newsletterTitle) newsletterTitle.textContent = trans.stay_updated
    if (newsletterDescription) newsletterDescription.textContent = trans.newsletter_desc
    if (newsletterInput) newsletterInput.placeholder = trans.email_placeholder
    if (newsletterBtn) newsletterBtn.textContent = trans.subscribe

    // Update footer
    const footerDescription = document.querySelector(".footer-description")
    if (footerDescription) footerDescription.textContent = trans.store_desc

    const footerHeadings = document.querySelectorAll(".footer-heading")
    footerHeadings.forEach((heading) => {
      const text = heading.textContent.trim().toLowerCase()
      if (text === "kategoriyalar" || text === "категории" || text === "categories") {
        heading.textContent = trans.categories
      } else if (text === "ma'lumot" || text === "информация" || text === "information") {
        heading.textContent = trans.information
      } else if (text === "mijozlarga xizmat" || text === "обслуживание клиентов" || text === "customer service") {
        heading.textContent = trans.customer_service
      } else if (text === "biz bilan bog'lanish" || text === "связаться с нами" || text === "contact us") {
        heading.textContent = trans.contact_us
      }
    })

    // Update footer links
    const footerLinks = document.querySelectorAll(".footer-links a")
    footerLinks.forEach((link) => {
      const text = link.textContent.trim().toLowerCase()

      // Categories
      if (text === "smartfonlar" || text === "смартфоны" || text === "smartphones") {
        link.textContent = trans.smartphones
      } else if (text === "noutbuklar" || text === "ноутбуки" || text === "laptops") {
        link.textContent = trans.laptops
      } else if (text === "planshetlar" || text === "планшеты" || text === "tablets") {
        link.textContent = trans.tablets
      } else if (text === "televizorlar" || text === "телевизоры" || text === "tvs") {
        link.textContent = trans.tvs
      } else if (text === "audio" || text === "аудио" || text === "audio") {
        link.textContent = trans.audio
      } else if (text === "kameralar" || text === "камеры" || text === "cameras") {
        link.textContent = trans.cameras
      } else if (text === "aksessuarlar" || text === "аксессуары" || text === "accessories") {
        link.textContent = trans.accessories
      }

      // Information
      else if (text === "biz haqimizda" || text === "о нас" || text === "about us") {
        link.textContent = trans.about_us
      } else if (text === "yetkazib berish" || text === "доставка" || text === "delivery") {
        link.textContent = trans.delivery
      } else if (text === "to'lov usullari" || text === "способы оплаты" || text === "payment methods") {
        link.textContent = trans.payment_methods
      } else if (text === "kafolat shartlari" || text === "условия гарантии" || text === "warranty terms") {
        link.textContent = trans.warranty
      } else if (text === "maxfiylik siyosati" || text === "политика конфиденциальности" || text === "privacy policy") {
        link.textContent = trans.privacy_policy
      } else if (text === "foydalanish shartlari" || text === "условия использования" || text === "terms of use") {
        link.textContent = trans.terms
      } else if (text === "ko'p so'raladigan savollar" || text === "часто задаваемые вопросы" || text === "faq") {
        link.textContent = trans.faq
      }

      // Customer Service
      else if (text === "mening hisobim" || text === "мой аккаунт" || text === "my account") {
        link.textContent = trans.my_account
      } else if (text === "buyurtmalar tarixi" || text === "история заказов" || text === "order history") {
        link.textContent = trans.order_history
      } else if (text === "istaklar ro'yxati" || text === "список желаний" || text === "wishlist") {
        link.textContent = trans.wishlist
      } else if (text === "qaytarish" || text === "возвраты" || text === "returns") {
        link.textContent = trans.returns
      } else if (text === "qo'llab-quvvatlash" || text === "поддержка" || text === "support") {
        link.textContent = trans.support
      } else if (text === "shikoyatlar" || text === "жалобы" || text === "complaints") {
        link.textContent = trans.complaints
      } else if (text === "aloqa" || text === "контакты" || text === "contact") {
        link.textContent = trans.contact
      }
    })

    // Update contact info
    const contactInfo = document.querySelectorAll(".contact-info li")
    if (contactInfo.length >= 4) {
      // Only update the working hours text
      const workingHoursSpan = contactInfo[3].querySelector("span")
      if (workingHoursSpan) {
        workingHoursSpan.textContent = trans.working_hours
      }
    }

    // Update app downloads
    const appDownloadsTitle = document.querySelector(".app-downloads h4")
    if (appDownloadsTitle) {
      appDownloadsTitle.textContent = trans.download_app
    }

    // Update payment methods and partners
    const paymentMethodsTitle = document.querySelector(".payment-methods h4")
    if (paymentMethodsTitle) {
      paymentMethodsTitle.textContent = trans.payment_methods
    }

    const partnersTitle = document.querySelector(".partners h4")
    if (partnersTitle) {
      partnersTitle.textContent = trans.partners
    }

    // Update copyright
    const copyright = document.querySelector(".copyright")
    if (copyright) {
      copyright.textContent = trans.copyright
    }

    // Update footer nav
    const footerNavLinks = document.querySelectorAll(".footer-nav a")
    if (footerNavLinks.length >= 3) {
      footerNavLinks[0].textContent = trans.privacy_policy
      footerNavLinks[1].textContent = trans.terms
      footerNavLinks[2].textContent = "Sayt xaritasi" // Site map - not in translations
    }

    // Update cart notification
    const cartNotificationText = document.querySelector(".notification-content span")
    if (cartNotificationText) {
      cartNotificationText.textContent = trans.cart_added
    }

    // Update contact form
    const contactFormTitle = document.querySelector(".contact-form-title")
    if (contactFormTitle) {
      contactFormTitle.textContent = trans.contact_us
    }

    const contactNameLabel = document.querySelector('label[for="contact-name"]')
    if (contactNameLabel) {
      contactNameLabel.textContent = trans.name
    }

    const contactSurnameLabel = document.querySelector('label[for="contact-surname"]')
    if (contactSurnameLabel) {
      contactSurnameLabel.textContent = trans.surname
    }

    const contactEmailLabel = document.querySelector('label[for="contact-email"]')
    if (contactEmailLabel) {
      contactEmailLabel.textContent = trans.email
    }

    const contactMessageLabel = document.querySelector('label[for="contact-message"]')
    if (contactMessageLabel) {
      contactMessageLabel.textContent = trans.message
    }

    const contactSubmitBtn = document.querySelector('#contact-form button[type="submit"]')
    if (contactSubmitBtn) {
      contactSubmitBtn.textContent = trans.send_message
    }

    const contactSuccessMessage = document.querySelector("#contact-success")
    if (contactSuccessMessage) {
      contactSuccessMessage.textContent = trans.message_sent
    }
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

  // Toggle mobile menu
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

  // Slider functions
  function changeSlide(direction) {
    if (!sliderDots) return

    const slidesCount = sliderDots.length
    currentSlide = (currentSlide + direction + slidesCount) % slidesCount
    goToSlide(currentSlide)
  }

  function goToSlide(slideIndex) {
    if (!heroSlider || !sliderDots) return

    const slides = heroSlider.querySelectorAll(".slide")

    slides.forEach((slide, index) => {
      slide.classList.remove("active")
      if (index === slideIndex) {
        slide.classList.add("active")
      }
    })

    sliderDots.forEach((dot, index) => {
      dot.classList.remove("active")
      if (index === slideIndex) {
        dot.classList.add("active")
      }
    })

    currentSlide = slideIndex
  }

  // Filter products
  function filterProducts(filter) {
    if (!productsGrid) return

    const productCards = productsGrid.querySelectorAll(".product-card")

    productCards.forEach((card) => {
      if (filter === "hammasi" || filter === "все" || filter === "all") {
        card.style.display = "block"
      } else if ((filter === "yangi" || filter === "новые" || filter === "new") && card.querySelector(".badge-new")) {
        card.style.display = "block"
      } else if (
        (filter === "chegirma" || filter === "скидки" || filter === "discount") &&
        card.querySelector(".badge-sale")
      ) {
        card.style.display = "block"
      } else if (filter === "eng yaxshi" || filter === "лучшие" || filter === "best") {
        // Assuming products with rating >= 4.8 are "best"
        // You might need to add a data attribute for this in your HTML
        card.style.display = "block"
      } else {
        card.style.display = "none"
      }
    })
  }

  // Load more products
  function loadMoreProducts() {
    // Since we now have static products, this would need to be implemented differently
    // For example, you could have hidden products that you show when this is clicked
    const message =
      currentLang === "uz"
        ? "Ko'proq mahsulotlar yuklash funksiyasi statik HTML uchun qayta ishlanishi kerak"
        : currentLang === "ru"
          ? "Функция загрузки дополнительных товаров должна быть переработана для статического HTML"
          : "The load more products function needs to be reworked for static HTML"

    alert(message)
  }

  // Product modal
  function openProductModal(productId) {
    if (!productModal || !modalBody) return

    // Find the product card with the matching ID
    const productCard = document.querySelector(`.product-card[data-id="${productId}"]`)

    if (!productCard) return

    const trans = translations[currentLang]

    // Extract product information from the card
    const productTitle = productCard.querySelector(".product-title").textContent
    const productImage = productCard.querySelector(".product-image img").src
    const productPrice = productCard.querySelector(".current-price").textContent
    const productOriginalPrice = productCard.querySelector(".original-price")?.textContent || ""
    const productRating = productCard.querySelector(".rating-stars").innerHTML
    const productRatingCount = productCard.querySelector(".rating-count").textContent
    const isNewProduct = productCard.querySelector(".badge-new") !== null

    // Create breadcrumb for product
    const productBreadcrumb = [...currentBreadcrumb]
    productBreadcrumb.push({ text: productTitle, url: "#" })

    // Create breadcrumb HTML
    let breadcrumbHTML = '<ul class="product-breadcrumb">'
    productBreadcrumb.forEach((item, index) => {
      breadcrumbHTML += `<li><a href="${item.url}">${item.text}</a></li>`
      if (index < productBreadcrumb.length - 1) {
        breadcrumbHTML += '<li class="separator"><i class="fas fa-chevron-right"></i></li>'
      }
    })
    breadcrumbHTML += "</ul>"

    // Create modal content
    modalBody.innerHTML = `
      ${breadcrumbHTML}
      <div class="modal-product">
        <div class="modal-product-gallery">
          <div class="modal-product-main-image">
            <img src="${productImage}" alt="${productTitle}">
            ${isNewProduct ? '<span class="modal-product-badge badge-new">Yangi</span>' : ""}
          </div>
          <div class="modal-product-thumbnails">
            <div class="modal-product-thumbnail active">
              <img src="${productImage}" alt="${productTitle}">
            </div>
            <div class="modal-product-thumbnail">
              <img src="${productImage}" alt="${productTitle}">
            </div>
            <div class="modal-product-thumbnail">
              <img src="${productImage}" alt="${productTitle}">
            </div>
          </div>
        </div>
        <div class="modal-product-info">
          <h2 class="modal-product-title">${productTitle}</h2>
          <div class="modal-product-rating">
            <div class="rating-stars">
              ${productRating}
            </div>
            <span class="rating-count">${productRatingCount} ${trans.ratings}</span>
          </div>
          <div class="modal-product-price">
            <span class="current-price">${productPrice}</span>
            ${productOriginalPrice ? `<span class="original-price">${productOriginalPrice}</span>` : ""}
          </div>
          <p class="modal-product-description">${trans.product_description}</p>
          <div class="modal-product-attributes">
            <div class="attribute-group">
              <h4 class="attribute-title">${trans.color}</h4>
              <div class="attribute-options">
                <div class="attribute-option active">${trans.black}</div>
                <div class="attribute-option">${trans.silver}</div>
                <div class="attribute-option">${trans.gold}</div>
              </div>
            </div>
            <div class="attribute-group">
              <h4 class="attribute-title">${trans.storage}</h4>
              <div class="attribute-options">
                <div class="attribute-option active">128GB</div>
                <div class="attribute-option">256GB</div>
                <div class="attribute-option">512GB</div>
              </div>
            </div>
          </div>
          <div class="modal-product-quantity">
            <span class="quantity-label">${trans.quantity}:</span>
            <div class="quantity-control">
              <button class="quantity-btn minus">-</button>
              <input type="number" class="quantity-input" value="1" min="1" max="100">
              <button class="quantity-btn plus">+</button>
            </div>
          </div>
          <div class="modal-product-actions">
            <button class="modal-add-to-cart" data-id="${productId}">${trans.add_to_cart}</button>
            <button class="modal-buy-now" data-id="${productId}">${trans.buy_now}</button>
          </div>
        </div>
      </div>
    `

    // Add event listeners for modal
    const quantityInput = modalBody.querySelector(".quantity-input")
    const minusBtn = modalBody.querySelector(".quantity-btn.minus")
    const plusBtn = modalBody.querySelector(".quantity-btn.plus")
    const addToCartBtn = modalBody.querySelector(".modal-add-to-cart")
    const buyNowBtn = modalBody.querySelector(".modal-buy-now")
    const attributeOptions = modalBody.querySelectorAll(".attribute-option")
    const thumbnails = modalBody.querySelectorAll(".modal-product-thumbnail")

    minusBtn.addEventListener("click", () => {
      if (quantityInput.value > 1) {
        quantityInput.value = Number.parseInt(quantityInput.value) - 1
      }
    })

    plusBtn.addEventListener("click", () => {
      quantityInput.value = Number.parseInt(quantityInput.value) + 1
    })

    addToCartBtn.addEventListener("click", () => {
      const quantity = Number.parseInt(quantityInput.value)
      addToCart(productId, quantity)
      showNotification()
    })

    buyNowBtn.addEventListener("click", () => {
      const quantity = Number.parseInt(quantityInput.value)
      addToCart(productId, quantity)
      window.location.href = "cart.html"
    })

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
        const mainImage = modalBody.querySelector(".modal-product-main-image img")
        const thumbnailImage = thumbnail.querySelector("img")

        mainImage.src = thumbnailImage.src

        thumbnails.forEach((t) => t.classList.remove("active"))
        thumbnail.classList.add("active")
      })
    })

    // Show modal
    productModal.classList.add("show")
    document.body.style.overflow = "hidden"
  }

  function closeProductModal() {
    if (!productModal) return

    productModal.classList.remove("show")
    document.body.style.overflow = ""
  }

  // Product detail modal
  function openProductDetailModal(productId) {
    if (!productDetailModal || !productDetailContent || !breadcrumbContainer) return

    // Find the product card with the matching ID
    const productCard = document.querySelector(`.product-card[data-id="${productId}"]`)

    if (!productCard) return

    // Extract product information from the card
    const productTitle = productCard.querySelector(".product-title").textContent
    const productImage = productCard.querySelector(".product-image img").src
    const productPrice = productCard.querySelector(".current-price").textContent
    const productOriginalPrice = productCard.querySelector(".original-price")?.textContent || ""
    const productRating = productCard.querySelector(".rating-stars").innerHTML
    const productRatingCount = productCard.querySelector(".rating-count").textContent
    const isNew = productCard.querySelector(".badge-new") !== null
    const isSale = productCard.querySelector(".badge-sale") !== null

    // Create breadcrumb navigation
    breadcrumbContainer.innerHTML = `
      <div class="breadcrumb">
        <a href="index.html">Bosh sahifa</a>
        <span class="breadcrumb-separator">&gt;</span>
        <a href="#">Barcha toifalar</a>
        <span class="breadcrumb-separator">&gt;</span>
        <a href="#">Elektronika</a>
        <span class="breadcrumb-separator">&gt;</span>
        <span class="breadcrumb-current">${productTitle}</span>
      </div>
    `

    // Create product detail content
    productDetailContent.innerHTML = `
      <div class="product-detail">
        <div class="product-detail-gallery">
          <div class="product-detail-badges">
            ${isNew ? '<span class="product-badge badge-new">Yangi</span>' : ""}
            ${isSale ? '<span class="product-badge badge-sale">Chegirma</span>' : ""}
          </div>
          <div class="product-detail-main-image">
            <img src="${productImage}" alt="${productTitle}">
          </div>
          <div class="product-detail-thumbnails">
            <div class="product-detail-thumbnail active">
              <img src="${productImage}" alt="${productTitle}">
            </div>
            <div class="product-detail-thumbnail">
              <img src="${productImage}" alt="${productTitle}">
            </div>
            <div class="product-detail-thumbnail">
              <img src="${productImage}" alt="${productTitle}">
            </div>
            <div class="product-detail-thumbnail">
              <img src="${productImage}" alt="${productTitle}">
            </div>
          </div>
        </div>
        <div class="product-detail-info">
          <h1 class="product-detail-title">${productTitle}</h1>
          <div class="product-detail-rating">
            <div class="rating-stars">
              ${productRating}
            </div>
            <span class="rating-count">${productRatingCount}</span>
            <span class="product-detail-reviews">Sharhlar (24)</span>
          </div>
          <div class="product-detail-price">
            <span class="current-price">${productPrice}</span>
            ${productOriginalPrice ? `<span class="original-price">${productOriginalPrice}</span>` : ""}
          </div>
          <div class="product-detail-description">
            <h3>Mahsulot tavsifi</h3>
            <p>Bu mahsulot haqida batafsil ma'lumot. Mahsulotning asosiy xususiyatlari, afzalliklari va qo'shimcha ma'lumotlar.</p>
            <ul class="product-detail-features">
              <li><i class="fas fa-check"></i> Yuqori sifatli</li>
              <li><i class="fas fa-check"></i> Ishonchli</li>
              <li><i class="fas fa-check"></i> Uzoq muddatli</li>
              <li><i class="fas fa-check"></i> Zamonaviy dizayn</li>
            </ul>
          </div>
          <div class="product-detail-attributes">
            <div class="attribute-group">
              <h4 class="attribute-title">Rang</h4>
              <div class="attribute-options">
                <div class="attribute-option active">Qora</div>
                <div class="attribute-option">Kumush</div>
                <div class="attribute-option">Oltin</div>
              </div>
            </div>
            <div class="attribute-group">
              <h4 class="attribute-title">Xotira</h4>
              <div class="attribute-options">
                <div class="attribute-option active">128GB</div>
                <div class="attribute-option">256GB</div>
                <div class="attribute-option">512GB</div>
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
            <span class="product-detail-stock">Omborda: 45 dona</span>
          </div>
          <div class="product-detail-actions">
            <button class="detail-add-to-cart" data-id="${productId}">Savatga qo'shish</button>
            <button class="detail-buy-now" data-id="${productId}">Hozir sotib olish</button>
            <button class="detail-wishlist" data-id="${productId}"><i class="far fa-heart"></i></button>
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
          <button class="tab-btn" data-tab="reviews">Sharhlar (24)</button>
        </div>
        <div class="tabs-content">
          <div class="tab-panel active" id="description">
            <h3>Mahsulot tavsifi</h3>
            <p>Bu mahsulot haqida batafsil ma'lumot. Mahsulotning asosiy xususiyatlari, afzalliklari va qo'shimcha ma'lumotlar.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.</p>
          </div>
          <div class="tab-panel" id="specifications">
            <h3>Xususiyatlar</h3>
            <ul>
              <li>Brend: Apple</li>
              <li>Model: iPhone 13 Pro</li>
              <li>Xotira: 256GB</li>
              <li>Rang: Qora</li>
              <li>Kamera: 12MP</li>
            </ul>
          </div>
          <div class="tab-panel" id="reviews">
            <h3>Sharhlar (24)</h3>
            <div class="review">
              <h4>Ali</h4>
              <div class="rating-stars">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
              </div>
              <p>Zo'r mahsulot, tavsiya qilaman!</p>
            </div>
            <div class="review">
              <h4>Vali</h4>
              <div class="rating-stars">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="far fa-star"></i>
              </div>
              <p>Narxi biroz qimmat, lekin sifati yaxshi.</p>
            </div>
          </div>
        </div>
      </div>
    `

    // Add event listeners for product detail modal
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

    minusBtn.addEventListener("click", () => {
      if (quantityInput.value > 1) {
        quantityInput.value = Number.parseInt(quantityInput.value) - 1
      }
    })

    plusBtn.addEventListener("click", () => {
      quantityInput.value = Number.parseInt(quantityInput.value) + 1
    })

    addToCartBtn.addEventListener("click", () => {
      const quantity = Number.parseInt(quantityInput.value)
      addToCart(productId, quantity)
      showNotification()
    })

    buyNowBtn.addEventListener("click", () => {
      const quantity = Number.parseInt(quantityInput.value)
      addToCart(productId, quantity)
      window.location.href = "cart.html"
    })

    wishlistBtn.addEventListener("click", () => {
      alert("Mahsulot istaklar ro'yxatiga qo'shildi!")
    })

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
        productDetailContent.querySelector(`#${tab}`).classList.add("active")
      })
    })

    // Show product detail modal
    productDetailModal.classList.add("show")
    document.body.style.overflow = "hidden"
  }

  function closeProductDetailModal() {
    if (!productDetailModal) return

    productDetailModal.classList.remove("show")
    document.body.style.overflow = ""
  }

  // Cart functions
  function addToCart(productId, quantity) {
    // Check if the product is already in the cart
    const existingProduct = cart.find((item) => item.id === productId)

    if (existingProduct) {
      // If it exists, update the quantity
      existingProduct.quantity += quantity
    } else {
      // Otherwise add it to the cart
      cart.push({ id: productId, quantity })
    }

    // Save cart to localStorage
    saveCart()

    // Update cart count
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

  function showNotification() {
    if (!cartNotification) return

    cartNotification.classList.add("show")

    setTimeout(() => {
      cartNotification.classList.remove("show")
    }, 3000)
  }

  function renderCart() {
    if (!cartContent || !emptyCart || !cartItemsList || !cartTotalCount || !cartSubtotal || !cartDiscount || !cartTotal)
      return

    if (cart.length === 0) {
      emptyCart.classList.add("show")
      cartContent.classList.remove("show")
      return
    }

    emptyCart.classList.remove("show")
    cartContent.classList.add("show")

    // Clear cart items list
    cartItemsList.innerHTML = ""

    let subtotal = 0
    let discount = 0
    let total = 0

    cart.forEach((item) => {
      // Find the product card with the matching ID
      const productCard = document.querySelector(`.product-card[data-id="${item.id}"]`)

      if (!productCard) return

      // Extract product information from the card
      const productTitle = productCard.querySelector(".product-title").textContent
      const productImage = productCard.querySelector(".product-image img").src
      const productPrice = productCard.querySelector(".current-price").textContent

      // Create cart item
      const cartItem = document.createElement("li")
      cartItem.className = "cart-item"
      cartItem.innerHTML = `
        <div class="cart-item-image">
          <img src="${productImage}" alt="${productTitle}">
        </div>
        <div class="cart-item-info">
          <h3 class="cart-item-title">${productTitle}</h3>
          <span class="cart-item-price">${productPrice}</span>
          <div class="cart-item-quantity">
            <button class="quantity-btn minus" data-id="${item.id}">-</button>
            <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="100" data-id="${item.id}">
            <button class="quantity-btn plus" data-id="${item.id}">+</button>
          </div>
        </div>
        <button class="cart-item-remove" data-id="${item.id}"><i class="fas fa-times"></i></button>
      `

      // Add event listeners for cart item
      const minusBtn = cartItem.querySelector(".quantity-btn.minus")
      const plusBtn = cartItem.querySelector(".quantity-btn.plus")
      const quantityInput = cartItem.querySelector(".quantity-input")
      const removeBtn = cartItem.querySelector(".cart-item-remove")

      minusBtn.addEventListener("click", () => {
        if (item.quantity > 1) {
          item.quantity--
          quantityInput.value = item.quantity
          saveCart()
          updateCartCount()
          renderCart()
        }
      })

      plusBtn.addEventListener("click", () => {
        item.quantity++
        quantityInput.value = item.quantity
        saveCart()
        updateCartCount()
        renderCart()
      })

      quantityInput.addEventListener("change", () => {
        const newQuantity = Number.parseInt(quantityInput.value)
        if (newQuantity >= 1 && newQuantity <= 100) {
          item.quantity = newQuantity
          saveCart()
          updateCartCount()
          renderCart()
        } else {
          quantityInput.value = item.quantity
        }
      })

      removeBtn.addEventListener("click", () => {
        cart = cart.filter((cartItem) => cartItem.id !== item.id)
        saveCart()
        updateCartCount()
        renderCart()
      })

      // Add cart item to list
      cartItemsList.appendChild(cartItem)

      // Update subtotal
      subtotal += Number.parseFloat(productPrice.replace(/[^0-9.-]+/g, "")) * item.quantity
    })

    // Calculate discount (example: 10%)
    discount = subtotal * 0.1

    // Calculate total
    total = subtotal - discount

    // Update cart totals
    cartSubtotal.textContent = subtotal.toFixed(2) + " so'm"
    cartDiscount.textContent = discount.toFixed(2) + " so'm"
    cartTotal.textContent = total.toFixed(2) + " so'm"
    cartTotalCount.textContent = total.toFixed(2) + " so'm"
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

  // Contact form
  function handleContactFormSubmit(e) {
    e.preventDefault()

    const name = document.getElementById("contact-name").value
    const surname = document.getElementById("contact-surname").value
    const email = document.getElementById("contact-email").value
    const message = document.getElementById("contact-message").value

    // Simple validation
    if (!name || !surname || !email || !message) {
      alert("Iltimos, barcha maydonlarni to'ldiring!")
      return
    }

    // Simulate sending the form
    setTimeout(() => {
      document.getElementById("contact-success").classList.add("show")
      document.getElementById("contact-form").reset()

      setTimeout(() => {
        document.getElementById("contact-success").classList.remove("show")
      }, 5000)
    }, 1000)
  }

  // Add the updateCartPreview function after the renderCart function:
  function updateCartPreview() {
    const cartContentPreview = document.getElementById("cart-content-preview")
    const emptyCartPreview = document.getElementById("empty-cart-preview")
    const cartItemsListPreview = document.getElementById("cart-items-list-preview")
    const cartTotalCountPreview = document.getElementById("cart-total-count-preview")
    const cartSubtotalPreview = document.getElementById("cart-subtotal-preview")
    const cartDiscountPreview = document.getElementById("cart-discount-preview")
    const cartTotalPreview = document.getElementById("cart-total-preview")

    if (!cartContentPreview || !emptyCartPreview || !cartItemsListPreview) return

    if (cart.length === 0) {
      if (emptyCartPreview) emptyCartPreview.style.display = "flex"
      if (cartContentPreview) cartContentPreview.style.display = "none"
      return
    }

    if (emptyCartPreview) emptyCartPreview.style.display = "none"
    if (cartContentPreview) cartContentPreview.style.display = "grid"

    // Clear cart items list
    if (cartItemsListPreview) cartItemsListPreview.innerHTML = ""

    let subtotal = 0
    let discount = 0
    let total = 0
    let itemCount = 0

    cart.forEach((item) => {
      // Find the product card with the matching ID
      const productCard = document.querySelector(`.product-card[data-id="${item.id}"]`)

      if (!productCard) return

      // Extract product information from the card
      const productTitle = productCard.querySelector(".product-title").textContent
      const productImage = productCard.querySelector(".product-image img").src
      const productPrice = productCard.querySelector(".current-price").textContent
      const priceValue = Number.parseFloat(productPrice.replace(/[^0-9.-]+/g, ""))

      // Create cart item
      const cartItem = document.createElement("div")
      cartItem.className = "cart-item"
      cartItem.innerHTML = `
      <input type="checkbox" class="cart-item-checkbox" checked>
      <div class="cart-item-image">
        <img src="${productImage}" alt="${productTitle}">
      </div>
      <div class="cart-item-details">
        <h3 class="cart-item-title">${productTitle}</h3>
        <div class="cart-item-price">${productPrice}</div>
      </div>
      <div class="cart-item-actions">
        <div class="quantity-control">
          <button class="quantity-btn minus" data-id="${item.id}">-</button>
          <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="100" data-id="${item.id}">
          <button class="quantity-btn plus" data-id="${item.id}">+</button>
        </div>
        <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
      </div>
    `

      // Add event listeners for cart item
      const minusBtn = cartItem.querySelector(".quantity-btn.minus")
      const plusBtn = cartItem.querySelector(".quantity-btn.plus")
      const quantityInput = cartItem.querySelector(".quantity-input")
      const removeBtn = cartItem.querySelector(".remove-item")

      minusBtn.addEventListener("click", () => {
        if (item.quantity > 1) {
          item.quantity--
          quantityInput.value = item.quantity
          saveCart()
          updateCartCount()
          updateCartPreview()
        }
      })

      plusBtn.addEventListener("click", () => {
        item.quantity++
        quantityInput.value = item.quantity
        saveCart()
        updateCartCount()
        updateCartPreview()
      })

      quantityInput.addEventListener("change", () => {
        const newQuantity = Number.parseInt(quantityInput.value)
        if (newQuantity >= 1 && newQuantity <= 100) {
          item.quantity = newQuantity
          saveCart()
          updateCartCount()
          updateCartPreview()
        } else {
          quantityInput.value = item.quantity
        }
      })

      removeBtn.addEventListener("click", () => {
        cart = cart.filter((cartItem) => cartItem.id !== item.id)
        saveCart()
        updateCartCount()
        updateCartPreview()
      })

      // Add cart item to list
      if (cartItemsListPreview) cartItemsListPreview.appendChild(cartItem)

      // Update subtotal
      subtotal += priceValue * item.quantity
      itemCount += item.quantity
    })

    // Calculate discount (example: 10%)
    discount = subtotal * 0.1

    // Calculate total
    total = subtotal - discount

    // Update cart totals
    if (cartTotalCountPreview) cartTotalCountPreview.textContent = `${itemCount} dona`
    if (cartSubtotalPreview) cartSubtotalPreview.textContent = `${subtotal.toFixed(2)} so'm`
    if (cartDiscountPreview) cartDiscountPreview.textContent = `${discount.toFixed(2)} so'm`
    if (cartTotalPreview) cartTotalPreview.textContent = `${total.toFixed(2)} so'm`
  }

  init()
})
