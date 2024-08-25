// Easter Egg Animation Script

// Create a separate container for the easter egg
function createEasterEggContainer() {
    const container = document.createElement('div');
    container.id = 'easter-egg-container';
    document.body.appendChild(container);
    return container;
}

// Create styles for the easter egg
function createStyles() {
    const style = document.createElement('style');
    style.textContent = `
        #easter-egg-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 25vh;
            background: transparent;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            transform: translateY(-150%);
            transition: transform 0.5s ease;
            z-index: 999;
        }
        #easter-egg-container::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
            -webkit-mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
        }
        #easter-egg-container.active {
            transform: translateY(0);
        }
        #clock {

            font-family: "Courier Prime", monospace;
            font-size: 2rem;
            color: #f9f9f9;
            transition: text-shadow 0.3s ease;
            z-index: 999999999;
        }
        .glow {
            animation: blink 0.5s ease-in-out infinite alternate;
        }
        @keyframes blink {
            from { text-shadow: 0 0 10px #ffffffb2, 0 0 20px #ffffffb2, 0 0 30px #fff; }
            to { text-shadow: none; }
        }
        #close-button {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0;
        }
    `;
    document.head.appendChild(style);
}

// Load Google Fonts
function loadGoogleFonts() {
    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
}

// Create clock element
function createClockElement(container) {
    const clock = document.createElement('div');
    clock.id = 'clock';
    clock.textContent = 'XX:XX';
    container.appendChild(clock);
    return clock;
}

// Create close button
function createCloseButton(container) {
    const button = document.createElement('button');
    button.id = 'close-button';
    button.textContent = '×';
    button.addEventListener('click', () => closeEasterEgg(container));
    container.appendChild(button);
}

// Clock animation logic
function initializeClockAnimation(clock) {
    function randomDigits() {
        return Math.floor(Math.random() * 10);
    }

    function updateClock() {
        clock.textContent = `${randomDigits()}${randomDigits()}:${randomDigits()}${randomDigits()}`;
    }

    function glowEffect(text, duration) {
        clock.textContent = text;
        clock.classList.add('glow');
        setTimeout(() => {
            clock.classList.remove('glow');
        }, duration);
    }

    function animateClock(duration) {
        return new Promise(resolve => {
            const intervalId = setInterval(updateClock, 50);
            setTimeout(() => {
                clearInterval(intervalId);
                resolve();
            }, duration);
        });
    }

    async function startAnimation() {
        while (true) {
            await animateClock(3000);
            glowEffect('20:25', 3000);
            await new Promise(resolve => setTimeout(resolve, 3000));
            await animateClock(3000);
            glowEffect('CO:MN', 3000);
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }

    startAnimation();
}

// Detect pull-down gesture and trigger animation
function detectPullDown(container) {
    let startY;
    let triggered = false;
    let touchScrollThreshold = 100; // Threshold for touch/mouse pull
    let wheelScrollThreshold = 1000; // Increased threshold for mouse wheel scroll
    
    // Touch events (unchanged)
    document.addEventListener('touchstart', (e) => {
        startY = e.touches[0].pageY;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        if (triggered) return;
        
        const pullDistance = e.touches[0].pageY - startY;
        if (window.scrollY === 0 && pullDistance > touchScrollThreshold) {
            triggerEasterEgg(container);
        }
    }, { passive: true });

    // Mouse events (unchanged)
    document.addEventListener('mousedown', (e) => {
        startY = e.pageY;
    });

    document.addEventListener('mousemove', (e) => {
        if (triggered || !startY) return;
        
        const pullDistance = e.pageY - startY;
        if (window.scrollY === 0 && pullDistance > touchScrollThreshold) {
            triggerEasterEgg(container);
        }
    });

    document.addEventListener('mouseup', () => {
        startY = null;
    });

    // Mouse wheel event with increased threshold
    let wheelDelta = 0;
    document.addEventListener('wheel', (e) => {
        if (triggered) return;

        // Check if scrolling up
        if (e.deltaY < 0) {
            wheelDelta += Math.abs(e.deltaY);
            if (window.scrollY === 0 && wheelDelta > wheelScrollThreshold) {
                triggerEasterEgg(container);
                wheelDelta = 0; // Reset after triggering
            }
        } else {
            wheelDelta = 0; // Reset if scrolling down
        }
    }, { passive: true });

    // Reset triggered state after animation ends
    function resetTrigger() {
        triggered = false;
        wheelDelta = 0;
    }

    container.addEventListener('transitionend', resetTrigger);
}

function triggerEasterEgg(container) {
    triggered = true;
    container.classList.add('active');

    // Automatically close after 10 seconds
    setTimeout(() => {
        closeEasterEgg(container);
    }, 10000);
}

function closeEasterEgg(container) {
    container.classList.remove('active');
}

// Initialize the easter egg
function initializeEasterEgg() {
    createStyles();
    loadGoogleFonts();
    const container = createEasterEggContainer();
    const clock = createClockElement(container);
    createCloseButton(container);
    initializeClockAnimation(clock);
    detectPullDown(container);
}

// Start the script after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeEasterEgg);
