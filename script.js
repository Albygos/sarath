(function () {
  "use strict";

  let resizeTimeout;
  function fitExactDesign() {
    var mobile = document.querySelector(".responsive-mobile");
    var desktop = document.querySelector(".responsive-desktop");
    var isMobile = window.innerWidth <= 768;
    var wrapper = isMobile ? mobile : desktop;
    if (mobile) mobile.style.display = isMobile ? 'block' : 'none';
    if (desktop) desktop.style.display = !isMobile ? 'block' : 'none';
    if (!wrapper) return;

    var baseWidth = isMobile ? 390 : 1920;
    var scale = Math.min(1, window.innerWidth / baseWidth);

    wrapper.style.transform = "scale(" + scale + ") translateZ(0)";
    wrapper.style.transformOrigin = "top center";
    wrapper.style.width = baseWidth + "px";
    wrapper.style.willChange = "transform";

    var root = isMobile
      ? wrapper.querySelector("#__x2d_body")
      : wrapper.querySelector("#__0") || wrapper.firstElementChild;

    if (root) {
        root.style.overflow = "visible";
    }

    if (isMobile) {
        var heroBg = wrapper.querySelector("#home-image-slider-1");
        if (heroBg) {
            var currentHeight = 702;
            var targetHeight = window.innerHeight / scale;
            var diff = Math.max(0, targetHeight - currentHeight);

            heroBg.style.height = (currentHeight + diff) + "px";
            var heroImg = heroBg.querySelector("#Image");
            if (heroImg) heroImg.style.height = (currentHeight + diff) + "px";

            var els = wrapper.querySelectorAll('#__x2d_body > *:not(#navbar-container), #Container > *:not(#home-image-slider-1)');
            els.forEach(function(el) {
                if (!el.dataset.origTop) {
                    var topStr = window.getComputedStyle(el).top;
                    el.dataset.origTop = (topStr && topStr !== 'auto') ? parseFloat(topStr) : 0;
                }
                var origTop = parseFloat(el.dataset.origTop);
                if (origTop >= 700) {
                    el.style.top = (origTop + diff) + "px";
                } else if (origTop >= 300 && origTop < 600) {
                    el.style.top = (origTop + diff / 2) + "px";
                } else if (origTop >= 600 && origTop < 700) {
                    el.style.top = (origTop + diff) + "px";
                }
            });

            var rootBody = wrapper.querySelector('#__x2d_body');
            var containerDiv = wrapper.querySelector('#Container');
            if (rootBody) {
                if (!rootBody.dataset.origHeight) rootBody.dataset.origHeight = 6967;
                var newBodyHeight = parseFloat(rootBody.dataset.origHeight) + diff;
                rootBody.style.minHeight = newBodyHeight + "px";
                rootBody.style.maxHeight = newBodyHeight + "px";
                rootBody.style.height = newBodyHeight + "px";
            }
            if (containerDiv) {
                if (!containerDiv.dataset.origHeight) containerDiv.dataset.origHeight = 7180;
                containerDiv.style.height = (parseFloat(containerDiv.dataset.origHeight) + diff) + "px";
            }
        }
    }

    /* "VIEW ON INSTAGRAM" sits outside the carousel with a hard-coded design top,
       so it does not follow the carousel when the hero is stretched to the viewport.
       Re-anchor it to the measured bottom of the carousel for a constant gap. */
    var reelCarousel = wrapper.querySelector("#Region_Media_carousel");
    var reelCta = wrapper.querySelector("#Mention_Widget");
    var ctaAnchor = reelCta ? reelCta.offsetParent : null;
    if (reelCarousel && ctaAnchor) {
        var ctaGap = isMobile ? 28 : 40;
        var carouselBottom = reelCarousel.getBoundingClientRect().bottom;
        var anchorTop = ctaAnchor.getBoundingClientRect().top;
        reelCta.style.top = ((carouselBottom - anchorTop) / scale + ctaGap) + "px";
    }

    var baseHeight = root ? root.getBoundingClientRect().height / scale : wrapper.scrollHeight;
    wrapper.style.height = (baseHeight * scale) + "px";
    wrapper.style.marginBottom = "0";
    document.body.style.overflowX = "hidden";
  }

  function debouncedFit() {
      if(resizeTimeout) cancelAnimationFrame(resizeTimeout);
      resizeTimeout = requestAnimationFrame(fitExactDesign);
  }

  window.addEventListener("resize", debouncedFit, { passive: true });
  window.addEventListener("orientationchange", debouncedFit, { passive: true });
  document.addEventListener("DOMContentLoaded", fitExactDesign);
  window.addEventListener("load", fitExactDesign);
  fitExactDesign();
})();

/* Founder & Co-Founder Card Slider Animation */
function initFounderCardSlider() {
  const cardSliders = document.querySelectorAll('.founder-card-slider');

  cardSliders.forEach(slider => {
    const slides = slider.querySelectorAll('.founder-slide');
    if (slides.length < 2) return;

    let currentIndex = 0;
    let autoPlayTimer = null;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        if (i === index) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });
      currentIndex = index;
    }

    function nextSlide() {
      const nextIndex = (currentIndex + 1) % slides.length;
      showSlide(nextIndex);
    }

    function startAutoPlay() {
      stopAutoPlay();
      autoPlayTimer = setInterval(nextSlide, 4500);
    }

    function stopAutoPlay() {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    }

    slider.addEventListener('click', () => {
      nextSlide();
      startAutoPlay();
    });

    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);

    startAutoPlay();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFounderCardSlider);
} else {
  initFounderCardSlider();
}
function initCustomSlideshows() {
  const slideshows = document.querySelectorAll('.custom-slideshow');
  slideshows.forEach(show => {
    let imgs = show.querySelectorAll('.slide');
    if (imgs.length === 0) return;
    let idx = 0;
    setInterval(() => {
      imgs[idx].style.opacity = '0';
      idx = (idx + 1) % imgs.length;
      imgs[idx].style.opacity = '1';
    }, 3500);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCustomSlideshows);
} else {
  initCustomSlideshows();
}

// Handle Navbar Navigation for duplicate IDs (mobile vs desktop logic)
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('#navbar-container a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            const isMobile = window.innerWidth <= 768;
            const activeWrapper = isMobile 
                ? document.querySelector('.responsive-mobile') 
                : document.querySelector('.responsive-desktop');

            if (targetId === '#') {
                const scrollRoot = isMobile 
                    ? activeWrapper.querySelector('#__x2d_body') 
                    : (activeWrapper.querySelector('#__0') || activeWrapper.querySelector('#__x2d_body') || activeWrapper.firstElementChild);
                if (scrollRoot && typeof scrollRoot.scrollTo === 'function') {
                    scrollRoot.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
                return;
            }
            
            if (activeWrapper) {
                const target = activeWrapper.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
});

function initMainGalleryScrollAnimation() {
  const galleryItems = document.querySelectorAll('#Group_45 > div, #Group_42 > div, #Group_43 > div, #Group_44 > div, #Group_47 > div');
  
  if (galleryItems.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  galleryItems.forEach((item, idx) => {
    item.classList.add('scroll-anim-item');
    item.style.transitionDelay = `${(idx % 4) * 100}ms`;
    observer.observe(item);
  });

  galleryItems.forEach(item => {
    item.addEventListener('transitionend', function(e) {
      if (e.propertyName === 'opacity' || e.propertyName === 'transform') {
        this.style.transitionDelay = '0s';
      }
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMainGalleryScrollAnimation);
} else {
  initMainGalleryScrollAnimation();
}
