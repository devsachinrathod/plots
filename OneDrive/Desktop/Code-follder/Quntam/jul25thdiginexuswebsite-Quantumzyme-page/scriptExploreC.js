//-------------------------Course JavaScript
const courses = [
  {
    id: 101,
    title: "Certified Data Science Course",
    instructor: "Multi Instructor Course",
    rating: 4.8,
    lessons: "3 Sessions Per Week",
    duration: "6 Months",
    price: "1,75,000",
    image: "images/dataScience.svg",
    category: "data-science",
  },
  {
    id: 102,
    title: "Programming in Python",
    instructor: "Multi Instructor Course",
    rating: 4.8,
    lessons: "3 Sessions Per Week",
    duration: "2 Months",
    price: "17,999",
    image: "images/Data-visi.svg",
    category: "programming",
  },
  // {
  //     id: 2,
  //     title: "Big Data Insights",
  //     instructor: "Sarah Smith",
  //     rating: 4.7,
  //     lessons: 40,
  //     duration: "28h 15m",
  //     price: 19999,
  //     image: "images/Big-data.svg",
  //     category: "analytics"
  // },
  // {
  //   id: 3,
  //   title: "Data Visualization Technique",
  //   instructor: "John Doe",
  //   rating: 4.9,
  //   lessons: 45,
  //   duration: "32h 45m",
  //   price: 19999,
  //   image: "images/Data-visi.svg",
  //   category: "data-science",
  // },
  //   {
  //     id: 4,
  //     title: "Data Visualization Technique",
  //     instructor: "John Doe",
  //     rating: 4.9,
  //     lessons: 45,
  //     duration: "32h 45m",
  //     price: 19999,
  //     image: "images/Data-visi.svg",
  //     category: "data-science",
  //   },
  // {
  //   id: 5,
  //   title: "Data Visualization Technique",
  //   instructor: "John Doe",
  //   rating: 4.9,
  //   lessons: 45,
  //   duration: "32h 45m",
  //   price: 19999,
  //   image: "images/Data-visi.svg",
  //   category: "data-science",
  // },
  // {
  //     id: 6,
  //     title: "Big Data Insights",
  //     instructor: "Sarah Smith",
  //     rating: 4.7,
  //     lessons: 40,
  //     duration: "28h 15m",
  //     price: 19999,
  //     image: "images/Big-data.svg",
  //     category: "analytics"
  // },
  // Add more course objects here
];

function createCourseCard(course) {
  return `
        <div class="course-card">
            <img src="${course.image}" alt="${course.title}" class="course-card__image">
            <div class="course-card__content">
                <div>
                    <h3 class="course-card__title">${course.title}</h3>
                    <p class="course-card__instructor">${course.instructor}</p>
                    <div class="course-card__rating">★★★★★ ${course.rating}</div>
                </div>
                <div>
                    <div class="course-card__meta">
                        <span><img src='./images/Future.svg' class='mark'></span>
                        <span><i class="fas fa-book"></i> ${course.lessons} lessons</span>
                        <span><img src='./images/Literature.svg' class='mark'></span>
                        <span><i class="far fa-clock"></i> ${course.duration}</span>
                        <div class="course-card__price">₹ ${course.price}</div>
                    </div>
                    
                </div>
            </div>
        </div>
    `;
}

function renderCourses(category = "all") {
  const courseGrid = document.getElementById("courseGrid");
  courseGrid.innerHTML = "";

  const filteredCourses =
    category === "all"
      ? courses
      : courses.filter((course) => course.category === category);

  if (filteredCourses.length === 0) {
    courseGrid.innerHTML =
      '<div class="course-explorer__empty-message">Coming soon...</div>';
  } else {
    filteredCourses.forEach((course) => {
      courseGrid.innerHTML += createCourseCard(course);
    });
  }
}

function initializeCourseExplorer() {
  renderCourses();

  const categoryButtons = document.querySelectorAll(
    ".course-explorer__category-btn"
  );
  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      categoryButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      renderCourses(button.dataset.category);
    });
  });
}

