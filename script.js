// --- SISTEMA DE ÁUDIO (APENAS O BLOP AO CLICAR NO ASTRO!) ---
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
}

function playBlop() {
    initAudio();
    if (!audioCtx) return;
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.12);
    
    gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.12);
}


// --- MOTOR DAS ESTRELAS DE FUNDO (CANVAS) ---
const canvas = document.getElementById('space-canvas');
const ctx = canvas.getContext('2d');
let stars = [];
const numStars = 160;

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
        if (s.alpha <= 0.1 || s.alpha >= 0.9) s.speed = -s.speed;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 247, 250, ${s.alpha})`;
        ctx.fill();
    }
    requestAnimationFrame(animateStars);
}
animateStars();


// --- ESTRELA CADENTE PERFEITA E DUPLA (SEM BUGS) ---
function createStarElement() {
    const star = document.createElement('div');
    star.className = 'shooting-star';
    
    const tail = document.createElement('div');
    tail.className = 'star-tail';
    
    const head = document.createElement('div');
    head.className = 'star-head';
    
    star.appendChild(tail);
    star.appendChild(head);
    document.body.appendChild(star);
    
    // Escolhe se nasce no topo/esquerda ou topo/direita para cruzar de forma nítida
    const daEsquerda = Math.random() > 0.4;
    const startX = daEsquerda ? Math.random() * (window.innerWidth * 0.3) - 100 : Math.random() * (window.innerWidth * 0.3) + (window.innerWidth * 0.7);
    const startY = Math.random() * (window.innerHeight * 0.45) - 30;
    
    // Ângulo exato: descendo para a direita (20° a 40°) ou descendo para a esquerda (140° a 160°)
    const angulo = daEsquerda ? (Math.random() * 20 + 20) : (Math.random() * 20 + 140);
    
    star.style.left = `${startX}px`;
    star.style.top = `${startY}px`;
    star.style.setProperty('--angle', `${angulo}deg`);
    
    star.classList.add('shoot');
    
    // Remove do DOM após 1.2s para manter o navegador 100% leve
    setTimeout(() => {
        star.remove();
    }, 1200);
}

function spawnShootingStarLoop() {
    createStarElement();
    
    // 40% de chance de disparar UMA SEGUNDA estrela cadente quase junto (Chuva de meteoros!)
    if (Math.random() < 0.40) {
        setTimeout(createStarElement, Math.random() * 350 + 150);
    }
    
    // Agenda a próxima passagem entre 3 e 7 segundos
    const nextInterval = Math.random() * (7000 - 3000) + 3000;
    setTimeout(spawnShootingStarLoop, nextInterval);
}
setTimeout(spawnShootingStarLoop, 1500);


// --- CLIQUE NAS 5 EMOÇÕES DO ASTRO (COM SOM DE BLOP!) ---
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
    playBlop();
    
    indiceAtual = (indiceAtual + 1) % emocoesAstro.length;
    astroImg.src = emocoesAstro[indiceAtual];
    
    astroImg.style.transform = 'scale(1.15) translateY(-10px)';
    setTimeout(() => {
        astroImg.style.transform = '';
    }, 250);
});


// --- MENU GAVETA MOBILE ---
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

document.querySelectorAll('.drawer-links a').forEach(link => {
    link.addEventListener('click', closeDrawer);
});