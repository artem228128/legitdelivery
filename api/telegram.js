const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // CORS заголовки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Обработка preflight запроса
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Только POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const orderData = req.body;
    console.log('📦 Получен заказ:', orderData);

    // Telegram настройки
    const TELEGRAM_BOT_TOKEN = '8000270765:AAFe0Oq0uuFwqpBVhYZOsn_pltffYdbrxr0';
    const CHAT_ID = '-1002375665181';
    
    // Формирование сообщения
    let message = '🆕 НОВИЙ ЗАМОВЛЕННЯ\n\n';
    message += `👤 Ім'я: ${orderData.name || 'Не вказано'}\n`;
    message += `📱 Телефон: ${orderData.phone || 'Не вказано'}\n`;
    message += `📷 Instagram: ${orderData.instagram || 'Не вказано'}\n`;
    
    if (orderData.comment) {
      message += `💬 Коментар: ${orderData.comment}\n`;
    }
    
    message += '\n📦 ТОВАРИ:\n';
    
    if (orderData.items && orderData.items.length > 0) {
      orderData.items.forEach((item, index) => {
        message += `${index + 1}. ${item.name || 'Товар'}\n`;
        message += `   Розмір: ${item.size || 'Не вказано'}\n`;
        message += `   Кількість: ${item.quantity || 1}\n`;
        message += `   Ціна: ${item.price || 0} ₴\n\n`;
      });
    }
    
    message += `💰 ЗАГАЛЬНА СУМА: ${orderData.total || 0} ₴`;

    console.log('📤 Отправляю в Telegram:', message.substring(0, 100) + '...');

    // Отправка в Telegram
    const telegramResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message
      }),
    });

    const telegramResult = await telegramResponse.json();
    
    if (!telegramResponse.ok) {
      console.error('❌ Telegram API ошибка:', telegramResult);
      res.status(500).json({ 
        success: false, 
        error: 'Ошибка отправки в Telegram',
        details: telegramResult 
      });
      return;
    }

    console.log('✅ Заказ отправлен в Telegram! Message ID:', telegramResult.result.message_id);
    
    res.status(200).json({ 
      success: true, 
      message: 'Заказ успешно отправлен в Telegram',
      messageId: telegramResult.result.message_id
    });
    
  } catch (error) {
    console.error('❌ Ошибка при отправке заказа:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Внутренняя ошибка сервера',
      details: error.message 
    });
  }
};
