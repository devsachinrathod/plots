// explore dropdown
document.addEventListener('DOMContentLoaded', function() {
    const dropdown = document.querySelector('.explore-dropdown');
  
    dropdown.addEventListener('click', function() {
        const dropdownContent = this.querySelector('.dropdown-content');
        dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
    });
  
    // Optional: Close the dropdown if the user clicks outside of it
    document.addEventListener('click', function(event) {
        if (!explore-dropdown.contains(event.target)) {
          explore-dropdown.querySelector('.dropdown-content').style.display === 'none';
        }
    });
  });
  