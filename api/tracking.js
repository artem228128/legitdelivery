const fs = require('fs').promises;
const path = require('path');

// Путь к файлу с данными
const DATA_FILE = '/tmp/tracking-data.json';

// Инициализация файла данных
async function initDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch (error) {
    // Файл не существует, создаем его
    await fs.writeFile(DATA_FILE, JSON.stringify([]));
  }
}

// Чтение данных
async function readTrackingData() {
  await initDataFile();
  const data = await fs.readFile(DATA_FILE, 'utf8');
  return JSON.parse(data);
}

// Запись данных
async function writeTrackingData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

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
    const trackingData = await readTrackingData();
    
    switch (req.method) {
      case 'GET':
        // Получить все данные или найти по trackingId
        const { trackingId } = req.query;
        
        if (trackingId) {
          const item = trackingData.find(item => 
            item.trackingId.toLowerCase() === trackingId.toLowerCase()
          );
          
          if (!item) {
            return res.status(404).json({ 
              success: false, 
              error: 'Трек-номер не знайдено' 
            });
          }
          
          return res.status(200).json({
            success: true,
            trackingId: item.trackingId,
            status: item.status,
            deliveryDate: item.deliveryDate,
            customerName: item.customerName
          });
        }
        
        // Возвращаем все данные (для админ панели)
        return res.status(200).json({
          success: true,
          data: trackingData
        });
        
      case 'POST':
        // Добавить новую посылку
        const newItem = {
          id: Date.now().toString(),
          trackingId: req.body.trackingId,
          status: req.body.status || 1,
          deliveryDate: req.body.deliveryDate || '',
          customerName: req.body.customerName || '',
          createdAt: new Date().toISOString()
        };
        
        // Проверяем, не существует ли уже такой трек-номер
        const existingItem = trackingData.find(item => 
          item.trackingId.toLowerCase() === newItem.trackingId.toLowerCase()
        );
        
        if (existingItem) {
          return res.status(400).json({
            success: false,
            error: 'Трек-номер уже існує'
          });
        }
        
        trackingData.push(newItem);
        await writeTrackingData(trackingData);
        
        return res.status(201).json({
          success: true,
          data: newItem
        });
        
      case 'PUT':
        // Обновить существующую посылку
        const { id } = req.query;
        const updateData = req.body;
        
        const itemIndex = trackingData.findIndex(item => item.id === id);
        
        if (itemIndex === -1) {
          return res.status(404).json({
            success: false,
            error: 'Посылка не знайдена'
          });
        }
        
        trackingData[itemIndex] = {
          ...trackingData[itemIndex],
          ...updateData,
          updatedAt: new Date().toISOString()
        };
        
        await writeTrackingData(trackingData);
        
        return res.status(200).json({
          success: true,
          data: trackingData[itemIndex]
        });
        
      case 'DELETE':
        // Удалить посылку
        const { id: deleteId } = req.query;
        
        const initialLength = trackingData.length;
        const filteredData = trackingData.filter(item => item.id !== deleteId);
        
        if (filteredData.length === initialLength) {
          return res.status(404).json({
            success: false,
            error: 'Посылка не знайдена'
          });
        }
        
        await writeTrackingData(filteredData);
        
        return res.status(200).json({
          success: true,
          message: 'Посылка видалена'
        });
        
      default:
        return res.status(405).json({
          success: false,
          error: 'Метод не підтримується'
        });
    }
    
  } catch (error) {
    console.error('Помилка API:', error);
    return res.status(500).json({
      success: false,
      error: 'Внутрішня помилка сервера'
    });
  }
}; 