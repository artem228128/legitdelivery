import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { ArrowLeft, Search, Package, Loader } from 'lucide-react';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const TrackingContainer = styled.div`
  min-height: 100vh;
  background: #ffffff;
  padding: 120px 20px 40px 20px;
  
  @media (max-width: 768px) {
    padding: 100px 15px 30px 15px;
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  color: #495057;
  padding: 12px 20px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: #e9ecef;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 768px) {
    top: 15px;
    left: 15px;
    padding: 10px 16px;
    font-size: 14px;
  }
`;

const Content = styled.div`
  max-width: 800px;
  margin: 0 auto;
  animation: ${fadeInUp} 0.8s ease-out;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 50px;
  
  h1 {
    font-size: 3rem;
    color: #2c3e50;
    margin-bottom: 15px;
    font-weight: 700;
    
    @media (max-width: 768px) {
      font-size: 2.2rem;
    }
    
    @media (max-width: 480px) {
      font-size: 1.8rem;
    }
  }
  
  p {
    font-size: 1.2rem;
    color: #6c757d;
    margin-bottom: 10px;
    
    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }
  
  .description {
    font-size: 1rem;
    color: #868e96;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
    
    @media (max-width: 768px) {
      font-size: 0.9rem;
    }
  }
`;

const SearchSection = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 40px;
  border: 2px solid #e9ecef;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  animation: ${slideInLeft} 0.8s ease-out 0.2s both;
  
  @media (max-width: 768px) {
    padding: 20px;
    margin-bottom: 30px;
  }
`;

const SearchForm = styled.form`
  display: flex;
  gap: 15px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 15px 20px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1rem;
  background: #f8f9fa;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    background: white;
    border-color: #FFD700;
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.2);
  }
  
  &::placeholder {
    color: #adb5bd;
  }
  
  @media (max-width: 768px) {
    padding: 12px 16px;
    font-size: 16px;
  }
`;

const SearchButton = styled.button`
  padding: 15px 30px;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  border: none;
  border-radius: 12px;
  color: #333;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 768px) {
    padding: 12px 24px;
    font-size: 16px;
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid #333;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const TrackingResult = styled.div<{ $isVisible: boolean }>`
  background: #ffffff;
  border-radius: 20px;
  padding: 40px;
  margin-top: 30px;
  border: 2px solid #e9ecef;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.12);
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0)' : 'translateY(20px)'};
  transition: all 0.6s ease;
  
  @media (max-width: 768px) {
    padding: 25px;
    margin-top: 20px;
  }
`;

const TrackingHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
  
  h2 {
    color: #333;
    margin-bottom: 10px;
    font-size: 1.8rem;
    
    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }
  
  .tracking-id {
    color: #666;
    font-family: 'Courier New', monospace;
    background: #f5f5f5;
    padding: 8px 16px;
    border-radius: 8px;
    display: inline-block;
    font-weight: 600;
  }
`;

const ProgressContainer = styled.div`
  position: relative;
  margin: 40px 0;
  background: #f8f9fa;
  border-radius: 16px;
  padding: 30px;
  border: 1px solid #e9ecef;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const ProgressBar = styled.div<{ $progress: number }>`
  width: 100%;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 30px;
  
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => props.$progress}%;
    background: linear-gradient(90deg, #4CAF50, #8BC34A);
    transition: width 1s ease;
  }
`;

const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Step = styled.div<{ $isActive: boolean; $isCompleted: boolean }>`
  display: flex;
  align-items: center;
  gap: 20px;
  opacity: ${props => props.$isActive || props.$isCompleted ? 1 : 0.5};
  transform: ${props => props.$isActive ? 'scale(1.02)' : 'scale(1)'};
  transition: all 0.3s ease;
  padding: 20px;
  border-radius: 16px;
  background: ${props => {
    if (props.$isActive) return 'linear-gradient(135deg, #fff3cd, #ffeaa7)';
    if (props.$isCompleted) return 'linear-gradient(135deg, #d4edda, #c3e6cb)';
    return '#ffffff';
  }};
  border: 2px solid ${props => {
    if (props.$isActive) return '#FFD700';
    if (props.$isCompleted) return '#28a745';
    return '#e9ecef';
  }};
  margin-bottom: 15px;
  box-shadow: ${props => props.$isActive || props.$isCompleted ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none'};
  
  @media (max-width: 768px) {
    gap: 15px;
    padding: 15px;
  }
`;

const StepIcon = styled.div<{ $isActive: boolean; $isCompleted: boolean }>`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => {
    if (props.$isCompleted) return '#4CAF50';
    if (props.$isActive) return '#FFD700';
    return '#e0e0e0';
  }};
  color: ${props => props.$isCompleted || props.$isActive ? 'white' : '#999'};
  font-size: 18px;
  flex-shrink: 0;
  animation: ${props => props.$isActive ? pulse : 'none'} 2s infinite;
  border: 3px solid ${props => {
    if (props.$isCompleted) return '#4CAF50';
    if (props.$isActive) return '#FFD700';
    return '#e0e0e0';
  }};
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 14px;
  }
