// API route для отправки заказов в Telegram
export default async function handler(req, res) {
  // Настройка CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Обработка preflight запроса
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Проверяем метод
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { orderData } = req.body;

    // Проверяем наличие данных заказа
    if (!orderData) {
      res.status(400).json({ error: 'Order data is required' });
      return;
    }

    const TELEGRAM_BOT_TOKEN = '8000270765:AAG93gqHnrPwnQgkC0xVd3FCSvylftogxZM';
    const CHAT_ID = '-1002375665181';
    
    // Формируем сообщение
    let message = `🆕 НОВИЙ ЗАМОВЛЕННЯ\n\n`;
    message += `👤 Ім'я: ${orderData.name}\n`;
    message += `📱 Телефон: ${orderData.phone}\n`;
    message += `📷 Instagram: ${orderData.instagram}\n`;
    
    if (orderData.comment) {
      message += `💬 Коментар: ${orderData.comment}\n`;
    }
    
    message += `\n📦 ТОВАРИ:\n`;
    
    orderData.items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   Розмір: ${item.size}\n`;
      message += `   Кількість: ${item.quantity}\n`;
      message += `   Ціна: ${item.price} ₴\n\n`;
    });
    
    message += `💰 ЗАГАЛЬНА СУМА: ${orderData.total} ₴`;

    // Отправляем в Telegram
    const telegramResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      }),
    });

    const telegramResult = await telegramResponse.json();
    
    if (!telegramResponse.ok) {
      console.error('Telegram API error:', telegramResult);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to send to Telegram',
        details: telegramResult 
      });
      return;
    }

    console.log('✅ Заказ успешно отправлен в Telegram:', telegramResult);
    
    res.status(200).json({ 
      success: true, 
      message: 'Order sent to Telegram successfully',
      telegramResult 
    });
    
  } catch (error) {
    console.error('❌ Ошибка при отправке в Telegram:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
