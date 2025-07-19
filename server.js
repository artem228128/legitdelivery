const express = require('express');
const cors = require('cors');
const { GoogleAuth } = require('google-auth-library');
const { google } = require('googleapis');

const app = express();
const PORT = 3001;

// Антиспам система
const requestLimits = new Map();

// Очистка старых записей каждые 5 минут
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of requestLimits.entries()) {
    if (now - data.lastRequest > 5 * 60 * 1000) {
      requestLimits.delete(ip);
    }
  }
}, 5 * 60 * 1000);

// Функция проверки лимитов
function checkRateLimit(ip) {
  const now = Date.now();
  const limit = requestLimits.get(ip);
  
  if (!limit) {
    requestLimits.set(ip, {
      count: 1,
      lastRequest: now,
      firstRequest: now
    });
    return true;
  }
  
  // Сброс счетчика если прошло больше часа
  if (now - limit.firstRequest > 60 * 60 * 1000) {
    requestLimits.set(ip, {
      count: 1,
      lastRequest: now,
      firstRequest: now
    });
    return true;
  }
  
  // Максимум 10 запросов в минуту
  if (now - limit.lastRequest < 60 * 1000) {
    if (limit.count >= 10) {
      return false;
    }
    limit.count++;
  } else {
    limit.count = 1;
  }
  
  limit.lastRequest = now;
  return true;
}

app.use(cors());
app.use(express.json());

// Настройка Google Auth с Service Account
const auth = new GoogleAuth({
  keyFile: './google-credentials.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

const SHEET_ID = '15LQwJJHEwVdnM6mtV6Ocf4u4zkNiclBXT4Uw39twzys';

// API endpoint для получения данных трекинга
app.get('/api/tracking/:trackingId', async (req, res) => {
  try {
    // Получаем IP адрес
    const ip = req.headers['x-forwarded-for'] || 
               req.headers['x-real-ip'] || 
               req.connection.remoteAddress || 
               req.socket.remoteAddress ||
               req.connection.socket?.remoteAddress || 
               'unknown';

    // Проверяем лимиты
    if (!checkRateLimit(ip)) {
      return res.status(429).json({ 
        error: 'Забагато запитів. Спробуйте пізніше.',
        retryAfter: 60
      });
    }

    const { trackingId } = req.params;
    
    // Валидация трек-номера
    if (trackingId.length < 3 || trackingId.length > 50) {
      return res.status(400).json({ error: 'Невірний формат номера відстеження' });
    }

    // Проверка на подозрительные символы
    if (!/^[A-Za-z0-9-_]+$/.test(trackingId)) {
      return res.status(400).json({ error: 'Невірний формат номера відстеження' });
    }
    
    console.log(`🔍 Поиск трек-номера: ${trackingId} (IP: ${ip})`);
    
    // Получаем данные из Google Sheets
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'A:C', // Читаем колонки A, B и C
    });
    
    const rows = response.data.values;
    
    if (!rows || rows.length === 0) {
      return res.status(404).json({ 
        error: 'Немає даних в таблиці' 
      });
    }
    
    // Ищем трек-номер в таблице
    const headerRow = rows[0];
    const dataRows = rows.slice(1);
    
    const trackingRow = dataRows.find(row => 
      row[0] && row[0].toString().toLowerCase() === trackingId.toLowerCase()
    );
    
    if (!trackingRow) {
      return res.status(404).json({ 
        error: 'Номер відстеження не знайдено' 
      });
    }
    
    const statusNumber = parseInt(trackingRow[1]);
    
    if (isNaN(statusNumber) || statusNumber < 1 || statusNumber > 13) {
      return res.status(400).json({ 
        error: 'Некоректний статус в системі' 
      });
    }
    
    // Если статус больше 13, устанавливаем его как 13 (максимальный)
    const finalStatus = Math.min(statusNumber, 13);
    
    console.log(`✅ Найден трек: ${trackingRow[0]}, статус: ${statusNumber} (IP: ${ip})`);
    
    res.json({
      trackingId: trackingRow[0],
      statusNumber: finalStatus,
      deliveryTime: trackingRow[2] || 'не визначено', // Дата доставки из 3-й колонки
      success: true
    });
    
  } catch (error) {
    console.error('❌ Ошибка сервера:', error);
    res.status(500).json({ 
      error: 'Помилка сервера при отриманні даних' 
    });
  }
});

// API endpoint для получения всех данных (для отладки)
app.get('/api/tracking-data', async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'A:C', // Читаем колонки A, B и C
    });
    
    const rows = response.data.values;
    
    res.json({
      data: rows,
      success: true
    });
    
  } catch (error) {
    console.error('❌ Ошибка при получении всех данных:', error);
    res.status(500).json({ 
      error: 'Помилка при отриманні даних' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📊 Google Sheets ID: ${SHEET_ID}`);
  console.log(`🔗 API доступен по адресу: http://localhost:${PORT}`);
}); 