const supabase = require('../lib/supabase');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Проверяем соединение с Supabase
    const { data, error } = await supabase
      .from('tracking')
      .select('count')
      .limit(1);
    
    if (error) {
      throw error;
    }
    
    res.status(200).json({ 
      status: 'OK',
      message: 'Server is running',
      database: 'Supabase Connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ 
      status: 'ERROR',
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}; 