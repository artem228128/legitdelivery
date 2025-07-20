const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://xjavflsdkeovjbkpwzct.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqYXZmbHNka2Vvdmpia3B3emN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNDYyNDQsImV4cCI6MjA2ODYyMjI0NH0.H_iTpOEhc23BSvbYVFrZCgaGSwAYYmeeFKPzpTbvl_Y';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
