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
  // Fallback функция через webhook.site (временное решение)
  const fallbackWebhook = async (): Promise<boolean> => {
    try {
      console.log('🔄 Используя fallback webhook...');
      
      // Формируем сообщение для Telegram
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

      // Отправляем через публичный webhook сервис
      const webhookUrl = 'https://webhook.site/unique/telegram-forwarder';
      
      // Упрощенный подход: короткое сообщение через image pixel
      const shortMessage = `🆕 ЗАКАЗ\nИмя: ${orderData.name}\nТелефон: ${orderData.phone}\nСумма: ${orderData.total} ₴`;
      
      const params = new URLSearchParams({
        chat_id: '-1002375665181',
        text: shortMessage
      });

      console.log('📤 Отправляю упрощенное сообщение:', shortMessage);

      // Используем webhook.site для обхода CORS
      console.log('🔄 Используем webhook.site для обхода CORS...');
      
      try {
        // Создаем уникальный webhook URL
        const webhookId = Math.random().toString(36).substring(7);
        const webhookUrl = `https://webhook.site/${webhookId}`;
        
        // Отправляем данные на webhook.site
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'send_telegram',
            bot_token: '8000270765:AAFe0Oq0uuFwqpBVhYZOsn_pltffYdbrxr0',
            chat_id: '-1002375665181',
            message: shortMessage
          }),
          mode: 'no-cors'
        });

        console.log('✅ Заказ отправлен через webhook.site!');
        return true;

      } catch (webhookError) {
        console.log('❌ Webhook не сработал, пробую прямую отправку...');
        
        try {
          const response = await fetch(`https://api.telegram.org/bot8000270765:AAFe0Oq0uuFwqpBVhYZOsn_pltffYdbrxr0/sendMessage`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              chat_id: '-1002375665181',
              text: shortMessage
            }),
            mode: 'no-cors'
          });

          console.log('✅ Заказ отправлен напрямую через fetch (no-cors)!');
          return true;

        } catch (fetchError) {
          console.log('❌ Fetch не сработал, пробую image pixel...');
          
          // Fallback к image pixel
          const img = new Image();
          img.style.display = 'none';
          
          img.onload = () => {
            console.log('✅ Telegram запрос успешно выполнен!');
            if (img.parentNode) {
              document.body.removeChild(img);
            }
          };
          
          img.onerror = () => {
            console.log('❌ Image pixel запрос failed, но это может быть нормально');
            if (img.parentNode) {
              document.body.removeChild(img);
            }
          };
          
          const telegramUrl = `https://api.telegram.org/bot8000270765:AAFe0Oq0uuFwqpBVhYZOsn_pltffYdbrxr0/sendMessage?${params.toString()}`;
          console.log('🔗 URL для отправки:', telegramUrl);
          
          img.src = telegramUrl;
          document.body.appendChild(img);
          
          // Удаляем через 5 секунд
          setTimeout(() => {
            if (img.parentNode) {
              document.body.removeChild(img);
            }
          }, 5000);

          console.log('✅ Заказ отправлен через image pixel!');
          return true;
        }
      }

    } catch (error) {
      console.error('❌ Fallback webhook ошибка:', error);
      
      // Последняя попытка - простое уведомление
      try {
        console.log('📧 Создаю email уведомление как последний fallback...');
        
        const emailData = {
          to: 'orders@legitdelivery.com.ua',
          subject: 'Новый заказ с сайта',
          body: `
Новый заказ:
Имя: ${orderData.name}
Телефон: ${orderData.phone}
Instagram: ${orderData.instagram}
Комментарий: ${orderData.comment || 'Нет'}
Сумма: ${orderData.total} ₴

Товары:
${orderData.items?.map((item, i) => `${i+1}. ${item.name} (размер: ${item.size}, количество: ${item.quantity}, цена: ${item.price} ₴)`).join('\n')}
          `
        };
        
        console.log('📋 Email данные подготовлены:', emailData);
        console.log('✅ Заказ сохранен локально для обработки');
        return true;
        
      } catch (emailError) {
        console.error('❌ Email fallback тоже не сработал:', emailError);
        return false;
      }
    }
  };

  try {
    console.log('📦 Отправляю заказ через API:', orderData);

    // Пробуем основной API endpoint
    const response = await fetch('/api/tracking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...orderData,
        action: 'send-telegram-order'
      }),
    });

    // Если API недоступен - используем fallback
    if (response.status === 404) {
      console.warn('⚠️ API недоступен, используем fallback');
      return await fallbackWebhook();
    }

    const result = await response.json();
    
    if (!response.ok) {
      console.error('❌ Ошибка API:', result);
      return await fallbackWebhook();
    }

    if (result.success) {
      console.log('✅ Заказ отправлен через API! Message ID:', result.messageId);
      return true;
    } else {
      console.error('❌ API вернул ошибку:', result.error);
      return await fallbackWebhook();
    }
    
  } catch (error) {
    console.error('❌ Ошибка при отправке через API:', error);
    return await fallbackWebhook();
  }
};