import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Minus, Plus, X, ShoppingBag, ArrowRight, Truck, Shield, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { OrderForm } from '../types';
import { sendOrderToTelegram } from '../utils/telegramApi';

const CartContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.div`
  margin-bottom: 40px;
  
  h1 {
    font-size: 2.5rem;
    color: var(--text-dark);
    margin-bottom: 10px;
  }
  
  .item-count {
    color: var(--text-light);
    font-size: 1.1rem;
  }
`;

const CartLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CartItems = styled.div`
  .empty-cart {
    text-align: center;
    padding: 80px 20px;
    
    h2 {
      font-size: 2rem;
      color: var(--text-dark);
      margin-bottom: 20px;
    }
    
    p {
      color: var(--text-light);
      margin-bottom: 30px;
      font-size: 1.1rem;
    }
  }
`;

const CartItem = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const ItemImage = styled.div`
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 10px;
  flex-shrink: 0;
  overflow: hidden;
  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 10px;
    background: #fff;
  }
`;

const ItemInfo = styled.div`
  flex: 1;
  
  h3 {
    font-size: 1.3rem;
    color: var(--text-dark);
    margin-bottom: 8px;
  }
  
  .brand {
    color: var(--text-light);
    margin-bottom: 10px;
  }
  
  .details {
    display: flex;
    gap: 20px;
    margin-bottom: 15px;
    
    span {
      color: var(--text-light);
      font-size: 0.9rem;
    }
  }
  
  .price {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-blue);
  }
`;

const ItemControls = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  
  @media (max-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: var(--text-light);
  cursor: pointer;
  padding: 5px;
  
  &:hover {
    color: #ff4444;
  }
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  
  button {
    width: 35px;
    height: 35px;
    border: 1px solid var(--border-light);
    background: white;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: var(--primary-blue);
      color: var(--primary-blue);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  span {
    font-weight: 600;
    min-width: 20px;
    text-align: center;
  }
`;

const OrderSummary = styled.div`
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: sticky;
  top: 100px;
  
  h2 {
    font-size: 1.5rem;
    color: var(--text-dark);
    margin-bottom: 20px;
  }
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  
  &.total {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--text-dark);
    border-top: 2px solid var(--border-light);
    padding-top: 15px;
    margin-top: 20px;
  }
  
  span {
    color: var(--text-light);
  }
  
  .price {
    color: var(--primary-blue);
    font-weight: 600;
  }
`;

const CheckoutButton = styled.button`
  width: 100%;
  background: var(--primary-blue);
  color: white;
  border: none;
  padding: 15px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  margin-top: 20px;
  
  &:hover:not(:disabled) {
    background: #4169E1;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(30, 144, 255, 0.3);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ContinueShoppingButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--primary-yellow);
  color: var(--text-dark);
  padding: 15px 30px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: #FFE55C;
    transform: translateY(-2px);
  }
`;

const Features = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid var(--border-light);
  
  .feature {
    display: flex;
    align-items: center;
    gap: 10px;
    
    svg {
      color: var(--primary-blue);
      width: 16px;
      height: 16px;
    }
    
    span {
      color: var(--text-light);
      font-size: 0.9rem;
    }
  }
`;

const CheckoutForm = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  
  .form-content {
    background: white;
    padding: 40px;
    border-radius: 20px;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    
    h3 {
      font-size: 1.8rem;
      color: var(--text-dark);
      margin-bottom: 10px;
    }
    
    .form-description {
      color: var(--text-light);
      margin-bottom: 30px;
      font-size: 1rem;
    }
    
    .messenger-note {
      background: var(--primary-yellow);
      padding: 15px;
      border-radius: 10px;
      margin: 20px 0;
      
      p {
        color: var(--text-dark);
        font-weight: 600;
        margin: 0;
        font-size: 0.9rem;
      }
    }
    
    .form-group {
      margin-bottom: 20px;
      
      label {
        display: block;
        margin-bottom: 8px;
        color: var(--text-dark);
        font-weight: 500;
      }
      
      input, textarea {
        width: 100%;
        padding: 12px;
        border: 1px solid var(--border-light);
        border-radius: 8px;
        font-size: 1rem;
        
        &:focus {
          outline: none;
          border-color: var(--primary-blue);
        }
        
        &.error {
          border-color: #ff4444;
          background-color: #fff5f5;
        }
      }
      
      textarea {
        resize: vertical;
        min-height: 80px;
      }
    }
    
    .close-button {
      position: absolute;
      top: 20px;
      right: 20px;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--text-light);
      
      &:hover {
        color: var(--text-dark);
      }
    }
  }
