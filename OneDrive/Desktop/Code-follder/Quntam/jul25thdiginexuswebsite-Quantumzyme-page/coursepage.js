document.addEventListener("DOMContentLoaded", function () {
  showCard("all-card")
  setActiveButton("all")
})

document.getElementById("all").addEventListener("click", function () {
  showCard("all-card")
  setActiveButton("all")
})

document.getElementById("data-science").addEventListener("click", function () {
  showCard("data-science-card")
  setActiveButton("data-science")
})

document.getElementById("generative-ai").addEventListener("click", function () {
  showCard("generative-ai-card")
  setActiveButton("generative-ai")
})

document.getElementById("analytics").addEventListener("click", function () {
  showCard("analytics-card")
  setActiveButton("analytics")
})

document.getElementById("programming").addEventListener("click", function () {
  showCard("programming-card")
  setActiveButton("programming")
})

const hamburger = document.querySelector('.navigation__hamburger');
const navMenu = document.querySelector('.coursepage-nav');

hamburger.addEventListener('click', () => {
  // Toggle hamburger animation
  hamburger.classList.toggle('active');

  // Toggle menu visibility
  navMenu.classList.toggle('show');
});


function showAllCards() {
  let cards = document.getElementsByClassName("cards")

  for (let i = 0; i < cards.length; i++) {
    cards[i].style.display = "flex"
  }
}

function showCard(cardId) {
  // Hide all cards
  let cards = document.getElementsByClassName("cards")

  for (let i = 0; i < cards.length; i++) {
    cards[i].style.display = "none"
  }

  // Show the selected card
  document.getElementById(cardId).style.display = "flex"
}

function setActiveButton(buttonId) {
  // Remove active class from all buttons
  let buttons = document.getElementsByClassName("button")

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("active")
  }

  // Add active class to the clicked button
  document.getElementById(buttonId).classList.add("active")
}


// explore dropdown
document.addEventListener('DOMContentLoaded', function() {
  const dropdown = document.querySelector('.explore-dropdown');

  dropdown.addEventListener('click', function() {
      const dropdownContent = this.querySelector('.dropdown-content');
      dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
  });

  // Optional: Close the dropdown if the user clicks outside of it
  // document.addEventListener('click', function(event) {
  //     if (!explore-dropdown.contains(event.target)) {
  //       explore-dropdown.querySelector('.dropdown-content').style.display === 'none';
  //     }
  // });
});


function dataScience(){
  showCard('data-science-card');
  setActiveButton('data-science');
}

function generative(){
  showCard('generative-ai-card');
  setActiveButton('generative-ai');
}

function analytics(){
  showCard('analytics-card');
  setActiveButton('analytics');
}

function programming(){
  showCard('programming-card');
  setActiveButton('programming');
}

 // Get modal elements
 const modal = document.getElementById('quoteModal');
 const btn = document.querySelector('.quote');
 const span = document.querySelector('.close');

 // Open modal
 btn.onclick = function() {
   modal.style.display = 'block';
 }

 // Close modal when "X" is clicked
 span.onclick = function() {
   modal.style.display = 'none';
 }

 // Close modal when clicked outside of modal content
 window.onclick = function(event) {
   if (event.target == modal) {
     modal.style.display = 'none';
   }
 }