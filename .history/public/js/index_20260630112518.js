// product slide automatically

document.querySelectorAll(".product-image-slider").forEach((slider) => {
  const slides = slider.querySelectorAll(".slide");
  let current = 0;

  setInterval(() => {
    slides[current].classList.remove("active");

    current = (current + 1) % slides.length;

    slides[current].classList.add("active");
  }, 3000);
});

// for form

// Model form
const modelForm = document.getElementById("modelForm");

if (modelForm) {

    modelForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const message = document.getElementById("modelMessage");
        const formData = new FormData(modelForm);

        message.style.color = "#0d6efd";
        message.innerHTML = "Sending...";

        try {

            const response = await fetch("/model", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data.success) {

                message.style.color = "green";
                message.innerHTML = data.message;

                modelForm.reset();

            } else {

                message.style.color = "red";
                message.innerHTML = data.message;

            }

        } catch (err) {

            console.error(err);

            message.style.color = "red";
            message.innerHTML = "Something went wrong.";

        }

    });

}


// navbar

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. GLOBAL NAVBAR ACTIVE PATH CHECK
  // ==========================================
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(".nav-link-item");

  navLinks.forEach((link) => {
    // Reset every single link to muted styles first
    link.classList.remove("text-danger", "text-dark", "fw-bold", "active");
    link.classList.add("text-secondary");

    // Check if the link's href attribute matches our current URL path
    if (link.getAttribute("href") === currentPath) {
      link.classList.remove("text-secondary");
      link.classList.add("text-danger", "active");
    }
  });

  // ==========================================
  // 2. MEGA MENU INNER LOGIC (RESPONSIVE)
  // ==========================================
  const categoryItems = document.querySelectorAll(".category-item");
  const brandGroups = document.querySelectorAll(".brand-group");
  const imageWrappers = document.querySelectorAll(".product-img-wrapper");

  // Shared function to update content when a category is selected
  const updateMegaMenu = (item, targetId) => {
    // Reset sub-category textual active loops
    categoryItems.forEach((el) => {
      el.classList.remove("text-danger", "active");
      el.classList.add("text-secondary");
    });
    item.classList.remove("text-secondary");
    item.classList.add("text-danger", "active");

    // Sync structural component flexboxes matching data target values
    brandGroups.forEach((group) => {
      group.classList.remove("d-flex");
      group.classList.add("d-none");
    });
    const targetGroup = document.getElementById(targetId);
    if (targetGroup) {
      targetGroup.classList.remove("d-none");
      targetGroup.classList.add("d-flex");
    }

    // Sync visual content boxes (Desktop layout context)
    imageWrappers.forEach((img) => {
      img.classList.add("d-none");
    });
    const targetImg = document.getElementById(`img-${targetId}`);
    if (targetImg) {
      targetImg.classList.remove("d-none");
    }
  };

  // Attach dynamic events based on Screen Width (Desktop vs Mobile)
  categoryItems.forEach((item) => {
    const targetId = item.getAttribute("data-target");

    // HOVER effect for Desktop devices (width >= 992px)
    item.addEventListener("mouseenter", () => {
      if (window.innerWidth >= 992) {
        updateMegaMenu(item, targetId);
      }
    });

    // CLICK effect for Mobile/Tablet devices (width < 992px)
    item.addEventListener("click", (e) => {
      if (window.innerWidth < 992) {
        e.stopPropagation(); // Prevents bootstrap dropdown from closing early
        updateMegaMenu(item, targetId);
      }
    });
  });
});


if (window.innerWidth < 992) {

    document.querySelectorAll(".category-item").forEach(item => {

        item.addEventListener("click", function () {

            const currentGroup = this.querySelector(".mobile-brand-group");

            // If already open, close it
            if (currentGroup.style.display === "block") {
                currentGroup.style.display = "none";
                return;
            }

            // Close all others
            document.querySelectorAll(".mobile-brand-group").forEach(group => {
                group.style.display = "none";
            });

            // Open current one
            currentGroup.style.display = "block";

        });

    });

}
const navbarCollapse = document.getElementById("mainNavbar");
const toggler = document.querySelector(".navbar-toggler");

navbarCollapse.addEventListener("show.bs.collapse", () => {
    toggler.querySelector(".menu-open").classList.add("d-none");
    toggler.querySelector(".menu-close").classList.remove("d-none");
});

navbarCollapse.addEventListener("hide.bs.collapse", () => {
    toggler.querySelector(".menu-open").classList.remove("d-none");
    toggler.querySelector(".menu-close").classList.add("d-none");
});

// tab section in product page

function openTab(event, tabId) {
  const contents = document.querySelectorAll(".tab-content");
  const buttons = document.querySelectorAll(".tab-btn");

  contents.forEach((content) => {
    content.classList.remove("active");
  });

  buttons.forEach((button) => {
    button.classList.remove("active");
  });

  document.getElementById(tabId).classList.add("active");
  event.currentTarget.classList.add("active");
}




// related product slider

function changeImage(element) {

    document.getElementById("mainProductImage").src =
        element.src;

    document.querySelectorAll(".thumb")
        .forEach(img => img.classList.remove("active"));

    element.classList.add("active");
}

const slider =
    document.getElementById("relatedSlider");

document.getElementById("nextBtn")
    .addEventListener("click", () => {
        slider.scrollBy({
            left: 300,
            behavior: "smooth"
        });
    });

document.getElementById("prevBtn")
    .addEventListener("click", () => {
        slider.scrollBy({
            left: -300,
            behavior: "smooth"
        });
    });




    // for product page filter
    document.querySelectorAll(".filter-check").forEach(cb => {

    cb.addEventListener("change", () => {

        const params = new URLSearchParams();

        document
            .querySelectorAll(".filter-check:checked")
            .forEach(el => {

                params.append(
                    el.name,
                    el.value
                );

            });

        fetch(
            window.location.pathname +
            "?" +
            params.toString()
        )
        .then(res => res.text())
        .then(html => {

            const parser =
                new DOMParser();

            const doc =
                parser.parseFromString(
                    html,
                    "text/html"
                );

            document.querySelector(
                ".product-grid"
            ).innerHTML =
            doc.querySelector(
                ".product-grid"
            ).innerHTML;

        });

    });

});


