function createEasterEggContainer() {
    const container = document.createElement('div');
    container.id = 'easter-egg-container';
    document.body.appendChild(container);
    return container;
}


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
            transform: translateY(-100%);
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
            font-family: "Space Mono", monospace;
            font-weight: 400;
            font-style: normal;
            font-size: 1.5rem;
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
    `;
    document.head.appendChild(style);
}


function loadGoogleFonts() {
    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
}


function createClockElement(container) {
    const clock = document.createElement('div');
    clock.id = 'clock';
    clock.textContent = 'XX:XX';
    container.appendChild(clock);
    return clock;
}


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
        return new Promise(resolve => {
            setTimeout(() => {
                clock.classList.remove('glow');
                resolve();
            }, duration);
        });
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

    async function animationSequence() {
        await animateClock(3000);
        await glowEffect('CO:MN', 3000);
        await animateClock(3000);
        await glowEffect('20:25', 3000);
    }

    return async function() {
        await animationSequence();
    };
}


function detectPullDown(container) {
    let startY;
    let triggered = false;
    let isAnimating = false;
    let touchScrollThreshold = 200;
    let wheelScrollThreshold = 1000;
    let wheelDelta = 0;

    function handlePullDown(pullDistance) {
        if (!triggered && !isAnimating && window.scrollY === 0 && pullDistance > touchScrollThreshold) {
            triggerEasterEgg(container);
        }
    }


    document.addEventListener('touchstart', (e) => {
        if (!isAnimating) {
            startY = e.touches[0].pageY;
        }
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        if (!isAnimating && startY !== undefined) {
            const currentY = e.touches[0].pageY;
            const pullDistance = currentY - startY;
            handlePullDown(pullDistance);
        }
    }, { passive: true });


    document.addEventListener('mousedown', (e) => {
        if (!isAnimating) {
            startY = e.pageY;
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!isAnimating && startY !== null) {
            const pullDistance = e.pageY - startY;
            handlePullDown(pullDistance);
        }
    });

    document.addEventListener('mouseup', () => {
        startY = null;
    });


    document.addEventListener('wheel', (e) => {
        if (!isAnimating) {
            if (e.deltaY < 0) {
                wheelDelta += Math.abs(e.deltaY);
                if (window.scrollY === 0 && wheelDelta > wheelScrollThreshold) {
                    triggerEasterEgg(container);
                    wheelDelta = 0;
                }
            } else {
                wheelDelta = 0;
            }
        }
    }, { passive: true });


    container.addEventListener('transitionend', () => {
        if (!container.classList.contains('active')) {
            wheelDelta = 0;
        }
    });

    async function triggerEasterEgg(container) {
        if (isAnimating) return;
        
        isAnimating = true;
        triggered = true;
        container.classList.add('active');

        const clock = container.querySelector('#clock');
        const runAnimation = initializeClockAnimation(clock);
        await runAnimation();
        
        hideAndResetAnimation(container);
    }

    function hideAndResetAnimation(container) {
        container.classList.remove('active');
        

        container.addEventListener('transitionend', function onTransitionEnd() {
            container.removeEventListener('transitionend', onTransitionEnd);
            resetAnimation(container);
            isAnimating = false;
            triggered = false;
        }, { once: true });
    }

    function resetAnimation(container) {
        const clock = container.querySelector('#clock');
        if (clock) {
            clock.textContent = 'XX:XX';
            clock.classList.remove('glow');
        }
    }
}


function initializeEasterEgg() {
    createStyles();
    loadGoogleFonts();
    const container = createEasterEggContainer();
    createClockElement(container);
    detectPullDown(container);
}


document.addEventListener('DOMContentLoaded', initializeEasterEgg);
