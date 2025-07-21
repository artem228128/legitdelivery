import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft } from 'lucide-react';

const NotFoundContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
`;

const NotFoundContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
  
  h1 {
    font-size: 4rem;
    color: var(--primary-blue);
    margin-bottom: 20px;
    
    @media (max-width: 768px) {
      font-size: 3rem;
    }
  }
  
  h2 {
    font-size: 2rem;
    color: var(--text-dark);
    margin-bottom: 20px;
    
    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }
  
  p {
    font-size: 1.1rem;
    color: var(--text-light);
    margin-bottom: 40px;
    line-height: 1.6;
  }
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--primary-yellow);
  color: var(--text-dark);
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #FFE55C;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
  }
`;

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <NotFoundContainer>
      <NotFoundContent>
        <h1>404</h1>
        <h2>Сторінка не знайдена</h2>
        <p>
          Вибачте, але сторінка, яку ви шукаєте, не існує або була переміщена.
          Перейдіть на головну сторінку, щоб знайти те, що вам потрібно.
        </p>
        <BackButton onClick={handleGoHome}>
          <ArrowLeft size={20} />
          На головну
        </BackButton>
      </NotFoundContent>
    </NotFoundContainer>
  );
};

export default NotFoundPage; 