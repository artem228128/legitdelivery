export default async function handler(req, res) {
  // Разрешаем только POST запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, phone, instagram, comment, total, items } = req.body;

    // Проверяем обязательные поля
    if (!name || !phone || !instagram) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const TELEGRAM_BOT_TOKEN = '8000270765:AAG93gqHnrPwnQgkC0xVd3FCSvylftogxZM';
    const CHAT_ID = '-1002375665181';

    // Формируем сообщение
    let message = `🆕 НОВИЙ ЗАМОВЛЕННЯ\n\n`;
    message += `👤 Ім'я: ${name}\n`;
    message += `📱 Телефон: ${phone}\n`;
    message += `📷 Instagram: ${instagram}\n`;
    
    if (comment) {
      message += `💬 Коментар: ${comment}\n`;
    }
    
    message += `\n📦 ТОВАРИ:\n`;
    
    // Добавляем информацию о товарах
    if (items && items.length > 0) {
      items.forEach((item, index) => {
        message += `${index + 1}. ${item.name}\n`;
        message += `   Розмір: ${item.size}\n`;
        message += `   Кількість: ${item.quantity}\n`;
        message += `   Ціна: ${item.price} ₴\n\n`;
      });
    }
    
    message += `💰 ЗАГАЛЬНА СУМА: ${total} ₴`;

    // Отправляем сообщение в Telegram
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

    const telegramData = await telegramResponse.json();

    if (!telegramResponse.ok) {
      console.error('Telegram API error:', telegramData);
      return res.status(500).json({ error: 'Failed to send message to Telegram' });
    }

    // Успешный ответ
    return res.status(200).json({ 
      success: true, 
      message: 'Order sent successfully',
      telegramMessageId: telegramData.result.message_id
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 