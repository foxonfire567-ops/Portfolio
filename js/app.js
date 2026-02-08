class ParticleSystem {
    constructor(container, particleCount = 50) {
        this.container = container;
        this.particleCount = particleCount;
        this.particles = [];
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = Math.random() * 6 + 4 + 's';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        return particle;
    }

    init() {
        for (let i = 0; i < this.particleCount; i++) {
            const particle = this.createParticle();
            this.particles.push(particle);
            this.container.appendChild(particle);
        }
    }
}

class Navigation {
    constructor() {
        this.nav = document.querySelector('nav');
        this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        this.navLinks = document.querySelector('.nav-links');
        this.scrollIndicator = document.querySelector('.scroll-indicator');
        this.lastScrollY = 0;
    }

    init() {
        this.bindEvents();
        this.setActiveLink();
    }

    bindEvents() {
        window.addEventListener('scroll', () => this.handleScroll());

        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        }

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
    }

    handleScroll() {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            this.nav.classList.add('scrolled');
        } else {
            this.nav.classList.remove('scrolled');
        }

        this.updateScrollIndicator();
        this.lastScrollY = scrollY;
    }

    updateScrollIndicator() {
        if (!this.scrollIndicator) return;

        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        this.scrollIndicator.style.width = scrollPercent + '%';
    }

    toggleMobileMenu() {
        this.mobileMenuBtn.classList.toggle('active');
        this.navLinks.classList.toggle('active');
    }

    closeMobileMenu() {
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.classList.remove('active');
        }
        if (this.navLinks) {
            this.navLinks.classList.remove('active');
        }
    }

    setActiveLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-links a').forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }
}

class Lightbox {
    constructor() {
        this.lightbox = null;
        this.lightboxImg = null;
    }

    init() {
        this.createLightbox();
        this.bindEvents();
    }

    createLightbox() {
        this.lightbox = document.createElement('div');
        this.lightbox.classList.add('lightbox');

        this.lightboxImg = document.createElement('img');
        this.lightboxImg.alt = 'Gallery Image';

        const closeBtn = document.createElement('button');
        closeBtn.classList.add('lightbox-close');
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', () => this.close());

        this.lightbox.appendChild(this.lightboxImg);
        this.lightbox.appendChild(closeBtn);
        document.body.appendChild(this.lightbox);

        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.close();
            }
        });
    }

    bindEvents() {
        document.querySelectorAll('.gallery-item img').forEach(img => {
            img.addEventListener('click', () => this.open(img.src));
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.lightbox.classList.contains('active')) {
                this.close();
            }
        });
    }

    open(src) {
        this.lightboxImg.src = src;
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.reveal');
        this.observer = null;
    }

    init() {
        this.createObserver();
        this.observe();
    }

    createObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, options);
    }

    observe() {
        this.elements.forEach(el => this.observer.observe(el));
    }
}

class ContactForm {
    constructor(formElement) {
        this.form = formElement;
    }

    init() {
        if (!this.form) return;
        this.bindEvents();
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        this.form.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('focus', () => this.handleFocus(field));
            field.addEventListener('blur', () => this.handleBlur(field));
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());

        this.showNotification('Message sent successfully!', 'success');
        this.form.reset();

        console.log('Form data:', data);
    }

    handleFocus(field) {
        field.parentElement.classList.add('focused');
    }

    handleBlur(field) {
        if (!field.value) {
            field.parentElement.classList.remove('focused');
        }
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            padding: 1rem 2rem;
            background: ${type === 'success' ? 'linear-gradient(135deg, #dc2626 0%, #f97316 100%)' : '#ef4444'};
            color: white;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(220, 38, 38, 0.3);
            z-index: 3000;
            animation: slideInNotification 0.3s ease forwards;
        `;
        notification.textContent = message;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInNotification {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideInNotification 0.3s ease reverse forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

class SmoothScroll {
    constructor() {
        this.links = document.querySelectorAll('a[href^="#"]');
    }

    init() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => this.handleClick(e, link));
        });
    }

    handleClick(e, link) {
        const href = link.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

class VideoPlayer {
    constructor() {
        this.videoCards = document.querySelectorAll('.video-card');
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.videoCards.forEach(card => {
            card.addEventListener('click', () => this.handleVideoClick(card));
        });
    }

    handleVideoClick(card) {
        const videoUrl = card.dataset.videoUrl;
        if (videoUrl) {
            window.open(videoUrl, '_blank');
        }
    }
}

class App {
    constructor() {
        this.navigation = new Navigation();
        this.lightbox = new Lightbox();
        this.scrollReveal = new ScrollReveal();
        this.smoothScroll = new SmoothScroll();
        this.videoPlayer = new VideoPlayer();
        this.contactForm = new ContactForm(document.querySelector('.contact-form'));
        this.particleContainer = document.querySelector('.particle-container');
    }

    init() {
        this.navigation.init();
        this.lightbox.init();
        this.scrollReveal.init();
        this.smoothScroll.init();
        this.videoPlayer.init();
        this.contactForm.init();

        if (this.particleContainer) {
            const particleSystem = new ParticleSystem(this.particleContainer, 40);
            particleSystem.init();
        }

        this.addCursorEffect();
    }

    addCursorEffect() {
        const cursor = document.createElement('div');
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(220, 38, 38, 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease, opacity 0.3s ease;
            mix-blend-mode: difference;
        `;
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
        });

        document.querySelectorAll('a, button, .gallery-item').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(2)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});
