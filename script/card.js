const cards = document.querySelectorAll('.card');
const maxRotation = 8; // Maximum rotation in degrees

cards.forEach(card => {
    const lightEffect = card.querySelector('.light-effect');

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const cardCenterX = rect.width / 2;
        const cardCenterY = rect.height / 2;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const rotateY = ((mouseX - cardCenterX) / cardCenterX) * maxRotation;
        const rotateX = -((mouseY - cardCenterY) / cardCenterY) * maxRotation;

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        // Update light effect
        const lightX = (mouseX / rect.width) * 100;
        const lightY = (mouseY / rect.height) * 100;
        lightEffect.style.background = `radial-gradient(circle at ${lightX}% ${lightY}%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 80%)`;
        lightEffect.style.opacity = '0.2';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateX(0) rotateY(0)';
        lightEffect.style.opacity = '0';
    });
});