`;

const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderForm, setOrderForm] = useState<OrderForm>({
    name: '',
    phone: '+380',
    instagram: '',
    comments: ''
  });
  
  const [errors, setErrors] = useState<Partial<OrderForm>>({});
  const [submitError, setSubmitError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Функция форматирования телефона
  const formatPhoneNumber = (value: string) => {
    // Убираем все кроме цифр
    const digits = value.replace(/\D/g, '');
    
    // Если нет цифр, возвращаем +380
    if (digits.length === 0) return '+380';
    
    // Если начинается не с 380, добавляем 380 в начало
    let phoneDigits = digits;
    if (!phoneDigits.startsWith('380')) {
      phoneDigits = '380' + phoneDigits;
    }
    
    // Ограничиваем до 12 цифр (380 + 9 цифр номера)
    phoneDigits = phoneDigits.slice(0, 12);
    
    // Форматируем номер
    let formatted = '+380';
    
    if (phoneDigits.length > 3) {
      // Добавляем код оператора (2 цифры после 380)
      formatted += ' (' + phoneDigits.slice(3, 5);
      if (phoneDigits.length > 5) {
        // Добавляем первые 3 цифры номера
        formatted += ') ' + phoneDigits.slice(5, 8);
        if (phoneDigits.length > 8) {
          // Добавляем следующие 2 цифры
          formatted += '-' + phoneDigits.slice(8, 10);
          if (phoneDigits.length > 10) {
            // Добавляем последние 2 цифры
            formatted += '-' + phoneDigits.slice(10, 12);
          }
        }
      }
    }
    
    return formatted;
  };

  const handleQuantityChange = (productId: string, size: string, change: number) => {
    const currentItem = items.find(item => item.product.id === productId && item.size === size);
    if (currentItem) {
      const newQuantity = currentItem.quantity + change;
      if (newQuantity > 0) {
        updateQuantity(productId, size, newQuantity);
      }
    }
  };

  const handleFormChange = (field: keyof OrderForm, value: string) => {
    setOrderForm(prev => ({ ...prev, [field]: value }));
    // Очищаем ошибку для этого поля при изменении
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    // Очищаем общую ошибку при любом изменении
    if (submitError) {
      setSubmitError('');
    }
  };

  const handleSubmitOrder = async () => {
    const newErrors: Partial<OrderForm> = {};
    
    // Проверяем, что заполнены все обязательные поля
    if (!orderForm.name) {
      newErrors.name = 'Введіть ваше ім\'я';
    }
    
    if (!orderForm.phone) {
      newErrors.phone = 'Введіть номер телефону';
    } else {
      const phoneDigits = orderForm.phone.replace(/\D/g, '');
      // Проверяем что номер начинается с 380 и имеет 12 цифр (380 + 9 цифр номера)
      if (phoneDigits.length < 12 || !phoneDigits.startsWith('380')) {
        newErrors.phone = 'Введіть коректний український номер телефону';
      }
    }
    
    if (!orderForm.instagram) {
      newErrors.instagram = 'Введіть Instagram';
    }
    
    // Если есть ошибки, показываем их
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Очищаем ошибки
    setErrors({});
    setSubmitError('');
    
    setIsSubmitting(true);
    
    try {
      // Подготавливаем данные для отправки
      const orderData = {
        name: orderForm.name,
        phone: orderForm.phone,
        instagram: orderForm.instagram,
        comment: orderForm.comments,
        total: getTotalPrice(),
        items: items.map(item => ({
          name: item.product.name,
          size: item.size,
          quantity: item.quantity,
          price: item.product.price
        }))
      };

      console.log('🛒 НОВЫЙ ЗАКАЗ:', orderData);
      
      // Пытаемся отправить в Telegram
      const telegramSuccess = await sendOrderToTelegram(orderData);
      
      if (telegramSuccess) {
        console.log('✅ Заказ успешно отправлен в Telegram');
      } else {
        console.warn('❌ Не удалось отправить в Telegram, но заказ оформлен');
        
        // Показываем заказ в консоли как fallback
        const orderText = `
🆕 НОВИЙ ЗАМОВЛЕННЯ

👤 Ім'я: ${orderData.name}
📱 Телефон: ${orderData.phone}
📷 Instagram: ${orderData.instagram}
${orderData.comment ? `💬 Коментар: ${orderData.comment}\n` : ''}
📦 ТОВАРИ:
${orderData.items.map((item, index) => 
  `${index + 1}. ${item.name}\n   Розмір: ${item.size}\n   Кількість: ${item.quantity}\n   Ціна: ${item.price} ₴`
).join('\n\n')}

