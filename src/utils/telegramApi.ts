interface OrderData {
  name: string;
  phone: string;
  instagram: string;
  comment?: string;
  total: number;
  items: Array<{
    name: string;
    size: string;
    quantity: number;
    price: number;
  }>;
}

export const sendOrderToTelegram = async (orderData: OrderData): Promise<boolean> => {
  // Вспомогательная функция: прямой запрос в Telegram, обход CORS через GET + no-cors
  const fallbackDirectSend = async (): Promise<boolean> => {
    try {
      const TELEGRAM_BOT_TOKEN = '8000270765:AAFe0Oq0uuFwqpBVhYZOsn_pltffYdbrxr0';
      const CHAT_ID = '-1002375665181';

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

      // Используем POST + no-cors для отправки в Telegram
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: 'HTML'
        })
      });

      console.warn('⚠️ Отправлено через прямой fallback (no-cors), ответ не читается');
      return true;
    } catch (e) {
      console.error('❌ Fallback direct send failed:', e);
      return false;
    }
  };

  try {
    // Основной путь: серверный API (без CORS проблем)
    const response = await fetch('/api/tracking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'send-telegram-order',
        orderData: orderData
      }),
    });

    // Если эндпоинт отсутствует на проде (404) — используем fallback
    if (response.status === 404) {
      console.warn('⚠️ /api/tracking недоступен (404). Использую прямой fallback.');
      return await fallbackDirectSend();
    }

    const result = await response.json();
    if (!response.ok) {
      console.error('API error:', result);
      // На всякий случай тоже пробуем fallback
      return await fallbackDirectSend();
    }

    if (result.success) {
      console.log('✅ Заказ успешно отправлен в Telegram:', result);
      return true;
    } else {
      console.error('❌ Ошибка отправки в Telegram:', result.error);
      return await fallbackDirectSend();
    }
  } catch (error) {
    console.error('❌ Ошибка при обращении к API, пробую fallback:', error);
    return await fallbackDirectSend();
  }
};