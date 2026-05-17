// 01 Film-Grain Canvas
const canvas = document.getElementById('canvas-grain');
const ctx = canvas.getContext('2d');

let w, h;
const resizeCanvas = () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
};
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const drawGrain = () => {
    const idata = ctx.createImageData(w, h);
    const buffer32 = new Uint32Array(idata.data.buffer);
    const len = buffer32.length;
    for (let i = 0; i < len; i++) {
        if (Math.random() < 0.5) {
            buffer32[i] = 0xff000000;
        }
    }
    ctx.putImageData(idata, 0, 0);
    requestAnimationFrame(drawGrain);
};
drawGrain();

// 02 Premium Cursor
const cursor = document.querySelector('.cursor');
const isTouchDevice = matchMedia('(hover: none)').matches;

if (!isTouchDevice && cursor) {
    document.addEventListener('mousemove', (e) => {
        // Adjust for center of the cursor element
        cursor.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
    });

    const hoverables = document.querySelectorAll('.hover');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    document.addEventListener('mousedown', () => cursor.classList.add('click'));
    document.addEventListener('mouseup', () => cursor.classList.remove('click'));
}

// 03 Navbar Scroll State & 06 Active Nav
const nav = document.getElementById('nav');
const sections = ['hero', 'vault', 'poem', 'film', 'about', 'connect'].map(id => document.getElementById(id)).filter(Boolean);
const navLinks = document.querySelectorAll('.desktop-nav a.nl');

window.addEventListener('scroll', () => {
    // Navbar Scroll State
    if (window.scrollY > 40) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }

    // Active Nav
    let currentId = 'hero';
    const scrollPos = window.scrollY + window.innerHeight * 0.4;
    
    sections.forEach(sec => {
        if (sec.offsetTop <= scrollPos) {
            currentId = sec.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
        }
    });
}, { passive: true });

// 04 Burger Menu
const burger = document.getElementById('burger');
const mobNav = document.querySelector('.mob-nav');
const mobLinks = document.querySelectorAll('.mob-link');

burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobNav.classList.toggle('open');
    document.body.classList.toggle('nav-open');
});

mobLinks.forEach(link => {
    link.addEventListener('click', () => {
        burger.classList.remove('open');
        mobNav.classList.remove('open');
        document.body.classList.remove('nav-open');
    });
});

// 05 Smooth Scroll
const anchorLinks = document.querySelectorAll('a.nl, .mob-link');
anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// 07 Scroll Reveal
const observerOptions = {
    threshold: 0.12,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('vis');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('[data-aos]').forEach((el, index) => {
    // Staggered reveal based on index
    el.style.transitionDelay = `${(index % 5) * 0.08}s`;
    observer.observe(el);
});

// 08 Form Validation
const form = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const submitBtn = document.getElementById('submit-btn');
const successMsg = document.getElementById('form-success');
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        
        // Validate name
        if (!nameInput.value.trim()) {
            nameInput.parentElement.classList.add('err');
            isValid = false;
        } else {
            nameInput.parentElement.classList.remove('err');
        }

        // Validate email
        if (!emailRegex.test(emailInput.value.trim())) {
            emailInput.parentElement.classList.add('err');
            isValid = false;
        } else {
            emailInput.parentElement.classList.remove('err');
        }

        if (isValid) {
            submitBtn.textContent = 'Sending...';
            submitBtn.style.pointerEvents = 'none';
            
            setTimeout(() => {
                successMsg.style.display = 'block';
                form.reset();
                submitBtn.textContent = 'Transmit Message';
                submitBtn.style.pointerEvents = 'auto';
                
                setTimeout(() => {
                    successMsg.style.display = 'none';
                }, 6000);
            }, 1400);
        }
    });
}

// 09 Back to Top
const btt = document.getElementById('btt');
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        btt.classList.add('vis');
    } else {
        btt.classList.remove('vis');
    }
}, { passive: true });

btt.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
