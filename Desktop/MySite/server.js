const express = require('express');
const cors = require('cors');
const path = require('path');
const supabase = require('./lib/supabase');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('build'));

app.get('/api/health', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tracking')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    
    res.json({ 
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
});

app.all('/api/tracking', async (req, res) => {
  try {
    switch (req.method) {
      case 'GET':
        if (req.query.trackingId) {
          const trackingId = req.query.trackingId.toString().trim();
          console.log('🔍 Поиск трек-номера:', trackingId, '(IP:', req.ip + ')');
          
          const { data: tracking, error } = await supabase
            .from('tracking')
            .select('*')
            .ilike('tracking_id', trackingId)
            .single();

          if (error && error.code !== 'PGRST116') {
            throw error;
          }

          if (tracking) {
            console.log('✅ Найден трек:', tracking.tracking_id, 'статус:', tracking.status, '(IP:', req.ip + ')');
            res.json({
              trackingId: tracking.tracking_id,
              status: tracking.status,
              deliveryDate: tracking.delivery_date,
              customerName: tracking.customer_name,
              id: tracking.id,
              createdAt: tracking.created_at,
              updatedAt: tracking.updated_at
            });
          } else {
            console.log('❌ Трек не найден:', trackingId, '(IP:', req.ip + ')');
            res.status(404).json({ error: 'Трек-номер не найден' });
          }
        } else {
          const { data: trackings, error } = await supabase
            .from('tracking')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;

          const formattedTrackings = trackings.map(tracking => ({
            trackingId: tracking.tracking_id,
            status: tracking.status,
            deliveryDate: tracking.delivery_date,
            customerName: tracking.customer_name,
            id: tracking.id,
            createdAt: tracking.created_at,
            updatedAt: tracking.updated_at
          }));

          res.json(formattedTrackings);
        }
        break;

      case 'POST':
        const newTracking = {
          tracking_id: req.body.trackingId,
          status: req.body.status || 1,
          delivery_date: req.body.deliveryDate || null,
          customer_name: req.body.customerName || '',
        };
        
        const { data: insertedTracking, error: insertError } = await supabase
          .from('tracking')
          .insert([newTracking])
          .select()
          .single();

        if (insertError) throw insertError;

        console.log('✅ Создан новый трек:', insertedTracking.tracking_id);
        res.status(201).json({
          trackingId: insertedTracking.tracking_id,
          status: insertedTracking.status,
          deliveryDate: insertedTracking.delivery_date,
          customerName: insertedTracking.customer_name,
          id: insertedTracking.id,
          createdAt: insertedTracking.created_at,
          updatedAt: insertedTracking.updated_at
        });
        break;

      case 'PUT':
        const { id } = req.body;
        if (!id) {
          return res.status(400).json({ error: 'ID обязателен для обновления' });
        }

        const updateData = {
          tracking_id: req.body.trackingId,
          status: req.body.status,
          delivery_date: req.body.deliveryDate,
          customer_name: req.body.customerName,
          updated_at: new Date().toISOString()
        };

        const { data: updatedTracking, error: updateError } = await supabase
          .from('tracking')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (updateError) throw updateError;

        if (!updatedTracking) {
          return res.status(404).json({ error: 'Трек-номер не найден' });
        }

        console.log('✅ Обновлен трек с ID:', id);
        res.json({ 
          message: 'Трек-номер обновлен успешно',
          data: {
            trackingId: updatedTracking.tracking_id,
            status: updatedTracking.status,
            deliveryDate: updatedTracking.delivery_date,
            customerName: updatedTracking.customer_name,
            id: updatedTracking.id,
            createdAt: updatedTracking.created_at,
            updatedAt: updatedTracking.updated_at
          }
        });
        break;

      case 'DELETE':
        const deleteId = req.body.id;
        if (!deleteId) {
          return res.status(400).json({ error: 'ID обязателен для удаления' });
        }

        const { error: deleteError } = await supabase
          .from('tracking')
          .delete()
          .eq('id', deleteId);

        if (deleteError) throw deleteError;

        console.log('✅ Удален трек с ID:', deleteId);
        res.json({ message: 'Трек-номер удален успешно' });
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('❌ Ошибка API:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера', details: error.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log('🚀 Сервер запущен на порту', PORT);
    console.log('🗄️ База данных: Supabase');
    console.log('🔗 API доступен по адресу: http://localhost:' + PORT);
  });
}

module.exports = app; 