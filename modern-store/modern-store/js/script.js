
document.addEventListener("DOMContentLoaded", () => {

  const welcomeOverlay = document.getElementById("welcome-overlay")


  const themeToggle = document.getElementById("theme-toggle")


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


  const languageBtn = document.querySelector(".language-btn")
  const languageOptions = document.querySelectorAll(".language-option")

  let currentSlide = 0
  let cart = []
  let currentLang = localStorage.getItem("language") || "uz"


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

    // Check current page
    const currentPath = window.location.pathname

    if (currentPath.includes("cart.html")) {
      renderCart()
    }
  }

  // Initialize event listeners
  function initEventListeners() {
    // Theme toggle
    if (themeToggle) {
      themeToggle.addEventListener("click", toggleTheme)
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
          currentFilter = filter
          currentPage = 1

          filterProducts()
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

        // Otherwise open product modal
        const productId = Number.parseInt(productCard.dataset.id)
        openProductModal(productId)
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
    // 

    


    

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

    // Update product titles and descriptions
    const productTitles = document.querySelectorAll(".product-title")
    productTitles.forEach((title) => {
      // Since product names are brand names, we don't translate them
      // But we could add additional descriptions in different languages if needed
    })

    // Update product modal description
    const modalProductDescription = document.querySelector(".modal-product-description")
    if (modalProductDescription) {
      modalProductDescription.textContent = trans.product_description
    }

    // Update color options
    const colorOptions = document.querySelectorAll(".attribute-option")
    colorOptions.forEach((option) => {
      const text = option.textContent.trim().toLowerCase()
      if (text === "qora" || text === "черный" || text === "black") {
        option.textContent = trans.black
      } else if (text === "kumush" || text === "серебристый" || text === "silver") {
        option.textContent = trans.silver
      } else if (text === "oltin" || text === "золотой" || text === "gold") {
        option.textContent = trans.gold
      }
    })

    // Update cart page if we're on it
    const cartTitle = document.querySelector(".cart-title")
    if (cartTitle) {
      cartTitle.textContent = trans.cart_title
    }

    const emptyCartMessage = document.querySelector(".empty-cart-message")
    if (emptyCartMessage) {
      emptyCartMessage.textContent = trans.cart_empty
    }

    const continueShoppingBtn = document.querySelector(".continue-shopping-btn")
    if (continueShoppingBtn) {
      continueShoppingBtn.textContent = trans.continue_shopping
    }

    const cartSummaryTitle = document.querySelector(".cart-summary-title")
    if (cartSummaryTitle) {
      cartSummaryTitle.textContent = trans.cart_summary
    }

    const totalItemsLabel = document.querySelector(".total-items-label")
    if (totalItemsLabel) {
      totalItemsLabel.textContent = trans.total_items
    }

    const subtotalLabel = document.querySelector(".subtotal-label")
    if (subtotalLabel) {
      subtotalLabel.textContent = trans.subtotal
    }

    const discountLabel = document.querySelector(".discount-label")
    if (discountLabel) {
      discountLabel.textContent = trans.discount
    }

    const totalLabel = document.querySelector(".total-label")
    if (totalLabel) {
      totalLabel.textContent = trans.total
    }

    if (clearCartBtn) {
      clearCartBtn.textContent = trans.clear_cart
    }

    if (checkoutBtn) {
      checkoutBtn.textContent = trans.checkout
    }

    // Update any items count text
    if (cartTotalCount) {
      const count = Number.parseInt(cartTotalCount.textContent)
      cartTotalCount.textContent = `${count} ${trans.items}`
    }

    // Update search placeholder if exists
    const searchInput = document.querySelector(".search-input")
    if (searchInput) {
      searchInput.placeholder = trans.search_placeholder
    }

    // Update filter and sort labels if they exist
    const filterByLabel = document.querySelector(".filter-by-label")
    if (filterByLabel) {
      filterByLabel.textContent = trans.filter_by
    }

    const sortByLabel = document.querySelector(".sort-by-label")
    if (sortByLabel) {
      sortByLabel.textContent = trans.sort_by
    }

    // Update sort options if they exist
    const sortOptions = document.querySelectorAll(".sort-option")
    sortOptions?.forEach((option) => {
      const text = option.textContent.trim().toLowerCase()
      if (text.includes("narx: pastdan") || text.includes("цена: от низкой") || text.includes("price: low to")) {
        option.textContent = trans.price_low_high
      } else if (
        text.includes("narx: yuqoridan") ||
        text.includes("цена: от высокой") ||
        text.includes("price: high to")
      ) {
        option.textContent = trans.price_high_low
      } else if (text.includes("avval yangilari") || text.includes("сначала новые") || text.includes("newest first")) {
        option.textContent = trans.newest_first
      } else if (text.includes("ommaboplik") || text.includes("популярности") || text.includes("popularity")) {
        option.textContent = trans.popularity
      }
    })

    // Update stock status if they exist
    const inStockLabels = document.querySelectorAll(".in-stock")
    inStockLabels?.forEach((label) => {
      label.textContent = trans.in_stock
    })

    const outOfStockLabels = document.querySelectorAll(".out-of-stock")
    outOfStockLabels?.forEach((label) => {
      label.textContent = trans.out_of_stock
    })

    // Update buttons
    const applyButtons = document.querySelectorAll(".apply-btn")
    applyButtons?.forEach((btn) => {
      btn.textContent = trans.apply
    })

    const resetButtons = document.querySelectorAll(".reset-btn")
    resetButtons?.forEach((btn) => {
      btn.textContent = trans.reset
    })

    // Add this function to update cart page elements when language changes
    // Add this to the updateLanguage function, right after the "Update cart page if we're on it" section

    // Update cart page elements
    const orderDetailsTitle = document.querySelector(".order-details-title, .buyurtma-malumotlari")
    if (orderDetailsTitle) {
      orderDetailsTitle.textContent = trans.order_details
    }

    const productsCountLabel = document.querySelector(".products-count-label, .mahsulotlar-label")
    if (productsCountLabel) {
      productsCountLabel.textContent = trans.products
    }

    const deliveryOptionsTitle = document.querySelector(".delivery-options-title, .yetkazib-berish-usuli")
    if (deliveryOptionsTitle) {
      deliveryOptionsTitle.textContent = trans.delivery_options
    }

    const courierDeliveryOption = document.querySelector(".courier-delivery-option")
    if (courierDeliveryOption) {
      const courierLabel = courierDeliveryOption.querySelector("label")
      if (courierLabel) {
        courierLabel.textContent = trans.courier_delivery
      }
    }

    const selfPickupOption = document.querySelector(".self-pickup-option")
    if (selfPickupOption) {
      const selfPickupLabel = selfPickupOption.querySelector("label")
      if (selfPickupLabel) {
        selfPickupLabel.textContent = trans.self_pickup
      }
    }

    const paymentMethodsTitleElement = document.querySelector(".payment-methods-title, .tolov-usuli")
    if (paymentMethodsTitleElement) {
      paymentMethodsTitleElement.textContent = trans.payment_methods
    }

    const cardPaymentOption = document.querySelector(".card-payment-option")
    if (cardPaymentOption) {
      const cardLabel = cardPaymentOption.querySelector("label")
      if (cardLabel) {
        cardLabel.textContent = trans.card_payment
      }
    }

    const cashPaymentOption = document.querySelector(".cash-payment-option")
    if (cashPaymentOption) {
      const cashLabel = cashPaymentOption.querySelector("label")
      if (cashLabel) {
        cashLabel.textContent = trans.cash_payment
      }
    }

    const installmentOption = document.querySelector(".installment-option")
    if (installmentOption) {
      const installmentLabel = installmentOption.querySelector("label")
      if (installmentLabel) {
        installmentLabel.textContent = trans.installment
      }
    }

    // If we're on the cart page, re-render the cart to update all translations
    if (window.location.pathname.includes("cart.html") && cartItemsList) {
      renderCart()
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
  function filterProducts() {
    if (!productsGrid) return

    const productCards = productsGrid.querySelectorAll(".product-card")

    productCards.forEach((card) => {
      if (currentFilter === "hammasi" || currentFilter === "все" || currentFilter === "all") {
        card.style.display = "block"
      } else if (
        (currentFilter === "yangi" || currentFilter === "новые" || currentFilter === "new") &&
        card.querySelector(".badge-new")
      ) {
        card.style.display = "block"
      } else if (
        (currentFilter === "chegirma" || currentFilter === "скидки" || currentFilter === "discount") &&
        card.querySelector(".badge-sale")
      ) {
        card.style.display = "block"
      } else if (currentFilter === "eng yaxshi" || currentFilter === "лучшие" || currentFilter === "best") {
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

    // Create modal content
    modalBody.innerHTML = `
    <div class="modal-product">
      <div class="modal-product-gallery">
        <div class="modal-product-main-image">
          <img src="${productImage}" alt="${productTitle}">
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

    // Show modal
    productModal.classList.add("show")
    document.body.style.overflow = "hidden"
  }

  function closeProductModal() {
    if (!productModal) return

    productModal.classList.remove("show")
    document.body.style.overflow = ""
  }

  // Cart functions
  function addToCart(productId, quantity) {
    // Find the product card with the matching ID
    const productCard = document.querySelector(`.product-card[data-id="${productId}"]`)

    if (!productCard) return

    // Extract product information from the card
    const productTitle = productCard.querySelector(".product-title").textContent
    const productImage = productCard.querySelector(".product-image img").src
    const productPriceText = productCard.querySelector(".current-price").textContent
    const productPrice = Number.parseInt(productPriceText.replace(/\D/g, ""))

    const existingItem = cart.find((item) => item.id === productId)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({
        id: productId,
        title: productTitle,
        price: productPrice,
        image: productImage,
        quantity: quantity,
      })
    }

    updateCartCount()
    saveCart()
  }

  function removeFromCart(productId) {
    cart = cart.filter((item) => item.id !== productId)
    updateCartCount()
    saveCart()

    if (cartItemsList) {
      renderCart()
    }
  }

  function updateCartCount() {
    if (!cartCount) return

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0)

    cartCount.textContent = totalItems

    if (totalItems > 0) {
      cartCount.style.display = "flex"
    } else {
      cartCount.style.display = "none"
    }
  }

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart))
  }

  function loadCart() {
    const savedCart = localStorage.getItem("cart")

    if (savedCart) {
      cart = JSON.parse(savedCart)
      updateCartCount()
    }
  }

  function clearCart() {
    cart = []
    updateCartCount()
    saveCart()

    if (cartItemsList) {
      renderCart()
    }
  }

  // Replace the renderCart function with this updated version
  function renderCart() {
    if (!cartContent || !emptyCart || !cartItemsList) return

    const trans = translations[currentLang]

    if (cart.length === 0) {
      cartContent.style.display = "none"
      emptyCart.style.display = "flex"
      return
    }

    cartContent.style.display = "grid"
    emptyCart.style.display = "none"

    cartItemsList.innerHTML = ""

    let subtotal = 0
    const discount = 0

    // Update select all checkbox label if it exists
    const selectAllLabel = document.querySelector(".cart-select-all label")
    if (selectAllLabel) {
      selectAllLabel.textContent = trans.select_all
    }

    // Update cart header if it exists
    const cartHeaderTitle = document.querySelector(".cart-header-title")
    if (cartHeaderTitle) {
      cartHeaderTitle.textContent = trans.cart_title
    }

    // Update clear cart button
    if (clearCartBtn) {
      clearCartBtn.textContent = trans.clear_cart
    }

    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity
      subtotal += itemTotal

      const cartItem = document.createElement("div")
      cartItem.className = "cart-item"

      cartItem.innerHTML = `
      <input type="checkbox" class="cart-item-checkbox" checked>
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.title}">
      </div>
      <div class="cart-item-details">
        <h3 class="cart-item-title">${item.title}</h3>
        <div class="cart-item-price">${formatPrice(item.price)}</div>
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

      cartItemsList.appendChild(cartItem)
    })

    // Add event listeners for cart item actions
    const minusButtons = cartItemsList.querySelectorAll(".quantity-btn.minus")
    const plusButtons = cartItemsList.querySelectorAll(".quantity-btn.plus")
    const quantityInputs = cartItemsList.querySelectorAll(".quantity-input")
    const removeButtons = cartItemsList.querySelectorAll(".remove-item")

    minusButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const productId = Number.parseInt(button.dataset.id)
        const item = cart.find((item) => item.id === productId)

        if (item && item.quantity > 1) {
          item.quantity--
          updateCartCount()
          saveCart()
          renderCart()
        }
      })
    })

    plusButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const productId = Number.parseInt(button.dataset.id)
        const item = cart.find((item) => item.id === productId)

        if (item) {
          item.quantity++
          updateCartCount()
          saveCart()
          renderCart()
        }
      })
    })

    quantityInputs.forEach((input) => {
      input.addEventListener("change", () => {
        const productId = Number.parseInt(input.dataset.id)
        const item = cart.find((item) => item.id === productId)
        const newQuantity = Number.parseInt(input.value)

        if (item && newQuantity > 0) {
          item.quantity = newQuantity
          updateCartCount()
          saveCart()
          renderCart()
        }
      })
    })

    removeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const productId = Number.parseInt(button.dataset.id)
        removeFromCart(productId)
      })
    })

    // Update cart summary
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0)
    const total = subtotal - discount

    // Update order summary section
    const orderSummaryTitle = document.querySelector(".order-summary-title, .cart-summary-title")
    if (orderSummaryTitle) {
      orderSummaryTitle.textContent = trans.order_details
    }

    // Update product count
    if (cartTotalCount) {
      cartTotalCount.textContent = `${totalItems} ${trans.product_count}`
    }

    // Update products label
    const productsLabel = document.querySelector(".products-label, .total-items-label")
    if (productsLabel) {
      productsLabel.textContent = trans.products
    }

    // Update subtotal, discount, and total labels
    const subtotalLabel = document.querySelector(".subtotal-label")
    if (subtotalLabel) {
      subtotalLabel.textContent = trans.subtotal
    }

    const discountLabel = document.querySelector(".discount-label")
    if (discountLabel) {
      discountLabel.textContent = trans.discount
    }

    const totalLabel = document.querySelector(".total-label, .total-payment-label")
    if (totalLabel) {
      totalLabel.textContent = trans.total_payment
    }

    // Update values
    if (cartSubtotal) cartSubtotal.textContent = formatPrice(subtotal)
    if (cartDiscount) cartDiscount.textContent = formatPrice(discount)
    if (cartTotal) cartTotal.textContent = formatPrice(total)

    // Update delivery options
    const deliveryOptionsTitle = document.querySelector(".delivery-options-title")
    if (deliveryOptionsTitle) {
      deliveryOptionsTitle.textContent = trans.delivery_options
    }

    const courierDeliveryLabel = document.querySelector(".courier-delivery-label")
    if (courierDeliveryLabel) {
      courierDeliveryLabel.textContent = trans.courier_delivery
    }

    const selfPickupLabel = document.querySelector(".self-pickup-label")
    if (selfPickupLabel) {
      selfPickupLabel.textContent = trans.self_pickup
    }

    // Update payment methods
    const paymentMethodsTitleElement = document.querySelector(".payment-methods-title")
    if (paymentMethodsTitleElement) {
      paymentMethodsTitleElement.textContent = trans.payment_methods
    }

    const cardPaymentLabel = document.querySelector(".card-payment-label")
    if (cardPaymentLabel) {
      cardPaymentLabel.textContent = trans.card_payment
    }

    const cashPaymentLabel = document.querySelector(".cash-payment-label")
    if (cashPaymentLabel) {
      cashPaymentLabel.textContent = trans.cash_payment
    }

    const installmentLabel = document.querySelector(".installment-label")
    if (installmentLabel) {
      installmentLabel.textContent = trans.installment
    }

    // Update checkout button
    if (checkoutBtn) {
      checkoutBtn.textContent = trans.checkout
    }
  }

  function checkout() {
    alert(translations[currentLang].order_success)
    clearCart()
  }

  // Show notification
  function showNotification() {
    if (!cartNotification) return

    cartNotification.classList.add("show")

    setTimeout(() => {
      cartNotification.classList.remove("show")
    }, 3000)
  }

  // Helper functions
  function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm"
  }

  // Initialize the page
  init()
})
