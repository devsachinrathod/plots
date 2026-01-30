window.onload = function () {
    const popup = document.getElementById("popup");
    const closeBtn = document.getElementById("closeBtn");

    // Show the popup with animation
    popup.classList.add("show");

    // Hide the popup when OK is clicked
    closeBtn.addEventListener("click", function () {
        popup.classList.remove("show");
    });
};
