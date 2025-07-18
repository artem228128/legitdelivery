import React, { useState } from 'react';
import styled from 'styled-components';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Instagram } from 'lucide-react';

const ContactContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 60px;
  
  h1 {
    font-size: 2.5rem;
    color: var(--text-dark);
    margin-bottom: 20px;
  }
  
  p {
    font-size: 1.2rem;
    color: var(--text-light);
    max-width: 600px;
    margin: 0 auto;
  }
`;

const ContactLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  margin-bottom: 80px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const ContactForm = styled.div`
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  
  h2 {
    font-size: 2rem;
    margin-bottom: 30px;
    color: var(--text-dark);
  }
  
  .form-group {
    margin-bottom: 25px;
    
    label {
      display: block;
      margin-bottom: 8px;
      color: var(--text-dark);
      font-weight: 600;
    }
    
    input, textarea, select {
      width: 100%;
      padding: 15px;
      border: 2px solid var(--border-light);
      border-radius: 10px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
      
      &:focus {
        outline: none;
        border-color: var(--primary-blue);
      }
      
      &::placeholder {
        color: var(--text-light);
      }
    }
    
    textarea {
      resize: vertical;
      min-height: 120px;
    }
  }
  
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
`;

const SubmitButton = styled.button`
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
  
  &:hover {
    background: #4169E1;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(30, 144, 255, 0.3);
  }
  
  &:disabled {
    background: var(--text-light);
    cursor: not-allowed;
    transform: none;
  }
`;

const ContactInfo = styled.div`
  h2 {
    font-size: 2rem;
    margin-bottom: 30px;
    color: var(--text-dark);
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 30px;
  
  .icon {
    width: 50px;
    height: 50px;
    background: var(--primary-blue);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
  }
  
  .info {
    flex: 1;
    
    h3 {
      font-size: 1.3rem;
      margin-bottom: 8px;
      color: var(--text-dark);
    }
    
    p {
      color: var(--text-light);
      line-height: 1.6;
    }
    
    a {
      color: var(--primary-blue);
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
  
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    background: var(--primary-yellow);
    border-radius: 50%;
    color: var(--text-dark);
    text-decoration: none;
    transition: all 0.3s ease;
    
    &:hover {
      background: #FFE55C;
      transform: translateY(-2px);
    }
  }
`;

const MapSection = styled.div`
  background: var(--bg-light);
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  
  h2 {
    font-size: 2rem;
    margin-bottom: 20px;
    color: var(--text-dark);
  }
  
  p {
    color: var(--text-light);
    margin-bottom: 30px;
  }
  
  .map-placeholder {
    width: 100%;
    height: 400px;
    background: url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=400&fit=crop') center/cover;
    border-radius: 15px;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(30, 144, 255, 0.2);
      border-radius: 15px;
    }
  }
`;

const FAQSection = styled.div`
  margin-top: 80px;
  
  h2 {
    font-size: 2rem;
    text-align: center;
    margin-bottom: 40px;
    color: var(--text-dark);
  }
  
  .faq-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
  }
`;

const FAQItem = styled.div`
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  
  h3 {
    font-size: 1.3rem;
    margin-bottom: 15px;
    color: var(--text-dark);
  }
  
  p {
    color: var(--text-light);
    line-height: 1.6;
  }
