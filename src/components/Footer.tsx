import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Instagram, MessageCircle, Phone, Mail, MapPin, Clock } from 'lucide-react';

const FooterContainer = styled.footer`
  color: var(--text-dark);
  padding: 60px 0 30px;
  margin-top: 80px;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 50px;
  justify-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
    justify-items: start;
    padding: 0 30px;
  }
`;

const FooterSection = styled.div`
  h3 {
    font-size: 1.5rem;
    margin-bottom: 25px;
    color: var(--text-dark);
    font-weight: 600;
  }
  
  p {
    line-height: 1.6;
    margin-bottom: 15px;
    color: var(--text-dark);
    font-size: 1rem;
  }
`;

const FooterLink = styled(Link)`
  color: var(--text-dark);
  text-decoration: none;
  display: block;
  margin-bottom: 12px;
  transition: color 0.3s ease;
  font-size: 1rem;
  
  &:hover {
    color: var(--primary-blue);
  }
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
  color: var(--text-dark);
  font-size: 1rem;
  
  svg {
    width: 18px;
    height: 18px;
    color: var(--primary-blue);
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  background: var(--primary-blue);
  border-radius: 12px;
  color: #ffffff;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--primary-yellow);
    color: var(--text-dark);
    transform: translateY(-2px);
  }
`;

const WorkingHours = styled.div`
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  
  h4 {
    margin: 0 0 8px 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-dark);
  }
  
  p {
    margin: 0;
    font-size: 1rem;
    color: var(--text-dark);
  }
`;

const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px 0;
  border-top: 1px solid #e0e0e0;
  margin-top: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const Copyright = styled.p`
  color: #666666;
  font-size: 0.9rem;
  margin: 0;
`;

const UserAgreement = styled(Link)`
  color: #666666;
  font-size: 0.9rem;
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--primary-blue);
  }
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>Зв'язок з нами</h3>
          
          <h4 style={{ fontSize: '1.2rem', marginBottom: '15px', fontWeight: '600' }}>Соц. мережі:</h4>
          <SocialLinks>
            <SocialLink href="https://instagram.com/legitdelivery.ua" target="_blank" rel="noopener noreferrer">
              <Instagram size={22} />
            </SocialLink>
            <SocialLink href="https://t.me/legitdelivery_ua" target="_blank" rel="noopener noreferrer">
              <MessageCircle size={22} />
            </SocialLink>
          </SocialLinks>
          
          <div style={{ marginTop: '30px' }}>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '15px', fontWeight: '600' }}>Підтримка клієнтів:</h4>
            <ContactInfo>
              <Mail />
              <span>legitdeliveryua@gmail.com</span>
            </ContactInfo>
          </div>
        </FooterSection>
        
        <FooterSection>
          <h3>Покупцю:</h3>
          <FooterLink to="/payment-delivery">Оплата/доставка</FooterLink>
          <FooterLink to="/warranty">Гарантія</FooterLink>
          <FooterLink to="/size-guide">Як підібрати розмір</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <h3>Графік роботи</h3>
          <p>ПН-ПТ: 09:00-23:00</p>
          <p>СБ-НД: 11:00-16:00</p>
        </FooterSection>
      </FooterContent>
      
      <FooterBottom>
        <Copyright>
          © 2025 LegitDelivery. Всі права захищені.
        </Copyright>
        <UserAgreement to="/user-agreement">
          Угода Користувача
        </UserAgreement>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer; 