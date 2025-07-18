import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Package, Calendar, Heart, Users, ArrowRight, Smartphone } from 'lucide-react';

// Анимации
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

const fadeInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

// Стили
const AboutContainer = styled.div`
  min-height: 100vh;
  background: #ffffff;
`;

const HeroSection = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 20px 60px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 100px 15px 40px;
    min-height: 80vh;
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
`;

const HeroText = styled.div`
  animation: ${fadeInLeft} 1s ease-out;
  
  h1 {
    font-size: 3.5rem;
    font-weight: 900;
    color: var(--text-dark);
    margin-bottom: 20px;
    line-height: 1.1;
    
    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
    
    @media (max-width: 480px) {
      font-size: 2rem;
    }
  }
  
  p {
    font-size: 1.3rem;
    color: var(--text-light);
    line-height: 1.6;
    margin-bottom: 30px;
    
    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
  }
`;

const HeroImage = styled.div`
  position: relative;
  animation: ${fadeInRight} 1s ease-out 0.3s both;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 50%, transparent 100%);
    border-radius: 50%;
    filter: blur(40px);
    z-index: -1;
    
    @media (max-width: 768px) {
      width: 300px;
      height: 300px;
      filter: blur(30px);
    }
  }
  
  .phone-frame {
    width: 300px;
    height: 600px;
    margin: 0 auto;
    animation: ${float} 6s ease-in-out infinite;
    position: relative;
    z-index: 1;
    
    @media (max-width: 768px) {
      width: 250px;
      height: 500px;
    }
  }
  
  .phone-screen {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
  }
  
  .instagram-screenshot {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 20px;
    
    @media (max-width: 768px) {
      border-radius: 15px;
    }
  }
`;

const Section = styled.section`
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto 0 auto;
  
  @media (max-width: 768px) {
    padding: 25px 15px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-dark);
  text-align: center;
  margin-bottom: 50px;
  animation: ${fadeInUp} 1s ease-out;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 40px;
  }
`;

const AboutText = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  animation: ${fadeInUp} 1s ease-out 0.2s both;
  
  p {
    font-size: 1.2rem;
    line-height: 1.8;
    color: var(--text-light);
    margin-bottom: 20px;
    
    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
  margin: 30px 0;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 18px;
    margin: 20px 0;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const StatCard = styled.div<{ $delay: number }>`
  text-align: center;
  padding: 30px 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  animation: ${fadeInUp} 1s ease-out;
  animation-delay: ${props => props.$delay}s;
  animation-fill-mode: both;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
  
  .icon {
    width: 60px;
    height: 60px;
    background: var(--primary-yellow);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    color: var(--text-dark);
    font-size: 1.5rem;
  }
  
  h3 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-dark);
    margin-bottom: 10px;
  }
  
  p {
    font-size: 1rem;
    color: var(--text-light);
    line-height: 1.5;
  }
`;

const MissionSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  align-items: center;
  margin: 30px 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 18px;
    margin: 20px 0;
  }
`;

const MissionText = styled.div`
  animation: ${fadeInLeft} 1s ease-out;
  
  h3 {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--text-dark);
    margin-bottom: 30px;
    
    @media (max-width: 768px) {
      font-size: 2rem;
      text-align: center;
    }
  }
  
  p {
    font-size: 1.2rem;
    line-height: 1.8;
    color: var(--text-light);
    margin-bottom: 20px;
    
    @media (max-width: 768px) {
      font-size: 1.1rem;
      text-align: center;
    }
  }
  
  .trust-text {
    font-size: 1.1rem;
    color: var(--primary-blue);
    font-weight: 600;
    margin-top: 30px;
    
    @media (max-width: 768px) {
      text-align: center;
    }
  }
`;

const MissionImage = styled.div`
  animation: ${fadeInRight} 1s ease-out 0.3s both;
  
  img {
    width: 100%;
    max-width: 400px;
    height: auto;
    border-radius: 20px;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.02);
    }
  }
`;

