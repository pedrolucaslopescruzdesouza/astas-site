// --- MOTOR DA GALÁXIA DE MARCAS (FILTROS COMPLETOS + BUSCA POR LUPA) ---
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
    const db = window.supabaseClient;

    // 1. Abrir e Fechar o menu de filtros
    btnToggleFilters.addEventListener('click', () => {
        const isOpen = filtersDropdown.classList.toggle('open');
        btnToggleFilters.classList.toggle('active', isOpen);
    });

    // 2. Buscar projetos na nuvem
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

    // 3. Sistema de Filtro Combinado (Categoria/Segmento/Estilo + Lupa)
    function executarFiltros() {
        if (!projectsGrid) return;
        let filtrados = todosOsProjetos;

        // Filtra pelo botão selecionado na gaveta
        if (filtroAtivo.tipo !== 'all') {
            filtrados = filtrados.filter(p => p[filtroAtivo.tipo] === filtroAtivo.valor);
        }

        // Filtra pelo que foi digitado na barra de pesquisa
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

    // 4. Desenhar cards na tela
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
                projectsGrid.appendChild(card);
            });
            projectsGrid.style.opacity = '1';
            projectsGrid.style.transition = 'opacity 0.3s ease';
        }, 150);
    }

    // 5. Ouve os cliques em QUALQUER botão de filtro das 3 seções
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            filtroAtivo.tipo = button.getAttribute('data-type');
            filtroAtivo.valor = button.getAttribute('data-val');
            executarFiltros();
        });
    });

    // 6. Ativa a pesquisa clicando no Botão Redondo da Lupa ou dando Enter
    btnSearch.addEventListener('click', () => {
        textoPesquisa = searchInput.value;
        executarFiltros();
        btnSearch.classList.add('active');
        setTimeout(() => btnSearch.classList.remove('active'), 300);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') { btnSearch.click(); }
    });

    searchInput.addEventListener('input', (e) => {
        if (e.target.value === '') {
            textoPesquisa = '';
            executarFiltros();
        }
    });

    carregarProjetosDaNuvem();
});