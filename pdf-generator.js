document.addEventListener("DOMContentLoaded", () => {
    // Procura pelo botão de exportar PDF na tela de resultados
    // Aceita os IDs mais comuns para facilitar a integração
    const btnPdf = document.getElementById("btn-pdf") || document.getElementById("btn-export") || document.getElementById("btn-download");
    
    if (!btnPdf) {
        console.warn("ASTAS IA: Botão de geração de PDF não encontrado. Verifique se o ID do botão no HTML está como 'btn-pdf'.");
        return;
    }

    btnPdf.addEventListener("click", () => {
        gerarBriefingPDF(btnPdf);
    });
});

// Função autônoma que carrega a biblioteca html2pdf dinamicamente direto da nuvem
function carregarHtml2Pdf() {
    return new Promise((resolve, reject) => {
        if (window.html2pdf) {
            resolve(window.html2pdf);
            return;
        }
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
        script.onload = () => resolve(window.html2pdf);
        script.onerror = () => reject(new Error("Não foi possível carregar o motor de PDF da nuvem."));
        document.head.appendChild(script);
    });
}

async function gerarBriefingPDF(botao) {
    const textoOriginal = botao.innerHTML;
    botao.innerHTML = "⏳ Gerando PDF...";
    botao.disabled = true;

    try {
        // 1. Garante que a biblioteca está pronta para uso
        await carregarHtml2Pdf();

        // 2. Captura a seção de resultados onde está o briefing
        const elementoResultado = document.getElementById("results-section");
        if (!elementoResultado) {
            throw new Error("Seção do briefing não encontrada na tela.");
        }

        // 3. Pega o nome oficial da marca gerada para dar nome ao arquivo salvo
        const nomeProjeto = document.getElementById("res-title")?.innerText || "Marca";
        const nomeArquivoClean = nomeProjeto.replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();

        // 4. Configurações técnicas de renderização (A4, qualidade máxima e margens limpas)
        const opcoes = {
            margin:       [12, 12, 12, 12], // margens em mm
            filename:     `briefing_astas_${nomeArquivoClean}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true, scrollY: 0 },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // 5. Esconde temporariamente botões de ação para não aparecerem impressos no PDF
        const botoesAcao = elementoResultado.querySelectorAll("button, .btn, #btn-new, #btn-pdf, #btn-export");
        botoesAcao.forEach(b => b.style.display = "none");

        // 6. Gera, converte em arquivo e inicia o download automaticamente no navegador
        await html2pdf().set(opcoes).from(elementoResultado).save();

        // 7. Devolve os botões para a tela após o download
        botoesAcao.forEach(b => b.style.display = "");

    } catch (erro) {
        console.error("Erro na exportação ASTAS:", erro);
        alert("⚠️ Ocorreu um problema ao exportar seu PDF:\n\n" + erro.message);
    } finally {
        botao.innerHTML = textoOriginal;
        botao.disabled = false;
    }
}