import React, { useState } from 'react';
import styled from 'styled-components';
import { Calculator, Ruler, Info } from 'lucide-react';

const SizeGuideContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 50px;
  
  h1 {
    font-size: 3rem;
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

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  margin-bottom: 50px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const InstructionsSection = styled.div`
  h2 {
    font-size: 2rem;
    color: var(--text-dark);
    margin-bottom: 30px;
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .instruction-steps {
    background: white;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    counter-reset: step-counter;
  }
  
  .step {
    margin-bottom: 20px;
    padding-left: 35px;
    position: relative;
    
    &:before {
      content: counter(step-counter);
      counter-increment: step-counter;
      position: absolute;
      left: 0;
      top: 0;
      background: var(--primary-blue);
      color: white;
      width: 25px;
      height: 25px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.9rem;
    }
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  .measurement-image {
    margin-top: 30px;
    text-align: center;
    
    img {
      max-width: 100%;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
  }
`;

const CalculatorSection = styled.div`
  h2 {
    font-size: 2rem;
    color: var(--text-dark);
    margin-bottom: 30px;
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .calculator-form {
    background: white;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  
  .form-group {
    margin-bottom: 25px;
    
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: var(--text-dark);
    }
    
    input, select {
      width: 100%;
      padding: 12px;
      border: 2px solid var(--border-light);
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
      
      &:focus {
        outline: none;
        border-color: var(--primary-blue);
      }
    }
    
    .error {
      border-color: #ff4444;
      background-color: #fff5f5;
    }
  }
  
  .calculate-btn {
    width: 100%;
    padding: 15px;
    background: var(--primary-blue);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;
    
    &:hover {
      background: #1e40af;
    }
    
    &:disabled {
      background: var(--border-light);
      cursor: not-allowed;
    }
  }
`;

const ResultSection = styled.div`
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-top: 30px;
  
  h3 {
    font-size: 1.5rem;
    color: var(--text-dark);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .size-result {
    background: var(--primary-yellow);
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 20px;
    
    .size-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-dark);
      margin-bottom: 10px;
    }
    
    .size-details {
      color: var(--text-dark);
      font-weight: 500;
    }
  }
  
  .size-note {
    background: #f0f9ff;
    padding: 15px;
    border-radius: 8px;
    border-left: 4px solid var(--primary-blue);
    
    p {
      margin: 0;
      color: var(--text-dark);
      font-size: 0.9rem;
    }
  }
`;

// Данные о размерах
const sizeData = {
  "Nike": [
    { "cm": 24, "EU": "38.5", "UK": "5.5", "US": "6" },
    { "cm": 24.5, "EU": "39", "UK": "6", "US": "6.5" },
    { "cm": 25, "EU": "40", "UK": "6", "US": "7" },
    { "cm": 25.5, "EU": "40.5", "UK": "6.5", "US": "7.5" },
    { "cm": 26, "EU": "41", "UK": "7", "US": "8" },
    { "cm": 26.5, "EU": "42", "UK": "7.5", "US": "8.5" },
    { "cm": 27, "EU": "42.5", "UK": "8", "US": "9" },
    { "cm": 27.5, "EU": "43", "UK": "8.5", "US": "9.5" },
    { "cm": 28, "EU": "44", "UK": "9", "US": "10" },
    { "cm": 28.5, "EU": "44.5", "UK": "9.5", "US": "10.5" },
    { "cm": 29, "EU": "45", "UK": "10", "US": "11" },
    { "cm": 29.5, "EU": "45.5", "UK": "10.5", "US": "11.5" },
    { "cm": 30, "EU": "46", "UK": "11", "US": "12" },
    { "cm": 30.5, "EU": "47", "UK": "11.5", "US": "12.5" },
    { "cm": 31, "EU": "47.5", "UK": "12", "US": "13" }
  ],
  "Adidas": [
    { "cm": 24.5, "EU": "39.5", "UK": "6.5", "US": "6" },
    { "cm": 25, "EU": "40", "UK": "7", "US": "6.5" },
    { "cm": 25.5, "EU": "40.5", "UK": "7.5", "US": "7" },
    { "cm": 26, "EU": "41.5", "UK": "8", "US": "7.5" },
    { "cm": 26.5, "EU": "42", "UK": "8.5", "US": "8" },
    { "cm": 27, "EU": "42.5", "UK": "9", "US": "8.5" },
    { "cm": 27.5, "EU": "43.5", "UK": "9.5", "US": "9" },
    { "cm": 28, "EU": "44", "UK": "10", "US": "9.5" },
    { "cm": 28.5, "EU": "44.5", "UK": "10.5", "US": "10" },
    { "cm": 29, "EU": "45.5", "UK": "11", "US": "10.5" },
    { "cm": 29.5, "EU": "46", "UK": "11.5", "US": "11" },
    { "cm": 30, "EU": "46.5", "UK": "12", "US": "11.5" },
    { "cm": 30.5, "EU": "47.5", "UK": "12.5", "US": "12" }
  ],
  "New Balance": [
    { "cm": 23.5, "EU": "38", "UK": "5.5", "US": "5" },
    { "cm": 24, "EU": "38.5", "UK": "6", "US": "5.5" },
    { "cm": 24.5, "EU": "39.5", "UK": "6.5", "US": "6" },
    { "cm": 25, "EU": "40", "UK": "7", "US": "6.5" },
    { "cm": 25.5, "EU": "40.5", "UK": "7.5", "US": "7" },
    { "cm": 26, "EU": "41.5", "UK": "8", "US": "7.5" },
    { "cm": 26.5, "EU": "42", "UK": "8.5", "US": "8" },
    { "cm": 27, "EU": "42.5", "UK": "9", "US": "8.5" },
    { "cm": 27.5, "EU": "43", "UK": "9.5", "US": "9" },
    { "cm": 28, "EU": "44", "UK": "10", "US": "9.5" },
    { "cm": 28.5, "EU": "44.5", "UK": "10.5", "US": "10" },
    { "cm": 29, "EU": "45", "UK": "11", "US": "10.5" },
    { "cm": 29.5, "EU": "45.5", "UK": "11.5", "US": "11" },
    { "cm": 30, "EU": "46.5", "UK": "12", "US": "11.5" },
    { "cm": 30.5, "EU": "47", "UK": "12.5", "US": "12" },
    { "cm": 31, "EU": "47.5", "UK": "13", "US": "12.5" }
  ],
  "Yeezy": [
    { "EU": "35.5", "Adidas EU": "36", "UK": "4", "US": "3.5", "cm": 22 },
    { "EU": "36", "Adidas EU": "36 2/3", "UK": "4.5", "US": "4", "cm": 22.5 },
    { "EU": "36.5", "Adidas EU": "37 1/3", "UK": "5", "US": "4.5", "cm": 23 },
    { "EU": "37", "Adidas EU": "38", "UK": "5.5", "US": "5", "cm": 23.5 },
    { "EU": "37.5", "Adidas EU": "38 2/3", "UK": "6", "US": "5.5", "cm": 24 },
    { "EU": "38", "Adidas EU": "39 1/3", "UK": "6.5", "US": "6", "cm": 24 },
    { "EU": "38.5", "Adidas EU": "40", "UK": "7", "US": "6.5", "cm": 24.5 },
    { "EU": "39", "Adidas EU": "40 2/3", "UK": "7.5", "US": "7", "cm": 25 },
    { "EU": "40", "Adidas EU": "41 1/3", "UK": "8", "US": "7.5", "cm": 25.5 },
    { "EU": "40.5", "Adidas EU": "42", "UK": "8.5", "US": "8", "cm": 26 },
    { "EU": "41", "Adidas EU": "42 2/3", "UK": "9", "US": "8.5", "cm": 26.5 },
    { "EU": "42", "Adidas EU": "43 1/3", "UK": "9.5", "US": "9", "cm": 27 },
    { "EU": "42.5", "Adidas EU": "44", "UK": "10", "US": "9.5", "cm": 27 },
    { "EU": "43", "Adidas EU": "44 2/3", "UK": "10.5", "US": "10", "cm": 27.5 },
    { "EU": "44", "Adidas EU": "45 1/3", "UK": "11", "US": "10.5", "cm": 28 },
    { "EU": "44.5", "Adidas EU": "46", "UK": "11.5", "US": "11", "cm": 28.5 },
    { "EU": "45", "Adidas EU": "46 2/3", "UK": "12", "US": "11.5", "cm": 29 },
    { "EU": "46", "Adidas EU": "47 1/3", "UK": "12.5", "US": "12", "cm": 29.5 },
    { "EU": "46.5", "Adidas EU": "48", "UK": "13", "US": "12.5", "cm": 30 },
    { "EU": "47", "Adidas EU": "48 2/3", "UK": "13.5", "US": "13", "cm": 30 }
  ]
};

const SizeGuidePage: React.FC = () => {
  const [footLength, setFootLength] = useState('');
  const [brand, setBrand] = useState('');
  const [result, setResult] = useState<any>(null);
  const [errors, setErrors] = useState<{ footLength?: string; brand?: string }>({});

  const calculateSize = () => {
    const newErrors: { footLength?: string; brand?: string } = {};

    if (!footLength) {
      newErrors.footLength = 'Введіть довжину стопи';
    } else {
      const length = parseFloat(footLength);
      if (length < 21 || length > 32) {
        newErrors.footLength = 'Довжина стопи повинна бути від 21 до 32 см';
      }
    }

    if (!brand) {
      newErrors.brand = 'Виберіть бренд';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const length = parseFloat(footLength);
    const brandSizes = sizeData[brand as keyof typeof sizeData];
    
    if (!brandSizes) {
      setResult(null);
      return;
    }

    // Находим ближайший размер
    let closestSize = brandSizes[0];
    let minDifference = Math.abs(brandSizes[0].cm - length);

    for (const size of brandSizes) {
      const difference = Math.abs(size.cm - length);
      if (difference < minDifference) {
        minDifference = difference;
        closestSize = size;
      }
    }

    setResult({
      footLength: length,
      brand,
      size: closestSize,
      difference: minDifference
    });
  };

  return (
    <SizeGuideContainer>
      <Header>
        <h1>Як підібрати розмір</h1>
        <p>Дізнайтеся як правильно виміряти стопу та підібрати ідеальний розмір взуття</p>
      </Header>

      <ContentGrid>
        <InstructionsSection>
          <h2>
            <Ruler size={30} />
            Як визначити свій розмір
          </h2>
          
          <div className="instruction-steps">
            <div className="step">
              Одягніть шкарпетки або панчохи, які зазвичай носите з таким типом взуття.
            </div>
            <div className="step">
              Станьте прямо на рівну тверду поверхню, п'ятами торкніться стіни.
            </div>
            <div className="step">
              Виміряйте довжину стопи від п'яти до кінчика найдовшого пальця.
            </div>
            <div className="step">
              Якщо потрібно — попросіть когось допомогти з вимірюванням.
            </div>
            <div className="step">
              Обов'язково виміряйте обидві стопи та орієнтуйтесь на більший результат.
            </div>
          </div>

          <div className="measurement-image">
            <img src="/images/sizeguid.png" alt="Як правильно виміряти стопу" />
          </div>
        </InstructionsSection>

        <CalculatorSection>
          <h2>
            <Calculator size={30} />
            Калькулятор розміру
          </h2>
          
          <div className="calculator-form">
            <div className="form-group">
              <label>Довжина стопи (см)</label>
              <input
                type="number"
                value={footLength}
                onChange={(e) => setFootLength(e.target.value)}
                placeholder="Наприклад: 27.5"
                min="21"
                max="32"
                step="0.1"
                className={errors.footLength ? 'error' : ''}
              />
              {errors.footLength && (
                <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>
                  {errors.footLength}
                </p>
              )}
            </div>

            <div className="form-group">
              <label>Бренд</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className={errors.brand ? 'error' : ''}
              >
                <option value="">Виберіть бренд</option>
                <option value="Nike">Nike</option>
                <option value="Adidas">Adidas</option>
                <option value="New Balance">New Balance</option>
                <option value="Yeezy">Yeezy</option>
              </select>
              {errors.brand && (
                <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>
                  {errors.brand}
                </p>
              )}
            </div>

            <button 
              className="calculate-btn"
              onClick={calculateSize}
              disabled={!footLength || !brand}
            >
              Розрахувати розмір
            </button>
          </div>

          {result && (
            <ResultSection>
              <h3>
                <Info size={24} />
                Результат
              </h3>
              
              <div className="size-result">
                <div className="size-value">
                  {result.size.EU} EU
                </div>
                <div className="size-details">
                  <strong>Для стопи довжиною {result.footLength} см у бренді {result.brand}:</strong><br />
                  EU: {result.size.EU} | UK: {result.size.UK} | US: {result.size.US}
                  {result.brand === 'Yeezy' && result.size['Adidas EU'] && (
                    <span> | Adidas EU: {result.size['Adidas EU']}</span>
                  )}
                </div>
              </div>

              <div className="size-note">
                <p>
                  <strong>Примітка:</strong> Цей розмір є приблизним. Рекомендуємо приміряти взуття перед покупкою, 
                  оскільки різні моделі можуть маломірити або великомірити.
                </p>
              </div>
            </ResultSection>
          )}
        </CalculatorSection>
      </ContentGrid>
    </SizeGuideContainer>
  );
};

export default SizeGuidePage; 