document.addEventListener('DOMContentLoaded', () => {
    // 1. Custom Interactive Cursor Glow
    const cursorGlow = document.getElementById('cursor-glow');
    
    if (cursorGlow) {
        window.addEventListener('mousemove', (e) => {
            // Use requestAnimationFrame for performance optimization
            window.requestAnimationFrame(() => {
                cursorGlow.style.left = `${e.clientX}px`;
                cursorGlow.style.top = `${e.clientY}px`;
            });
        });
    }

    // 2. Header Scroll Effect
    const header = document.querySelector('.header');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check on load

    // 3. Mobile Navbar Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navbar) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navbar.classList.toggle('active');
        });

        // Close mobile nav when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navbar.classList.remove('active');
            });
        });
    }

    // 4. Scroll Reveal (Intersection Observer for fade-in elements)
    const revealElements = document.querySelectorAll('.fade-in-up');
    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing once animate-in is done
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport fully
    });

    revealElements.forEach(element => {
        revealOnScroll.observe(element);
    });

    // 5. Active Link Sync (Scroll Spy)
    const sections = document.querySelectorAll('section');
    const spyOptions = {
        threshold: 0.5,
        rootMargin: '-80px 0px -40% 0px'
    };

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, spyOptions);

    sections.forEach(section => {
        spyObserver.observe(section);
    });

    // 6. Project Filter Logic
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active filter button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // Reset card transition styles
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

                if (filterValue === 'all' || cardCategory === filterValue) {
                    // Show matching cards with transition
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    // Hide non-matching cards
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // 7. Contact Form Validation & Mock Submission
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('contact-submit-btn');
    const toastResponse = document.getElementById('form-toast-response');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Inputs
            const nameInput = document.getElementById('contact-name');
            const emailInput = document.getElementById('contact-email');
            const subjectInput = document.getElementById('contact-subject');
            const messageInput = document.getElementById('contact-message');

            let isValid = true;

            // Simple Validation Rules
            // Name Check
            if (nameInput.value.trim() === '') {
                showError(nameInput);
                isValid = false;
            } else {
                clearError(nameInput);
            }

            // Email Check
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                showError(emailInput);
                isValid = false;
            } else {
                clearError(emailInput);
            }

            // Subject Check
            if (subjectInput.value.trim() === '') {
                showError(subjectInput);
                isValid = false;
            } else {
                clearError(subjectInput);
            }

            // Message Check
            if (messageInput.value.trim() === '') {
                showError(messageInput);
                isValid = false;
            } else {
                clearError(messageInput);
            }

            // If Valid, Send Mock Request
            if (isValid) {
                // Change button state
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';

                // Simulate API post response (1.5 seconds)
                setTimeout(() => {
                    // Reset Button State
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;

                    // Show Toast Alert Notification
                    if (toastResponse) {
                        toastResponse.style.display = 'flex';
                        
                        // Scroll to the bottom of the form to view the toast response clearly
                        toastResponse.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

                        // Reset Form Fields
                        contactForm.reset();

                        // Hide toast response after 5 seconds
                        setTimeout(() => {
                            toastResponse.style.animation = 'slideInDown 0.4s ease reverse';
                            setTimeout(() => {
                                toastResponse.style.display = 'none';
                                toastResponse.style.animation = 'slideInDown 0.4s ease forwards';
                            }, 400);
                        }, 5000);
                    }
                }, 1500);
            }
        });

        // Helper function to display input error
        function showError(input) {
            const formGroup = input.closest('.form-group');
            if (formGroup) {
                formGroup.classList.add('error');
            }
        }

        // Helper function to remove input error
        function clearError(input) {
            const formGroup = input.closest('.form-group');
            if (formGroup) {
                formGroup.classList.remove('error');
            }
        }

        // Interactive validation on blur/input
        const inputsToValidate = contactForm.querySelectorAll('input, textarea');
        inputsToValidate.forEach(input => {
            input.addEventListener('blur', () => {
                if (input.value.trim() !== '') {
                    clearError(input);
                }
            });
            input.addEventListener('input', () => {
                if (input.value.trim() !== '') {
                    clearError(input);
                }
            });
        });
    }
});
