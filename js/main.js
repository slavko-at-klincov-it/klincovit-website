/* ═══════════════════════════════════════════
   KLINCOV.IT - Main JavaScript
   Bereinigt und optimiert
═══════════════════════════════════════════ */

// ═══════════════════════════════════════════
// CONFIGURATION CONSTANTS
// ═══════════════════════════════════════════
const CONFIG = {
    // Animation timing (ms)
    CARD_INIT_DELAY: 2000,
    MOBILE_MENU_CLOSE_DELAY: 300,
    COUNTER_ANIMATION_DURATION: 1500,
    COUNTER_ANIMATION_DURATION_LONG: 1800,
    COUNTER_STAGGER_DELAY: 200,
    COUNTER_CLEANUP_DELAY: 2000,
    RESIZE_DEBOUNCE: 100,
    FORM_SUBMIT_DELAY: 300,

    // Scroll animation
    HERO_ANIMATION_END_RATIO: 0.80,
    MAX_SPREAD_X: 200,
    MAX_SPREAD_Y: 40,
    MAX_OPACITY_LOSS: 0.1,
    SCROLL_HINT_THRESHOLD: 50,
    NAV_SCROLL_THRESHOLD: 100,

    // Observer thresholds
    REVEAL_THRESHOLD: 0.1,
    REVEAL_ROOT_MARGIN: '0px 0px -80px 0px',
    SECTION_ROOT_MARGIN: '-45% 0px -45% 0px',
    ROI_THRESHOLD: 0.3,
    TIMELINE_SCROLL_START_RATIO: 0.6,
    TIMELINE_TRIGGER_RATIO: 0.55,
    TIMELINE_ACTIVE_OFFSET: 100,

    // Challenge items animation
    CHALLENGE_ITEM_DELAY: 160,
    CHALLENGE_ITEM_INITIAL_DELAY: 60,

    // Magnetic button effect
    MAGNETIC_FACTOR: 0.1
};

// ═══════════════════════════════════════════
// FLOATING CARDS SCROLL ANIMATION
// ═══════════════════════════════════════════
(function() {
    const leftCards = document.querySelectorAll('.float-card[class*="left"]');
    const rightCards = document.querySelectorAll('.float-card[class*="right"]');
    const allCards = document.querySelectorAll('.float-card');
    const hero = document.querySelector('.hero');
    const scrollHint = document.querySelector('.scroll-hint');

    let ticking = false;
    let initialized = false;

    function initCards() {
        if (initialized) return;

        setTimeout(() => {
            allCards.forEach(card => {
                card.classList.add('scroll-controlled');
            });
            initialized = true;
        }, CONFIG.CARD_INIT_DELAY);
    }

    function updateScrollAnimation() {
        if (!initialized) {
            ticking = false;
            return;
        }

        const scrollY = window.scrollY;
        const heroHeight = hero.offsetHeight;
        const animationEndPoint = heroHeight * CONFIG.HERO_ANIMATION_END_RATIO;
        const progress = Math.min(scrollY / animationEndPoint, 1);
        const eased = 1 - Math.pow(1 - progress, 2);

        leftCards.forEach((card, index) => {
            const stagger = 1 + (index * 0.30);
            const xOffset = -CONFIG.MAX_SPREAD_X * eased * stagger;
            const yOffset = CONFIG.MAX_SPREAD_Y * eased * (index % 2 === 0 ? -1 : 1) * 0.3;
            const opacity = 1 - (CONFIG.MAX_OPACITY_LOSS * eased);

            card.style.marginLeft = `${xOffset}px`;
            card.style.marginTop = `${yOffset}px`;
            card.style.opacity = opacity;
        });

        rightCards.forEach((card, index) => {
            const stagger = 1 + (index * 0.30);
            const xOffset = CONFIG.MAX_SPREAD_X * eased * stagger;
            const yOffset = CONFIG.MAX_SPREAD_Y * eased * (index % 2 === 0 ? 1 : -1) * 0.3;
            const opacity = 1 - (CONFIG.MAX_OPACITY_LOSS * eased);

            card.style.marginRight = `${-xOffset}px`;
            card.style.marginTop = `${yOffset}px`;
            card.style.opacity = opacity;
        });

        if (scrollHint) {
            scrollHint.classList.toggle('hidden', scrollY > CONFIG.SCROLL_HINT_THRESHOLD);
        }

        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateScrollAnimation);
            ticking = true;
        }
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        // Initialize after fonts load
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(initCards);
        } else {
            window.addEventListener('load', initCards);
        }

        window.addEventListener('scroll', onScroll, { passive: true });
    }
})();

