// DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('AI Chef website loaded successfully');

    // Initialize all functionality
    initMobileMenu();
    initSmoothScrolling();
    initScrollAnimations();
    initForms();
    initFAQ();
    initScrollSpy();
    initBackToTop();
});

// -----------------------------
// Mobile Menu Functionality
// -----------------------------
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (!menuToggle || !navMenu) return;

    // Create overlay for mobile menu (if not present)
    let overlay = document.querySelector('.menu-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        document.body.appendChild(overlay);
    }

    const openMenu = () => {
        navMenu.classList.add('active');
        menuToggle.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        overlay.classList.add('active');
        document.body.classList.add('menu-open');
        // lock scroll on mobile
        document.documentElement.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        overlay.classList.remove('active');
        document.body.classList.remove('menu-open');
        document.documentElement.style.overflow = '';
    };

    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (navMenu.classList.contains('active')) closeMenu(); else openMenu();
    });

    // Close when clicking overlay or nav links
    overlay.addEventListener('click', closeMenu);

    navMenu.addEventListener('click', (e) => {
        const target = e.target.closest('a');
        if (target && target.getAttribute('href') && target.getAttribute('href').startsWith('#')) {
            // close menu after navigation for single-page anchors
            closeMenu();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) closeMenu();
    });

    // Click outside the navMenu should close when it's open (desktop fallback)
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // Accessibility: set initial aria state
    menuToggle.setAttribute('aria-controls', 'nav-menu');
    menuToggle.setAttribute('aria-expanded', 'false');
    navMenu.setAttribute('id', navMenu.id || 'nav-menu');
}

// -----------------------------
// Smooth Scrolling for Anchor Links
// -----------------------------
function initSmoothScrolling() {
    // Only attach to in-page hashes
    const anchorLinks = Array.from(document.querySelectorAll('a[href^="#"]'))
        .filter(a => a.getAttribute('href') !== '#' && a.hash);

    const header = document.querySelector('.navbar') || document.querySelector('nav');
    const headerHeight = header ? header.offsetHeight : 70;

    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            const target = document.querySelector(href);
            if (!target) return; // allow normal behavior if no target
            e.preventDefault();

            // Compute target top while keeping it >= 0
            const rect = target.getBoundingClientRect();
            const absoluteTop = window.pageYOffset + rect.top - headerHeight - 16;
            const top = Math.max(0, absoluteTop);

            window.scrollTo({ top, behavior: 'smooth' });

            // Update URL hash without jumping
            if (history.pushState) {
                history.pushState(null, '', href);
            } else {
                location.hash = href;
            }
        });
    });
}

// -----------------------------
// Scroll Animations
// -----------------------------
function initScrollAnimations() {
    const animateOnScroll = document.querySelectorAll('.card, .feature-card, .contact-form, .hero h1, .hero p');

    if (!('IntersectionObserver' in window)) {
        // If not supported, just reveal immediately
        animateOnScroll.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    animateOnScroll.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(18px)';
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        observer.observe(el);
    });
}

// -----------------------------
// Form Handling
// -----------------------------
function initForms() {
    const forms = document.querySelectorAll('form');
    if (!forms.length) return;

    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateForm(form)) {
                handleFormSubmission(form);
            }
        });
    });
}

// Form Validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
        const value = (input.value || '').trim();
        if (!value) {
            showFieldError(input, 'Bu alan zorunludur');
            isValid = false;
            return;
        }

        if (input.type === 'email' && !isValidEmail(value)) {
            showFieldError(input, 'Geçerli bir email adresi girin');
            isValid = false;
        } else {
            clearFieldError(input);
        }
    });

    return isValid;
}

// Email Validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show Field Error
function showFieldError(input, message) {
    clearFieldError(input);
    input.classList.add('has-error');
    input.style.borderColor = '#e74c3c';

    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    input.parentNode.appendChild(errorDiv);
}

// Clear Field Error
function clearFieldError(input) {
    input.classList.remove('has-error');
    input.style.borderColor = '';
    const existingError = input.parentNode && input.parentNode.querySelector('.field-error');
    if (existingError) existingError.remove();
}

// Handle Form Submission
function handleFormSubmission(form) {
    const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : '';

    if (submitBtn) {
        submitBtn.textContent = 'Gönderiliyor...';
        submitBtn.disabled = true;
    }

    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
        showNotification('Mesajınız başarıyla gönderildi!', 'success');
        try { form.reset(); } catch (e) {}

        if (submitBtn) {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }, 1000);
}

// -----------------------------
// Show Notification
// -----------------------------
function showNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    Object.assign(notification.style, {
        position: 'fixed', top: '20px', right: '20px', padding: '0.9rem 1.25rem', borderRadius: '10px', color: 'white', fontWeight: '600', zIndex: '10050', opacity: '0', transform: 'translateY(-6px)', transition: 'all 0.25s ease'
    });

    switch (type) {
        case 'success': notification.style.backgroundColor = '#27ae60'; break;
        case 'error': notification.style.backgroundColor = '#e74c3c'; break;
        case 'warning': notification.style.backgroundColor = '#f39c12'; break;
        default: notification.style.backgroundColor = '#3498db';
    }

    document.body.appendChild(notification);
    requestAnimationFrame(() => { notification.style.opacity = '1'; notification.style.transform = 'translateY(0)'; });

    setTimeout(() => { notification.style.opacity = '0'; notification.style.transform = 'translateY(-6px)'; setTimeout(() => notification.remove(), 220); }, 4200);
}

// -----------------------------
// FAQ Functionality
// -----------------------------
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (!question || !answer) return;

        question.setAttribute('tabindex', '0');
        question.addEventListener('click', () => toggleFAQ(item, answer));
        question.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleFAQ(item, answer); } });
    });
}

function toggleFAQ(item, answer) {
    const isActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item.active').forEach(i => { i.classList.remove('active'); const a = i.querySelector('.faq-answer'); if (a) a.style.display = 'none'; });
    if (!isActive) { item.classList.add('active'); answer.style.display = 'block'; } else { item.classList.remove('active'); answer.style.display = 'none'; }
}

// -----------------------------
// Scroll Spy (active nav links)
// -----------------------------
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    if (!sections.length || !navLinks.length) return;

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const link = document.querySelector(`.nav-menu a[href="#${id}"]`);
            if (!link) return;
            if (entry.isIntersecting) {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(s => obs.observe(s));
}

// -----------------------------
// Back to Top
// -----------------------------
function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    const toggle = () => {
        if (window.scrollY > 400) btn.classList.add('show'); else btn.classList.remove('show');
    };

    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    window.addEventListener('scroll', toggle);
    toggle();
}

// Newsletter form handler
document.addEventListener('DOMContentLoaded', () => {
    const newsletter = document.getElementById('newsletter-form');
    if (!newsletter) return;
    newsletter.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletter.querySelector('input[type="email"]');
        if (!emailInput) return;
        const email = (emailInput.value || '').trim();
        if (!isValidEmail(email)) { showNotification('Lütfen geçerli bir email girin', 'error'); emailInput.focus(); return; }

        // Simulate subscribe
        const submitBtn = newsletter.querySelector('button[type="submit"]');
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Abone olunuyor...'; }
        setTimeout(() => {
            showNotification('Teşekkürler! Bültene kaydınız alındı.', 'success');
            try { newsletter.reset(); } catch (e) {}
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Subscribe'; }
        }, 900);
    });
});