`;

const StepContent = styled.div`
  flex: 1;
  
  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 5px;
    
    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }
  
  .step-number {
    font-size: 0.8rem;
    color: #999;
    margin-bottom: 5px;
  }
`;

const StatusBadge = styled.div<{ $status: string }>`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-top: 8px;
  background: ${props => {
    switch (props.$status) {
      case 'completed': return '#4CAF50';
      case 'active': return '#FFD700';
      case 'pending': return '#e0e0e0';
      default: return '#e0e0e0';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'active': return '#333';
      case 'completed': return 'white';
      default: return '#666';
    }
  }};
`;

const ErrorMessage = styled.div`
  background: #ffebee;
  color: #c62828;
  padding: 15px;
  border-radius: 10px;
  margin-top: 20px;
  border: 1px solid #ffcdd2;
  text-align: center;
`;

const NoResultMessage = styled.div`
  text-align: center;
  padding: 60px 30px;
  background: #ffffff;
  border-radius: 20px;
  border: 2px solid #e9ecef;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 15px;
    color: #495057;
  }
  
  p {
    font-size: 1rem;
    color: #6c757d;
    margin-bottom: 20px;
  }
  
  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-top: 30px;
    text-align: left;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
  
  .feature {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 12px;
    border: 1px solid #e9ecef;
    
    h4 {
      color: #495057;
      margin-bottom: 8px;
      font-size: 1rem;
    }
    
    p {
      color: #6c757d;
      font-size: 0.9rem;
      margin: 0;
    }
  }
