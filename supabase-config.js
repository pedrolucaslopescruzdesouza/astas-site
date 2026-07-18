// --- CONEXÃO OFICIAL COM O SUPABASE (PORTFÓLIO ASTAS) ---
const SUPABASE_URL = 'https://ntokcdwyaokkonbpsqpt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50b2tjZHd5YW9ra29uYnBzcXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzNzE4NDEsImV4cCI6MjA5OTk0Nzg0MX0.5kd3q38XFeJ57BF1-W4yoYe2-IcqLWIFLdX1UjR95G8';

// Criamos o cliente blindado como window.supabaseClient para evitar o erro "undefined"
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);