/* ═══════════════════════════════════════════
   KLINCOV.IT - Main JavaScript
   Bereinigt und optimiert
═══════════════════════════════════════════ */

// Floating Cards Scroll Animation
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

        // Wait for CSS animations to complete initial reveal, then enable scroll effects
        // Cards: last one starts at 0.65s + 1.2s duration = 1.85s
        setTimeout(() => {
            allCards.forEach(card => {
                card.classList.add('scroll-controlled');
            });
            initialized = true;
        }, 2000);
    }

    // Scroll spread animation using margins (so CSS float animation can use transform)
    const maxSpreadX = 200;
    const maxSpreadY = 40;
    const maxOpacityLoss = 0.1;

    function updateScrollAnimation() {
        if (!initialized) {
            ticking = false;
            return;
        }

        const scrollY = window.scrollY;
        const heroHeight = hero.offsetHeight;
        const animationEndPoint = heroHeight * 0.80;
        const progress = Math.min(scrollY / animationEndPoint, 1);
        const eased = 1 - Math.pow(1 - progress, 2);

        // Left cards spread further left using margin
        leftCards.forEach((card, index) => {
            const stagger = 1 + (index * 0.30);
            const xOffset = -maxSpreadX * eased * stagger; // negative = move left
            const yOffset = maxSpreadY * eased * (index % 2 === 0 ? -1 : 1) * 0.3;
            const opacity = 1 - (maxOpacityLoss * eased);

            card.style.marginLeft = `${xOffset}px`;
            card.style.marginTop = `${yOffset}px`;
            card.style.opacity = opacity;
        });

        // Right cards spread further right using margin
        rightCards.forEach((card, index) => {
            const stagger = 1 + (index * 0.30);
            const xOffset = maxSpreadX * eased * stagger; // positive = move right
            const yOffset = maxSpreadY * eased * (index % 2 === 0 ? 1 : -1) * 0.3;
            const opacity = 1 - (maxOpacityLoss * eased);

            card.style.marginRight = `${-xOffset}px`; // negative margin to push right
            card.style.marginTop = `${yOffset}px`;
            card.style.opacity = opacity;
        });

        // Scroll hint fade behavior - hide when scrolled, show when at top
        if (scrollHint) {
            if (scrollY > 50) {
                scrollHint.classList.add('hidden');
            } else {
                scrollHint.classList.remove('hidden');
            }
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

// Intersection Observer for scroll animations (optimized - unobserve after reveal)
(function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px'
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            // If this element is inside the challenges list, reveal all items sequentially
            const challengesContainer = entry.target.closest('.challenges-compact');
            if (challengesContainer) {
                if (!challengesContainer.dataset.sequenced) {
                    challengesContainer.dataset.sequenced = '1';
                    const items = Array.from(challengesContainer.querySelectorAll('.challenge-item'));
                    items.forEach((it, i) => setTimeout(() => it.classList.add('visible'), i * 160 + 60));
                }
                // stop observing the children of this container
                challengesContainer.querySelectorAll('.reveal').forEach(el => obs.unobserve(el));
                return;
            }

            entry.target.classList.add('visible');
            obs.unobserve(entry.target); // Stop observing after revealed
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

// Modal functions
function openModal(e) {
    e.preventDefault();
    document.getElementById('impressum-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('impressum-modal').classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

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

            // Smooth scroll after menu closes
            setTimeout(() => {
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }, 300);
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
    }, { rootMargin: '-45% 0px -45% 0px' });

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
    }, { root: null, rootMargin: '-45% 0px -45% 0px', threshold: 0 });

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
        }, 100);
    }, { passive: true });
})();

// Navbar background on scroll - optimized with caching and passive listener
(function() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    let lastState = null;
    let rafId = null;

    function updateNavBackground() {
        const currentScroll = window.pageYOffset;
        const newState = currentScroll > 100 ? 'scrolled' : 'top';

        // Only update DOM if state changed
        if (newState !== lastState) {
            lastState = newState;
            if (newState === 'scrolled') {
                nav.style.background = 'rgba(232, 228, 220, 0.92)';
                nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05)';
            } else {
                nav.style.background = 'rgba(232, 228, 220, 0.75)';
                nav.style.boxShadow = '0 2px 16px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.5)';
            }
        }
        rafId = null;
    }

    window.addEventListener('scroll', () => {
        if (!rafId) {
            rafId = requestAnimationFrame(updateNavBackground);
        }
    }, { passive: true });
})();

// ROI Counter Animation
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
            const delay = index * 200;

            setTimeout(() => {
                stat.classList.add('counting');

                if (type === 'range') {
                    const startVal = parseInt(stat.dataset.start);
                    const endVal = parseInt(stat.dataset.end);
                    const suffix = stat.dataset.suffix || '';
                    const nums = stat.querySelectorAll('.counter-num');

                    if (nums.length >= 2) {
                        animateCounter(nums[0], 0, startVal, 1500);
                        animateCounter(nums[1], 0, endVal, 1800);
                    }
                } else if (type === 'single') {
                    const value = parseInt(stat.dataset.value);
                    const num = stat.querySelector('.counter-num');
                    if (num) {
                        animateCounter(num, 0, value, 1500);
                    }
                }

                setTimeout(() => stat.classList.remove('counting'), 2000);
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
    }, { threshold: 0.3 });

    roiObserver.observe(roiBox);
})();

// Timeline Scroll Progress Animation
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

        // Calculate progress through the timeline
        const scrollStart = viewportHeight * 0.6;
        const scrollProgress = Math.max(0, Math.min(1, (scrollStart - timelineTop) / timelineHeight));

        // Update the progress bar height via CSS custom property
        const progressHeight = scrollProgress * timelineHeight;
        timeline.style.setProperty('--timeline-progress', `${progressHeight}px`);

        // Update stage states based on scroll position
        stages.forEach((stage, index) => {
            const stageRect = stage.getBoundingClientRect();
            const stageCenter = stageRect.top + stageRect.height / 2;
            const triggerPoint = viewportHeight * 0.55;

            stage.classList.remove('active', 'completed');

            if (stageCenter < triggerPoint - 100) {
                stage.classList.add('completed');
            } else if (stageCenter < triggerPoint + 100) {
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

// Button Micro-interactions: Ripple + Magnetic Hover
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

            const moveX = x * 0.1;
            const moveY = y * 0.1;

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

        // Add submitting class for animation
        card.classList.add('submitting');

        // Prepare form data
        const formData = {
            painpoint: painpoint,
            email: email || 'Not provided',
            timestamp: new Date().toISOString(),
            page: window.location.href
        };

        try {
            // Send to Formspree (replace YOUR_FORM_ID with actual ID)
            // For now, we'll simulate the submission
            // Uncomment and replace with your Formspree endpoint:
            // await fetch('https://formspree.io/f/YOUR_FORM_ID', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData)
            // });

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 300));

            // Switch to success state
            setTimeout(() => {
                const inputState = card.querySelector('.challenge-card__input-state');
                const successState = card.querySelector('.challenge-card__success-state');

                inputState.style.display = 'none';
                successState.style.display = 'flex';

                // Store in localStorage as backup
                const submissions = JSON.parse(localStorage.getItem('painpoint_submissions') || '[]');
                submissions.push(formData);
                localStorage.setItem('painpoint_submissions', JSON.stringify(submissions));

                console.log('Pain point submitted:', formData);
            }, 300);

        } catch (error) {
            console.error('Submission error:', error);
            card.classList.remove('submitting');
            alert('Es gab einen Fehler. Bitte versuchen Sie es erneut.');
        }
    });
})();
