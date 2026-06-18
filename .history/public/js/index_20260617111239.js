document.addEventListener("DOMContentLoaded", () => {
  // =========================================================
  // 1. GLOBAL NAVBAR LINK PATH HIGHLIGHT ENGINE
  // =========================================================
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(".nav-link-item");

  navLinks.forEach((link) => {
    // Clear active arrays first
    link.classList.remove("text-danger", "text-dark", "fw-bold", "active");
    link.classList.add("text-secondary", "fw-semibold");

    // Evaluate path match condition profiles
    if (link.getAttribute("href") === currentPath) {
      link.classList.remove("text-secondary", "fw-semibold");
      link.classList.add("text-danger", "fw-bold", "active");
    }
  });

  // =========================================================
  // 2. RESPONSIVE INNER MEGA MENU ACCORDION TAB CONTROLLER
  // =========================================================
  const categoryItems = document.querySelectorAll(".category-item");
  const brandGroups = document.querySelectorAll(".brand-group");
  const imageWrappers = document.querySelectorAll(".product-img-wrapper");

  // Functional workflow configuration map to cycle display states
  const updateMegaMenu = (item, targetId) => {
    categoryItems.forEach((el) => {
      el.classList.remove("text-danger", "active");
      el.classList.add("text-secondary");
    });
    item.classList.remove("text-secondary");
    item.classList.add("text-danger", "active");

    brandGroups.forEach((group) => {
      group.classList.remove("d-flex");
      group.classList.add("d-none");
    });
    const targetGroup = document.getElementById(targetId);
    if (targetGroup) {
      targetGroup.classList.remove("d-none");
      targetGroup.classList.add("d-flex");
    }

    imageWrappers.forEach((img) => {
      img.classList.add("d-none");
    });
    const targetImg = document.getElementById(`img-${targetId}`);
    if (targetImg) {
      targetImg.classList.remove("d-none");
    }
  };

  // Setup adaptive window listening triggers (Hover on Desktop vs Taps on Mobile)
  categoryItems.forEach((item) => {
    const targetId = item.getAttribute("data-target");

    // Desktop Viewports Interactivity Handler
    item.addEventListener("mouseenter", () => {
      if (window.innerWidth >= 992) {
        updateMegaMenu(item, targetId);
      }
    });

    // Mobile/Touch Devices Interactivity Handler
    item.addEventListener("click", (e) => {
      if (window.innerWidth < 992) {
        e.stopPropagation(); // Stops backdrop container closures inside hamburger views
        updateMegaMenu(item, targetId);
      }
    });
  });
});
