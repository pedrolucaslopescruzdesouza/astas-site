/* ==========================================================================
   ASTAS - MOTOR DO PAINEL ADMINISTRATIVO (SUPABASE)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Carrega a lista de projetos assim que o painel abre
    await carregarProjetosAdmin();

    // 2. Botão de Sair (Logout)
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', async () => {
            await window.supabaseClient.auth.signOut();
            window.location.href = 'login.html';
        });
    }

    // 3. Escuta o envio do formulário para salvar um novo projeto
    const form = document.getElementById('form-novo-projeto');
    const btnSalvar = document.getElementById('btn-salvar');
    const statusMsg = document.getElementById('form-status');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Muda o estado do botão
            btnSalvar.disabled = true;
            btnSalvar.innerText = '⏳ Enviando foto para a nuvem...';
            statusMsg.style.display = 'none';

            try {
                const title = document.getElementById('proj-title').value;
                const category = document.getElementById('proj-category').value;
                const tag = document.getElementById('proj-tag').value;
                const fileInput = document.getElementById('proj-image');
                const file = fileInput.files[0];

                if (!file) throw new Error('Por favor, selecione um arquivo de imagem.');

                // --- PASSO A: FAZER UPLOAD DA IMAGEM PARA O BUCKET ---
                // Cria um nome único usando a data atual para nunca haver conflito de nomes
                const fileExt = file.name.split('.').pop();
                const fileName = `art_${Date.now()}.${fileExt}`;
                
                const { data: uploadData, error: uploadError } = await window.supabaseClient
                    .storage
                    .from('portfolio-images')
                    .upload(fileName, file);

                if (uploadError) throw uploadError;

                // --- PASSO B: PEGAR A URL PÚBLICA DA IMAGEM ---
                const { data: urlData } = window.supabaseClient
                    .storage
                    .from('portfolio-images')
                    .getPublicUrl(fileName);

                const imageUrl = urlData.publicUrl;

                // --- PASSO C: SALVAR OS TEXTOS E A URL NA TABELA PROJECTS ---
                btnSalvar.innerText = '💾 Gravando no banco de dados...';
                
                const { error: dbError } = await window.supabaseClient
                    .from('projects')
                    .insert([
                        { title: title, category: category, tag: tag, image_url: imageUrl }
                    ]);

                if (dbError) throw dbError;

                // SUCESSO ABSOLUTO!
                form.reset();
                statusMsg.innerText = '✅ Projeto publicado com sucesso no portfólio!';
                statusMsg.style.backgroundColor = 'rgba(105, 213, 195, 0.15)';
                statusMsg.style.color = '#69D5C3';
                statusMsg.style.border = '1px solid #69D5C3';
                statusMsg.style.display = 'block';

                // Recarrega a lista lateral para mostrar a nova arte
                await carregarProjetosAdmin();

            } catch (err) {
                console.error('Erro ao cadastrar projeto:', err);
                statusMsg.innerText = `❌ Erro: ${err.message}`;
                statusMsg.style.backgroundColor = 'rgba(255, 107, 107, 0.15)';
                statusMsg.style.color = '#ff6b6b';
                statusMsg.style.border = '1px solid #ff6b6b';
                statusMsg.style.display = 'block';
            } finally {
                btnSalvar.disabled = false;
                btnSalvar.innerText = '🚀 Publicar no Portfólio';
            }
        });
    }
});


// Função que desenha a lista de projetos ativos no lado direito do painel
async function carregarProjetosAdmin() {
    const listaContainer = document.getElementById('lista-projetos');
    const totalSpan = document.getElementById('total-projetos');
    if (!listaContainer) return;

    listaContainer.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Carregando projetos...</p>';

    // Busca no Supabase dos mais novos para os mais antigos
    const { data: projects, error } = await window.supabaseClient
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        listaContainer.innerHTML = '<p style="color: #ff6b6b; text-align: center;">Erro ao ler banco de dados.</p>';
        return;
    }

    if (totalSpan) totalSpan.innerText = projects ? projects.length : 0;

    if (!projects || projects.length === 0) {
        listaContainer.innerHTML = `
            <div style="text-align: center; padding: 30px 10px; border: 1px dashed rgba(159,178,195,0.2); border-radius: 8px;">
                <p style="color: var(--text-muted); font-size: 0.9rem;">Nenhum projeto publicado no momento.</p>
                <span style="font-size: 0.8rem; color: var(--primary);">Use o formulário ao lado para adicionar a primeira arte!</span>
            </div>
        `;
        return;
    }

    // Desenha cada projeto em uma linha com a foto em miniatura e botão de excluir
    listaContainer.innerHTML = projects.map(proj => `
        <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-main); padding: 12px; border-radius: 8px; border: 1px solid rgba(159, 178, 195, 0.15); transition: 0.2s;" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='rgba(159, 178, 195, 0.15)'">
            <div style="display: flex; align-items: center; gap: 15px; overflow: hidden;">
                <img src="${proj.image_url}" alt="${proj.title}" style="width: 55px; height: 55px; object-fit: cover; border-radius: 6px; flex-shrink: 0; background: #000;">
                <div style="overflow: hidden;">
                    <h4 style="color: var(--text-light); margin: 0; font-size: 0.95rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${proj.title}</h4>
                    <div style="display: flex; gap: 8px; align-items: center; margin-top: 3px;">
                        <span style="background: rgba(105, 213, 195, 0.1); color: var(--primary); font-size: 0.7rem; font-weight: bold; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">${proj.category}</span>
                        <span style="color: var(--text-muted); font-size: 0.75rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${proj.tag || ''}</span>
                    </div>
                </div>
            </div>
            
            <button onclick="deletarProjeto(${proj.id})" title="Excluir Projeto" style="background: rgba(255, 107, 107, 0.1); color: #ff6b6b; border: 1px solid rgba(255, 107, 107, 0.3); padding: 8px 12px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.8rem; transition: 0.2s; flex-shrink: 0; margin-left: 10px;" onmouseover="this.style.background='#ff6b6b'; this.style.color='#fff';" onmouseout="this.style.background='rgba(255, 107, 107, 0.1)'; this.style.color='#ff6b6b';">
                🗑️
            </button>
        </div>
    `).join('');
}


// Função global para excluir um projeto do banco com confirmação de segurança
window.deletarProjeto = async function(id) {
    if (!confirm('⚠️ Tem certeza que deseja remover este projeto do seu portfólio? Essa ação não pode ser desfeita.')) {
        return;
    }

    try {
        const { error } = await window.supabaseClient
            .from('projects')
            .delete()
            .eq('id', id);

        if (error) throw error;

        // Atualiza a lista na hora
        await carregarProjetosAdmin();
        
    } catch (err) {
        console.error('Erro ao excluir:', err);
        alert('❌ Erro ao excluir projeto: ' + err.message);
    }
};