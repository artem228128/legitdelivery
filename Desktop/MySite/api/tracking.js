const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://xjavflsdkeovjbkpwzct.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqYXZmbHNka2Vvdmpia3B3emN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNDYyNDQsImV4cCI6MjA2ODYyMjI0NH0.H_iTpOEhc23BSvbYVFrZCgaGSwAYYmeeFKPzpTbvl_Y';

const supabase = createClient(supabaseUrl, supabaseKey);

// CORS заголовки
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = async (req, res) => {
  setCorsHeaders(res);
  
  // Обработка OPTIONS запроса для CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    switch (req.method) {
      case 'GET':
        if (req.query.trackingId) {
          const trackingId = req.query.trackingId.toString().trim();
          console.log(`🔍 Поиск трек-номера: ${trackingId}`);
          
          const { data: tracking, error } = await supabase
            .from('tracking')
            .select('*')
            .ilike('tracking_id', trackingId)
            .single();

          if (error && error.code !== 'PGRST116') {
            throw error;
          }

          if (tracking) {
            console.log(`✅ Найден трек: ${tracking.tracking_id}, статус: ${tracking.status}`);
            res.json({
              success: true,
              trackingId: tracking.tracking_id,
              status: tracking.status,
              deliveryDate: tracking.delivery_date,
              customerName: tracking.customer_name,
              id: tracking.id,
              createdAt: tracking.created_at,
              updatedAt: tracking.updated_at
            });
          } else {
            console.log(`❌ Трек не найден: ${trackingId}`);
            res.status(404).json({ 
              success: false, 
              error: 'Трек-номер не знайдено' 
            });
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

          res.json({
            success: true,
            data: formattedTrackings
          });
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

        if (insertError) {
          if (insertError.code === '23505') {
            return res.status(400).json({
              success: false,
              error: 'Трек-номер уже існує'
            });
          }
          throw insertError;
        }

        console.log(`✅ Создан новый трек: ${insertedTracking.tracking_id}`);
        res.status(201).json({
          success: true,
          data: {
            trackingId: insertedTracking.tracking_id,
            status: insertedTracking.status,
            deliveryDate: insertedTracking.delivery_date,
            customerName: insertedTracking.customer_name,
            id: insertedTracking.id,
            createdAt: insertedTracking.created_at,
            updatedAt: insertedTracking.updated_at
          }
        });
        break;

      case 'PUT':
        const { id } = req.query;
        if (!id) {
          return res.status(400).json({ 
            success: false, 
            error: 'ID обязателен для обновления' 
          });
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
          return res.status(404).json({ 
            success: false, 
            error: 'Посылка не знайдена' 
          });
        }

        console.log(`✅ Обновлен трек с ID: ${id}`);
        res.json({ 
          success: true,
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
        const deleteId = req.query.id;
        if (!deleteId) {
          return res.status(400).json({ 
            success: false, 
            error: 'ID обязателен для удаления' 
          });
        }

        const { error: deleteError } = await supabase
          .from('tracking')
          .delete()
          .eq('id', deleteId);

        if (deleteError) throw deleteError;

        console.log(`✅ Удален трек с ID: ${deleteId}`);
        res.json({ 
          success: true, 
          message: 'Посылка видалена' 
        });
        break;

      default:
        res.status(405).json({ 
          success: false, 
          error: 'Метод не підтримується' 
        });
    }
  } catch (error) {
    console.error('❌ Ошибка API:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Внутрішня помилка сервера', 
      details: error.message 
    });
  }
}; 