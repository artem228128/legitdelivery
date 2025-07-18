import React from 'react';
import styled from 'styled-components';
import { Shield, RefreshCcw } from 'lucide-react';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Title = styled.h1`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 2.2rem;
  color: var(--text-dark);
  margin-bottom: 32px;
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.3rem;
  color: var(--primary-blue);
  margin-bottom: 18px;
`;

const Paragraph = styled.p`
  font-size: 1.1rem;
  color: var(--text-light);
  margin-bottom: 16px;
`;

const List = styled.ul`
  margin: 0 0 16px 20px;
  padding: 0;
  color: var(--text-light);
  font-size: 1.1rem;
  li {
    margin-bottom: 8px;
  }
`;

const WarrantyPage: React.FC = () => (
  <Container>
    <Title><Shield size={32}/> Гарантія. Обмін та повернення</Title>

    <Section>
      <SectionTitle><RefreshCcw size={22}/> Товар у наявності в Україні:</SectionTitle>
      <Paragraph>
        Обмін або повернення можливе протягом 14 днів з дня отримання за умови, що товар не був у використанні, має повністю збережений товарний вигляд, оригінальну упаковку та всі бирки.
      </Paragraph>
      <Paragraph>
        Витрати на пересилку товару для обміну чи повернення покладаються на покупця. Перед відправкою просимо зв’язатися з менеджером для узгодження деталей.
      </Paragraph>
      <Paragraph>
        Кошти повертаються на вашу картку протягом 5 робочих днів після отримання та перевірки товару на відповідність умовам. Зверніть увагу, що повернення з суб’єктивних причин (наприклад, "не сподобався колір чи фасон") можливе лише за згодою магазину.
      </Paragraph>
    </Section>

    <Section>
      <SectionTitle><RefreshCcw size={22}/> Товар під замовлення з Європи або США:</SectionTitle>
      <Paragraph>
        Обмін чи повернення товарів, замовлених із-за кордону, можливе лише у таких випадках:
      </Paragraph>
      <List>
        <li>Доставлено товар, який не відповідає вашому замовленню.</li>
        <li>Отримано неправильний розмір, вказаний у замовленні.</li>
        <li>Виявлено суттєвий дефект, який унеможливлює використання товару.</li>
      </List>
      <Paragraph>
        Для оформлення обміну чи повернення зв’яжіться з менеджером протягом 3 днів після отримання та надайте фото/відео з доказами проблеми, зроблені під час огляду на пошті. Витрати на зворотну доставку оплачує покупець.
      </Paragraph>
    </Section>
  </Container>
);

export default WarrantyPage; 