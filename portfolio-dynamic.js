/* ==========================================================================
   ASTAS - RENDERIZAÇÃO DINÂMICA DO PORTFÓLIO (SUPABASE)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', async () => {
    const gridContainer = document.getElementById('portfolio-grid');
    const loadingSpinner = document.getElementById('loading-spinner');

    if (!gridContainer) return;

    try {
        // 1. Busca os projetos usando a nossa variável exclusiva 'supabaseClient'
        const { data: projects, error } = await window.supabaseClient
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Esconde o aviso de carregamento
        if (loadingSpinner) loadingSpinner.style.display = 'none';
        gridContainer.style.display = 'grid';

        // 2. Se o banco estiver vazio, mostra a mensagem amigável
        if (!projects || projects.length === 0) {
            gridContainer.style.display = 'block';
            gridContainer.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; background: var(--bg-secondary); border-radius: 12px; border: 1px dashed rgba(159, 178, 195, 0.3);">
                    <h3 style="color: var(--text-light); margin-bottom: 10px;">Nenhum projeto publicado ainda</h3>
                    <p style="color: var(--text-muted);">Acesse o painel administrativo no rodapé para cadastrar o primeiro projeto da ASTAS!</p>
                </div>
            `;
            return;
        }

        // 3. Desenha os cartões dos projetos na tela
        gridContainer.innerHTML = projects.map(proj => `
            <div class="portfolio-card fade-in visible" data-category="${proj.category}">
                <div class="portfolio-img-wrapper">
                    <img src="${proj.image_url}" alt="${proj.title}" loading="lazy">
                    <div class="portfolio-overlay">
                        <span class="portfolio-tag">${proj.tag || proj.category}</span>
                        <h3>${proj.title}</h3>
                        <span class="zoom-action">🔍 Clique para Ampliar em Alta Resolução</span>
                    </div>
                </div>
            </div>
        `).join('');

        // 4. Reativa o Sistema de Filtros para os novos cartões
        ativarFiltrosDinamicos();

        // 5. Reativa o Sistema de Zoom (Lightbox) e Botão Fechar para os novos cartões
        ativarZoomDinamico();

    } catch (err) {
        console.error('Erro ao carregar projetos do Supabase:', err.message);
        if (loadingSpinner) {
            loadingSpinner.innerHTML = `❌ Erro ao conectar com a nuvem. Tente atualizar a página.`;
            loadingSpinner.style.color = '#ff6b6b';
        }
    }
});


/* --- FUNÇÕES AUXILIARES DE INTERAÇÃO --- */
function ativarFiltrosDinamicos() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

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

function ativarZoomDinamico() {
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    const lightbox = document.getElementById('zoom-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const closeBtn = document.querySelector('.close-lightbox');

    if (!lightbox || portfolioCards.length === 0) return;

    // 1. Abrir o Lightbox ao clicar em qualquer card
    portfolioCards.forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('img');
            const title = card.querySelector('h3').innerText;
            
            if (lightboxImg) lightboxImg.src = img.src;
            if (lightboxTitle) lightboxTitle.innerText = title;
            
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Trava a rolagem do fundo
        });
    });

    // 2. Função inteligente para fechar o Lightbox e liberar a rolagem
    const fecharLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto'; // Destrava a rolagem do fundo
    };

    // 3. Fechar ao clicar no botão "✕"
    if (closeBtn) {
        closeBtn.onclick = fecharLightbox;
    }

    // 4. Fechar ao clicar na área escura (fora da foto)
    lightbox.onclick = (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-container')) {
            fecharLightbox();
        }
    };

    // 5. Fechar ao pressionar a tecla ESC no teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            fecharLightbox();
        }
    });
}