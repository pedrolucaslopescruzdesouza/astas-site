// ==========================================================================
// CONEXÃO COM O BANCO DOS ASTRONAUTAS (SUPABASE 2 - COMUNIDADE / XP)
// ==========================================================================

const COMUNIDADE_URL = 'https://vxmbxpanwikiixkalvlc.supabase.co';
const COMUNIDADE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4bWJ4cGFud2lraWl4a2FsdmxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0NzI2OTEsImV4cCI6MjEwMDA0ODY5MX0.QrqYRaCGuPs5AauI_mpBtsbbFHFSvRsoN7KYCVK3GUk';

// Inicializa o cliente do Supabase exclusivo para os usuários e gamificação
// Usamos o nome 'supabaseComunidade' para nunca conflitar com o 'supabase' do Portfólio!
const supabaseComunidade = supabase.createClient(COMUNIDADE_URL, COMUNIDADE_ANON_KEY);

// Torna o cliente acessível globalmente para o motor de autenticação (auth-engine.js)
window.supabaseComunidade = supabaseComunidade;