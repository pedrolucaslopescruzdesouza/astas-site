/* --- ANIMAÇÕES E INTERAÇÕES DO SITE --- */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Efeito de Animação ao Rolar a Página (Scroll Reveal)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Seleciona elementos para animar
    const elementsToAnimate = document.querySelectorAll('.service-card, .about-text, .section-title, .contact-form');
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // 2. Feedback simples no formulário
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Obrigado, Pedro! Recebemos sua mensagem. (Esta é uma versão de demonstração)');
            contactForm.reset();
        });
    }
});