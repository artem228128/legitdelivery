const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3001;

// Путь к файлу с данными
const DATA_FILE = path.join(__dirname, 'tracking-data.json');

// Middleware
app.use(cors());
app.use(express.json());

// Инициализация файла данных
async function initDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch (error) {
    // Файл не существует, создаем его с тестовыми данными
    const testData = [
      {
        id: '1',
        trackingId: 'TEST123',
        status: 7,
        deliveryDate: '25 січня 2025',
        customerName: 'Тестовий клієнт',
        createdAt: new Date().toISOString()
      }
    ];
    await fs.writeFile(DATA_FILE, JSON.stringify(testData, null, 2));
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

// API маршруты
app.get('/api/tracking', async (req, res) => {
  try {
    const trackingData = await readTrackingData();
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
      
      return res.json({
        success: true,
        trackingId: item.trackingId,
        status: item.status,
        deliveryDate: item.deliveryDate,
        customerName: item.customerName
      });
    }
    
    // Возвращаем все данные
    return res.json({
      success: true,
      data: trackingData
    });
    
  } catch (error) {
    console.error('Ошибка API:', error);
    return res.status(500).json({
      success: false,
      error: 'Внутрішня помилка сервера'
    });
  }
});

app.post('/api/tracking', async (req, res) => {
  try {
    const trackingData = await readTrackingData();
    
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
    
  } catch (error) {
    console.error('Ошибка API:', error);
    return res.status(500).json({
      success: false,
      error: 'Внутрішня помилка сервера'
    });
  }
});

app.put('/api/tracking', async (req, res) => {
  try {
    const trackingData = await readTrackingData();
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
    
    return res.json({
      success: true,
      data: trackingData[itemIndex]
    });
    
  } catch (error) {
    console.error('Ошибка API:', error);
    return res.status(500).json({
      success: false,
      error: 'Внутрішня помилка сервера'
    });
  }
});

app.delete('/api/tracking', async (req, res) => {
  try {
    const trackingData = await readTrackingData();
    const { id } = req.query;
    
    const initialLength = trackingData.length;
    const filteredData = trackingData.filter(item => item.id !== id);
    
    if (filteredData.length === initialLength) {
      return res.status(404).json({
        success: false,
        error: 'Посылка не знайдена'
      });
    }
    
    await writeTrackingData(filteredData);
    
    return res.json({
      success: true,
      message: 'Посылка видалена'
    });
    
  } catch (error) {
    console.error('Ошибка API:', error);
    return res.status(500).json({
      success: false,
      error: 'Внутрішня помилка сервера'
    });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущений на порту ${PORT}`);
  console.log(`🔗 API доступний за адресою: http://localhost:${PORT}/api`);
}); 