// Pixel Stars Background
class PixelStarsBackground {
    constructor() {
        this.createStars();
        this.createScrollIndicator();
    }

    createStars() {
        const starCount = 80;
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'pixel-star';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 3 + 's';
            star.style.animationDuration = (2 + Math.random() * 2) + 's';
            document.body.appendChild(star);
        }
    }

    createScrollIndicator() {
        // Only show on homepage
        if (window.location.pathname.includes('projects')) return;
        
        const indicator = document.createElement('div');
        indicator.className = 'scroll-indicator';
        indicator.innerHTML = '▼ SCROLL ▼';
        document.body.appendChild(indicator);

        // Hide indicator after scrolling
        let scrolled = false;
        window.addEventListener('scroll', () => {
            if (!scrolled && window.scrollY > 100) {
                indicator.style.opacity = '0';
                indicator.style.pointerEvents = 'none';
                scrolled = true;
                setTimeout(() => {
                    indicator.style.display = 'none';
                }, 500);
            }
        });
    }
}

// Turkish Flag with Pixel Art Style
class TurkishFlag {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        // Use smaller dimensions for pixelated effect
        this.width = 96;
        this.height = 64;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // Disable image smoothing for pixel-perfect rendering
        this.ctx.imageSmoothingEnabled = false;

        this.drawPixelFlag();
    }

    drawPixelFlag() {
        // Red background
        this.ctx.fillStyle = '#E30A17';
        this.ctx.fillRect(0, 0, this.width, this.height);

        const flagCenterX = Math.floor(this.width * 0.4);
        const flagCenterY = Math.floor(this.height / 2);
        const moonRadius = Math.floor(this.height * 0.28);

        // Draw white circle (moon base)
        this.ctx.fillStyle = '#FFFFFF';
        this.drawPixelCircle(flagCenterX, flagCenterY, moonRadius);

        // Draw red circle (crescent)
        this.ctx.fillStyle = '#E30A17';
        this.drawPixelCircle(
            flagCenterX + Math.floor(moonRadius * 0.4),
            flagCenterY,
            Math.floor(moonRadius * 0.75)
        );

        // Draw star
        const starCenterX = flagCenterX + Math.floor(moonRadius * 1.2);
        const starCenterY = flagCenterY;
        const starSize = Math.floor(this.height * 0.15);

        this.ctx.fillStyle = '#FFFFFF';
        this.drawPixelStar(starCenterX, starCenterY, starSize);
    }

    drawPixelCircle(cx, cy, radius) {
        for (let y = -radius; y <= radius; y++) {
            for (let x = -radius; x <= radius; x++) {
                if (x * x + y * y <= radius * radius) {
                    this.ctx.fillRect(cx + x, cy + y, 1, 1);
                }
            }
        }
    }

    drawPixelStar(cx, cy, size) {
        // Simple 5-pointed star using pixel blocks
        const points = [];
        for (let i = 0; i < 10; i++) {
            const radius = i % 2 === 0 ? size : size * 0.4;
            const angle = (i * Math.PI) / 5 - Math.PI / 2;
            points.push({
                x: Math.floor(cx + Math.cos(angle) * radius),
                y: Math.floor(cy + Math.sin(angle) * radius)
            });
        }

        // Fill the star shape
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            this.ctx.lineTo(points[i].x, points[i].y);
        }
        this.ctx.closePath();
        this.ctx.fill();
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PixelStarsBackground();
    new TurkishFlag('flag-canvas');
    initScrollEffects();
    initScrollProgress();
    initBackToTop();
    initScrollUnfurl();
});

