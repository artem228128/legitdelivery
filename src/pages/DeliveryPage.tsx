import React from 'react';
import styled from 'styled-components';
import { Truck, CreditCard, Clock, Package, Globe, Shield } from 'lucide-react';

const DeliveryContainer = styled.div`
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

const Section = styled.section`
  margin-bottom: 60px;
  
  h2 {
    font-size: 2rem;
    color: var(--text-dark);
    margin-bottom: 30px;
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  p {
    font-size: 1.1rem;
    line-height: 1.7;
    color: var(--text-light);
    margin-bottom: 20px;
  }
  
  ul {
    margin: 20px 0;
    padding-left: 20px;
    
    li {
      font-size: 1.1rem;
      line-height: 1.7;
      color: var(--text-light);
      margin-bottom: 10px;
    }
  }
`;

const InfoCard = styled.div`
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  
  h3 {
    font-size: 1.5rem;
    color: var(--text-dark);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  p {
    font-size: 1.1rem;
    line-height: 1.7;
    color: var(--text-light);
    margin-bottom: 15px;
  }
  
  ul {
    margin: 15px 0;
    padding-left: 20px;
    
    li {
      font-size: 1.1rem;
      line-height: 1.7;
      color: var(--text-light);
      margin-bottom: 8px;
    }
  }
`;

const PaymentMethods = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 30px;
`;

const PaymentMethod = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  border-left: 4px solid var(--primary-blue);
  
  h4 {
    font-size: 1.2rem;
    color: var(--text-dark);
    margin-bottom: 10px;
  }
  
  p {
    font-size: 1rem;
    color: var(--text-light);
    line-height: 1.6;
  }
`;

const PaymentTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  color: var(--text-dark);
  margin-top: 40px;
  margin-bottom: 20px;
`;

const DeliveryPage: React.FC = () => {
  return (
    <DeliveryContainer>
      <Header>
        <h1>Доставка і оплата</h1>
        <p>
          Дізнайтеся про способи доставки та оплати товарів у нашому магазині
        </p>
      </Header>

      <Section>
        <h2>
          <Truck size={32} />
          Доставка
        </h2>
        
        <InfoCard>
          <h3>
            <Package size={24} />
            Товар у наявності в Україні:
          </h3>
          <ul>
            <li>Відправлення по Україні через "Нову пошту" до найближчого відділення.</li>
            <li>Доставка кур'єром "Нової пошти" прямо до вашої адреси.</li>
          </ul>
          <p>
            Замовлення відправляється протягом 1-2 робочих днів після узгодження оплати з менеджером. 
            Доставка займає 1-3 дні з моменту відправки. Витрати на доставку сплачує покупець за тарифами служби доставки.
          </p>
        </InfoCard>

        <InfoCard>
          <h3>
            <Globe size={24} />
            Товар під замовлення з Європи або США:
          </h3>
          <p>
            Термін доставки з-за кордону становить 10-14 робочих днів з дня оформлення замовлення. 
            Час може варіюватися залежно від розташування товару та можливих непередбачених ситуацій 
            (затримки на кордоні чи у перевізників). Якщо виникнуть такі обставини, наш менеджер зв'яжеться з вами.
          </p>
        </InfoCard>
      </Section>

      <Section>
        <h2>
          <CreditCard size={32} />
          Оплата
        </h2>
        
        <InfoCard>
          <h3>
            <Package size={24} />
            Товар у наявності в Україні:
          </h3>
          <ul>
            <li><strong>Оплата при отриманні:</strong> Накладений платіж у відділеннях "Нової пошти" з мінімальною передоплатою 200 грн (ця сума покриває доставку у разі відмови).</li>
            <li><strong>Повна оплата заздалегідь:</strong> Здійснюється будь-яким із доступних способів оплати без додаткових витрат.</li>
          </ul>
        </InfoCard>

        <InfoCard>
          <h3>
            <Globe size={24} />
            Товар під замовлення з Європи або США:
          </h3>
          <ul>
            <li><strong>Часткова оплата:</strong> 30% вартості вноситься під час замовлення, решта — при отриманні через "Нову пошту".</li>
            <li><strong>100% передоплата:</strong> Повна сума сплачується перед відправленням.</li>
          </ul>
        </InfoCard>

        <PaymentTitle>
          <Shield size={24} />
          Способи оплати:
        </PaymentTitle>
        
        <PaymentMethods>
          <PaymentMethod>
            <h4>Переказ на рахунок ФОП</h4>
            <p>Безпечний переказ на офіційний рахунок підприємця</p>
          </PaymentMethod>
          
          <PaymentMethod>
            <h4>Оплата на картку українського банку</h4>
            <p>Переказ за номером картки українського банку</p>
          </PaymentMethod>
          
          <PaymentMethod>
            <h4>Переказ у криптовалюті USDT</h4>
            <p>Сучасний спосіб оплати криптовалютою</p>
          </PaymentMethod>
          
          <PaymentMethod>
            <h4>Оплата на картку іноземного банку</h4>
            <p>Можливість оплати карткою іноземного банку</p>
          </PaymentMethod>
        </PaymentMethods>
      </Section>
    </DeliveryContainer>
  );
};

export default DeliveryPage; 