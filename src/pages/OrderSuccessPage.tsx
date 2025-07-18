import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { CheckCircle, ArrowLeft, Home, ShoppingBag } from 'lucide-react';

const SuccessContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 60px 20px;
  text-align: center;
`;

const SuccessIcon = styled.div`
  margin-bottom: 30px;
  
  svg {
    width: 80px;
    height: 80px;
    color: #10b981;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: var(--text-dark);
  margin-bottom: 20px;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: var(--text-light);
  margin-bottom: 40px;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Button = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 30px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &.primary {
    background: var(--primary-blue);
    color: white;
    
    &:hover {
      background: #1e40af;
      transform: translateY(-2px);
    }
  }
  
  &.secondary {
    background: white;
    color: var(--text-dark);
    border: 2px solid var(--border-light);
    
    &:hover {
      border-color: var(--primary-blue);
      color: var(--primary-blue);
      transform: translateY(-2px);
    }
  }
`;

const OrderSuccessPage: React.FC = () => {
  return (
    <SuccessContainer>
      <SuccessIcon>
        <CheckCircle />
      </SuccessIcon>
      
      <Title>Замовлення успішно оформлено!</Title>
      <Subtitle>
        Дякуємо за ваше замовлення! З вами зв'яжеться менеджер в месенджері для підтвердження деталей доставки.
      </Subtitle>
      
      <ButtonGroup>
        <Button to="/catalog" className="primary">
          <ShoppingBag size={20} />
          Перейти до каталогу
        </Button>
        
        <Button to="/" className="secondary">
          <Home size={20} />
          На головну
        </Button>
      </ButtonGroup>
    </SuccessContainer>
  );
};

export default OrderSuccessPage; 