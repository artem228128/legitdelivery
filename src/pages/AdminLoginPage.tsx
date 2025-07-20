import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';

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

const LoginContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const LoginCard = styled.div`
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  animation: ${fadeInUp} 0.8s ease-out;
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 12px 20px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
  
  .icon {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #FFD700, #FFA500);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    color: white;
  }
  
  h1 {
    font-size: 2rem;
    color: #2c3e50;
    margin-bottom: 10px;
    font-weight: 700;
  }
  
  p {
    color: #6c757d;
    font-size: 1rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  position: relative;
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #495057;
  }
  
  input {
    width: 100%;
    padding: 15px 16px;
    border: 2px solid #e9ecef;
    border-radius: 12px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: #FFD700;
    }
  }
`;

const PasswordInput = styled.div`
  position: relative;
  
  input {
    padding-right: 50px;
  }
  
  .toggle-password {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: #6c757d;
    padding: 5px;
    
    &:hover {
      color: #495057;
    }
  }
`;

const LoginButton = styled.button`
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #333;
  border: none;
  padding: 15px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #f5c6cb;
  margin-bottom: 20px;
  font-size: 0.9rem;
`;

const ServerStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &.checking {
    background: rgba(255, 193, 7, 0.1);
    color: #856404;
    border: 1px solid rgba(255, 193, 7, 0.3);
  }
  
  &.online {
    background: rgba(40, 167, 69, 0.1);
    color: #155724;
    border: 1px solid rgba(40, 167, 69, 0.3);
  }
  
  &.offline {
    background: rgba(220, 53, 69, 0.1);
    color: #721c24;
    border: 1px solid rgba(220, 53, 69, 0.3);
  }
  
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  
  .status-dot.checking {
    background: #ffc107;
    animation: pulse 2s infinite;
  }
  
  .status-dot.online {
    background: #28a745;
  }
  
  .status-dot.offline {
    background: #dc3545;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Простой пароль для демонстрации (в продакшене использовать хеширование)
  const ADMIN_PASSWORD = 'admin123';

  // API base URL
  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? '/api' 
    : 'http://localhost:3001/api';

  const checkServerStatus = async () => {
    try {
      console.log('🔍 Проверяю статус сервера...', `${API_BASE_URL}/tracking.js`);
      setServerStatus('checking');
      const response = await fetch(`${API_BASE_URL}/tracking.js`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📡 Ответ сервера:', response.status);
      if (response.ok) {
        console.log('✅ Сервер онлайн');
        setServerStatus('online');
      } else {
        console.log('❌ Сервер офлайн (статус:', response.status, ')');
        setServerStatus('offline');
      }
    } catch (error) {
      console.log('❌ Ошибка подключения к серверу:', error);
      setServerStatus('offline');
    }
  };

  const handleCheckServer = () => {
    checkServerStatus();
  };

  useEffect(() => {
    checkServerStatus();
    
    // Проверяем статус сервера каждые 30 секунд
    const interval = setInterval(checkServerStatus, 30000);
    
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError('Будь ласка, введіть пароль');
      return;
    }

    setIsLoading(true);
    setError('');

    // Имитация задержки для лучшего UX
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        // Сохраняем в localStorage что админ вошел
        localStorage.setItem('adminAuthenticated', 'true');
        navigate('/admin');
      } else {
        setError('Неправильний пароль');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <LoginContainer>
      <BackButton onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        Назад
      </BackButton>
      
      <LoginCard>
        <Header>
          <div className="icon">
            <Lock size={30} />
          </div>
          <h1>Адмін панель</h1>
          <p>Введіть пароль для доступу</p>
        </Header>
        
        <ServerStatus className={serverStatus} onClick={handleCheckServer} style={{ cursor: 'pointer' }}>
          <div className={`status-dot ${serverStatus}`}></div>
          {serverStatus === 'checking' && '🟡 Перевірка сервера...'}
          {serverStatus === 'online' && '🟢 Сервер працює'}
          {serverStatus === 'offline' && '🔴 Сервер офлайн'}
        </ServerStatus>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <label>Пароль</label>
            <PasswordInput>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введіть пароль адміністратора"
                disabled={isLoading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </PasswordInput>
          </FormGroup>
          
          <LoginButton type="submit" disabled={isLoading}>
            {isLoading ? 'Перевірка...' : 'Увійти'}
          </LoginButton>
        </Form>
      </LoginCard>
    </LoginContainer>
  );
};

export default AdminLoginPage; 