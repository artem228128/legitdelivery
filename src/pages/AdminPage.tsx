import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { ArrowLeft, Plus, Trash2, Edit, Search, Package, Users, Settings, LogOut } from 'lucide-react';

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

const AdminContainer = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
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
`;

const LogoutButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: #dc3545;
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
  
  &:hover {
    background: #c82333;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
  }
`;



const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  animation: ${fadeInUp} 0.8s ease-out;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
  
  h1 {
    font-size: 2.5rem;
    color: #2c3e50;
    margin-bottom: 10px;
    font-weight: 700;
  }
  
  p {
    font-size: 1.1rem;
    color: #6c757d;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  
  .icon {
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #FFD700, #FFA500);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 15px;
    color: white;
  }
  
  .number {
    font-size: 2rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 5px;
  }
  
  .label {
    color: #6c757d;
    font-size: 0.9rem;
  }
`;

const ActionsSection = styled.div`
  background: white;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ActionButton = styled.button`
  padding: 15px 25px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &.primary {
    background: linear-gradient(135deg, #FFD700, #FFA500);
    color: #333;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4);
    }
  }
  
  &.secondary {
    background: #e9ecef;
    color: #495057;
    
    &:hover {
      background: #dee2e6;
      transform: translateY(-2px);
    }
  }
  
  &.danger {
    background: #dc3545;
    color: white;
    
    &:hover {
      background: #c82333;
      transform: translateY(-2px);
    }
  }
`;

const TrackingTable = styled.div`
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 100px;
  gap: 20px;
  padding: 15px 0;
  border-bottom: 2px solid #e9ecef;
  font-weight: 600;
  color: #495057;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 100px;
  gap: 20px;
  padding: 15px 0;
  border-bottom: 1px solid #f8f9fa;
  align-items: center;
  
  &:hover {
    background: #f8f9fa;
  }
  
  @media (max-width: 768px) {
    display: block;
    padding: 20px;
    border: 1px solid #e9ecef;
    border-radius: 10px;
    margin-bottom: 15px;
  }
`;

const StatusBadge = styled.span<{ $status: number }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  
  ${props => {
    if (props.$status === 13) return 'background: #28a745; color: white;';
    if (props.$status >= 10) return 'background: #17a2b8; color: white;';
    if (props.$status >= 7) return 'background: #ffc107; color: #333;';
    if (props.$status >= 4) return 'background: #fd7e14; color: white;';
    return 'background: #6c757d; color: white;';
  }}
`;

const SearchBar = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  
  input {
    flex: 1;
    padding: 12px 16px;
    border: 2px solid #e9ecef;
    border-radius: 10px;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: #FFD700;
    }
  }
`;

const Modal = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 15px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  label {
    font-weight: 600;
    color: #495057;
  }
  
  input, select {
    padding: 12px 16px;
    border: 2px solid #e9ecef;
    border-radius: 10px;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: #FFD700;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 20px;
`;

interface TrackingItem {
  id: string;
  trackingId: string;
  status: number;
  deliveryDate: string;
  customerName?: string;
  createdAt: string;
}

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [trackingItems, setTrackingItems] = useState<TrackingItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TrackingItem | null>(null);
  const [formData, setFormData] = useState({
    trackingId: '',
    status: 1,
    deliveryDate: '',
    customerName: ''
  });
  // Проверка аутентификации
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/admin-login');
      return;
    }
  }, [navigate]);

  // API base URL
  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://legitdelivery.com.ua/api' 
    : 'http://localhost:3001/api';

  const fetchTrackingItems = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tracking`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setTrackingItems(data);
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  }, [API_BASE_URL]);

  // Загружаем данные с сервера
  useEffect(() => {
    fetchTrackingItems();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredItems = trackingItems.filter(item =>
    item.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: trackingItems.length,
    active: trackingItems.filter(item => item.status < 13).length,
    completed: trackingItems.filter(item => item.status === 13).length,
    pending: trackingItems.filter(item => item.status <= 3).length
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingItem) {
        // Обновляем существующий элемент
        const response = await fetch(`${API_BASE_URL}/tracking`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...formData, id: editingItem.id }),
        });
        
        if (response.ok) {
          await fetchTrackingItems();
        }
      } else {
        // Добавляем новый элемент
        const response = await fetch(`${API_BASE_URL}/tracking`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (response.ok) {
          await fetchTrackingItems();
        }
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Ошибка сохранения:', error);
    }
  };

  const handleEdit = (item: TrackingItem) => {
    setEditingItem(item);
    setFormData({
      trackingId: item.trackingId,
      status: item.status,
      deliveryDate: item.deliveryDate,
      customerName: item.customerName || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Ви впевнені, що хочете видалити цей трек-номер?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/tracking`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });
        
        if (response.ok) {
          await fetchTrackingItems();
        }
      } catch (error) {
        console.error('Ошибка удаления:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      trackingId: '',
      status: 1,
      deliveryDate: '',
      customerName: ''
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    navigate('/');
  };



  const getStatusText = (status: number) => {
    const statusMap: { [key: number]: string } = {
      1: "Замовлення створено",
      2: "Оплачено",
      3: "Збирається на складі",
      4: "Відправлено з США",
      5: "В дорозі до Німеччини",
      6: "Прибуло в Німеччину",
      7: "Митне оформлення",
      8: "Відправлено з Німеччини",
      9: "В дорозі до України",
      10: "Прибуло в Україну",
      11: "Митне оформлення в Україні",
      12: "В дорозі до магазину",
      13: "Готово до видачі"
    };
    return statusMap[status] || "Невідомий статус";
  };


  
  return (
    <AdminContainer>
      <BackButton onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        Назад
      </BackButton>
      
      <LogoutButton onClick={handleLogout}>
        <LogOut size={20} />
        Вийти
      </LogoutButton>
      
      <Content>
        <Header>
          <h1>Адмін панель</h1>
          <p>Управління системою відстеження посілок</p>
        </Header>
        
        <StatsGrid>
          <StatCard>
            <div className="icon">
              <Package size={24} />
            </div>
            <div className="number">{stats.total}</div>
            <div className="label">Всього посілок</div>
          </StatCard>
          
          <StatCard>
            <div className="icon">
              <Settings size={24} />
            </div>
            <div className="number">{stats.active}</div>
            <div className="label">Активних</div>
          </StatCard>
          
          <StatCard>
            <div className="icon">
              <Users size={24} />
            </div>
            <div className="number">{stats.completed}</div>
            <div className="label">Завершених</div>
          </StatCard>
          
          <StatCard>
            <div className="icon">
              <Search size={24} />
            </div>
            <div className="number">{stats.pending}</div>
            <div className="label">Очікують</div>
          </StatCard>
        </StatsGrid>
        
        <ActionsSection>
          <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>Дії</h3>
          <ActionButtons>
            <ActionButton 
              className="primary"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus size={20} />
              Додати посылку
            </ActionButton>
            
            <ActionButton 
              className="secondary"
              onClick={() => {
                const dataStr = JSON.stringify(trackingItems, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'tracking-data.json';
                link.click();
              }}
            >
              <Settings size={20} />
              Експорт даних
            </ActionButton>
          </ActionButtons>
        </ActionsSection>
        
        <TrackingTable>
          <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>Список посілок</h3>
          
          <SearchBar>
            <input
              type="text"
              placeholder="Пошук за трек-номером або ім'ям клієнта..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBar>
          
          <TableHeader>
            <div>Трек-номер</div>
            <div>Клієнт</div>
            <div>Статус</div>
            <div>Дата доставки</div>
            <div>Дії</div>
          </TableHeader>
          
          {filteredItems.map(item => (
            <TableRow key={item.id}>
              <div>
                <strong>{item.trackingId}</strong>
                <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div>{item.customerName || 'Не вказано'}</div>
              <div>
                <StatusBadge $status={item.status}>
                  {item.status}/13
                </StatusBadge>
                <div style={{ fontSize: '0.8rem', marginTop: '5px' }}>
                  {getStatusText(item.status)}
                </div>
              </div>
              <div>{item.deliveryDate || 'Не визначено'}</div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleEdit(item)}
                  style={{
                    background: '#17a2b8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    cursor: 'pointer'
                  }}
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={{
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </TableRow>
          ))}
          
          {filteredItems.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
              {searchTerm ? 'Немає результатів пошуку' : 'Немає посілок для відображення'}
            </div>
          )}
        </TrackingTable>
      </Content>
      
      <Modal $isOpen={isModalOpen}>
        <ModalContent>
          <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>
            {editingItem ? 'Редагувати посылку' : 'Додати нову посылку'}
          </h2>
          
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <label>Трек-номер *</label>
              <input
                type="text"
                value={formData.trackingId}
                onChange={(e) => setFormData({...formData, trackingId: e.target.value})}
                required
                placeholder="Введіть трек-номер"
              />
            </FormGroup>
            
            <FormGroup>
              <label>Ім'я клієнта</label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                placeholder="Введіть ім'я клієнта"
              />
            </FormGroup>
            
            <FormGroup>
              <label>Статус *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: parseInt(e.target.value)})}
                required
              >
                {Array.from({ length: 13 }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>
                    {num}/13 - {getStatusText(num)}
                  </option>
                ))}
              </select>
            </FormGroup>
            
            <FormGroup>
              <label>Дата доставки</label>
              <input
                type="text"
                value={formData.deliveryDate}
                onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})}
                placeholder="Наприклад: 25 грудня 2024"
              />
            </FormGroup>
            
            <ButtonGroup>
              <ActionButton 
                type="button"
                className="secondary"
                onClick={handleCloseModal}
              >
                Скасувати
              </ActionButton>
              <ActionButton 
                type="submit"
                className="primary"
              >
                {editingItem ? 'Оновити' : 'Додати'}
              </ActionButton>
            </ButtonGroup>
          </Form>
        </ModalContent>
      </Modal>
    </AdminContainer>
  );
};

export default AdminPage; 