// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Phone Showcase Animation
class PhoneShowcase {
    constructor() {
        this.currentIndex = 0;
        this.mediaContents = document.querySelectorAll('.media-content');
        this.autoPlayInterval = null;
        this.isPlaying = true;
        
        this.init();
    }
    
    init() {
        if (this.mediaContents.length === 0) return;
        
        this.showMedia(0);
        this.startAutoPlay();
        this.bindEvents();
        this.addFloatingElements();
    }
    
    showMedia(index) {
        // Remove active class from all items
        this.mediaContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to current item
        if (this.mediaContents[index]) {
            this.mediaContents[index].classList.add('active');
        }
        
        this.currentIndex = index;
    }
    
    nextMedia() {
        const nextIndex = (this.currentIndex + 1) % this.mediaContents.length;
        this.showMedia(nextIndex);
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            if (this.isPlaying) {
                this.nextMedia();
            }
        }, 3500);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }
    
    pauseAutoPlay() {
        this.isPlaying = false;
    }
    
    resumeAutoPlay() {
        this.isPlaying = true;
    }
    
    addFloatingElements() {
        const phoneShowcase = document.querySelector('.phone-showcase');
        if (!phoneShowcase) return;
        
        const floatingContainer = document.createElement('div');
        floatingContainer.className = 'floating-elements';
        
        for (let i = 0; i < 3; i++) {
            const circle = document.createElement('div');
            circle.className = 'float-circle';
            floatingContainer.appendChild(circle);
        }
        
        phoneShowcase.appendChild(floatingContainer);
    }
    
    bindEvents() {
        // Phone device hover effects
        const phoneDevice = document.querySelector('.phone-device');
        if (phoneDevice) {
            phoneDevice.addEventListener('mouseenter', () => this.pauseAutoPlay());
            phoneDevice.addEventListener('mouseleave', () => this.resumeAutoPlay());
        }
        
        // Video play buttons
        const playIcons = document.querySelectorAll('.play-icon');
        playIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                const videoContent = icon.closest('.media-content');
                const video = videoContent.querySelector('video');
                if (video) {
                    if (video.paused) {
                        video.play();
                        icon.style.opacity = '0';
                    } else {
                        video.pause();
                        icon.style.opacity = '1';
                    }
                }
            });
        });
        
        // Video ended event
        const videos = document.querySelectorAll('.phone-media[data-type="video"]');
        videos.forEach(video => {
            video.addEventListener('ended', () => {
                const playIcon = video.parentElement.querySelector('.play-icon');
                if (playIcon) {
                    playIcon.style.opacity = '1';
                }
            });
        });
        
        // Touch support for mobile
        let startX = 0;
        let startY = 0;
        
        if (phoneDevice) {
            phoneDevice.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            });
            
            phoneDevice.addEventListener('touchend', (e) => {
                const endX = e.changedTouches[0].clientX;
                const endY = e.changedTouches[0].clientY;
                const diffX = startX - endX;
                const diffY = startY - endY;
                
                // Horizontal swipe detection
                if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                    if (diffX > 0) {
                        // Swipe left - next media
                        this.nextMedia();
                    } else {
                        // Swipe right - previous media
                        const prevIndex = this.currentIndex === 0 ? 
                            this.mediaContents.length - 1 : this.currentIndex - 1;
                        this.showMedia(prevIndex);
                    }
                    this.pauseAutoPlay();
                    setTimeout(() => this.resumeAutoPlay(), 3000);
                }
            });
        }
    }
}

// Initialize phone showcase when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const phoneShowcase = new PhoneShowcase();
    const servicesCarousel = new ServicesCarousel();
    
    // Initialize scroll animations
    new ScrollAnimations();
    
    // Social Media Interactions
    const socialCircles = document.querySelectorAll('.social-circle');
    
    socialCircles.forEach(circle => {
        // Ripple effect on mouseenter
        circle.addEventListener('mouseenter', function(e) {
            const ripple = document.createElement('div');
            ripple.classList.add('ripple-effect');
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        // Click animation
        circle.addEventListener('click', function(e) {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
});

// Scroll-triggered Animations System
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }
    
    init() {
        this.setupSectionAnimations();
        this.setupStaggeredAnimations();
        this.setupParallaxEffects();
        this.setupSocialInteractions();
    }
    
    setupSectionAnimations() {
        const sections = document.querySelectorAll('section');
        const footer = document.querySelector('.footer');
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, this.observerOptions);
        
        sections.forEach(section => {
            section.classList.add('animate-section');
            sectionObserver.observe(section);
        });
        
        // Observe footer separately
        if (footer) {
            sectionObserver.observe(footer);
        }
    }
    
    setupStaggeredAnimations() {
        // Services grid items
        const serviceItems = document.querySelectorAll('.service-item');
        const serviceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = Array.from(serviceItems).indexOf(entry.target);
                    setTimeout(() => {
                        entry.target.classList.add('animate-service');
                    }, index * 100);
                }
            });
        }, this.observerOptions);
        
        serviceItems.forEach(item => {
            serviceObserver.observe(item);
        });
        
        // Contact items
        const contactItems = document.querySelectorAll('.contact-item, .social-circle');
        const contactObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = Array.from(contactItems).indexOf(entry.target);
                    setTimeout(() => {
                        entry.target.classList.add('animate-contact');
                    }, index * 150);
                }
            });
        }, this.observerOptions);
        
        contactItems.forEach(item => {
            contactObserver.observe(item);
        });
    }
    
    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.floating-element, .float-circle, .hero-visual');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            
            parallaxElements.forEach((element, index) => {
                const speed = 0.2 + (index * 0.1);
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }
    
    setupSocialInteractions() {
        // This method can be used for additional social interaction animations
        // if needed beyond the basic ripple effects
    }
}

