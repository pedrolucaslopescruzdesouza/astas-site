// --- MOTOR DA GALÁXIA DE MARCAS (MODAL INTELIGENTE + FILTROS + BUSCA) ---
let todosOsProjetos = [];
let filtroAtivo = { tipo: 'all', valor: 'all' };
let textoPesquisa = '';

document.addEventListener('DOMContentLoaded', async () => {
    const projectsGrid = document.querySelector('.projects-grid');
    const filterButtons = document.querySelectorAll('.btn-filter');
    const searchInput = document.getElementById('search-input');
    const btnSearch = document.getElementById('btn-search');
    const btnToggleFilters = document.getElementById('btn-toggle-filters');
    const filtersDropdown = document.getElementById('filters-dropdown');
    
    // Elementos do Modal Lightbox
    const modalOverlay = document.getElementById('modal-missao');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTag = document.getElementById('modal-tag');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalDesc = document.getElementById('modal-desc');
    const modalExtras = document.getElementById('modal-extras');

    const db = window.supabaseClient;

    // 1. Abrir e Fechar o menu de filtros
    if (btnToggleFilters) {
        btnToggleFilters.addEventListener('click', () => {
            const isOpen = filtersDropdown.classList.toggle('open');
            btnToggleFilters.classList.toggle('active', isOpen);
        });
    }

    // 2. Sistema do Modal (Abrir e Fechar)
    function abrirModal(proj) {
        const catNomes = { 'branding': 'Identidade Visual', 'logos': 'Logotipo', 'motion': 'Motion Design', 'uiux': 'UI/UX Design', 'webdesign': 'Web Design', 'socialmedia': 'Social Media' };
        const nomeCat = catNomes[proj.categoria] || proj.categoria;

        modalImg.src = proj.capa_url;
        modalTag.textContent = `✦ ${nomeCat} • ${proj.segmento || 'Geral'}`;
        modalTitulo.textContent = proj.titulo;
        modalDesc.textContent = proj.descricao_completa || proj.descricao_curta || 'Sem descrição detalhada disponível para esta missão.';

        // Renderizar extras (estilo, tipografia e paleta de cores visual)
        modalExtras.innerHTML = '';
        
        if (proj.estilo_visual) {
            modalExtras.innerHTML += `<div class="extra-item"><span class="extra-label">Estilo:</span> <span>${proj.estilo_visual}</span></div>`;
        }
        if (proj.tipografia && proj.tipografia.length > 0) {
            modalExtras.innerHTML += `<div class="extra-item"><span class="extra-label">Tipografia:</span> <span>${proj.tipografia.join(', ')}</span></div>`;
        }
        if (proj.paleta_cores && proj.paleta_cores.length > 0) {
            let coresHtml = proj.paleta_cores.map(c => {
                const hex = c.trim();
                return `<span class="color-dot" style="background-color: ${hex};" title="${hex}"></span><strong>${hex}</strong>`;
            }).join(' &nbsp; ');
            modalExtras.innerHTML += `<div class="extra-item" style="flex-wrap: wrap;"><span class="extra-label">Paleta:</span> <span>${coresHtml}</span></div>`;
        }

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Trava a rolagem da página ao fundo
    }

    function fecharModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Libera a rolagem da página
    }

    if (btnCloseModal) btnCloseModal.addEventListener('click', fecharModal);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) fecharModal(); // Fecha clicando fora da caixa
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
            fecharModal(); // Fecha no ESC
        }
    });

    // 3. Buscar projetos na nuvem
    async function carregarProjetosDaNuvem() {
        try {
            if (projectsGrid) {
                projectsGrid.innerHTML = '<div style="color: var(--verde-aurora); font-weight: 700; grid-column: 1/-1; text-align: center; padding: 4rem;">✦ Sincronizando com o Universo Relacional...</div>';
            }
            const { data, error } = await db.from('universo_projetos').select('*').order('ordem', { ascending: false }).order('data_publicacao', { ascending: false });
            if (error) throw error;
            todosOsProjetos = data || [];
            executarFiltros();
        } catch (err) {
            console.error('Erro ao buscar projetos:', err);
            if (projectsGrid) { projectsGrid.innerHTML = '<div style="color: #ff6b6b; grid-column: 1/-1; text-align: center; padding: 4rem;">Não foi possível carregar as missões da nuvem no momento.</div>'; }
        }
    }

    // 4. Sistema de Filtro Combinado
    function executarFiltros() {
        if (!projectsGrid) return;
        let filtrados = todosOsProjetos;

        if (filtroAtivo.tipo !== 'all') {
            filtrados = filtrados.filter(p => p[filtroAtivo.tipo] === filtroAtivo.valor);
        }

        if (textoPesquisa.trim() !== '') {
            const termo = textoPesquisa.toLowerCase().trim();
            filtrados = filtrados.filter(p => 
                (p.titulo && p.titulo.toLowerCase().includes(termo)) ||
                (p.descricao_curta && p.descricao_curta.toLowerCase().includes(termo)) ||
                (p.segmento && p.segmento.toLowerCase().includes(termo)) ||
                (p.estilo_visual && p.estilo_visual.toLowerCase().includes(termo))
            );
        }
        renderizarProjetos(filtrados);
    }

    // 5. Desenhar cards com clique habilitado para o Modal
    function renderizarProjetos(listaProj) {
        projectsGrid.style.opacity = '0';
        setTimeout(() => {
            if (!listaProj || listaProj.length === 0) {
                projectsGrid.innerHTML = '<div style="color: var(--cinza-claro); grid-column: 1/-1; text-align: center; padding: 4rem;">✦ Nenhuma missão encontrada para esta pesquisa ou filtro.</div>';
                projectsGrid.style.opacity = '1'; return;
            }
            projectsGrid.innerHTML = '';
            listaProj.forEach((proj, index) => {
                const card = document.createElement('div');
                card.className = 'project-card';
                card.style.animationDelay = `${index * 0.06}s`;
                
                const catNomes = { 'branding': 'Identidade Visual', 'logos': 'Logotipo', 'motion': 'Motion Design', 'uiux': 'UI/UX Design', 'webdesign': 'Web Design', 'socialmedia': 'Social Media' };
                const nomeCat = catNomes[proj.categoria] || proj.categoria;

                card.innerHTML = `
                    <div class="project-image-box"><img src="${proj.capa_url}" alt="${proj.titulo}"></div>
                    <div class="project-info">
                        <span class="project-tag">✦ ${nomeCat} • ${proj.segmento || 'Geral'}</span>
                        <h3>${proj.titulo}</h3>
                        <p>${proj.descricao_curta}</p>
                    </div>
                `;

                // ADICIONA O CLIQUE PARA ABRIR O MODAL DO PROJETO
                card.addEventListener('click', () => abrirModal(proj));

                projectsGrid.appendChild(card);
            });
            projectsGrid.style.opacity = '1';
            projectsGrid.style.transition = 'opacity 0.3s ease';
        }, 150);
    }

    // 6. Cliques nos botões de filtro
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            filtroAtivo.tipo = button.getAttribute('data-type');
            filtroAtivo.valor = button.getAttribute('data-val');
            executarFiltros();
        });
    });

    // 7. Eventos de pesquisa na Lupa
    if (btnSearch) {
        btnSearch.addEventListener('click', () => {
            textoPesquisa = searchInput.value;
            executarFiltros();
            btnSearch.classList.add('active');
            setTimeout(() => btnSearch.classList.remove('active'), 300);
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && btnSearch) { btnSearch.click(); }
        });

        searchInput.addEventListener('input', (e) => {
            if (e.target.value === '') {
                textoPesquisa = '';
                executarFiltros();
            }
        });
    }

    carregarProjetosDaNuvem();
});