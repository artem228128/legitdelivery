import { google } from 'googleapis';

const GOOGLE_SHEETS_ID = '15LQwJJHEwVdnM6mtV6Ocf4u4zkNiclBXT4Uw39twzys';

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

// Инициализация Google Auth
const auth = new google.auth.GoogleAuth({
  keyFile: './google-credentials.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

  const { trackingId } = req.query;

  if (!trackingId) {
    return res.status(400).json({ error: 'Необхідно вказати номер відстеження' });
  }

  // Валидация трек-номера
  if (trackingId.length < 3 || trackingId.length > 50) {
    return res.status(400).json({ error: 'Невірний формат номера відстеження' });
  }

  // Проверка на подозрительные символы
  if (!/^[A-Za-z0-9-_]+$/.test(trackingId)) {
    return res.status(400).json({ error: 'Невірний формат номера відстеження' });
  }

  try {
    const sheets = google.sheets({ version: 'v4', auth });
    
    console.log(`🔍 Поиск трек-номера: ${trackingId} (IP: ${ip})`);
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEETS_ID,
      range: 'A:C', // Читаем колонки A, B и C
    });

    const rows = response.data.values;
    
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'Дані не знайдено' });
    }

    // Ищем трек-номер в первой колонке
    const trackingRow = rows.find(row => row[0] === trackingId);
    
    if (!trackingRow) {
      return res.status(404).json({ error: 'Трек-номер не знайдено' });
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

    res.status(200).json({
      success: true,
      trackingId: trackingRow[0],
      statusNumber: finalStatus,
      deliveryTime: trackingRow[2] || 'не визначено' // Дата доставки из 3-й колонки
    });

  } catch (error) {
    console.error('❌ Ошибка сервера:', error);
    res.status(500).json({ error: 'Помилка сервера при отриманні даних' });
  }
} 