/**
 * Spoonful Hengelo - App Landing Page Interaction Script
 * Handled features:
 * 1. Automatic & manual smartphone mockup screen switcher
 * 2. Signature menu tab filtering
 * 3. Hengelo / Enschede Postcode Delivery Checker
 * 4. Micro-interactions and scroll observers
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. SMARTPHONE SCREEN ROTATOR & STEP ITEMS BINDING
    // ==========================================================================
    const screens = [
        document.getElementById('app-screen-1'),
        document.getElementById('app-screen-2'),
        document.getElementById('app-screen-3')
    ];
    const steps = [
        document.getElementById('step-nav-1'),
        document.getElementById('step-nav-2'),
        document.getElementById('step-nav-3')
    ];

    let currentScreenIndex = 0;
    let autoRotateInterval;
    const rotateSpeed = 5000; // 5 seconds per screen

    // Set screen index active
    function setScreenActive(index) {
        screens.forEach((screen, i) => {
            screen.classList.remove('active', 'prev');
            if (i === index) {
                screen.classList.add('active');
            } else if (i < index) {
                screen.classList.add('prev');
            }
        });

        steps.forEach((step, i) => {
            if (i === index) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        currentScreenIndex = index;
    }

    // Auto rotate function
    function startAutoRotation() {
        autoRotateInterval = setInterval(() => {
            let nextIndex = (currentScreenIndex + 1) % screens.length;
            setScreenActive(nextIndex);
        }, rotateSpeed);
    }

    function stopAutoRotation() {
        clearInterval(autoRotateInterval);
    }

    // Bind step item clicks to phone screens
    steps.forEach((step, index) => {
        step.addEventListener('click', () => {
            stopAutoRotation();
            setScreenActive(index);
            // Restart rotation after a delay of user inactivity
            setTimeout(startAutoRotation, 10000);
        });
    });

    // Start rotation on page load
    startAutoRotation();

    // ==========================================================================
    // 2. SIGNATURE MENU TABS FILTERING
    // ==========================================================================
    const tabButtons = [
        document.getElementById('btn-cat-hoofd'),
        document.getElementById('btn-cat-combi'),
        document.getElementById('btn-cat-snacks')
    ];
    const grids = [
        document.getElementById('hoofdgerechten-grid'),
        document.getElementById('combis-grid'),
        document.getElementById('snacks-grid')
    ];

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');

            // Remove active states from buttons
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Toggle active menu grid
            grids.forEach(grid => {
                grid.classList.remove('active');
                if (grid.id === `${category}-grid`) {
                    grid.classList.add('active');
                }
            });
        });
    });

    // ==========================================================================
    // 3. POSTCODE DELIVERY AREA CHECKER
    // ==========================================================================
    const checkBtn = document.getElementById('postcode-check-btn');
    const inputField = document.getElementById('postcode-input');
    const resultDiv = document.getElementById('postcode-result');

    if (checkBtn && inputField && resultDiv) {
        checkBtn.addEventListener('click', performPostcodeCheck);
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performPostcodeCheck();
            }
        });
    }

    function performPostcodeCheck() {
        const rawInput = inputField.value.trim().toUpperCase();
        
        // Match general Dutch postcode structure: 4 numbers + space? + 2 letters
        const nlPostcodeRegex = /^[1-9][0-9]{3}\s?[A-Z]{2}$/;
        
        // Extract 4 numeric digits for prefix validation
        const numericMatch = rawInput.match(/^([1-9][0-9]{3})/);

        if (!rawInput) {
            resultDiv.className = 'checker-feedback error';
            resultDiv.innerHTML = '⚠️ Vul a.u.b. een postcode in.';
            return;
        }

        if (!nlPostcodeRegex.test(rawInput)) {
            resultDiv.className = 'checker-feedback error';
            resultDiv.innerHTML = '⚠️ Ongeldig formaat. Gebruik bijv. 7556 AB.';
            return;
        }

        const prefix = parseInt(numericMatch[1]);

        // Hengelo: 7550 to 7559
        if (prefix >= 7550 && prefix <= 7559) {
            resultDiv.className = 'checker-feedback success';
            resultDiv.innerHTML = `🟢 Ja! We bezorgen gratis in Hengelo (${rawInput}). Bestel direct via de App voor snelle bezorging!`;
        } 
        // Enschede: 7500 to 7549 (original kitchen location)
        else if (prefix >= 7500 && prefix <= 7549) {
            resultDiv.className = 'checker-feedback success';
            resultDiv.innerHTML = `🟢 Ja! We bezorgen in Enschede (${rawInput}). Bestel direct via de App voor snelle bezorging!`;
        } 
        // Other regions
        else {
            resultDiv.className = 'checker-feedback error';
            resultDiv.innerHTML = `🔴 Helaas! We bezorgen momenteel niet op ${rawInput}. Onze bezorging is beperkt tot Enschede & Hengelo.`;
        }
    }

    // ==========================================================================
    // 4. NAVBAR BLUR EFFCT ON SCROLL
    // ==========================================================================
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(5, 4, 4, 0.92)';
            navbar.style.padding = '0.5rem 0';
            navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
        } else {
            navbar.style.background = 'rgba(10, 8, 8, 0.8)';
            navbar.style.padding = '0';
            navbar.style.boxShadow = 'none';
        }
    });

    // ==========================================================================
    // 5. INTERSECTION OBSERVER FOR ACTIVE NAVBAR LINKS
    // ==========================================================================
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.4
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        if (section.getAttribute('id')) {
            observer.observe(section);
        }
    });
});