💰 ЗАГАЛЬНА СУМА: ${orderData.total} ₴
        `;
        
        console.log(orderText);
      }
      
      // Очищаем корзину и закрываем форму
      clearCart();
      setShowCheckout(false);
      setOrderForm({
        name: '',
        phone: '+380',
        instagram: '',
        comments: ''
      });
      
      // Редирект на страницу успеха
      navigate('/order-success');
      
    } catch (error) {
      console.error('Ошибка при отправке заказа:', error);
      
      // Более детальная обработка ошибок
      let errorMessage = 'Помилка при відправленні замовлення. Спробуйте ще раз.';
      
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          errorMessage = 'Проблема з підключенням. Перевірте інтернет і спробуйте ще раз.';
        } else if (error.message.includes('Failed to send')) {
          errorMessage = 'Помилка відправки в Telegram. Спробуйте ще раз.';
        }
        console.log('Error details:', error.message);
      }
      
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <CartContainer>
        <Header>
          <h1>Кошик</h1>
          <div className="item-count">Кошик порожній</div>
        </Header>
        
        <CartItems>
          <div className="empty-cart">
            <ShoppingBag size={80} color="var(--text-light)" />
            <h2>Ваш кошик порожній</h2>
            <p>Додайте товари до кошика, щоб оформити замовлення</p>
            <ContinueShoppingButton to="/catalog">
              Перейти до каталогу
              <ArrowRight size={20} />
            </ContinueShoppingButton>
          </div>
        </CartItems>
      </CartContainer>
    );
  }

  return (
    <CartContainer>
      <Header>
        <h1>Кошик</h1>
        <div className="item-count">
          {getTotalItems()} {getTotalItems() === 1 ? 'товар' : getTotalItems() < 5 ? 'товари' : 'товарів'} на суму {getTotalPrice().toLocaleString()} ₴
        </div>
      </Header>
      
      <CartLayout>
        <CartItems>
          {items.map(item => (
            <CartItem key={`${item.product.id}-${item.size}`}>
              <ItemImage>
                <img src={item.product.image} alt={item.product.name} />
              </ItemImage>
              <ItemInfo>
                <h3>{item.product.name}</h3>
                <div className="brand">{item.product.brand}</div>
                <div className="details">
                  <span>Розмір: {item.size}</span>
                  {item.color && <span>Колір: {item.color}</span>}
                </div>
                <div className="price">{item.product.price.toLocaleString()} ₴</div>
              </ItemInfo>
              <ItemControls>
                <RemoveButton onClick={() => removeFromCart(item.product.id, item.size)}>
                  <X size={20} />
                </RemoveButton>
                <QuantityControl>
                  <button
                    onClick={() => handleQuantityChange(item.product.id, item.size, -1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item.product.id, item.size, 1)}>
                    <Plus size={16} />
                  </button>
                </QuantityControl>
              </ItemControls>
            </CartItem>
          ))}
        </CartItems>
        
        <OrderSummary>
          <h2>Разом</h2>
          <SummaryRow>
            <span>Товари ({getTotalItems()})</span>
            <span className="price">{getTotalPrice().toLocaleString()} ₴</span>
          </SummaryRow>
          <SummaryRow>
            <span>Доставка</span>
            <span className="price">Безкоштовно</span>
          </SummaryRow>
          <SummaryRow className="total">
            <span>Загальна сума</span>
            <span className="price">{getTotalPrice().toLocaleString()} ₴</span>
          </SummaryRow>
          
          <CheckoutButton onClick={() => setShowCheckout(true)}>
            Оформити замовлення
            <ArrowRight size={20} />
          </CheckoutButton>
          
          <Features>
            <div className="feature">
              <Truck />
              <span>Безкоштовна доставка від 1000 ₴</span>
            </div>
            <div className="feature">
              <Shield />
              <span>Гарантія 100% оригіналу</span>
            </div>
            <div className="feature">
              <CreditCard />
              <span>Безпечна оплата</span>
            </div>
          </Features>
        </OrderSummary>
      </CartLayout>
      
      {showCheckout && (
        <CheckoutForm onClick={() => setShowCheckout(false)}>
          <div className="form-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setShowCheckout(false)}>
              <X size={24} />
            </button>
            
            <h3>Оформлення замовлення</h3>
            <p className="form-description">Після підтвердження з вами звʼяжеться менеджер в месенджері</p>
            
            <div className="form-group">
              <label>Ваше імʼя *</label>
              <input
                type="text"
                value={orderForm.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                placeholder="Дмитро"
                required
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.name}</p>}
            </div>
            
            <div className="form-group">
              <label>Ваш телефон *</label>
              <input
                type="tel"
                value={orderForm.phone}
                onChange={(e) => handleFormChange('phone', formatPhoneNumber(e.target.value))}
                placeholder="+380 (99) 999-99-99"
                required
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.phone}</p>}
            </div>
            
            <div className="form-group">
              <label>Instagram *</label>
              <input
                type="text"
                value={orderForm.instagram}
                onChange={(e) => handleFormChange('instagram', e.target.value)}
                placeholder="username або посилання"
                required
                className={errors.instagram ? 'error' : ''}
              />
              {errors.instagram && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.instagram}</p>}
            </div>
            
            <div className="form-group">
              <label>Коментар до замовлення</label>
              <textarea
                value={orderForm.comments}
                onChange={(e) => handleFormChange('comments', e.target.value)}
                placeholder="Додаткові побажання..."
                className={errors.comments ? 'error' : ''}
              />
              {errors.comments && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.comments}</p>}
            </div>
            
            {submitError && (
              <div style={{ 
                color: 'red', 
                fontSize: '0.9rem', 
                textAlign: 'center', 
                margin: '15px 0',
                padding: '10px',
                background: '#ffe6e6',
                borderRadius: '8px',
                border: '1px solid #ffcccc'
              }}>
                {submitError}
              </div>
            )}
            
            <CheckoutButton onClick={handleSubmitOrder} disabled={isSubmitting}>
              {isSubmitting ? 'Відправляємо...' : 'Оформити замовлення'}
            </CheckoutButton>
          </div>
        </CheckoutForm>
      )}
    </CartContainer>
  );
};

export default CartPage; 