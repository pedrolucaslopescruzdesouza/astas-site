// ==========================================================================
// MOTOR CENTRAL DE AUTENTICAÇÃO & MUTADOR DE INTERFACE (AUTH ENGINE)
// ==========================================================================

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Verifica se a conexão com o banco da comunidade está ativa
    if (!window.supabaseComunidade) {
        console.error("✦ ASTRO ERRO: supabaseComunidade não encontrado. Verifique se o arquivo comunidade-config.js foi carregado antes do auth-engine.js!");
        return;
    }

    const supabase = window.supabaseComunidade;

    // 2. Busca a sessão atual assim que a página abre
    const { data: { session }, error } = await supabase.auth.getSession();
    
    // 3. Aplica a mutação visual inicial na interface
    await mutarInterfaceUsuario(session);

    // 4. Escuta mudanças em tempo real (Ex: usuário logou em outra aba ou clicou em sair)
    supabase.auth.onAuthStateChange(async (event, newSession) => {
        console.log("✦ ASTRO AUTH EVENT:", event);
        await mutarInterfaceUsuario(newSession);
    });
});

/**
 * Função principal que altera o DOM do site dependendo do estado do usuário
 * @param {Object|null} session - Objeto da sessão do Supabase
 */
async function mutarInterfaceUsuario(session) {
    const btnTopEntre = document.querySelectorAll('.btn-top-entre');
    const botoesConversaoHome = document.querySelectorAll('a[href="login.html"], a[href="cadastro.html"]');

    if (session && session.user) {
        // ==================================================================
        // ESTADO: USUÁRIO LOGADO (NAVEGANDO COM CONTA ATIVA)
        // ==================================================================
        
        // Busca os dados de gamificação do astronauta (Nível e Codinome)
        const perfil = await buscarPerfilAstronauta(session.user.id);
        const nivel = perfil ? perfil.nivel : 1;
        const codinome = perfil ? perfil.codinome : 'Astronauta';

        // 1. Transforma o botão superior "Entre" em "✦ Conta (Nvl. X)"
        btnTopEntre.forEach(btn => {
            // Adiciona efeito de fade suave antes de trocar o texto
            btn.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            btn.style.opacity = '0';
            
            setTimeout(() => {
                btn.setAttribute('href', 'conta.html');
                btn.classList.add('logged-in-pill');
                btn.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: #04070D;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    <span>✦ ${codinome} <strong style="background: rgba(0,0,0,0.15); padding: 2px 8px; border-radius: 12px; margin-left: 4px; font-size: 0.85em;">Nvl. ${nivel}</strong></span>
                `;
                btn.style.opacity = '1';
                btn.style.background = 'linear-gradient(135deg, #8DE6D8 0%, var(--verde-aurora) 100%)';
                btn.style.boxShadow = '0 0 25px rgba(105, 213, 195, 0.6), inset 0 1px 1px #FFFFFF';
            }, 200);
        });

        // 2. Esconde botões de "Criar Conta / Entre" no meio das páginas (exceto o da navbar)
        botoesConversaoHome.forEach(el => {
            if (!el.classList.contains('btn-top-entre') && !el.classList.contains('nav-link-liquid')) {
                el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                el.style.opacity = '0';
                el.style.transform = 'scale(0.95)';
                setTimeout(() => { el.style.display = 'none'; }, 500);
            }
        });

    } else {
        // ==================================================================
        // ESTADO: USUÁRIO DESCONECTADO (VISITANTE COMUM)
        // ==================================================================
        
        btnTopEntre.forEach(btn => {
            if (btn.getAttribute('href') !== 'login.html') {
                btn.setAttribute('href', 'login.html');
                btn.classList.remove('logged-in-pill');
                btn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    <span>Entre</span>
                `;
                btn.style.background = '';
                btn.style.boxShadow = '';
            }
        });
    }
}

/**
 * Consulta a tabela perfis_astronautas para pegar XP, Nível e Codinome
 */
async function buscarPerfilAstronauta(userId) {
    try {
        const { data, error } = await window.supabaseComunidade
            .from('perfis_astronautas')
            .select('codinome, nivel, xp_atual, xp_proximo_nivel, avatar_url')
            .eq('id', userId)
            .single();

        if (error) {
            console.warn("✦ ASTRO AVISO: Perfil ainda não gerado ou erro na busca:", error.message);
            return null;
        }
        return data;
    } catch (err) {
        console.error("✦ ASTRO ERRO CRÍTICO NA BUSCA DE PERFIL:", err);
        return null;
    }
}

/**
 * Função Global de Logout (Para ser chamada no botão Sair do conta.html)
 */
window.desconectarNave = async function() {
    if (!window.supabaseComunidade) return;
    
    // Adiciona efeito de desfoque na tela durante o logout
    document.body.style.transition = 'filter 0.5s ease';
    document.body.style.filter = 'blur(10px)';
    
    await window.supabaseComunidade.auth.signOut();
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 600);
};