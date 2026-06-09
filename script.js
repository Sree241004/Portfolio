document.addEventListener('DOMContentLoaded', () => {
    /* ==================== MOBILE NAVIGATION MENU ==================== */
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav-link');

    // Show menu
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show-menu');
        });
    }

    // Hide menu
    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    }

    // Hide menu on click of any nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    });

    /* ==================== ACTIVE LINK ON SCROLL ==================== */
    const sections = document.querySelectorAll('section[id]');

    function scrollActive() {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100; // Offset for header height
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active-link');
                } else {
                    navLink.classList.remove('active-link');
                }
            }
        });
    }
    window.addEventListener('scroll', scrollActive);
    scrollActive(); // Initial run

    /* ==================== HEADER SHADOW ON SCROLL ==================== */
    const header = document.getElementById('header');
    
    function scrollHeader() {
        if (window.scrollY >= 50) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4)';
            header.style.backgroundColor = 'rgba(6, 9, 16, 0.92)';
        } else {
            header.style.boxShadow = 'none';
            header.style.backgroundColor = 'rgba(9, 13, 22, 0.8)';
        }
    }
    window.addEventListener('scroll', scrollHeader);
    scrollHeader(); // Initial run

    /* ==================== SCROLL ENTRANCE REVEAL ANIMATIONS ==================== */
    // Add reveal class to all sections and cards dynamically for cleaner HTML
    const revealTargets = [];
    
    // Select containers and cards to reveal
    const animatedSections = document.querySelectorAll('.section');
    animatedSections.forEach(sec => {
        sec.classList.add('reveal');
        revealTargets.push(sec);
    });

    const animatedCards = document.querySelectorAll('.card, .timeline-item');
    animatedCards.forEach(card => {
        card.classList.add('reveal');
        // Add a small inline delay dynamically for stagger effects if in a group
        revealTargets.push(card);
    });

    // Intersection Observer Configuration
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                // Unobserve after revealing to prevent repeating animations
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters fully
    });

    revealTargets.forEach(target => {
        revealObserver.observe(target);
    });

    /* ==================== DYNAMIC TYPING SIMULATION ==================== */
    const typedTitleElement = document.querySelector('.hero-typed-title');
    if (typedTitleElement) {
        const titles = [
            'AI/ML Enthusiast',
            'Data Science Student',
            'ECE Engineer'
        ];
        
        let titleIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function typeEffect() {
            const currentTitle = titles[titleIdx];
            
            if (isDeleting) {
                typedTitleElement.textContent = currentTitle.substring(0, charIdx - 1);
                charIdx--;
                typingSpeed = 50; // Deleting is faster
            } else {
                typedTitleElement.textContent = currentTitle.substring(0, charIdx + 1);
                charIdx++;
                typingSpeed = 100; // Normal typing speed
            }

            // Word completed
            if (!isDeleting && charIdx === currentTitle.length) {
                isDeleting = true;
                typingSpeed = 2000; // Pause at end of word
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                titleIdx = (titleIdx + 1) % titles.length;
                typingSpeed = 500; // Pause before typing next word
            }

            setTimeout(typeEffect, typingSpeed);
        }
        
        // Start after a slight delay
        setTimeout(typeEffect, 1000);
    }

    /* ==================== CONTACT FORM SUBMISSION ==================== */
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('contact-submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Change button state to loading
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            
            // Clear status
            formStatus.className = 'form-status';
            formStatus.textContent = '';

            const name = document.getElementById('user-name').value;

            // Prepare form data
            const formData = new FormData(contactForm);

            // POST to Formspree endpoint
            fetch('https://formspree.io/f/mrevkpdn', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;

                if (response.ok) {
                    formStatus.classList.add('success');
                    formStatus.textContent = `Thank you, ${name}! Your message has been sent successfully. I will get back to you soon.`;
                    contactForm.reset();
                } else {
                    response.json().then(data => {
                        formStatus.classList.add('error');
                        if (Object.hasOwn(data, 'errors')) {
                            formStatus.textContent = data.errors.map(error => error.message).join(", ");
                        } else {
                            formStatus.textContent = "Oops! There was a problem submitting your form. Please try again.";
                        }
                    });
                }
            })
            .catch(error => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                formStatus.classList.add('error');
                formStatus.textContent = "Oops! There was a connection issue. Please check your network and try again.";
            });
        });
    }
});
