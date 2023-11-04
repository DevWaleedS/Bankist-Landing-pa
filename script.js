'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const btnCloseModal = document.querySelector('.btn--close-modal');
const tabsContent = document.querySelectorAll('.operations__content');
const buttonsOpenModal = document.querySelectorAll('.btn--show-modal');
const tabsContainer = document.querySelector('.operations__tab-container');
const nav = document.querySelector('.nav');

/** -----------------------------------------------------------------
 * Modal window
 ----------------------------------------------------------------- */
//1- open modal function
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

//2- close modal function
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
buttonsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

/** ------------------------------------------------------------------
 * handle scroll to sections
 ------------------------------------------------------------------ */
btnScrollTo.addEventListener('click', () => {
  section1.scrollIntoView({ behavior: 'smooth' });
});
// --------------------------------------------------------------------------

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // matching nav link Element
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');

    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
// ----------------------------------------------------------------------
// handle tapped component

// handle event delegations
tabsContainer.addEventListener('click', function (event) {
  const clicked = event.target.closest('.operations__tab');

  // guard claus
  if (!clicked) return;

  // remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(tC => tC.classList.remove('operations__content--active'));

  // Activate tab
  clicked.classList.add('operations__tab--active');

  // Activate Content Area using the dataset
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});
//-------------------------------------------------------------------

// handle menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;

    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });

    logo.style.opacity = this;
  }
};
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));
/**-----------------------------------------------------------------
 *handle nav sticky using IntersectionObserver API
 */

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const navSticky = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(navSticky, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);
/**-----------------------------------------------------------------
 * handle reveal sections using IntersectionObserver API
 */

const allSections = document.querySelectorAll('.section');

// handle logic of  reveal section
const revealSections = function (entries, observe) {
  const [entry] = entries;

  // guard claus
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');

  // to stop observe of the current section that observed before
  observe.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSections, {
  root: null,
  threshold: 0.15,
});

// using foreach looping to add the section-hidden class
allSections.forEach(section => {
  // to observer the current section
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});
/**-----------------------------------------------------------------
 * handle lazy loading images using IntersectionObserver API
 */

const imgTargets = document.querySelectorAll('img[data-src]');
const loadImg = function (entries, observe) {
  const [entry] = entries;

  // to gard this function
  if (!entry.isIntersecting) return;

  // replace the src value with data-src
  entry.target.src = entry.target.dataset.src;

  // handle remove the lazy loading class using load event
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  // to stop observe of the current section that observed before
  observe.unobserve(entry.target);
};

const imagesObserve = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '-200px',
});

imgTargets.forEach(img => imagesObserve.observe(img));
/**-----------------------------------------------------------------
 * Sliders
 */

const Slider = function () {
  const slides = document.querySelectorAll('.slide');
  const sliderBtnRight = document.querySelector('.slider__btn--right');
  const sliderBtnLeft = document.querySelector('.slider__btn--left');
  const dotContainer = document.querySelector('.dots');

  let currentSlide = 0;
  const maxSlides = slides.length;

  // Create Dots based on Slides Length
  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class='dots__dot' data-slide='${i}'></button>`
      );
    });
  };

  // Create Activate Dots
  const activateDots = function (slide) {
    // remove active class from all dots
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    // add the active class to the current dot

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  // looping on all slides to handle the translateX Values
  const goToSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (slide - i)}%)`;
    });
  };

  // to start the slides from first one
  const init = function () {
    goToSlide(0);

    createDots();
    activateDots(0);
  };
  init();

  // handle nextSlide Function
  const nextSlide = function () {
    if (currentSlide === maxSlides - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToSlide(currentSlide);
    activateDots(currentSlide);
  };

  // handle nextSlide Function
  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlides - 1;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
    activateDots(currentSlide);
  };

  sliderBtnRight.addEventListener('click', nextSlide);
  sliderBtnLeft.addEventListener('click', prevSlide);

  // to handle arrow right and left buttons
  document.addEventListener('keydown', function (e) {
    //ArrowRight
    e.key == 'ArrowRight' && nextSlide();

    //ArrowLeft
    e.key == 'ArrowLeft' && prevSlide();
  });

  // handle onClick function
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDots(slide);
    }
  });
};

Slider();
