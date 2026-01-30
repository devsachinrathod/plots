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