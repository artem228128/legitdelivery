import React from 'react';
import styled from 'styled-components';
import { Target, Users, Award, Heart } from 'lucide-react';

const AboutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 80px 20px;
  background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-yellow) 100%);
  color: white;
  border-radius: 20px;
  margin-bottom: 80px;
  
  h1 {
    font-size: 3rem;
    margin-bottom: 20px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    
    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }
  
  p {
    font-size: 1.3rem;
    max-width: 600px;
    margin: 0 auto;
    opacity: 0.9;
    
    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
  }
`;

const Section = styled.section`
  margin-bottom: 80px;
  
  h2 {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 20px;
    color: var(--text-dark);
  }
  
  .section-description {
    text-align: center;
    font-size: 1.1rem;
    color: var(--text-light);
    margin-bottom: 50px;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
`;

const ValueCard = styled.div`
  background: white;
  padding: 40px 30px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
  
  .icon {
    width: 60px;
    height: 60px;
    background: var(--primary-blue);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    color: white;
  }
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 15px;
    color: var(--text-dark);
  }
  
  p {
    color: var(--text-light);
    line-height: 1.6;
  }
`;

const StorySection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  margin-bottom: 80px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const StoryContent = styled.div`
  h3 {
    font-size: 2rem;
    margin-bottom: 20px;
    color: var(--text-dark);
  }
  
  p {
    font-size: 1.1rem;
    line-height: 1.7;
    color: var(--text-light);
    margin-bottom: 20px;
  }
`;

const StoryImage = styled.div`
  height: 400px;
  background: url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop') center/cover;
  border-radius: 15px;
  
  @media (max-width: 768px) {
    height: 300px;
  }
`;

const TeamSection = styled.div`
  text-align: center;
  
  .team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
    margin-top: 50px;
  }
`;

const TeamMember = styled.div`
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  
  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary-blue), var(--primary-yellow));
    margin: 0 auto 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 2rem;
    font-weight: 700;
  }
  
  h4 {
    font-size: 1.3rem;
    margin-bottom: 10px;
    color: var(--text-dark);
  }
  
  .role {
    color: var(--primary-blue);
    font-weight: 600;
    margin-bottom: 15px;
  }
  
  p {
    color: var(--text-light);
    line-height: 1.6;
  }
`;

const MissionSection = styled.div`
  background: var(--bg-light);
  padding: 60px 40px;
  border-radius: 20px;
  text-align: center;
  margin-bottom: 80px;
  
  h3 {
    font-size: 2.5rem;
    margin-bottom: 30px;
    color: var(--text-dark);
  }
  
  .mission-text {
    font-size: 1.3rem;
    color: var(--text-dark);
    max-width: 800px;
    margin: 0 auto;
    line-height: 1.6;
    font-style: italic;
  }
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin-bottom: 80px;
  
  .stat {
    text-align: center;
    padding: 30px;
    background: white;
    border-radius: 15px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    
    .number {
      font-size: 3rem;
      font-weight: 700;
      color: var(--primary-blue);
      margin-bottom: 10px;
    }
    
    .label {
      font-size: 1.1rem;
      color: var(--text-light);
    }
  }
`;

const AboutPage: React.FC = () => {
  return (
    <AboutContainer>
      <HeroSection>
        <h1>О нас</h1>
        <p>
          Ми обираємо стиль, не компроміси. LegitDelivery — це місце, де зустрічаються 
          найкращі кросівки та вулична мода від світових брендів.
        </p>
      </HeroSection>

      <Section>
        <h2>Наші цінності</h2>
        <div className="section-description">
          Те, що робить нас особливими та допомагає створювати кращий досвід для наших клієнтів
        </div>
        
        <ValuesGrid>
          <ValueCard>
            <div className="icon">
              <Award size={30} />
            </div>
            <h3>Якість</h3>
            <p>
              Ми працюємо тільки з офіційними постачальниками та гарантуємо 
              100% оригінальність усіх товарів.
            </p>
          </ValueCard>
          
          <ValueCard>
            <div className="icon">
              <Target size={30} />
            </div>
            <h3>Стиль</h3>
            <p>
              Наша команда слідкує за останніми трендами та обирає тільки 
              найактуальніші моделі.
            </p>
          </ValueCard>
          
          <ValueCard>
            <div className="icon">
              <Users size={30} />
            </div>
            <h3>Спільнота</h3>
            <p>
              Ми створюємо спільноту людей, які розділяють любов до 
              вуличної моди та кросівок.
            </p>
          </ValueCard>
          
          <ValueCard>
            <div className="icon">
              <Heart size={30} />
            </div>
            <h3>Турбота</h3>
            <p>
              Ми турбуємося про кожного клієнта та прагнемо зробити покупки 
              максимально комфортними.
            </p>
          </ValueCard>
        </ValuesGrid>
      </Section>

      <Section>
        <StorySection>
          <StoryContent>
            <h3>Наша історія</h3>
            <p>
              LegitDelivery був заснований у 2020 році групою ентузіастів вуличної моди, 
              які хотіли створити місце, де кожен зможе знайти ідеальну пару 
              кросівок для свого стилю.
            </p>
            <p>
              Почавши як невеликий інтернет-магазин, ми швидко завоювали довіру 
              клієнтів завдяки якісному сервісу та ретельному відбору товарів.
            </p>
            <p>
              Сьогодні ми працюємо з провідними брендами світу та допомагаємо тисячам 
              людей виражати свою індивідуальність через стиль.
            </p>
          </StoryContent>
          <StoryImage />
        </StorySection>
      </Section>

      <MissionSection>
        <h3>Наша місія</h3>
        <div className="mission-text">
          «Ми робимо стиль доступним для кожного, створюючи простір, 
          де якість зустрічається з трендами, а кожен покупець знаходить 
          те, що відображає його унікальну особистість»
        </div>
      </MissionSection>

      <Section>
        <h2>Наша команда</h2>
        <div className="section-description">
          Професіонали, які роблять LegitDelivery особливим
        </div>
        
        <TeamSection>
          <div className="team-grid">
            <TeamMember>
              <div className="avatar">АИ</div>
              <h4>Олексій Іванов</h4>
              <div className="role">Засновник та CEO</div>
              <p>
                Візіонер та натхненник команди. Відповідає за стратегічний 
                розвиток компанії та партнерські відносини.
              </p>
            </TeamMember>
            
            <TeamMember>
              <div className="avatar">МП</div>
              <h4>Марія Петрова</h4>
              <div className="role">Головний баєр</div>
              <p>
                Експерт у галузі трендів та модних напрямків. Обирає 
                найкращі моделі для нашого каталогу.
              </p>
            </TeamMember>
            
            <TeamMember>
              <div className="avatar">ДС</div>
              <h4>Дмитрий Сидоров</h4>
              <div className="role">Руководитель отдела продаж</div>
              <p>
                Заботится о том, чтобы каждый клиент получил максимум 
                удовольствия от покупок в StreetKicks.
              </p>
            </TeamMember>
          </div>
        </TeamSection>
      </Section>

      <StatsSection>
        <div className="stat">
          <div className="number">10K+</div>
          <div className="label">Довольных клиентов</div>
        </div>
        <div className="stat">
          <div className="number">500+</div>
          <div className="label">Моделей кроссовок</div>
        </div>
        <div className="stat">
          <div className="number">50+</div>
          <div className="label">Брендов</div>
        </div>
        <div className="stat">
          <div className="number">99%</div>
          <div className="label">Положительных отзывов</div>
        </div>
      </StatsSection>
    </AboutContainer>
  );
};

export default AboutPage; 