// ═══════════════════════════════════════════
// INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
// ═══════════════════════════════════════════
(function() {
    const observerOptions = {
        threshold: CONFIG.REVEAL_THRESHOLD,
        rootMargin: CONFIG.REVEAL_ROOT_MARGIN
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const challengesContainer = entry.target.closest('.challenges-compact');
            if (challengesContainer) {
                if (!challengesContainer.dataset.sequenced) {
                    challengesContainer.dataset.sequenced = '1';
                    const items = Array.from(challengesContainer.querySelectorAll('.challenge-item'));
                    items.forEach((it, i) => {
                        setTimeout(() => it.classList.add('visible'),
                            i * CONFIG.CHALLENGE_ITEM_DELAY + CONFIG.CHALLENGE_ITEM_INITIAL_DELAY);
                    });
                }
                challengesContainer.querySelectorAll('.reveal').forEach(el => obs.unobserve(el));
                return;
            }

            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ═══════════════════════════════════════════
// MODAL CONTROLLER
// ═══════════════════════════════════════════
const ModalController = (function() {
    const modal = document.getElementById('impressum-modal');

    function open(e) {
        if (e) e.preventDefault();
        if (!modal) return;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
    });

    // Expose to global scope for inline onclick handlers
    window.openModal = open;
    window.closeModal = close;

    return { open, close };
})();

// Mobile Navigation Toggle
(function() {
    const hamburger = document.querySelector('.nav-hamburger');
    const mobileNav = document.querySelector('.nav-mobile');
    const overlay = document.querySelector('.nav-mobile-overlay');
    const bugButton = document.querySelector('.nav-mobile__bug');
    const mobileLinks = document.querySelectorAll('.nav-mobile__link');

    if (!hamburger || !mobileNav || !overlay) return;

    function toggleMobileNav() {
        const isOpen = hamburger.classList.contains('active');

        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        overlay.classList.toggle('active');
        if (bugButton) bugButton.classList.toggle('active');

        hamburger.setAttribute('aria-expanded', !isOpen);
        document.body.style.overflow = isOpen ? '' : 'hidden';
    }

    function closeMobileNav() {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        overlay.classList.remove('active');
        if (bugButton) bugButton.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', toggleMobileNav);
    overlay.addEventListener('click', closeMobileNav);

    // Close on link click and update active state
    mobileLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Update active state
            mobileLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Don't close for external links
            if (!this.getAttribute('href').startsWith('#')) return;

            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);

            closeMobileNav();

            setTimeout(() => {
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }, CONFIG.MOBILE_MENU_CLOSE_DELAY);
        });
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && hamburger.classList.contains('active')) {
            closeMobileNav();
        }
    });

    // Update mobile nav active state on scroll
    const sections = document.querySelectorAll('.section, .hero');
    const mobileNavObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                mobileLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: CONFIG.SECTION_ROOT_MARGIN });

    sections.forEach(section => mobileNavObserver.observe(section));
})();

