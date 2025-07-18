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

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
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

    const result = await response.json();
    
    if (!response.ok) {
      console.error('Telegram API error:', result);
      return false;
    }

    console.log('Заказ успешно отправлен в Telegram:', result);
    return true;
    
  } catch (error) {
    console.error('Ошибка при отправке в Telegram:', error);
    return false;
  }
}; 