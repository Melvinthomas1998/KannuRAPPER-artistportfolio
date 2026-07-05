// 00 Lenis Smooth Scroll Setup
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

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

// 03 WebGL 3D Background (Three.js) - Raw Honesty & Independent Music
// A gritty, dynamic particle field representing soundwaves and raw energy
const webglCanvas = document.getElementById('webgl-canvas');
if (webglCanvas && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    // Use fog to blend the particles into the dark void
    scene.fog = new THREE.FogExp2(0x080808, 0.05);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: webglCanvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Create raw particles (sound dust)
    const particleCount = 4000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
        // Spread particles out to fill the screen
        positions[i * 3] = (Math.random() - 0.5) * 60;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
        scales[i] = Math.random();
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
    
    // A gritty, raw gold material
    const material = new THREE.PointsMaterial({
        color: 0xC9A84C,
        size: 0.15,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    
    camera.position.z = 10;
    
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    
    if (!isTouchDevice) {
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - windowHalfX);
            mouseY = (e.clientY - windowHalfY);
        });
    }
    
    const clock = new THREE.Clock();
    function animate3D() {
        requestAnimationFrame(animate3D);
        const time = clock.getElapsedTime() * 0.2;
        
        targetX = mouseX * 0.0005;
        targetY = mouseY * 0.0005;
        
        // Slowly rotate the entire field like raw energy
        particles.rotation.y += 0.05 * (targetX - particles.rotation.y);
        particles.rotation.x += 0.05 * (targetY - particles.rotation.x);
        
        // Undulate particles like a soundwave
        const positions = particles.geometry.attributes.position.array;
        for(let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            // Apply a sine wave based on X and time to simulate sound vibration
            positions[i3 + 1] += Math.sin(time + positions[i3]) * 0.02;
        }
        particles.geometry.attributes.position.needsUpdate = true;
        
        // Parallax of the camera based on scroll
        camera.position.y = -(window.scrollY * 0.003);
        
        renderer.render(scene, camera);
    }
    animate3D();
    
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// 04 GSAP ScrollTrigger Integrations
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Integrate GSAP with Lenis
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time)=>{
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0, 0)

    // Hero Parallax
    gsap.to('.hero h1, .hero-tagline', {
        yPercent: 50,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // Track Row parallax & reveals
    document.querySelectorAll('.track-row').forEach(row => {
        const img = row.querySelector('.track-img img, .track-img video');
        const content = row.querySelector('.track-content');
        
        // FIX: The row is hidden by [data-aos] in CSS. We must force it visible 
        // so the content children can be animated independently.
        gsap.set(row, { opacity: 1, y: 0, clearProps: "transform" });
        
        if (img) {
            gsap.fromTo(img, 
                { yPercent: -15, scale: 1.1 },
                {
                    yPercent: 15,
                    ease: "none",
                    scrollTrigger: {
                        trigger: row,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                }
            );
        }
        
        if (content) {
            gsap.from(content, {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: row,
                    start: "top 80%"
                }
            });
        }
    });

    // General Data-AOS reveals replaced with GSAP
    document.querySelectorAll('[data-aos]').forEach(el => {
        if(el.classList.contains('track-row') || el.closest('.track-content')) return;
        
        // Force the element visible so we control it entirely via GSAP
        gsap.set(el, { opacity: 1, y: 0, clearProps: "transform" });

        gsap.from(el, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%"
            }
        });
    });
}

// 05 Navbar Scroll State & Active Nav
const nav = document.getElementById('nav');
const sections = ['hero', 'vault', 'poem', 'film', 'about', 'connect'].map(id => document.getElementById(id)).filter(Boolean);
const navLinks = document.querySelectorAll('.desktop-nav a.nl');

window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }

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

// 06 Burger Menu
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

// 07 Smooth Scroll Anchor Links (using Lenis)
const anchorLinks = document.querySelectorAll('a.nl, .mob-link');
anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            lenis.scrollTo(href, { offset: -70 });
        }
    });
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
        
        if (!nameInput.value.trim()) {
            nameInput.parentElement.classList.add('err');
            isValid = false;
        } else {
            nameInput.parentElement.classList.remove('err');
        }

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

if (btt) {
    btt.addEventListener('click', () => {
        lenis.scrollTo(0);
    });
}
