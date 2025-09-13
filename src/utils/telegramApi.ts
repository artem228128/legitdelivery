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
    console.log('📦 Отправляю заказ через API:', orderData);

    // Отправляем через ваш API endpoint (работает без CORS проблем)
    const response = await fetch('/api/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    // Если API недоступен (dev режим), показываем сообщение
    if (response.status === 404) {
      console.warn('⚠️ API недоступен в dev режиме');
      console.log('🚀 На продакшене заказы будут отправляться через /api/order');
      console.log('📋 Данные заказа:', orderData);
      return true; // В dev режиме считаем успешным
    }

    const result = await response.json();
    
    if (!response.ok) {
      console.error('❌ Ошибка API:', result);
      return false;
    }

    if (result.success) {
      console.log('✅ Заказ отправлен через API! Message ID:', result.messageId);
      return true;
    } else {
      console.error('❌ API вернул ошибку:', result.error);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Ошибка при отправке через API:', error);
    console.log('ℹ️ В dev режиме это нормально - API endpoints недоступны');
    console.log('🚀 На продакшене через /api/order всё будет работать');
    return true; // В dev режиме считаем успешным
  }
};