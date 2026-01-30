const testimonials = [
    {
      name: "Anand Joshi",
      title: "Team lead in MNC",
      image: "./images/Anand Joshi.jpg",
      rating: 5,
      text: "As an IT professional with 12 years of experience, I decided to pursue a career shift. The Data Science course at Digital Nexus AI has been transformative. The comprehensive curriculum, hands-on projects, and expert guidance seamlessly introduced me to the world of data science. Taught by top industry experts in a clear and accessible manner, this course is truly a game-changer.",
    },
    {
      name: "Nikhil Karnam",
      title: "Engineering Student",
      image:"./images/Nikil Karnam.jpg",
      rating: 5,
      text: "I'm an engineering student. The Data Science course at Digital Nexus AI transformed my learning experience. I went from being a novice to being able to write AI and ML programs confidently. The curriculum, hands-on projects, and supportive instructors made all the difference. I highly recommend this course to any student looking to excel in AI and machine learning.",
    },
    {
      name: "Nachiket Kulkarni",
      title: "Developer",
      image:
        "./images/dontKnowTheName.jpg",
      rating: 5,
      text: "Digital Nexus AI is an excellent place to gain technology skills. My trainer was outstanding, and I learned extensively about Python, Data Science, Machine Learning, Neural Networks, and more. The best part of the experience was the hands-on projects and the internship. They provided great support in career guidance, offering valuable advice on acing interviews at multinational companies. I secured a fantastic job in a pharma-based MNC in data science and data engineering.",
    },
    {
      name: "Shridhar Purandare",
      title: "Developer",
      image:
        "./images/Shridhar Purandare1.jpg",
      rating: 5,
      text: "Praveen Kumar sir guided me in Python, ML, and AI with hands-on coding and practical examples which led me to get my first job in an MNC like TCS. The comprehensive curriculum and career support were instrumental in my success. I highly recommend this course to anyone looking to transform their career.",
    },
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
    const prevButton = document.getElementById("prevButton");
    const nextButton = document.getElementById("nextButton");
    
    let currentIndex = 0;
    const cardWidth = container.firstElementChild.offsetWidth;
  
    function goToSlide(index) {
      currentIndex = (index + testimonials.length) % testimonials.length; // Loop through testimonials
      const translateX = -currentIndex * cardWidth;
      container.style.transform = `translateX(${translateX}px)`;
    }
  
    prevButton.addEventListener("click", () => {
      goToSlide(currentIndex - 1);
    });
  
    nextButton.addEventListener("click", () => {
      goToSlide(currentIndex + 1);
    });
  
    // Optional: Show buttons on hover
    carousel.addEventListener("mouseenter", () => {
      prevButton.style.opacity = 1;
      nextButton.style.opacity = 1;
    });
  
    carousel.addEventListener("mouseleave", () => {
      prevButton.style.opacity = 0;
      nextButton.style.opacity = 0;
    });



  });
  











/*
  
  document.addEventListener("DOMContentLoaded", () => {
    populateTestimonials();
  
    // const carousel = document.getElementById("testimonialCarousel");
    // const container = document.getElementById("testimonialContainer");
    // let isDragging = false;
    // let startPosition = 0;
    // let currentTranslate = 0;
    // let prevTranslate = 0;
  
    // container.addEventListener("mousedown", dragStart);
    // container.addEventListener("touchstart", dragStart);
    // container.addEventListener("mouseup", dragEnd);
    // container.addEventListener("touchend", dragEnd);
    // container.addEventListener("mousemove", drag);
    // container.addEventListener("touchmove", drag);
  
    //  // Add mousewheel event listener
    // //  carousel.addEventListener("wheel", handleMouseWheel);
    // let isMouseOverCarousel = false;
    // carousel.addEventListener("mouseenter", () => isMouseOverCarousel = true);
    // carousel.addEventListener("mouseleave", () => isMouseOverCarousel = false);
    // window.addEventListener("wheel", handleMouseWheel, { passive: false });
  
    // function dragStart(e) {
    //   isDragging = true;
    //   startPosition = getPositionX(e);
    //   carousel.style.cursor = "grabbing";
    // }
  
    // function drag(e) {
    //   if (isDragging) {
    //     const currentPosition = getPositionX(e);
    //     currentTranslate = prevTranslate + currentPosition - startPosition;
    //     container.style.transform = `translateX(${currentTranslate}px)`;
    //   }
    // }
  
    // function dragEnd() {
    //   isDragging = false;
    //   const movedBy = currentTranslate - prevTranslate;
    //   if (movedBy < -100) snapToNext();
    //   else if (movedBy > 100) snapToPrev();
    //   else snapToCurrent();
    //   carousel.style.cursor = "grab";
    // }
  
    // function getPositionX(e) {
    //   return e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
    // }
  
    // function snapToNext() {
    //   const cardWidth = container.firstElementChild.offsetWidth;
    //   prevTranslate -= cardWidth;
    //   prevTranslate = Math.max(
    //     prevTranslate,
    //     -cardWidth * (testimonials.length - 3)
    //   );
    //   container.style.transform = `translateX(${prevTranslate}px)`;
    // }
  
    // function snapToPrev() {
    //   const cardWidth = container.firstElementChild.offsetWidth;
    //   prevTranslate += cardWidth;
    //   prevTranslate = Math.min(prevTranslate, 0);
    //   container.style.transform = `translateX(${prevTranslate}px)`;
    // }
  
    // function snapToCurrent() {
    //   container.style.transform = `translateX(${prevTranslate}px)`;
    // }
    
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
    // function handleMouseWheel(e) {
    //   if (!isMouseOverCarousel) return;
  
    //   e.preventDefault();
    //   const cardWidth = container.firstElementChild.offsetWidth;
    //   const maxScroll = cardWidth * (testimonials.length - 3);
  
    //   if (e.deltaY > 0) {
    //     // Scroll right
    //     prevTranslate = Math.max(prevTranslate - cardWidth / 2, -maxScroll);
    //   } else {
    //     // Scroll left
    //     prevTranslate = Math.min(prevTranslate + cardWidth / 2, 0);
    //   }
  
    //   container.style.transform = `translateX(${prevTranslate}px)`;
    // }
  
  });
 */ 
  
  
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


  







