// --- MOTOR DAS ESTRELAS NA TELA INTEIRA (CANVAS) ---
const canvas = document.getElementById('space-canvas');
const ctx = canvas.getContext('2d');

let stars = [];
const numStars = 150; // Mais estrelas brilhando no fundo!

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

for (let i = 0; i < numStars; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.8 + 0.5,
        alpha: Math.random(),
        speed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1)
    });
}

function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < stars.length; i++) {
        let s = stars[i];
        s.alpha += s.speed;
        if (s.alpha <= 0.1 || s.alpha >= 0.9) {
            s.speed = -s.speed;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        ctx.fill();
    }
    
    requestAnimationFrame(animateStars);
}

animateStars();


// --- ESTRELA CADENTE COM MAIS PRESENÇA E BRILHO ---
const shootingStar = document.getElementById('shooting-star');

function triggerShootingStar() {
    const startX = Math.random() * (window.innerWidth - 300) + 200;
    const startY = Math.random() * (window.innerHeight / 3);
    
    shootingStar.style.left = `${startX}px`;
    shootingStar.style.top = `${startY}px`;
    
    shootingStar.classList.add('shoot');
    
    setTimeout(() => {
        shootingStar.classList.remove('shoot');
    }, 1100);

    // Aparece com muito mais presença: intervalo rápido entre 5s e 15s!
    const nextInterval = Math.random() * (15000 - 5000) + 5000;
    setTimeout(triggerShootingStar, nextInterval);
}

setTimeout(triggerShootingStar, 2000);


// --- SISTEMA INTERATIVO: AS 5 EMOÇÕES DO ASTRO ---
const astroImg = document.getElementById('astro-img');
const emocoesAstro = [
    'assets/astro-neutro.png',
    'assets/astro-curioso.png',
    'assets/astro-pensativo.png',
    'assets/astro-surpreso.png',
    'assets/astro-feliz.png'
];
let indiceAtual = 0;

astroImg.addEventListener('click', () => {
    indiceAtual = (indiceAtual + 1) % emocoesAstro.length;
    astroImg.src = emocoesAstro[indiceAtual];
    
    astroImg.style.transform = 'scale(1.15) translateY(-10px)';
    setTimeout(() => {
        astroImg.style.transform = '';
    }, 250);
});


// --- MENU GAVETA MOBILE COM ANIMAÇÃO SUAVE (IMAGEM 2) ---
const btnOpenMenu = document.getElementById('btn-open-menu');
const btnCloseMenu = document.getElementById('btn-close-menu');
const mobileDrawer = document.getElementById('mobile-drawer');
const drawerOverlay = document.getElementById('drawer-overlay');

function openDrawer() {
    mobileDrawer.classList.add('open');
    drawerOverlay.classList.add('open');
}

function closeDrawer() {
    mobileDrawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
}

btnOpenMenu.addEventListener('click', openDrawer);
btnCloseMenu.addEventListener('click', closeDrawer);
drawerOverlay.addEventListener('click', closeDrawer);

// Fecha a gaveta automaticamente quando o usuário clica em algum link
const drawerLinks = document.querySelectorAll('.drawer-links a');
drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
});