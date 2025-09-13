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
    // Используем существующий tracking API с параметром action
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