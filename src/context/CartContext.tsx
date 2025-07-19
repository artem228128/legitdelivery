import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, CartContextType, Product } from '../types';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  // Инициализация корзины из localStorage сразу в useState
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch (error) {
        console.error('[CartContext] Ошибка загрузки корзины из localStorage:', error);
        return [];
      }
    }
    return [];
  });

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
    console.log('[CartContext] Сохраняем корзину в localStorage:', items);
  }, [items]);

  const showNotification = (message: string) => {
    // Удаляем существующие уведомления
    const existingNotifications = document.querySelectorAll('[data-notification="cart"]');
    existingNotifications.forEach(notification => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    });
    
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.setAttribute('data-notification', 'cart');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      left: 20px;
      background: var(--success-green);
      color: white;
      padding: 15px 20px;
      border-radius: 12px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
      z-index: 10000;
      font-weight: 600;
      font-size: 14px;
      text-align: center;
      transform: translateY(-100%);
      transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      max-width: 400px;
      margin: 0 auto;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      touch-action: pan-y;
      user-select: none;
      
      @media (max-width: 768px) {
        top: 10px;
        left: 10px;
        right: 10px;
        padding: 12px 16px;
        font-size: 13px;
        border-radius: 10px;
        max-width: none;
      }
      
      @media (max-width: 480px) {
        top: 8px;
        left: 8px;
        right: 8px;
        padding: 10px 14px;
        font-size: 12px;
        border-radius: 8px;
      }
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Показываем уведомление
    setTimeout(() => {
      notification.style.transform = 'translateY(0)';
    }, 100);
    
    // Переменные для отслеживания свайпа
    let startY = 0;
    let currentY = 0;
    let isDragging = false;
    
    // Функция для скрытия уведомления
    const hideNotification = () => {
      notification.style.transform = 'translateY(-100%)';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 400);
    };
    
    // Обработчики для свайпа на мобильных устройствах
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      isDragging = true;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      
      currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;
      
      // Если свайп вверх больше 50px, скрываем уведомление
      if (deltaY < -50) {
        hideNotification();
        isDragging = false;
        return;
      }
      
      // Ограничиваем движение вниз
      if (deltaY > 0) {
        notification.style.transform = `translateY(${Math.min(deltaY * 0.3, 20)}px)`;
      }
    };
    
    const handleTouchEnd = () => {
      if (!isDragging) return;
      
      const deltaY = currentY - startY;
      
      // Если свайп вверх больше 30px, скрываем уведомление
      if (deltaY < -30) {
        hideNotification();
      } else {
        // Возвращаем уведомление на место
        notification.style.transform = 'translateY(0)';
      }
      
      isDragging = false;
    };
    
    // Добавляем обработчики событий
    notification.addEventListener('touchstart', handleTouchStart, { passive: true });
    notification.addEventListener('touchmove', handleTouchMove, { passive: true });
    notification.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // Скрываем через 3 секунды
    setTimeout(() => {
      hideNotification();
    }, 3000);
  };

  const addToCart = (product: Product, size: string, quantity: number = 1, color?: string) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => item.product.id === product.id && item.size === size && item.color === color
      );

      if (existingItemIndex !== -1) {
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        showNotification(`Кількість товару "${product.name}" оновлено в кошику`);
        return newItems;
      } else {
        showNotification(`Товар "${product.name}" додано до кошика`);
        return [...prevItems, { product, size, quantity, color }];
      }
    });
  };

  const removeFromCart = (productId: string, size: string) => {
    setItems(prevItems => prevItems.filter(
      item => !(item.product.id === productId && item.size === size)
    ));
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
    console.log('[CartContext] Корзина очищена и удалена из localStorage');
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}; 