const CTASection = styled.div`
  text-align: center;
  padding: 40px 20px 53px;
  background: linear-gradient(135deg, var(--primary-yellow) 0%, #FFE55C 100%);
  border-radius: 30px;
  margin: 27px 0 40px;
  animation: ${fadeInUp} 1s ease-out;
  
  @media (max-width: 768px) {
    padding: 27px 15px 40px;
    margin: 20px 0 27px;
  }
  
  h3 {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--text-dark);
    margin-bottom: 20px;
    
    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }
  
  p {
    font-size: 1.2rem;
    color: var(--text-dark);
    margin-bottom: 40px;
    opacity: 0.8;
    
    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
  }
`;

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--text-dark);
  color: white;
  padding: 18px 40px;
  border-radius: 50px;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
    background: #000;
  }
  
  @media (max-width: 768px) {
    padding: 15px 30px;
    font-size: 1.1rem;
  }
`;

const AboutPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
      section.id = `section-${index}`;
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <AboutContainer>
      <HeroSection>
        <HeroContent>
          <HeroText>
            <h1>Ми — більше, ніж магазин кросівок</h1>
            <p>Робимо стиль доступним з 2021 року</p>
          </HeroText>
          
          <HeroImage>
            <div className="phone-frame">
              <div className="phone-screen">
                <img 
                  src="http://res.cloudinary.com/dvy87ylmu/image/upload/v1752869540/a7507hitjp1j30sdhj3v.png" 
                  alt="LegitDelivery Instagram" 
                  className="instagram-screenshot"
                />
              </div>
            </div>
          </HeroImage>
        </HeroContent>
      </HeroSection>

      <Section id="about-section">
        <SectionTitle>Хто ми?</SectionTitle>
        <AboutText>
          <p>
            Ми почали в 2021 році з простої ідеї — дати людям доступ до оригінальних, стильних кросівок без переплат.
          </p>
          <p>
            За цей час ми відправили більше 1400 пар клієнтам по всій Україні.
          </p>
          <p>
            Наш головний пріоритет — якість, чесність і довіра.
          </p>
          <p>
            Ми самі носимо те, що продаємо, і підбираємо пари так, як наче вибираємо для себе або друзів.
          </p>
        </AboutText>

        <StatsGrid>
          <StatCard $delay={0.1}>
            <div className="icon">
              <Package size={30} />
            </div>
            <h3>1400+</h3>
            <p>відправок</p>
          </StatCard>
          
          <StatCard $delay={0.2}>
            <div className="icon">
              <Calendar size={30} />
            </div>
            <h3>2022</h3>
            <p>рік заснування</p>
          </StatCard>
          
          <StatCard $delay={0.3}>
            <div className="icon">
              <Heart size={30} />
            </div>
            <h3>98%</h3>
            <p>задоволених клієнтів</p>
          </StatCard>
          
          <StatCard $delay={0.4}>
            <div className="icon">
              <Users size={30} />
            </div>
            <h3>100%</h3>
            <p>оригінальні бренди</p>
          </StatCard>
        </StatsGrid>
      </Section>

      <Section id="mission-section">
        <MissionSection>
          <MissionText>
            <h3>Наша місія</h3>
            <p>
              Зробити оригінальні кросівки доступними кожному.
            </p>
            <p>
              Ми віримо, що взуття — це частина самовираження.
            </p>
            <p>
              Наше завдання — допомогти тобі почуватися впевнено кожен день.
            </p>
            <p className="trust-text">
              Нам довіряють сотні клієнтів — приєднуйся!
            </p>
          </MissionText>
          
          <MissionImage>
            <img src="http://res.cloudinary.com/dvy87ylmu/image/upload/v1752869534/egvl79ttla3ttyqb9dks.png" alt="LegitDelivery" />
          </MissionImage>
        </MissionSection>
      </Section>

      <Section id="cta-section">
        <CTASection>
          <h3>Готовий знайти свою ідеальну пару?</h3>
          <p>👟 Переходи в каталог і вибирай!</p>
          <CTAButton to="/catalog">
            Каталог
            <ArrowRight size={20} />
          </CTAButton>
        </CTASection>
      </Section>
    </AboutContainer>
  );
};

export default AboutPage; 