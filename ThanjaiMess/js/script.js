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
    const menuContainer = document.getElementById("menu-container");
    if (menuContainer) {
      fetch("menu-data.json")
        .then((response) => response.json())
        .then((data) => {
          console.log("✅ Menu data loaded");
          menuContainer.innerHTML = "";
  
          Object.entries(data).forEach(([categoryName, categoryData]) => {
            const title = `<h2 class="menu-category-title text-center">${categoryName}</h2>`;
            let rowHTML = `<div class="row">`;
  
            categoryData.items.forEach((item) => {
              const imageUrl = item["img-url"] || "menu-image/noimage.avif";
              const foodTitle = item["food-title"] || item["dish-title"] || "Untitled Dish";
              const description = item["description"] || "";
  
              rowHTML += `
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
  
            rowHTML += `</div>`;
            menuContainer.innerHTML += title + rowHTML;
          });
        })
        .catch((error) => {
          console.error("❌ Failed to load menu data:", error);
          menuContainer.innerHTML = "<p class='text-danger'>Failed to load menu. Please try again later.</p>";
        });
    } else {
      console.warn("⚠️ No #menu-container found.");
    }
  });
  
