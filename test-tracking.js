const GOOGLE_SHEETS_API_KEY = '08e7f160b72fc8e07b6d1ef721bbd80b459d6f1a';
const SHEET_ID = '15LQwJJHEwVdnM6mtV6Ocf4u4zkNiclBXT4Uw39twzys';

async function testGoogleSheetsAPI() {
  console.log('🔍 Тестируем подключение к Google Sheets...');
  
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1!A:B?key=${GOOGLE_SHEETS_API_KEY}`;
    console.log('URL:', url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('✅ Ответ от API:', data);
    
    if (data.values) {
      console.log('📊 Данные из таблицы:');
      data.values.forEach((row, index) => {
        console.log(`Строка ${index + 1}:`, row);
      });
    } else {
      console.log('❌ Нет данных в таблице или ошибка доступа');
    }
    
  } catch (error) {
    console.error('❌ Ошибка при подключении:', error);
  }
}

testGoogleSheetsAPI(); 