document.addEventListener("DOMContentLoaded", initializeCourseExplorer);
/*
//Testimonial Script
const testimonials = [
  {
    name: "Nachiket Kulkarni",
    title: "Developer",
    image: "./images/testimonial-guy-image.jpg",
    rating: 5,
    text: "Digital Nexus AI is an excellent place to gain technology skills. My trainer was outstanding, and I learned extensively about Python, Data Science, Machine Learning, Neural Networks, and more. The best part of the experience was the hands-on projects and the internship. They provided great support in career guidance, offering valuable advice on acing interviews at multinational companies. I secured a fantastic job in a pharma-based MNC in data science and data engineering.",
  },
  {
    name: "Nikhil Karnam",
    title: "Developer ",
    image:"./images/testimonial-guy-image.jpg",
    rating: 5,
    text: "I'm an engineering student. The Data Science course at Digital Nexus AI transformed my learning experience. I went from being a novice to being able to write AI and ML programs confidently. The curriculum, hands-on projects, and supportive instructors made all the difference. I highly recommend this course to any student looking to excel in AI and machine learning.",
  },
  {
    name: "Jayanthi G",
    title: "Developer",
    image:
      "./images/testimonial-guy-image.jpg",
    rating: 5,
    text: "With a limited coding background, I never imagined I would be writing complex AI programs. The Certified Data Scientist course greatly boosted my confidence. The real-world examples make the concepts easy to understand for anyone. The practical projects, expert instructors, and supportive environment make learning both enjoyable and effective",
  },
  {
    name: "Srinivas KS",
    title: "Developer",
    image:
      "./images/testimonial-guy-image.jpg",
    rating: 5,
    text: "With no background in coding or AI/ML, I was initially apprehensive about learning data science. However, the Certified Data Scientist course truly lives up to its 'Zero to Hero' concept. The step-by-step approach, hands-on learning, and personalized support have enabled me to grasp complex concepts and apply them effectively. Now, I am becoming proficient in data science and feel prepared to tackle new challenges.",
  },
  // Add more testimonials...
];

function createTestimonialCard(testimonial) {
  const card = document.createElement("div");
  card.className = "testimonial-card";

  card.innerHTML = `
        <img loading="lazy" src="${testimonial.image}" alt="${
    testimonial.name
  }" class="testimonial-image">
        <h2 class="testimonial-name">${testimonial.name}</h2>
        <p class="testimonial-title">${testimonial.title}</p>
        <div class="testimonial-rating">${"★".repeat(testimonial.rating)}</div>
        <p class="testimonial-text">${testimonial.text}</p>
    `;

  return card;
}

function populateTestimonials() {
  const container = document.getElementById("testimonialContainer");
  testimonials.forEach((testimonial) => {
    container.appendChild(createTestimonialCard(testimonial));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  populateTestimonials();

  const carousel = document.getElementById("testimonialCarousel");
  const container = document.getElementById("testimonialContainer");
  let isDragging = false;
  let startPosition = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;

  container.addEventListener("mousedown", dragStart);
  container.addEventListener("touchstart", dragStart);
  container.addEventListener("mouseup", dragEnd);
  container.addEventListener("touchend", dragEnd);
  container.addEventListener("mousemove", drag);
  container.addEventListener("touchmove", drag);

   // Add mousewheel event listener
  //  carousel.addEventListener("wheel", handleMouseWheel);
  let isMouseOverCarousel = false;
  carousel.addEventListener("mouseenter", () => isMouseOverCarousel = true);
  carousel.addEventListener("mouseleave", () => isMouseOverCarousel = false);
  window.addEventListener("wheel", handleMouseWheel, { passive: false });

  function dragStart(e) {
    isDragging = true;
    startPosition = getPositionX(e);
    carousel.style.cursor = "grabbing";
  }

  function drag(e) {
    if (isDragging) {
      const currentPosition = getPositionX(e);
      currentTranslate = prevTranslate + currentPosition - startPosition;
      container.style.transform = `translateX(${currentTranslate}px)`;
    }
  }

  function dragEnd() {
    isDragging = false;
    const movedBy = currentTranslate - prevTranslate;
    if (movedBy < -100) snapToNext();
    else if (movedBy > 100) snapToPrev();
    else snapToCurrent();
    carousel.style.cursor = "grab";
  }

  function getPositionX(e) {
    return e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
  }

  function snapToNext() {
    const cardWidth = container.firstElementChild.offsetWidth;
    prevTranslate -= cardWidth;
    prevTranslate = Math.max(
      prevTranslate,
      -cardWidth * (testimonials.length - 3)
    );
    container.style.transform = `translateX(${prevTranslate}px)`;
  }

  function snapToPrev() {
    const cardWidth = container.firstElementChild.offsetWidth;
    prevTranslate += cardWidth;
    prevTranslate = Math.min(prevTranslate, 0);
    container.style.transform = `translateX(${prevTranslate}px)`;
  }

  function snapToCurrent() {
    container.style.transform = `translateX(${prevTranslate}px)`;
  }
  
  // New function to handle mousewheel scrolling
  // function handleMouseWheel(e) {
  //   const cardWidth = container.firstElementChild.offsetWidth;
  //   const maxScroll = cardWidth * (testimonials.length - 3);

  //   if (e.deltaY > 0 && prevTranslate > -maxScroll) {
  //     // Scroll right
  //     e.preventDefault();
  //     prevTranslate -= cardWidth / 2;
  //     prevTranslate = Math.max(prevTranslate, -maxScroll);
  //   } else if (e.deltaY < 0 && prevTranslate < 0) {
  //     // Scroll left
  //     e.preventDefault();
  //     prevTranslate += cardWidth / 2;
  //     prevTranslate = Math.min(prevTranslate, 0);
  //   }
  //   // If we're at either end, don't prevent default scrolling
  //   if ((e.deltaY > 0 && prevTranslate <= -maxScroll) || (e.deltaY < 0 && prevTranslate >= 0)) {
  //     return;
  //   }
  //   container.style.transform = `translateX(${prevTranslate}px)`;
  // }
  function handleMouseWheel(e) {
    if (!isMouseOverCarousel) return;

    e.preventDefault();
    const cardWidth = container.firstElementChild.offsetWidth;
    const maxScroll = cardWidth * (testimonials.length - 3);

    if (e.deltaY > 0) {
      // Scroll right
      prevTranslate = Math.max(prevTranslate - cardWidth / 2, -maxScroll);
    } else {
      // Scroll left
      prevTranslate = Math.min(prevTranslate + cardWidth / 2, 0);
    }

    container.style.transform = `translateX(${prevTranslate}px)`;
  }

});



const carousel = document.querySelector('.carousel');
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID;
const cards = document.querySelectorAll('.card');
const cardCount = cards.length;
const cardWidth = document.querySelector('.card').offsetWidth + 10; // Including margin

carousel.addEventListener('mousedown', startDrag);
carousel.addEventListener('mouseup', endDrag);
carousel.addEventListener('mouseleave', endDrag);
carousel.addEventListener('mousemove', drag);

carousel.addEventListener('touchstart', startDrag);
carousel.addEventListener('touchend', endDrag);
carousel.addEventListener('touchmove', drag);

function startDrag(event) {
    isDragging = true;
    startPos = getPositionX(event);
    animationID = requestAnimationFrame(animation);
}

function endDrag() {
    isDragging = false;
    cancelAnimationFrame(animationID);

    const movedBy = currentTranslate - prevTranslate;
    if (movedBy < -100) {
        prevTranslate = Math.max(prevTranslate - cardWidth, -getMaxTranslate());
    } else if (movedBy > 100) {
        prevTranslate = Math.min(prevTranslate + cardWidth, 0);
    }
    setCarouselPosition();
    // updateDots(); // Update dots when drag ends
}

function drag(event) {
    if (isDragging) {
        const currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + currentPosition - startPos;
    }
}

function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
}

function animation() {
    setCarouselPosition();
    if (isDragging) requestAnimationFrame(animation);
}

function setCarouselPosition() {
    const maxTranslate = -getMaxTranslate();
    if (currentTranslate < maxTranslate) {
        currentTranslate = maxTranslate;
    } else if (currentTranslate > 0) {
        currentTranslate = 0;
    }
    carousel.style.transform = `translateX(${currentTranslate}px)`;
}

function getMaxTranslate() {
    const containerWidth = document.querySelector('.carousel-container').offsetWidth;
    const visibleAreaWidth = cardWidth * 2; // Width of 2 visible cards
    return (cardCount * cardWidth) - containerWidth + visibleAreaWidth;
}

// Navigation and Dots functionality
const dotsContainer = document.querySelector('.carousel-dots');
const leftControl = document.querySelector('.carousel-control.left');
const rightControl = document.querySelector('.carousel-control.right');
let currentIndex = 0;

// const updateDots = () => {
//     const dots = document.querySelectorAll('.carousel-dots .dot');
//     dots.forEach((dot, index) => {
//         dot.classList.toggle('active', index === currentIndex);
//     });
// };

const goToSlide = (index) => {
    currentIndex = (index + cards.length) % cards.length;
    currentTranslate = -currentIndex * cardWidth;
    prevTranslate = currentTranslate;
    setCarouselPosition();
    // updateDots();
};

// const createDots = () => {
//     cards.forEach((_, index) => {
//         const dot = document.createElement('span');
//         dot.classList.add('dot');
//         dot.addEventListener('click', () => goToSlide(index));
//         dotsContainer.appendChild(dot);
//     });
//     updateDots();
// };

leftControl.addEventListener('click', () => goToSlide(currentIndex - 1));
rightControl.addEventListener('click', () => goToSlide(currentIndex + 1));

// createDots();
goToSlide(0);

*/
