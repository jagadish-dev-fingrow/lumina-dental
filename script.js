// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Loader ---
    const loader = document.querySelector('.loader');
    setTimeout(() => {
        gsap.to(loader, {
            opacity: 0,
            duration: 1,
            ease: "power2.inOut",
            onComplete: () => {
                loader.style.display = 'none';
                initHeroAnimations();
            }
        });
    }, 2000);

    // --- 2. Lenis Smooth Scroll ---
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
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // --- 3. Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- 4. Mobile Menu Toggle ---
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    // Implement mobile menu basic logic (for demo purposes)
    mobileBtn.addEventListener('click', () => {
        // Simple toggle for demo
        if(navLinks.style.display === 'flex') {
            navLinks.style.display = 'none';
        } else {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = 'rgba(255, 255, 255, 0.95)';
            navLinks.style.padding = '2rem';
            navLinks.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
        }
    });

    // --- 5. Three.js Hero Scene ---
    initThreeJS();

    // --- 6. GSAP Animations ---
    gsap.registerPlugin(ScrollTrigger);

    function initHeroAnimations() {
        const tl = gsap.timeline();
        
        tl.from(".hero-badge", { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" })
          .from(".hero-title", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.4")
          .from(".hero-subtitle", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
          .from(".hero-cta .btn", { y: 20, opacity: 0, duration: 0.6, stagger: 0.2, ease: "power3.out" }, "-=0.6")
          .from(".scroll-indicator", { opacity: 0, duration: 1 }, "-=0.2");
    }

    // Parallax Image
    gsap.to(".parallax-img", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
            trigger: ".about-image",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });

    // Section Reveals
    const sections = gsap.utils.toArray('.section-padding');
    sections.forEach(section => {
        const elements = section.querySelectorAll('.section-header, .service-card, .team-card, .testimonial-card, .booking-wrapper, .pricing-card, .tech-list li, .faq-item');
        if (elements.length > 0) {
            gsap.fromTo(elements, 
                {
                    y: 50,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 85%",
                        once: true
                    }
                }
            );
        }
    });

    // Float Card Animation
    gsap.to(".glass-float-card", {
        y: -20,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
    });

    // --- 7. Animated Counters ---
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        ScrollTrigger.create({
            trigger: counter,
            start: "top 90%",
            once: true,
            onEnter: () => {
                const target = parseFloat(counter.getAttribute('data-target'));
                const duration = 2000; // ms
                const step = target / (duration / 16); // 60fps
                let current = 0;

                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        // format to 1 decimal if target has decimal
                        counter.innerText = Number.isInteger(target) ? Math.ceil(current) : current.toFixed(1);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCounter();
            }
        });
    });

    // --- 8. 3D Tilt Effect for Team Cards ---
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
            card.style.transition = 'transform 0.5s ease';
        });
        
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    });

});

// --- Three.js Implementation ---
function initThreeJS() {
    const canvas = document.getElementById('hero-canvas');
    if(!canvas) return;

    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create a futuristic geometric structure (Abstract Tooth / Core)
    const geometry = new THREE.IcosahedronGeometry(2, 1);
    
    // Wireframe material for the high-tech look
    const material = new THREE.MeshStandardMaterial({
        color: 0x00d2ff,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
    });
    
    // Solid inner material
    const innerMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.9, // glass-like
        thickness: 0.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const sphere = new THREE.Mesh(geometry, material);
    const innerSphere = new THREE.Mesh(new THREE.IcosahedronGeometry(1.5, 0), innerMaterial);
    
    const group = new THREE.Group();
    group.add(sphere);
    group.add(innerSphere);
    
    // Move slightly to the right to balance with text
    group.position.x = window.innerWidth > 768 ? 2 : 0;
    scene.add(group);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 700;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x0066ff,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00d2ff, 2);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x0066ff, 2);
    pointLight2.position.set(-2, -3, -4);
    scene.add(pointLight2);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Animation Loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Rotate group
        group.rotation.y += 0.002;
        group.rotation.x += 0.001;
        
        // Floating effect
        group.position.y = Math.sin(elapsedTime * 0.5) * 0.2;

        // Rotate inner sphere slightly faster
        innerSphere.rotation.y -= 0.005;

        // Animate particles
        particlesMesh.rotation.y = -elapsedTime * 0.05;
        
        // Mouse interaction easing
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;
        
        group.rotation.y += 0.05 * (targetX - group.rotation.y);
        group.rotation.x += 0.05 * (targetY - group.rotation.x);

        renderer.render(scene, camera);
    }

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Adjust group position based on screen size
        group.position.x = window.innerWidth > 768 ? 2 : 0;
    });
}