`;

const STATUS_MAP = {
  1: "✅ Замовлення оформлене на маркетплейсі",
  2: "📤 Відправлено з маркетплейсу",
  3: "📦 Прибуло на склад в Делавері (США)",
  4: "📦 Прибуло на склад в Нью-Джерсі (США)",
  5: "🛃 Експортне митне оформлення",
  6: "✈️ Виліт з Нью-Джерсі",
  7: "🏢 Прибуття до Франкфурта (Німеччина)",
  8: "🛃 Митне оформлення в Німеччині",
  9: "📤 Відправка з Франкфурта",
  10: "🏢 Прибуття до Львова (Україна)",
  11: "🚚 Відправка з сортувального центру",
  12: "🎉 Посилка прибула в магазин - готово до видачі!",
  13: "✅ Посилка видана клієнту"
};

const TrackingPage: React.FC = () => {
  const navigate = useNavigate();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(0);
  const [error, setError] = useState('');
  const [foundTrackingId, setFoundTrackingId] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('не визначено');

  // API endpoint для Vercel
  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? '/api' 
    : 'http://localhost:3001/api';

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      setError('Будь ласка, введіть номер відстеження');
      return;
    }

    setIsSearching(true);
    setError('');
    setShowResult(false);
    
    try {
      // Делаем запрос к API серверу
      const response = await fetch(`${API_BASE_URL}/tracking?trackingId=${trackingNumber}`);
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Помилка при отриманні даних');
        return;
      }
      
      if (data.success) {
        setCurrentStatus(data.status);
        setFoundTrackingId(data.trackingId);
        setDeliveryTime(data.deliveryDate || 'не визначено');
        setShowResult(true);
      } else {
        setError('Трек-номер не знайдено');
      }
      
    } catch (error) {
      console.error('Помилка при отриманні даних:', error);
      setError('Помилка при підключенні до сервера');
    } finally {
      setIsSearching(false);
    }
  };

  const getProgressPercentage = () => {
    // Ограничиваем максимальный прогресс 100%
    const percentage = (currentStatus / 13) * 100;
    return Math.min(percentage, 100);
  };

  const getStepStatus = (stepNumber: number) => {
    if (stepNumber <= currentStatus) return 'completed';
    if (stepNumber === currentStatus + 1) return 'active';
    return 'pending';
  };

  const allSteps = Object.entries(STATUS_MAP).map(([num, text]) => ({
    number: parseInt(num),
    text: text
  }));

  return (
    <TrackingContainer>
      <BackButton onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        Назад
      </BackButton>
      
      <Content>
        <Header>
          <h1>Відстеження посилки</h1>
          <p>Дізнайтеся точний статус вашого замовлення в режимі реального часу</p>
          <div className="description">
            Наша система відстеження дозволяє відслідковувати ваше замовлення на всіх етапах доставки - 
            від оформлення на маркетплейсі до отримання в нашому магазині в Україні. 
            Просто введіть ваш номер відстеження нижче.
          </div>
        </Header>
        
        <SearchSection>
          <SearchForm onSubmit={handleSearch}>
            <SearchInput
              type="text"
              placeholder="Введіть номер відстеження..."
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
            />
            <SearchButton type="submit" disabled={isSearching}>
              {isSearching ? (
                <>
                  <LoadingSpinner />
                  Пошук...
                </>
              ) : (
                <>
                  <Search size={20} />
                  Відстежити
                </>
              )}
            </SearchButton>
          </SearchForm>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </SearchSection>
        
        {!showResult && !isSearching && (
          <NoResultMessage>
            <h3>🔍 Як працює система відстеження</h3>
            <p>Наша система надає детальну інформацію про кожен етап доставки вашого замовлення</p>
            
            <div className="features">
              <div className="feature">
                <h4>📦 Міжнародна доставка</h4>
                <p>Відстежуємо ваше замовлення від складів у США через Німеччину до України</p>
              </div>
              <div className="feature">
                <h4>🛃 Митне оформлення</h4>
                <p>Контролюємо проходження митних процедур у США та Німеччині</p>
              </div>
              <div className="feature">
                <h4>🚚 Локальна доставка</h4>
                <p>Відстежуємо доставку від Львова до нашого магазину</p>
              </div>

            </div>
            

          </NoResultMessage>
        )}
        
        {showResult && (
          <TrackingResult $isVisible={showResult}>
            <TrackingHeader>
              <h2>Маршрут замовлення</h2>
              <div className="tracking-id">#{foundTrackingId}</div>
              <div style={{ 
                marginTop: '15px', 
                padding: '15px', 
                background: '#f8f9fa', 
                borderRadius: '8px',
                fontSize: '0.95rem',
                color: '#495057'
              }}>
                <strong>Прогрес доставки:</strong> {Math.round(getProgressPercentage())}% завершено
                <br/>
                <span style={{ fontSize: '0.85rem', color: '#6c757d' }}>
                  Етап {currentStatus} з 13 • {currentStatus === 13 ? 'Доставка завершена!' : `Орієнтовна дата доставки: ${deliveryTime}`}
                </span>
              </div>
            </TrackingHeader>
            
            <ProgressContainer>
              <ProgressBar $progress={getProgressPercentage()} />
              <StepContainer>
                {allSteps.map((step) => {
                  const status = getStepStatus(step.number);
                  return (
                    <Step key={step.number} $isActive={status === 'active'} $isCompleted={status === 'completed'}>
                      <StepIcon $isActive={status === 'active'} $isCompleted={status === 'completed'}>
                        {step.number}
                      </StepIcon>
                      <StepContent>
                        <div className="step-number">Етап {step.number}</div>
                        <h3>{step.text}</h3>
                        <StatusBadge $status={status}>
                          {status === 'completed' && 'Завершено'}
                          {status === 'active' && 'В процесі'}
                          {status === 'pending' && 'Очікується'}
                        </StatusBadge>
                      </StepContent>
                    </Step>
                  );
                })}
              </StepContainer>
            </ProgressContainer>
          </TrackingResult>
        )}
      </Content>
    </TrackingContainer>
  );
};

export default TrackingPage; 