// Navigation pill: position & active state
(function () {
    const pill = document.querySelector('.nav');
    const navLinks = Array.from(document.querySelectorAll('.nav__link'));
    const navLinksContainer = document.querySelector('.nav__links');
    const sections = Array.from(document.querySelectorAll('.section, .hero'));

    function updatePillPosition(link) {
        if (!link || !navLinksContainer || !pill) return;
        const linkRect = link.getBoundingClientRect();
        const containerRect = navLinksContainer.getBoundingClientRect();
        const left = linkRect.left - containerRect.left;
        const width = linkRect.width;
        pill.style.left = `${left}px`;
        pill.style.width = `${width}px`;
    }

    function setActiveLink(sectionId) {
        const currentActive = document.querySelector('.nav__link.active');
        const newActive = document.querySelector(`.nav__link[data-section="${sectionId}"]`);
        if (!newActive || currentActive === newActive) return;
        navLinks.forEach(l => l.classList.remove('active'));
        newActive.classList.add('active');
        updatePillPosition(newActive);
    }

    // Initialize pill position immediately and after fonts load
    const initial = document.querySelector('.nav__link.active');
    if (initial) {
        // Disable transition for initial positioning
        pill.style.transition = 'none';
        // Calculate immediately (before animation starts)
        updatePillPosition(initial);
        // Re-enable transition after a frame
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                pill.style.transition = '';
            });
        });
        // Recalculate after fonts load (in case font affects width)
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => updatePillPosition(initial));
        }
    }

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) setActiveLink(e.target.id);
        });
    }, { root: null, rootMargin: CONFIG.SECTION_ROOT_MARGIN, threshold: 0 });

    sections.forEach(s => obs.observe(s));

    // click handlers (smooth scroll + active)
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const id = link.getAttribute('href').substring(1);
            const target = document.getElementById(id);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
            setActiveLink(id);
        });
    });

    // Debounced resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const activeLink = document.querySelector('.nav__link.active');
            if (activeLink) updatePillPosition(activeLink);
        }, CONFIG.RESIZE_DEBOUNCE);
    }, { passive: true });
})();

// ═══════════════════════════════════════════
// NAVBAR BACKGROUND ON SCROLL
// ═══════════════════════════════════════════
(function() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    let lastState = null;
    let rafId = null;

    function updateNavBackground() {
        const currentScroll = window.pageYOffset;
        const newState = currentScroll > CONFIG.NAV_SCROLL_THRESHOLD ? 'scrolled' : 'top';

        if (newState !== lastState) {
            lastState = newState;
            nav.classList.toggle('nav--scrolled', newState === 'scrolled');
        }
        rafId = null;
    }

    window.addEventListener('scroll', () => {
        if (!rafId) {
            rafId = requestAnimationFrame(updateNavBackground);
        }
    }, { passive: true });
})();

// ═══════════════════════════════════════════
// ROI COUNTER ANIMATION
// ═══════════════════════════════════════════
(function() {
    const roiBox = document.querySelector('.roi-box');
    if (!roiBox) return;

    let hasAnimated = false;

    function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function animateCounter(element, start, end, duration) {
        const startTime = performance.now();
        element.classList.add('counting');

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutExpo(progress);
            const current = Math.round(start + (end - start) * easedProgress);
            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.parentElement.classList.remove('counting');
            }
        }

        requestAnimationFrame(update);
    }

    function animateStats() {
        if (hasAnimated) return;
        hasAnimated = true;

        const statValues = roiBox.querySelectorAll('.roi-box__stat-value');

        statValues.forEach((stat, index) => {
            const type = stat.dataset.counter;
            const delay = index * CONFIG.COUNTER_STAGGER_DELAY;

            setTimeout(() => {
                stat.classList.add('counting');

                if (type === 'range') {
                    const startVal = parseInt(stat.dataset.start);
                    const endVal = parseInt(stat.dataset.end);
                    const nums = stat.querySelectorAll('.counter-num');

                    if (nums.length >= 2) {
                        animateCounter(nums[0], 0, startVal, CONFIG.COUNTER_ANIMATION_DURATION);
                        animateCounter(nums[1], 0, endVal, CONFIG.COUNTER_ANIMATION_DURATION_LONG);
                    }
                } else if (type === 'single') {
                    const value = parseInt(stat.dataset.value);
                    const num = stat.querySelector('.counter-num');
                    if (num) {
                        animateCounter(num, 0, value, CONFIG.COUNTER_ANIMATION_DURATION);
                    }
                }

                setTimeout(() => stat.classList.remove('counting'), CONFIG.COUNTER_CLEANUP_DELAY);
            }, delay);
        });
    }

    const roiObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                roiObserver.unobserve(entry.target);
            }
        });
    }, { threshold: CONFIG.ROI_THRESHOLD });

    roiObserver.observe(roiBox);
})();

