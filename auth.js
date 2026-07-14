/* ==========================================================================
   ASTAS - AUTENTICAÇÃO E CONTROLE DE SESSÃO (SUPABASE)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const btnLogin = document.getElementById('btn-login');

    // 1. SE ESTIVERMOS NA TELA DE LOGIN: Escuta o envio do formulário
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Estado de carregamento do botão
            btnLogin.innerText = 'Autenticando...';
            btnLogin.disabled = true;
            loginError.style.display = 'none';

            try {
                // Tenta fazer login na nuvem do Supabase
                const { data, error } = await window.supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password
                });

                if (error) throw error;

                // Sucesso! Redireciona para o painel administrativo
                window.location.href = 'admin.html';

            } catch (err) {
                console.error('Erro no login:', err.message);
                loginError.innerText = '❌ E-mail ou senha incorretos. Verifique suas credenciais.';
                loginError.style.display = 'block';
                btnLogin.innerText = 'Entrar no Sistema';
                btnLogin.disabled = false;
            }
        });
    }

    // 2. SE ESTIVERMOS NA TELA ADM: Proteção de Rota (Guarda de Segurança)
    // Se alguém tentar abrir admin.html sem estar logado, expulsa de volta para o login!
    const isAdminPage = window.location.pathname.includes('admin.html');
    if (isAdminPage) {
        verificarSessao();
    }
});

// Função que checa se o usuário tem um token válido salvo no navegador
async function verificarSessao() {
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    
    if (!session) {
        // Não está logado! Redireciona para o login
        window.location.href = 'login.html';
    }
}