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
  try {
    // Используем наш API route вместо прямого обращения к Telegram API
    const response = await fetch('/api/send-telegram-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderData: orderData
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('API error:', result);
      return false;
    }

    if (result.success) {
      console.log('✅ Заказ успешно отправлен в Telegram:', result);
      return true;
    } else {
      console.error('❌ Ошибка отправки в Telegram:', result.error);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Ошибка при отправке в Telegram:', error);
    return false;
  }
}; 