`;

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      alert('Спасибо за обращение! Мы свяжемся с вами в ближайшее время.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <ContactContainer>
      <Header>
        <h1>Контакты</h1>
        <p>
          Свяжитесь с нами любым удобным способом. Мы всегда готовы помочь 
          и ответить на ваши вопросы.
        </p>
      </Header>

      <ContactLayout>
        <ContactForm>
          <h2>Напишите нам</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Ваше имя *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Введите ваше имя"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Телефон</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+38 (099) 123-45-67"
                />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Тема обращения *</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Выберите тему</option>
                  <option value="order">Вопрос по заказу</option>
                  <option value="product">Вопрос о товаре</option>
                  <option value="delivery">Доставка</option>
                  <option value="return">Возврат/обмен</option>
                  <option value="partnership">Сотрудничество</option>
                  <option value="other">Другое</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Сообщение *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Опишите ваш вопрос подробно..."
                required
              />
            </div>
            
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Отправка...' : 'Отправить сообщение'}
              <Send size={20} />
            </SubmitButton>
          </form>
        </ContactForm>

        <ContactInfo>
          <h2>Как с нами связаться</h2>
          
          <InfoItem>
            <div className="icon">
              <Phone size={24} />
            </div>
            <div className="info">
              <h3>Телефон</h3>
              <p>
                <a href="tel:+380991234567">+38 (099) 123-45-67</a><br />
                Пн-Пт: 9:00 - 18:00<br />
                Сб-Вс: 10:00 - 16:00
              </p>
            </div>
          </InfoItem>
          
          <InfoItem>
            <div className="icon">
              <Mail size={24} />
            </div>
            <div className="info">
              <h3>Email</h3>
              <p>
                <a href="mailto:info@streetkicks.com">info@streetkicks.com</a><br />
                Ответим в течение 24 часов
              </p>
            </div>
          </InfoItem>
          
          <InfoItem>
            <div className="icon">
              <MapPin size={24} />
            </div>
            <div className="info">
              <h3>Адрес</h3>
              <p>
                г. Киев, ул. Крещатик, 1<br />
                Офис 501, 5 этаж<br />
                01001, Украина
              </p>
            </div>
          </InfoItem>
          
          <InfoItem>
            <div className="icon">
              <Clock size={24} />
            </div>
            <div className="info">
              <h3>Режим работы</h3>
              <p>
                Пн-Пт: 9:00 - 18:00<br />
                Сб-Вс: 10:00 - 16:00<br />
                Онлайн-магазин: 24/7
              </p>
            </div>
          </InfoItem>
          
          <SocialLinks>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Instagram size={24} />
            </a>
            <a href="https://t.me" target="_blank" rel="noopener noreferrer">
              <MessageCircle size={24} />
            </a>
          </SocialLinks>
        </ContactInfo>
      </ContactLayout>

      <MapSection>
        <h2>Как нас найти</h2>
        <p>Наш офис находится в самом центре Киева</p>
        <div className="map-placeholder" />
      </MapSection>

      <FAQSection>
        <h2>Часто задаваемые вопросы</h2>
        <div className="faq-grid">
          <FAQItem>
            <h3>Как оформить заказ?</h3>
            <p>
              Выберите товар в каталоге, добавьте в корзину и следуйте 
              инструкциям на странице оформления заказа.
            </p>
          </FAQItem>
          
          <FAQItem>
            <h3>Сколько стоит доставка?</h3>
            <p>
              Доставка бесплатная при заказе от 1000 ₴. При меньшей 
              сумме заказа стоимость доставки составляет 100 ₴.
            </p>
          </FAQItem>
          
          <FAQItem>
            <h3>Можно ли вернуть товар?</h3>
            <p>
              Да, вы можете вернуть товар в течение 14 дней с момента 
              получения, если он не подошел по размеру или не понравился.
            </p>
          </FAQItem>
          
          <FAQItem>
            <h3>Все ли товары оригинальные?</h3>
            <p>
              Мы работаем только с официальными поставщиками и 
              гарантируем 100% оригинальность всех товаров.
            </p>
          </FAQItem>
          
          <FAQItem>
            <h3>Как долго доставляется заказ?</h3>
            <p>
              По Киеву доставка занимает 1-2 рабочих дня. По Украине — 
              2-5 рабочих дней в зависимости от региона.
            </p>
          </FAQItem>
          
          <FAQItem>
            <h3>Есть ли программа лояльности?</h3>
            <p>
              Да, мы предоставляем скидки постоянным клиентам и 
              регулярно проводим специальные акции.
            </p>
          </FAQItem>
        </div>
      </FAQSection>
    </ContactContainer>
  );
};

export default ContactPage; 