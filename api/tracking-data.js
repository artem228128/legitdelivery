import { google } from 'googleapis';

const GOOGLE_SHEETS_ID = '15LQwJJHEwVdnM6mtV6Ocf4u4zkNiclBXT4Uw39twzys';

// Инициализация Google Auth
const auth = new google.auth.GoogleAuth({
  keyFile: './google-credentials.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEETS_ID,
      range: 'A:B',
    });

    const rows = response.data.values;
    
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'Дані не знайдено' });
    }

    // Преобразуем данные в нужный формат
    const trackingData = rows.map(row => ({
      trackingId: row[0],
      status: parseInt(row[1]) || 0
    }));

    res.status(200).json({
      success: true,
      data: trackingData
    });

  } catch (error) {
    console.error('❌ Ошибка сервера:', error);
    res.status(500).json({ error: 'Помилка сервера при отриманні даних' });
  }
} 