// ═══════════════════════════════════════════
// TIMELINE SCROLL PROGRESS ANIMATION
// ═══════════════════════════════════════════
(function() {
    const timeline = document.querySelector('.transformation__timeline');
    if (!timeline) return;

    const stages = timeline.querySelectorAll('.transformation__stage');
    if (stages.length === 0) return;

    function updateTimelineProgress() {
        const timelineRect = timeline.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const timelineTop = timelineRect.top;
        const timelineHeight = timelineRect.height;

        const scrollStart = viewportHeight * CONFIG.TIMELINE_SCROLL_START_RATIO;
        const scrollProgress = Math.max(0, Math.min(1, (scrollStart - timelineTop) / timelineHeight));

        const progressHeight = scrollProgress * timelineHeight;
        timeline.style.setProperty('--timeline-progress', `${progressHeight}px`);

        stages.forEach((stage) => {
            const stageRect = stage.getBoundingClientRect();
            const stageCenter = stageRect.top + stageRect.height / 2;
            const triggerPoint = viewportHeight * CONFIG.TIMELINE_TRIGGER_RATIO;

            stage.classList.remove('active', 'completed');

            if (stageCenter < triggerPoint - CONFIG.TIMELINE_ACTIVE_OFFSET) {
                stage.classList.add('completed');
            } else if (stageCenter < triggerPoint + CONFIG.TIMELINE_ACTIVE_OFFSET) {
                stage.classList.add('active');
            }
        });
    }

    // Apply progress height via ::after
    const style = document.createElement('style');
    style.textContent = `.transformation__timeline::after { height: var(--timeline-progress, 0); }`;
    document.head.appendChild(style);

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateTimelineProgress();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Initial call
    updateTimelineProgress();
})();

// ═══════════════════════════════════════════
// BUTTON MICRO-INTERACTIONS
// ═══════════════════════════════════════════
(function() {
    const buttons = document.querySelectorAll('.btn');

    // Ripple Effect on Click
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');

            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            btn.appendChild(ripple);

            ripple.addEventListener('animationend', () => {
                ripple.remove();
            });
        });
    });

    // Magnetic Hover Effect (subtle)
    const magneticBtns = document.querySelectorAll('.btn--primary');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const moveX = x * CONFIG.MAGNETIC_FACTOR;
            const moveY = y * CONFIG.MAGNETIC_FACTOR;

            btn.style.transform = `translateY(-4px) translate(${moveX}px, ${moveY}px)`;
        });

        btn.addEventListener('mouseleave', function() {
            btn.style.transform = '';
        });
    });
})();

