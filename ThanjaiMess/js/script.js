document.addEventListener("DOMContentLoaded", () => {
    // ===== DOM Elements =====
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const dropdowns = document.querySelectorAll(".dropdown");
  
    // ===== Mobile Menu Toggle =====
    if (hamburger && navMenu) {
      hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
      });
  
      document.querySelectorAll(".nav-menu a").forEach((link) => {
        const parentDropdown = link.closest(".dropdown");
        link.addEventListener("click", () => {
          if (!parentDropdown || window.innerWidth > 768) {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
          }
        });
      });
  
      dropdowns.forEach((dropdown) => {
        const dropdownLink = dropdown.querySelector("a");
        dropdownLink.addEventListener("click", (e) => {
          if (window.innerWidth <= 768) {
            e.preventDefault();
            dropdown.classList.toggle("active");
            dropdowns.forEach((other) => {
              if (other !== dropdown) other.classList.remove("active");
            });
          }
        });
      });
    }
  
    // ===== Hero Slider Logic =====
    const heroSlider = document.querySelector(".hero-slider");
    const slides = document.querySelectorAll(".slide");
    const navBtns = document.querySelectorAll(".nav-btn");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
  
    if (heroSlider && slides.length > 0) {
      let currentSlide = 0;
      const slideCount = slides.length;
  
      function updateSlide(index) {
        slides.forEach((slide) => slide.classList.remove("active"));
        navBtns.forEach((btn) => btn.classList.remove("active"));
        slides[index].classList.add("active");
        navBtns[index].classList.add("active");
        currentSlide = index;
      }
  
      function nextSlide() {
        const newIndex = (currentSlide + 1) % slideCount;
        updateSlide(newIndex);
      }
  
      function prevSlide() {
        const newIndex = (currentSlide - 1 + slideCount) % slideCount;
        updateSlide(newIndex);
      }
  
      if (nextBtn && prevBtn) {
        nextBtn.addEventListener("click", nextSlide);
        prevBtn.addEventListener("click", prevSlide);
      }
  
      navBtns.forEach((btn, index) => {
        btn.addEventListener("click", () => updateSlide(index));
      });
  
      let slideInterval = setInterval(nextSlide, 5000);
  
      heroSlider.addEventListener("mouseenter", () => clearInterval(slideInterval));
      heroSlider.addEventListener("mouseleave", () => {
        slideInterval = setInterval(nextSlide, 5000);
      });
  
      document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") nextSlide();
        else if (e.key === "ArrowLeft") prevSlide();
      });
  
      let touchStartX = 0;
      let touchEndX = 0;
  
      heroSlider.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
      });
  
      heroSlider.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) nextSlide();
        if (touchEndX > touchStartX + swipeThreshold) prevSlide();
      });
  
      updateSlide(0);
    }
  
    // ===== Dynamic Menu Loading =====
    let menuData = null;
    const menuContainer = document.getElementById("menu-container");
    const filterBtns = document.querySelectorAll(".filter-btn");
    const dropdownBtn = document.querySelector(".filter-dropdown-btn");
    const dropdownContent = document.querySelector(".filter-dropdown-content");
    const dropdownItems = document.querySelectorAll(".filter-dropdown-item");
  
    // Fetch menu data
    if (menuContainer) {
      fetch("menu-data.json")
        .then((response) => response.json())
        .then((data) => {
          menuData = data;
          console.log("✅ Menu data loaded");
          displayMenuItems("all"); // Show all items by default
          initializeEventListeners(); // Initialize after data is loaded
        })
        .catch((error) => {
          console.error("❌ Failed to load menu data:", error);
          menuContainer.innerHTML = "<p class='text-danger'>Failed to load menu. Please try again later.</p>";
        });
    }
  
    function initializeEventListeners() {
      // Desktop filter buttons
      filterBtns.forEach(btn => {
        btn.addEventListener("click", function() {
          const category = this.dataset.category;
          
          // Update button states
          filterBtns.forEach(b => b.classList.remove("active"));
          this.classList.add("active");
  
          // Update dropdown if on mobile
          if (dropdownBtn) {
            dropdownBtn.querySelector("span").textContent = this.textContent;
            dropdownItems.forEach(item => {
              if (item.dataset.category === category) {
                item.classList.add("active");
              } else {
                item.classList.remove("active");
              }
            });
          }
  
          // Display filtered items
          displayMenuItems(category);
        });
      });
  
      // Mobile dropdown toggle
      if (dropdownBtn) {
        dropdownBtn.addEventListener("click", function(e) {
          e.stopPropagation();
          dropdownContent.classList.toggle("show");
          this.classList.toggle("active");
        });
      }
  
      // Close dropdown when clicking outside
      document.addEventListener("click", function(e) {
        if (!e.target.closest(".filter-dropdown")) {
          dropdownContent?.classList.remove("show");
          dropdownBtn?.classList.remove("active");
        }
      });
  
      // Dropdown items
      dropdownItems.forEach(item => {
        item.addEventListener("click", function(e) {
          e.stopPropagation();
          const category = this.dataset.category;
          
          // Update dropdown items state
          dropdownItems.forEach(i => i.classList.remove("active"));
          this.classList.add("active");
          
          // Update desktop buttons state
          filterBtns.forEach(btn => {
            if (btn.dataset.category === category) {
              btn.classList.add("active");
            } else {
              btn.classList.remove("active");
            }
          });
          
          // Update dropdown button text
          if (dropdownBtn) {
            dropdownBtn.querySelector("span").textContent = this.textContent;
          }
          
          // Close dropdown
          dropdownContent?.classList.remove("show");
          dropdownBtn?.classList.remove("active");
          
          // Display filtered items
          displayMenuItems(category);
        });
      });
    }
  
    // Function to display menu items
    function displayMenuItems(category) {
      if (!menuData || !menuContainer) return;
      
      menuContainer.innerHTML = "";
      
      if (category === "all") {
        // Display all categories
        Object.entries(menuData).forEach(([categoryName, categoryData]) => {
          displayCategory(categoryName, categoryData.items);
        });
      } else {
        // Display single category
        const categoryData = menuData[category];
        if (categoryData) {
          displayCategory(category, categoryData.items);
        }
      }
  
      // Scroll to first menu title after content is loaded
      setTimeout(() => {
        const firstMenuTitle = document.querySelector(".menu-category-title");
        if (firstMenuTitle) {
          const headerHeight = document.querySelector(".header")?.offsetHeight || 0;
          const filterHeight = document.querySelector(".filter-section")?.offsetHeight || 0;
          const offset = headerHeight + filterHeight;
  
          window.scrollTo({
            top: firstMenuTitle.offsetTop - offset,
            behavior: "smooth"
          });
        }
      }, 100);
    }
  
    // Helper function to display a category
    function displayCategory(categoryName, items) {
      if (!items || !Array.isArray(items)) return;
    
      const title = `
        <div class="category-section" id="category-${categoryName.toLowerCase().replace(/\s+/g, '-')}">
          <h2 class="menu-category-title text-center">${categoryName}</h2>
          <div class="row">
      `;
    
      let itemsHTML = "";
      items.forEach((item) => {
        const imageUrl = item["img-url"] || "menu-image/noimage.avif";
        const foodTitle = item["food-title"] || item["dish-title"] || "Untitled Dish";
        const description = item["description"] || "";
    
        itemsHTML += `
          <div class="col-12 col-md-6">
            <div class="menu-card">
              <img src="${imageUrl}" alt="${foodTitle}" class="img-fluid dish-image" />
              <div class="menu-item">
                <div class="dish-info">
                  <h5 class="dish-name">${foodTitle}</h5>
                </div>
                <hr class="m-2" />
                <p class="dish-desc">${description}</p>
              </div>
            </div>
          </div>
        `;
      });
    
      const categoryHTML = title + itemsHTML + `</div></div>`;
      menuContainer.innerHTML += categoryHTML;
    
      // Add click event to menu titles for navigation
      const menuTitles = document.querySelectorAll(".menu-category-title");
      menuTitles.forEach(title => {
        title.style.cursor = "pointer";
        title.addEventListener("click", function() {
          const headerHeight = document.querySelector(".header")?.offsetHeight || 0;
          const filterHeight = document.querySelector(".filter-section")?.offsetHeight || 0;
          const offset = headerHeight + filterHeight;
    
          window.scrollTo({
            top: this.offsetTop - offset,
            behavior: "smooth"
          });
        });
      });
    }
  });
  
