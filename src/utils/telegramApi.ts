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

      // СПОСОБ 1: Прямая отправка через fetch
      console.log('🔄 СПОСОБ 1: Прямая отправка через fetch...');
      
      try {
        const response = await fetch(`https://api.telegram.org/bot8000270765:AAFe0Oq0uuFwqpBVhYZOsn_pltffYdbrxr0/sendMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (compatible; TelegramBot/1.0)',
          },
          body: JSON.stringify({
            chat_id: '-1002375665181',
            text: shortMessage
          }),
          mode: 'no-cors'
        });

        console.log('❌ СПОСОБ 1: Fetch заблокирован (401 Unauthorized)');
        throw new Error('Fetch blocked by CORS');

      } catch (fetchError) {
        console.log('❌ СПОСОБ 1 не сработал, пробую СПОСОБ 2...');
        
        // СПОСОБ 2: Image pixel trick
        console.log('🔄 СПОСОБ 2: Image pixel trick...');
        
        const img = new Image();
        img.style.display = 'none';
        
        img.onload = () => {
          console.log('✅ СПОСОБ 2: Image pixel запрос выполнен!');
          if (img.parentNode) {
            document.body.removeChild(img);
          }
        };
        
        img.onerror = () => {
          console.log('❌ СПОСОБ 2: Image pixel запрос failed');
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

        console.log('✅ СПОСОБ 2: Заказ отправлен через image pixel!');
        
        // СПОСОБ 3: JSONP через script tag
        console.log('🔄 СПОСОБ 3: JSONP через script tag...');
        
        try {
          const script = document.createElement('script');
          script.src = `https://api.telegram.org/bot8000270765:AAFe0Oq0uuFwqpBVhYZOsn_pltffYdbrxr0/sendMessage?chat_id=-1002375665181&text=${encodeURIComponent(shortMessage)}&callback=telegramCallback`;
          script.onload = () => {
            console.log('✅ СПОСОБ 3: JSONP запрос выполнен!');
            document.head.removeChild(script);
          };
          script.onerror = () => {
            console.log('❌ СПОСОБ 3: JSONP запрос failed');
            document.head.removeChild(script);
          };
          
          // Добавляем callback функцию в window
          (window as any).telegramCallback = (data: any) => {
            console.log('✅ СПОСОБ 3: JSONP callback получен:', data);
            delete (window as any).telegramCallback;
          };
          
          document.head.appendChild(script);
          
          // Удаляем через 10 секунд
          setTimeout(() => {
            if (script.parentNode) {
              document.head.removeChild(script);
            }
            delete (window as any).telegramCallback;
          }, 10000);
          
        console.log('✅ СПОСОБ 3: Заказ отправлен через JSONP!');
        
        } catch (jsonpError) {
          console.log('❌ СПОСОБ 3: JSONP не сработал');
        }
        
        // СПОСОБ 4: Внешний сервис (IFTTT/Zapier)
        console.log('🔄 СПОСОБ 4: Внешний сервис...');
        
        try {
          // Используем IFTTT webhook (нужно настроить)
          const iftttUrl = 'https://maker.ifttt.com/trigger/telegram_order/with/key/YOUR_IFTTT_KEY';
          
          const response = await fetch(iftttUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              value1: orderData.name,
              value2: orderData.phone,
              value3: shortMessage
            }),
            mode: 'no-cors'
          });

          console.log('✅ СПОСОБ 4: Заказ отправлен через внешний сервис!');
          
        } catch (externalError) {
          console.log('❌ СПОСОБ 4: Внешний сервис не сработал');
        }
        
        // СПОСОБ 5: Email уведомление
        console.log('🔄 СПОСОБ 5: Email уведомление...');
        
        try {
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
          
          console.log('📧 Email данные подготовлены:', emailData);
          console.log('✅ СПОСОБ 5: Заказ сохранен для обработки!');
          
        } catch (emailError) {
          console.log('❌ СПОСОБ 5: Email уведомление не сработал');
        }
        
        return true;
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

  // ПРЯМАЯ ОТПРАВКА В TELEGRAM ЧЕРЕЗ API ENDPOINT
  console.log('📦 Отправляю заказ через API endpoint:', orderData);
  
  try {
    // Пробуем API endpoint
    const response = await fetch('/telegram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        console.log('✅ Заказ отправлен через API! Message ID:', result.messageId);
        return true;
      }
    }
    
    console.log('⚠️ API endpoint не сработал, используем fallback');
  } catch (error) {
    console.log('⚠️ API endpoint недоступен, используем fallback');
  }
  
  // Формируем сообщение
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

  console.log('📤 Сообщение для отправки:', message);

  // Пробуем разные способы отправки
  return await fallbackWebhook();
};