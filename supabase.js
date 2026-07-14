/* ==========================================================================
   ASTAS - CONEXÃO COM O BANCO DE DADOS SUPABASE
   ========================================================================== */

const SUPABASE_URL = 'https://xujbfvdwrxktupybnfzz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1amJmdmR3cnhrdHVweWJuZnp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NzI0NDAsImV4cCI6MjA5OTU0ODQ0MH0.A4_9Ro24h9kI4k77FYy0AbYF6YsOq2a15rAyzCchqDo';

// Criamos o cliente com um nome exclusivo para evitar conflito com a biblioteca
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);