// ═══════════════════════════════════════════
// PAIN POINT FORM SUBMISSION
// ═══════════════════════════════════════════
(function() {
    const form = document.getElementById('painpoint-form');
    const card = document.getElementById('painpoint-card');

    if (!form || !card) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const painpoint = document.getElementById('painpoint-input').value.trim();
        const email = document.getElementById('painpoint-email').value.trim();

        if (!painpoint) return;

        card.classList.add('submitting');

        const formData = {
            painpoint: painpoint,
            email: email || 'Not provided',
            timestamp: new Date().toISOString(),
            page: window.location.href
        };

        try {
            await fetch('https://formspree.io/f/xojaqqlw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            setTimeout(() => {
                const inputState = card.querySelector('.challenge-card__input-state');
                const successState = card.querySelector('.challenge-card__success-state');

                inputState.style.display = 'none';
                successState.style.display = 'flex';

                // Store in localStorage as backup
                const submissions = JSON.parse(localStorage.getItem('painpoint_submissions') || '[]');
                submissions.push(formData);
                localStorage.setItem('painpoint_submissions', JSON.stringify(submissions));
            }, CONFIG.FORM_SUBMIT_DELAY);

        } catch (error) {
            card.classList.remove('submitting');
            alert('Es gab einen Fehler. Bitte versuchen Sie es erneut.');
        }
    });
})();

// ═══════════════════════════════════════════
// ESCAPE BUTTON - Easter Egg
// ═══════════════════════════════════════════
(function() {
    const escapeBtn = document.getElementById('escape-btn');
    const placeholder = document.getElementById('escape-btn-placeholder');
    if (!escapeBtn || !placeholder) return;

    let escapeCount = 0;
    let isMoving = false;
    let isInitialized = false;

    function getRandomPosition() {
        const btnWidth = 120;
        const btnHeight = 45;
        const padding = 30;

        const maxX = window.innerWidth - btnWidth - padding;
        const maxY = window.innerHeight - btnHeight - padding;

        const randomX = Math.max(padding, Math.random() * maxX);
        const randomY = Math.max(padding, Math.random() * maxY);

        return { x: randomX, y: randomY };
    }

    function initializeButton() {
        if (isInitialized) return;

        const rect = placeholder.getBoundingClientRect();
        const btnWidth = escapeBtn.offsetWidth || 120;

        // Zentriert unter dem Text
        const centerX = (window.innerWidth - btnWidth) / 2;

        escapeBtn.style.left = centerX + 'px';
        escapeBtn.style.top = (rect.top - 170) + 'px';
        escapeBtn.classList.add('visible');
        isInitialized = true;
    }

    function escapeFromPointer() {
        if (escapeCount >= 20 || isMoving) return;

        isMoving = true;
        escapeCount++;

        // Add moving class for transition (after first move)
        if (escapeCount > 1) {
            escapeBtn.classList.add('moving');
        }

        // Move to new position
        const pos = getRandomPosition();
        escapeBtn.style.left = pos.x + 'px';
        escapeBtn.style.top = pos.y + 'px';

        // Change text after a few attempts
        if (escapeCount === 3) {
            escapeBtn.textContent = 'Haha, nein!';
        } else if (escapeCount === 6) {
            escapeBtn.textContent = 'Erwischt mich nicht!';
        } else if (escapeCount === 10) {
            escapeBtn.textContent = 'Gib auf!';
        } else if (escapeCount === 15) {
            escapeBtn.textContent = 'Ok ok...';
        } else if (escapeCount >= 20) {
            escapeBtn.textContent = 'Du hast gewonnen!';
            escapeBtn.style.cursor = 'pointer';
        }

        // Prevent rapid firing
        setTimeout(() => {
            isMoving = false;
        }, 250);
    }

    // Watch for placeholder to come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                initializeButton();
            }
        });
    }, { threshold: 0.5 });

    observer.observe(placeholder);

    // Desktop: escape on hover
    escapeBtn.addEventListener('mouseenter', escapeFromPointer);

    // Mobile: escape on touch
    escapeBtn.addEventListener('touchstart', function(e) {
        if (escapeCount < 20) {
            e.preventDefault();
            escapeFromPointer();
        }
    }, { passive: false });

    // When finally clicked after "winning"
    escapeBtn.addEventListener('click', function() {
        if (escapeCount >= 20) {
            alert('Gratulation! Du hast den Button gefangen. Hier ist dein Preis: Nichts. Aber du hast Ausdauer bewiesen!');
        }
    });
})();