// Scroll unfurling animation with GSAP
function initScrollUnfurl() {
    const container = document.querySelector('.container');
    const terminal = document.querySelector('.terminal');
    const h1 = document.querySelector('h1');
    const bio = document.querySelector('.bio');
    const links = document.querySelector('.links');
    const navigation = document.querySelector('.navigation');
    const loader = document.querySelector('.page-loader');

    if (!terminal) return;

    // Create wrapper for terminal + rod
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.maxWidth = '650px';
    wrapper.style.width = '100%';
    wrapper.style.overflow = 'visible';
    
    // Wrap the terminal
    terminal.parentNode.insertBefore(wrapper, terminal);
    wrapper.appendChild(terminal);

    // Create actual scroll rod element
    const scrollRod = document.createElement('div');
    scrollRod.className = 'scroll-rod';
    wrapper.insertBefore(scrollRod, terminal);
    
    // Create decorative rod end caps
    const leftCap = document.createElement('div');
    leftCap.className = 'rod-cap rod-cap-left';
    scrollRod.appendChild(leftCap);
    
    const rightCap = document.createElement('div');
    rightCap.className = 'rod-cap rod-cap-right';
    scrollRod.appendChild(rightCap);
    
    // Create decorative tassels/ribbons
    const leftTassel = document.createElement('div');
    leftTassel.className = 'scroll-tassel tassel-left';
    leftCap.appendChild(leftTassel);
    
    const rightTassel = document.createElement('div');
    rightTassel.className = 'scroll-tassel tassel-right';
    rightCap.appendChild(rightTassel);

    // Set initial states (preserve the translateX(-50%) from CSS)
    gsap.set(scrollRod, { 
        opacity: 0, 
        y: -150, 
        rotation: 360,
        scale: 0.3,
        xPercent: -50, // This preserves the centering
        transformOrigin: 'center center'
    });
    gsap.set([leftCap, rightCap], {
        scale: 0,
        rotation: 180
    });
    gsap.set(terminal, { clipPath: 'inset(0 0 100% 0)' });

    // Create GSAP timeline
    const tl = gsap.timeline({
        defaults: {
            ease: 'power2.out'
        }
    });

    // 1. Fade out loader
    tl.to(loader, {
        opacity: 0,
        duration: 0.4,
        delay: 0.8,
        onComplete: () => {
            if (loader) loader.remove();
        }
    })
    
    // 2. Animate scroll rod spinning and dropping into place
    .to(scrollRod, {
        opacity: 1,
        y: 0,
        rotation: 0,
        scale: 1,
        duration: 1.5,
        ease: 'elastic.out(1, 0.6)'
    }, '+=0.2')
    
    // 2.5 Pop in the rod caps
    .to([leftCap, rightCap], {
        scale: 1,
        rotation: 0,
        duration: 0.6,
        ease: 'back.out(2)',
        stagger: 0.1
    }, '-=0.8')
    
    // Add subtle float after main animation
    .add(() => {
        gsap.to(scrollRod, {
            y: '+=5',
            duration: 1.5,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1
        });
    }, '+=0.5')
    
    // 3. Unfurl the scroll from top to bottom
    .to(terminal, {
        clipPath: 'inset(0 0 0% 0)',
        duration: 2.2,
        ease: 'power1.inOut'
    }, '-=0.5')
    
    // 4. Animate content elements sequentially
    .to(h1, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'back.out(1.7)'
    }, '-=1.4')
    
    .to(bio, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'back.out(1.7)'
    }, '-=1.1')
    
    .to(links, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'back.out(1.7)'
    }, '-=0.9')
    
    .to(navigation, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'back.out(1.7)'
    }, '-=0.7');
}

// Scroll reveal effects
function initScrollEffects() {
    const terminal = document.querySelector('.terminal');
    if (!terminal) return;

    // Parallax effect on scroll
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercent = scrolled / maxScroll;
                
                // Subtle scroll effect
                if (terminal) {
                    const translateY = scrollPercent * 20;
                    terminal.style.transform = `translateY(-${translateY}px)`;
                }
                
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Scroll progress bar
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercent = (scrolled / maxScroll) * 100;
                
                progressBar.style.width = scrollPercent + '%';
                
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Add pixel button sound effect simulation (visual feedback)
document.addEventListener('click', (e) => {
    if (e.target.matches('.link-button, .nav-link, .project-link, .tag')) {
        // Create a quick flash effect
        e.target.style.transition = 'none';
        e.target.style.filter = 'brightness(1.5)';
        setTimeout(() => {
            e.target.style.transition = '';
            e.target.style.filter = '';
        }, 100);
    }
});

// Smooth scroll reveal for elements
function revealOnScroll() {
    const elements = document.querySelectorAll('.bio, .links, .navigation, .project-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => {
        observer.observe(el);
    });
}

// Call reveal on scroll if needed
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', revealOnScroll);
} else {
    revealOnScroll();
}

// Back to top button
function initBackToTop() {
    const backToTop = document.createElement('div');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '▲';
    backToTop.title = 'Back to Top';
    document.body.appendChild(backToTop);

    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    // Smooth scroll to top
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
