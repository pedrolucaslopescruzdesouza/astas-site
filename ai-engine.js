document.addEventListener("DOMContentLoaded", () => {
    const stylePills = document.querySelectorAll(".style-pill");
    const btnGenerate = document.getElementById("btn-generate");
    const btnNew = document.getElementById("btn-new");

    const formSection = document.getElementById("form-section");
    const loadingSection = document.getElementById("loading-section");
    const resultsSection = document.getElementById("results-section");

    // Lógica para selecionar múltiplas pílulas de estilo
    stylePills.forEach(pill => {
        pill.addEventListener("click", () => {
            pill.classList.toggle("selected");
        });
    });

    // Ação principal: Gerar Direção Criativa
    btnGenerate.addEventListener("click", async () => {
        const name = document.getElementById("proj-name").value.trim();
        const segment = document.getElementById("proj-segment").value.trim();
        const target = document.getElementById("proj-target").value.trim();
        const message = document.getElementById("proj-message").value.trim();
        const colors = document.getElementById("proj-colors").value.trim() || "Sem preferência específica, escolha a melhor harmonia para o setor";

        if (!name || !segment || !target || !message) {
            alert("⚠️ Por favor, preencha todos os campos obrigatórios para que a ASTAS IA possa gerar uma direção criativa precisa.");
            return;
        }

        const selectedStyles = Array.from(document.querySelectorAll(".style-pill.selected")).map(p => p.getAttribute("data-value"));
        const styleText = selectedStyles.length > 0 ? selectedStyles.join(", ") : "Moderno e Profissional";

        // Transição para tela de carregamento
        formSection.style.display = "none";
        loadingSection.style.display = "block";
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Chamada para o motor de Inteligência Artificial
        await chamarAstasIA({ name, segment, target, message, colors, styleText });
    });

    // Botão para criar um novo briefing
    btnNew.addEventListener("click", () => {
        resultsSection.style.display = "none";
        formSection.style.display = "block";
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});

async function chamarAstasIA(dados) {
    // SUA CHAVE API OFICIAL CONECTADA
    const GEMINI_API_KEY = "AQ.Ab8RN6KVmTIsEL59iW3Mf66F6-21mevYVPrwRlFay_GmYGYcEg"; 

    // O PROMPT OFICIAL DA ASTAS IA 1.0 (COM BLINDAGEM DE SINTAXE JSON)
    const systemInstruction = `
    Você é a ASTAS IA 1.0, atuando estritamente como um "Diretor Criativo especializado em Branding e Identidade Visual".
    Sua única missão é analisar os dados fornecidos pelo usuário e desenvolver um briefing profissional de posicionamento de marca, design estratégico e direção criativa.

    REGRA DE BLINDAGEM E SEGURANÇA MÁXIMA:
    Você NÃO deve responder perguntas sobre programação, matemática, história, política, religião ou assuntos aleatórios fora do design e branding.
    Se o usuário tentar desviar o assunto ou preencher os campos com perguntas aleatórias, recuse imediatamente respondendo APENAS com um JSON contendo a frase de segurança no campo de erro:
    {"erro": "A ASTAS IA foi desenvolvida exclusivamente para auxiliar projetos relacionados ao Branding, Design e Identidade Visual."}

    REGRA ESTRUTURAL DE SINTAXE (MUITO IMPORTANTE):
    - Nunca utilize aspas duplas ("") dentro do texto dos valores JSON. Se precisar destacar uma palavra, utilize sempre aspas simples ('').
    - Não insira quebras de linha reais ou caracteres especiais não escapados dentro das strings.

    FORMATO DE SAÍDA OBRIGATÓRIO:
    Se os dados forem válidos para um projeto de marca, retorne ESTRICTAMENTE um objeto JSON válido (sem tags markdown como \`\`\`json ou textos adicionais) contendo exatamente estas chaves:
    {
      "nome_projeto": "Nome oficial da marca",
      "slogan": "Um slogan curto, magnético e memorável",
      "descricao_marca": "Descrição do conceito, propósito e posicionamento da marca em até 3 frases impactantes",
      "paleta_cores": [
        {"hex": "#07111F", "nome": "Nome criativo da cor - Explicação psicológica rápida"},
        {"hex": "#69D5C3", "nome": "Nome da cor - Explicação psicológica"},
        {"hex": "#FFFFFF", "nome": "Nome da cor - Explicação psicológica"}
      ],
      "sugestao_tipografica": "Indicação precisa de famílias tipográficas (ex: Montserrat, Clásica, Geométrica) e a justificativa técnica para a marca",
      "conceito_logo": "Diretriz detalhada para a construção da logo, formato do símbolo, geometria e aplicações vetoriais",
      "direcao_criativa": "Orientações sobre estilo visual global, texturas, formas, uso de espaço em branco e sensação estética",
      "social_media": "Estratégia de posicionamento visual e comportamento de marca para Instagram, LinkedIn e mídias sociais",
      "diferenciais": "Os principais diferenciais estratégicos que farão essa marca se destacar da concorrência",
      "palavras_chave": ["Palavra1", "Palavra2", "Palavra3", "Palavra4", "Palavra5"]
    }`;

    const promptUsuario = `
    DADOS DO BRIEFING DO CLIENTE:
    - Nome da Empresa: ${dados.name}
    - Segmento de Atuação: ${dados.segment}
    - Público-Alvo: ${dados.target}
    - Mensagem que Deseja Transmitir: ${dados.message}
    - Estilo Visual Desejado: ${dados.styleText}
    - Preferência de Cores: ${dados.colors}
    
    Por favor, gere a Direção Criativa e o Posicionamento de Marca para este projeto em formato JSON.
    `;

    let modelosParaTestar = [
        "gemini-2.5-flash",
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-pro"
    ];

    try {
        const resLista = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`);
        if (resLista.ok) {
            const dataLista = await resLista.json();
            if (dataLista.models && Array.isArray(dataLista.models)) {
                const modelosDinamicos = dataLista.models
                    .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent") && m.name.toLowerCase().includes("gemini"))
                    .map(m => m.name.replace("models/", ""))
                    .reverse();
                
                modelosParaTestar = [...new Set([...modelosDinamicos, ...modelosParaTestar])];
            }
        }
    } catch (e) {
        console.warn("Aviso: O rastreador usará a lista de segurança padrão.", e);
    }

    let data = null;
    let erroAnterior = "";

    try {
        for (const nomeModelo of modelosParaTestar) {
            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${nomeModelo}:generateContent?key=${GEMINI_API_KEY}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: systemInstruction + "\n\n" + promptUsuario }] }],
                        generationConfig: { 
                            temperature: 0.7, 
                            responseMimeType: "application/json" 
                        }
                    })
                });

                data = await response.json();
                
                if (response.ok && data.candidates && data.candidates[0].content) {
                    console.log(`Conexão estabelecida com sucesso usando o modelo: ${nomeModelo}`);
                    break;
                } else {
                    erroAnterior = data.error && data.error.message ? data.error.message : "Modelo recusou a conexão.";
                    data = null;
                }
            } catch (e) {
                erroAnterior = e.message;
                data = null;
            }
        }

        if (!data || !data.candidates || !data.candidates[0].content) {
            throw new Error(`Nenhum modelo da nuvem aceitou a conexão. Último aviso do servidor: ${erroAnterior}`);
        }

        // LIMPEZA E SANITIZAÇÃO DA RESPOSTA ANTES DE PARSAR
        let textoResposta = data.candidates[0].content.parts[0].text;
        
        // Remove possíveis blocos de marcação markdown (```json e ```) caso o modelo adicione
        textoResposta = textoResposta.replace(/^```json\s*/i, "").replace(/\s*```$/, "").trim();

        const jsonResposta = JSON.parse(textoResposta);

        if (jsonResposta.erro) {
            alert("⚠️ " + jsonResposta.erro);
            document.getElementById("loading-section").style.display = "none";
            document.getElementById("form-section").style.display = "block";
            return;
        }

        renderizarResultado(jsonResposta);

    } catch (error) {
        console.error("Erro técnico na ASTAS IA:", error);
        alert("⚠️ Ocorreu um problema ao processar seu projeto:\n\n" + error.message);
        document.getElementById("loading-section").style.display = "none";
        document.getElementById("form-section").style.display = "block";
    }
}

function renderizarResultado(res) {
    document.getElementById("loading-section").style.display = "none";
    document.getElementById("results-section").style.display = "block";

    document.getElementById("res-title").innerText = res.nome_projeto || "Projeto Sem Nome";
    document.getElementById("res-date").innerText = new Date().toLocaleDateString('pt-BR');
    document.getElementById("res-slogan").innerText = `"${res.slogan}"`;
    document.getElementById("res-desc").innerText = res.descricao_marca;
    document.getElementById("res-typo").innerText = res.sugestao_tipografica;
    document.getElementById("res-logo").innerText = res.conceito_logo;
    document.getElementById("res-creative").innerText = res.direcao_criativa;
    document.getElementById("res-social").innerText = res.social_media;
    document.getElementById("res-diff").innerText = res.diferenciais;

    const colorsContainer = document.getElementById("res-colors");
    colorsContainer.innerHTML = "";
    if (res.paleta_cores && Array.isArray(res.paleta_cores)) {
        res.paleta_cores.forEach(cor => {
            const span = document.createElement("div");
            span.className = "color-swatch";
            span.innerHTML = `<span class="color-circle" style="background-color: ${cor.hex};"></span> <strong>${cor.hex}</strong> - ${cor.nome}`;
            colorsContainer.appendChild(span);
        });
    }

    const kwContainer = document.getElementById("res-keywords");
    kwContainer.innerHTML = "";
    if (res.palavras_chave && Array.isArray(res.palavras_chave)) {
        res.palavras_chave.forEach(kw => {
            const tag = document.createElement("span");
            tag.className = "keyword-tag";
            tag.innerText = `#${kw}`;
            kwContainer.appendChild(tag);
        });
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
}