document.addEventListener('DOMContentLoaded', () => {

    /* 1. ANIMAÇÃO SUAVE AO ROLAR (SCROLL REVEAL) */
    const observerOptions = { threshold: 0.1 };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.service-card, .portfolio-card, .highlight-box, .about-text, .contact-form');
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });


    /* 2. MENU MOBILE INTELIGENTE (GAVETA PARA SMARTPHONES) */
    const headerContent = document.querySelector('.header-content');
    const navMenu = document.querySelector('.nav-menu');

    if (headerContent && navMenu) {
        // Cria o botão hamburguer automaticamente via JS sem precisar editar os HTMLs
        let mobileBtn = document.querySelector('.mobile-menu-btn');
        if (!mobileBtn) {
            mobileBtn = document.createElement('button');
            mobileBtn.className = 'mobile-menu-btn';
            mobileBtn.innerHTML = '☰';
            mobileBtn.setAttribute('aria-label', 'Abrir ou Fechar Menu');
            headerContent.appendChild(mobileBtn);
        }

        // Alterna entre abrir/fechar a gaveta e mudar o ícone (☰ para ✕)
        mobileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('open');
            mobileBtn.innerHTML = navMenu.classList.contains('open') ? '✕' : '☰';
        });

        // Fecha a gaveta automaticamente quando o usuário clica em um link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                mobileBtn.innerHTML = '☰';
            });
        });

        // Fecha a gaveta se o usuário tocar em qualquer área fora do menu
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileBtn.contains(e.target) && navMenu.classList.contains('open')) {
                navMenu.classList.remove('open');
                mobileBtn.innerHTML = '☰';
            }
        });
    }


    /* 3. SISTEMA DE FILTROS DO PORTFÓLIO */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                portfolioCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    
                    if (filterValue === 'todos' || filterValue === cardCategory) {
                        card.style.display = 'block';
                        setTimeout(() => card.style.opacity = '1', 50);
                    } else {
                        card.style.opacity = '0';
                        setTimeout(() => card.style.display = 'none', 300);
                    }
                });
            });
        });
    }


    /* 4. SISTEMA DE ZOOM / LIGHTBOX (SEM DOWNLOAD) */
    const lightbox = document.getElementById('zoom-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const closeBtn = document.querySelector('.close-lightbox');

    if (lightbox && portfolioCards.length > 0) {
        portfolioCards.forEach(card => {
            card.addEventListener('click', () => {
                const img = card.querySelector('img');
                const title = card.querySelector('h3').innerText;
                
                lightboxImg.src = img.src;
                if (lightboxTitle) lightboxTitle.innerText = title;
                
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-container')) {
                closeLightbox();
            }
        });
    }


    /* 5. BLINDAGEM CONTRA CLIQUE DIREITO E DOWNLOADS */
    const protectedContent = document.querySelector('.protected-content');
    const toast = document.getElementById('protection-toast');

    const showProtectionToast = () => {
        if (toast) {
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 4000);
        }
    };

    if (protectedContent) {
        protectedContent.addEventListener('contextmenu', (e) => {
            if (e.target.tagName === 'IMG' || e.target.closest('.portfolio-card')) {
                e.preventDefault();
                showProtectionToast();
            }
        });

        protectedContent.addEventListener('dragstart', (e) => {
            if (e.target.tagName === 'IMG') {
                e.preventDefault();
                showProtectionToast();
            }
        });
    }
});