var coll = document.getElementsByClassName("collapsible");
var activeIndex = 0; // Index of the initially active (open) collapsible

// Function to close all collapsibles
function closeAllCollapsibles(exceptIndex) {
  for (var i = 0; i < coll.length; i++) {
    if (i !== exceptIndex) {
      coll[i].classList.remove("active");
      coll[i].nextElementSibling.style.display = "none";
    }
  }
}
///Navbar js 
  const hamburger = document.querySelector('.navigation__hamburger');
  const navMenu = document.querySelector('.navigation__nav-container');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });


// Open the first collapsible by default
//coll[activeIndex].classList.add("active");
//coll[activeIndex].nextElementSibling.style.display = "block";

// Add event listeners to all collapsibles
for (var i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    var content = this.nextElementSibling;

    if (this.classList.contains("active")) {
      // If already active, close it
      this.classList.remove("active");
      content.style.display = "none";
    } else {
      // Close all others
      closeAllCollapsibles(Array.prototype.indexOf.call(coll, this));

      // Open this one
      this.classList.add("active");
      content.style.display = "block";
      // 👉 Smooth scroll into view
      content.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

// Directs to the Aiden website when clicked
  document.getElementById("showcase-item2").onclick = function() {
    window.location.href = "https://aiden.digitalnexusai.com/";
  };


// Show by default data science card
document.addEventListener("DOMContentLoaded", function () {
  showCard("data-science-card");
  setActiveButton("data-science");
});

document.getElementById("data-science").addEventListener("click", function () {
  showCard("data-science-card");
  setActiveButton("data-science");
});

document.getElementById("generative-ai").addEventListener("click", function () {
  showCard("generative-ai-card");
  setActiveButton("generative-ai");
});

document.getElementById("analytics").addEventListener("click", function () {
  showCard("analytics-card");
  setActiveButton("analytics");
});

document.getElementById("programming").addEventListener("click", function () {
  showCard("programming-card");
  setActiveButton("programming");
});

function showCard(cardId) {
  // Hide all cards
  let cards = document.getElementsByClassName("cards");

  for (let i = 0; i < cards.length; i++) {
    cards[i].style.display = "none";
  }

  // Show the selected card
  document.getElementById(cardId).style.display = "flex";
}

function setActiveButton(buttonId) {
  // Remove active class from all buttons
  let buttons = document.getElementsByClassName("button");

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("active");
  }

  // Add active class  to the clicked button
  document.getElementById(buttonId).classList.add("active");
}

const showcaseItems = document.querySelectorAll(".showcase-item");
const showcaseDots = document.querySelectorAll(".showcase-dot");
let showcaseIndex = 1;

function updateShowcasePositions() {
  const containerWidth = document.querySelector(".showcase-container").offsetWidth;
  const itemWidth = containerWidth * 0.3;

  showcaseItems.forEach((item, index) => {
    const offset = (index - showcaseIndex + showcaseItems.length) % showcaseItems.length;
    let x, scale, zIndex, opacity, boxShadow;

    if (offset === 0) {
      x = containerWidth / 2 - itemWidth / 2;
      scale = 1;
      zIndex = 3;
      opacity = 1;
    } else if (offset === 1 || offset === -2) {
      x = containerWidth - itemWidth * 1.1;
      scale = 0.8;
      zIndex = 2;
      opacity = 0.7;
    } else {
      x = itemWidth * 0.1;
      scale = 0.8;
      zIndex = 2;
      opacity = 0.7;
      boxShadow = "none";
    }

    item.style.transform = `translateX(${x}px) scale(${scale})`;
    item.style.zIndex = zIndex;
    item.style.opacity = opacity;
    item.style.boxShadow = boxShadow;

    // Dodaj ili ukloni 'active' klasu
    item.classList.toggle('active', offset === 0);
  });

  updateShowcaseDots();
}

function updateShowcaseDots() {
  showcaseDots.forEach((dot, index) => {
    dot.classList.toggle("active", index === showcaseIndex);
  });
}
//next //prev
const prevBtn = document.getElementById("prev-course");
const nextBtn = document.getElementById("next-course");
const cardsContainer = document.querySelector(".card-container");

nextBtn.addEventListener("click", () => {
  cardsContainer.scrollBy({ left: 270, behavior: "smooth" }); 
});

prevBtn.addEventListener("click", () => {
  cardsContainer.scrollBy({ left: -270, behavior: "smooth" }); 
});

function rotateShowcaseItems(direction) {
  showcaseIndex = (showcaseIndex + direction + showcaseItems.length) % showcaseItems.length;
  updateShowcasePositions();
}

showcaseItems.forEach((item) => {
  item.addEventListener("click", () => {
    const itemIndex = Array.from(showcaseItems).indexOf(item);
    const direction =
      (itemIndex - showcaseIndex + showcaseItems.length) % showcaseItems.length <=
      1
        ? 1
        : -1;
    rotateShowcaseItems(direction);
  });
});

showcaseDots.forEach((dot, dotIndex) => {
  dot.addEventListener("click", () => {
    const direction = dotIndex > showcaseIndex ? 1 : -1;
    showcaseIndex = dotIndex;
    updateShowcasePositions();
  });
});


window.addEventListener("resize", updateShowcasePositions);
updateShowcasePositions();

function handleSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const data = new FormData(form);

  const jsonData = {};
  data.forEach((value, key) => {
    jsonData[key] = value;
  });

  fetch("http://localhost/jul25thdiginexuswebsite/contact_us.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData),
  })
    .then((response) => {
      if (response.status === 200) {
        alert("Success");
        form.reset();
      } else {
        alert("Failed to submit");
      }
    })
    .catch((error) => {
      console.error("Error submitting data:", error);
      alert("Failed to submit");
    });
}





