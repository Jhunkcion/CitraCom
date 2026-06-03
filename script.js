/* ========================================
   CITRA COM — Interactive JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ===== HERO PARTICLES =====
    const particlesContainer = document.getElementById('heroParticles');
    if (particlesContainer) {
        for (let i = 0; i < 40; i++) {
            const particle = document.createElement('div');
            particle.classList.add('hero-particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.width = particle.style.height = Math.random() * 4 + 2 + 'px';
            particle.style.animationDuration = Math.random() * 10 + 8 + 's';
            particle.style.animationDelay = Math.random() * 10 + 's';
            particlesContainer.appendChild(particle);
        }
    }

    // ===== NAVBAR SCROLL =====
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function handleNavScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active nav link based on scroll position
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', handleNavScroll);
    handleNavScroll();

    // ===== MOBILE MENU =====
    const hamburger = document.getElementById('hamburger');
    const navLinksContainer = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
        document.body.style.overflow = navLinksContainer.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinksContainer.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ===== SCROLL REVEAL ANIMATION =====
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation for sibling elements
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach((el, i) => {
        // Add stagger delay for grid items
        const parent = el.parentElement;
        if (parent && (parent.classList.contains('layanan-grid') || 
                       parent.classList.contains('catalog-grid') ||
                       parent.classList.contains('tentang-features'))) {
            const siblings = Array.from(parent.querySelectorAll('.reveal'));
            const siblingIndex = siblings.indexOf(el);
            el.dataset.delay = siblingIndex * 100;
        }
        revealObserver.observe(el);
    });



    // ===== CATALOG FILTER =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    const templateCards = document.querySelectorAll('.template-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            templateCards.forEach(card => {
                if (filter === 'semua' || card.dataset.category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.4s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ===== GALLERY LIGHTBOX =====
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const thumb = item.querySelector('.gallery-thumb');
            const caption = item.dataset.caption;
            
            // Copy the background style to lightbox
            const computedStyle = getComputedStyle(thumb);
            lightboxImage.style.background = computedStyle.background;
            lightboxImage.style.backgroundSize = 'cover';
            lightboxCaption.textContent = caption;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });


    // ===== CONTACT FORM =====
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nama = document.getElementById('nama').value.trim();
        const telepon = document.getElementById('telepon').value.trim();
        const layanan = document.getElementById('layanan-select').value;
        const pesan = document.getElementById('pesan').value.trim();

        if (!nama || !telepon || !layanan || !pesan) {
            showNotification('Mohon lengkapi semua field.', 'error');
            return;
        }

        // Build WhatsApp message
        const waMessage = `Halo Citra Com! 👋%0A%0A` +
            `*Nama:* ${nama}%0A` +
            `*Telepon:* ${telepon}%0A` +
            `*Layanan:* ${layanan}%0A` +
            `*Pesan:* ${pesan}`;

        window.open(`https://wa.me/6281234567890?text=${waMessage}`, '_blank');
        
        showNotification('Pesan Anda sedang dikirim via WhatsApp!', 'success');
        contactForm.reset();
    });

    // ===== NOTIFICATION =====
    function showNotification(message, type = 'success') {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" style="background:none;border:none;color:inherit;font-size:1.2rem;cursor:pointer;margin-left:12px;">×</button>
        `;
        
        // Styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '24px',
            padding: '14px 20px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem',
            fontWeight: '500',
            zIndex: '3000',
            animation: 'fadeInDown 0.4s ease forwards',
            maxWidth: '400px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
            background: type === 'success' 
                ? 'linear-gradient(135deg, #10B981, #059669)' 
                : 'linear-gradient(135deg, #EF4444, #DC2626)',
            color: 'white',
        });

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'fadeInUp 0.4s ease reverse forwards';
            setTimeout(() => notification.remove(), 400);
        }, 4000);
    }

    // ===== SMOOTH SCROLL for all anchor links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});