// Services Carousel Animation
class ServicesCarousel {
    constructor() {
        this.carousels = document.querySelectorAll('.carousel-item');
        this.intervals = [];
        
        this.init();
    }
    
    init() {
        this.carousels.forEach((carousel, index) => {
            this.setupCarousel(carousel, index);
        });
    }
    
    setupCarousel(carousel, carouselIndex) {
        const slides = carousel.querySelectorAll('.carousel-slide');
        let currentSlide = 0;
        
        if (slides.length === 0) return;
        
        // Set first slide as active
        slides[0].classList.add('active');
        
        // Auto-advance slides
        const interval = setInterval(() => {
            this.nextSlide(slides, currentSlide);
            currentSlide = (currentSlide + 1) % slides.length;
        }, 3000 + (carouselIndex * 500)); // Stagger timing for different carousels
        
        this.intervals.push(interval);
        
        // Pause on hover
        carousel.addEventListener('mouseenter', () => {
            clearInterval(this.intervals[carouselIndex]);
        });
        
        carousel.addEventListener('mouseleave', () => {
            const newInterval = setInterval(() => {
                this.nextSlide(slides, currentSlide);
                currentSlide = (currentSlide + 1) % slides.length;
            }, 3000 + (carouselIndex * 500));
            
            this.intervals[carouselIndex] = newInterval;
        });
    }
    
    nextSlide(slides, currentIndex) {
        const nextIndex = (currentIndex + 1) % slides.length;
        this.showSlide(slides, nextIndex);
    }
    
    showSlide(slides, index) {
        // Remove active class from all slides
        slides.forEach(slide => slide.classList.remove('active'));
        
        // Add active class to current slide
        if (slides[index]) slides[index].classList.add('active');
    }
    
    destroy() {
        this.intervals.forEach(interval => clearInterval(interval));
    }
}

// Smooth Scrolling for Navigation Links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80; // Account for fixed nav
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});



// Scroll Animation for Service Cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service cards for animation
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
});

// Navbar Background on Scroll
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.nav');
    if (window.scrollY > 100) {
        nav.style.background = 'rgba(255, 255, 255, 0.98)';
        nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        nav.style.background = 'rgba(255, 255, 255, 0.95)';
        nav.style.boxShadow = 'none';
    }
});

// Floating Elements Animation Enhancement
const floatingElements = document.querySelectorAll('.floating-element');
floatingElements.forEach((element, index) => {
    element.addEventListener('mouseenter', () => {
        element.style.transform = 'scale(1.1)';
        element.style.transition = 'transform 0.3s ease';
    });
    
    element.addEventListener('mouseleave', () => {
        element.style.transform = 'scale(1)';
    });
});

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroVisual = document.querySelector('.hero-visual');
    
    if (heroVisual) {
        heroVisual.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate hero elements on load
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-description, .hero-highlights, .cta-button');
    heroElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// Add smooth reveal animation for sections
const sections = document.querySelectorAll('section');
sections.forEach(section => {
    observer.observe(section);
});

// Enhanced media showcase with touch support
let startX = 0;
let currentX = 0;
let isDragging = false;

const mediaGrid = document.querySelector('.media-grid');

if (mediaGrid) {
    mediaGrid.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        stopMediaCarousel();
    });
    
    mediaGrid.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        e.preventDefault(); // Prevent scrolling
    });
    
    mediaGrid.addEventListener('touchend', () => {
        if (!isDragging) return;
        
        const diffX = startX - currentX;
        
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // Swipe left - next media
                nextMedia();
            } else {
                // Swipe right - previous media
                const prevIndex = currentMedia - 1 < 0 ? mediaItems.length - 1 : currentMedia - 1;
                showMedia(prevIndex);
            }
        }
        
        isDragging = false;
        setTimeout(startMediaCarousel, 2000); // Restart carousel after swipe
    });
}

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        const prevIndex = currentMedia - 1 < 0 ? mediaItems.length - 1 : currentMedia - 1;
        showMedia(prevIndex);
        stopMediaCarousel();
        setTimeout(startMediaCarousel, 2000);
    } else if (e.key === 'ArrowRight') {
        nextMedia();
        stopMediaCarousel();
        setTimeout(startMediaCarousel, 2000);
    }
});

// Add typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect on load
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 150);
        }, 1000);
    }
});

// Add cursor follow effect
const cursor = document.createElement('div');
cursor.classList.add('cursor');
document.body.appendChild(cursor);

// Add cursor styles
const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
    .cursor {
        width: 20px;
        height: 20px;
        border: 2px solid #6366f1;
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        opacity: 0;
    }
    
    @media (hover: hover) {
        .cursor {
            opacity: 1;
        }
    }
`;
document.head.appendChild(cursorStyle);

// Update cursor position
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX - 10 + 'px';
    cursor.style.top = e.clientY - 10 + 'px';
});

// Scale cursor on hover
const hoverElements = document.querySelectorAll('a, button, .service-card, .media-item');
hoverElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)';
        cursor.style.backgroundColor = 'rgba(99, 102, 241, 0.2)';
    });
    
    element.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursor.style.backgroundColor = 'transparent';
    });
});

// Add intersection observer for media items
const mediaObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'scale(1) translateY(0)';
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
});

// Observe media items for scroll animations
mediaItems.forEach((item, index) => {
    item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    mediaObserver.observe(item);
});

// Add glitch effect on media item click
mediaItems.forEach(item => {
    item.addEventListener('click', () => {
        if (!item.classList.contains('active')) {
            const index = Array.from(mediaItems).indexOf(item);
            showMedia(index);
            stopMediaCarousel();
            setTimeout(startMediaCarousel, 3000);
        }
    });
});