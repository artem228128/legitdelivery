const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://xjavflsdkeovjbkpwzct.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqYXZmbHNka2Vvdmpia3B3emN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNDYyNDQsImV4cCI6MjA2ODYyMjI0NH0.H_iTpOEhc23BSvbYVFrZCgaGSwAYYmeeFKPzpTbvl_Y';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
  // CORS заголовки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    const { data, error } = await supabase
      .from('tracking')
      .select('count')
      .limit(1);
    
    if (error) {
      throw error;
    }
    
    res.json({ 
      status: 'OK',
      message: 'Server is running on Vercel',
      database: 'Supabase Connected',
      timestamp: new Date().toISOString(),
      environment: 'production'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ 
      status: 'ERROR',
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString(),
      environment: 'production'
    });
  }
}; 