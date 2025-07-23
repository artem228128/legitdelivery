import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const CollectionsWrapper = styled.div`
  width: 100%;
  position: relative;
  background-color: #fff;
`;

const CollectionsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    padding: 25px 15px;
  }
  
  @media (max-width: 480px) {
    padding: 20px 10px;
  }
`;

const CollectionsHeader = styled.div`
  text-align: center;
  margin-bottom: 50px;
  
  @media (max-width: 768px) {
    margin-bottom: 40px;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 30px;
  }
`;

const CollectionsTitle = styled.h2`
  font-size: 3rem;
  color: var(--text-dark);
  margin-bottom: 15px;
  font-weight: 900;
  font-family: 'Inter', 'Segoe UI', 'Roboto', sans-serif;
  position: relative;
  z-index: 1;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const CollectionsSubtitle = styled.p`
  font-size: 1.1rem;
  color: var(--text-light);
  margin: 0;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const CollectionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const CollectionCard = styled(Link)`
  position: relative;
  height: 600px;
  border-radius: 15px;
  overflow: hidden;
  text-decoration: none;
  display: block;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 768px) {
    height: 450px;
    border-radius: 12px;
  }
  
  @media (max-width: 480px) {
    height: 330px;
    border-radius: 10px;
  }
`;

const CollectionImage = styled.div<{ bgImage: string }>`
  width: 100%;
  height: 100%;
  background: url(${props => props.bgImage}) center no-repeat;
  background-size: cover;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    transition: background 0.3s ease;
  }
  
  ${CollectionCard}:hover &::before {
    background: rgba(0, 0, 0, 0.6);
  }
  
  @media (max-width: 768px) {
    &::before {
      background: rgba(0, 0, 0, 0.5);
    }
  }
`;

const CollectionOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${CollectionCard}:hover & {
    opacity: 1;
  }
  
  @media (max-width: 768px) {
    opacity: 1;
  }
`;

const CollectionTitle = styled.h3`
  color: white;
  font-size: 1.8rem;
  font-weight: 700;
  text-align: center;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const LoadMoreButton = styled.button`
  background: var(--primary-yellow);
  color: var(--text-dark);
  border: none;
  border-radius: 8px;
  padding: 15px 30px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: block;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  
  &:hover {
    background: #FFE55C;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    padding: 12px 25px;
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
`;

const Spinner = styled.span`
  display: inline-block;
  width: 22px;
  height: 22px;
  border: 3px solid #fff3;
  border-top: 3px solid var(--text-dark, #222);
  border-radius: 50%;
  animation: spin 0.35s linear infinite;
  vertical-align: middle;
  margin-right: 8px;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const HiddenCollectionsGrid = styled.div<{ isVisible: boolean }>`
  display: ${props => props.isVisible ? 'grid' : 'none'};
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  margin-top: 40px;
  opacity: ${props => props.isVisible ? '1' : '0'};
  transition: opacity 0.5s ease;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-top: 30px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 15px;
    margin-top: 20px;
  }
`;

// Данные коллекций
const initialCollections = [
  {
    id: 'nike-dunk-low',
    title: 'NIKE DUNK LOW',
    image: '"https://res.cloudinary.com/dvy87ylmu/image/upload/v1752849108/collections/nike-dunk-low.png"',
    link: '/catalog?model=Nike Dunk Low'
  },
  {
    id: 'new-balance',
    title: 'NEW BALANCE',
    image: '"https://res.cloudinary.com/dvy87ylmu/image/upload/v1752849107/collections/new-balance.jpg"',
    link: '/catalog?brand=New Balance'
  },
  {
    id: 'air-jordan-1-low',
    title: 'AIR JORDAN 1 LOW',
    image: '"https://res.cloudinary.com/dvy87ylmu/image/upload/v1752849098/collections/air-jordan-1-low.jpg"',
    link: '/catalog?model=Air Jordan 1 Low'
  }
];

const hiddenCollections = [
  {
    id: 'air-jordan-3',
    title: 'AIR JORDAN 3',
    image: '"https://res.cloudinary.com/dvy87ylmu/image/upload/v1752849102/collections/air-jordan-3.jpg"',
    link: '/catalog?model=Air Jordan 3'
  },
  {
    id: 'air-jordan-4',
    title: 'AIR JORDAN 4',
    image: '"https://res.cloudinary.com/dvy87ylmu/image/upload/v1752849103/collections/air-jordan-4.jpg"',
    link: '/catalog?model=Air Jordan 4'
  },
  {
    id: 'air-jordan-5',
    title: 'AIR JORDAN 5',
    image: '"https://res.cloudinary.com/dvy87ylmu/image/upload/v1752849105/collections/air-jordan-5.png"',
    link: '/catalog?model=Air Jordan 5'
  },
  {
    id: 'air-jordan-1-mid',
    title: 'AIR JORDAN 1 MID',
    image: '"https://res.cloudinary.com/dvy87ylmu/image/upload/v1752849100/collections/air-jordan-1-mid.png"',
    link: '/catalog?model=Air Jordan 1 Mid'
  },
  {
    id: 'air-jordan-1-high',
    title: 'AIR JORDAN 1 HIGH',
    image: '"https://res.cloudinary.com/dvy87ylmu/image/upload/v1752849098/collections/air-jordan-1-high.jpg"',
    link: '/catalog?model=Air Jordan 1 High'
  },
  {
    id: 'air-force-1-low',
    title: 'AIR FORCE 1 LOW',
    image: '"https://res.cloudinary.com/dvy87ylmu/image/upload/v1752849097/collections/air-force-1-low.jpg"',
    link: '/catalog?model=Air Force 1 Low'
  },
  {
    id: 'off-white',
    title: 'OFF WHITE',
    image: '"https://res.cloudinary.com/dvy87ylmu/image/upload/v1752849109/collections/off-white.jpg"',
    link: '/catalog?brand=Off-White'
  },
  {
    id: 'salomon',
    title: 'SALOMON',
    image: '"https://res.cloudinary.com/dvy87ylmu/image/upload/v1752849110/collections/salomon.jpg"',
    link: '/catalog?brand=Salomon'
  }
];

// Функция для перемешивания массива
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const Collections: React.FC = () => {
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(false);

  // Перемешиваем коллекции при каждом рендере компонента
  const shuffledInitialCollections = useMemo(() => shuffleArray(initialCollections), []);
  const shuffledHiddenCollections = useMemo(() => shuffleArray(hiddenCollections), []);

  const handleShowMore = () => {
    setLoading(true);
    setTimeout(() => {
      setShowMore((prev) => !prev);
      setLoading(false);
    }, 350);
  };

  return (
    <CollectionsWrapper>
      <CollectionsContainer>
        <CollectionsHeader>
          <CollectionsTitle>КОЛЕКЦІЇ</CollectionsTitle>
          <CollectionsSubtitle>Культові серії відомих брендів</CollectionsSubtitle>
        </CollectionsHeader>
        
        <CollectionsGrid>
          {shuffledInitialCollections.map(collection => (
            <CollectionCard key={collection.id} to={collection.link}>
              <CollectionImage bgImage={collection.image}>
                <CollectionOverlay>
                  <CollectionTitle>{collection.title}</CollectionTitle>
                </CollectionOverlay>
              </CollectionImage>
            </CollectionCard>
          ))}
        </CollectionsGrid>
        
        <LoadMoreButton onClick={handleShowMore} disabled={loading}>
          {loading && <Spinner />}
          {showMore ? 'Сховати' : 'Завантажити ще'}
        </LoadMoreButton>
        
        <HiddenCollectionsGrid isVisible={showMore}>
          {shuffledHiddenCollections.map(collection => (
            <CollectionCard key={collection.id} to={collection.link}>
              <CollectionImage bgImage={collection.image}>
                <CollectionOverlay>
                  <CollectionTitle>{collection.title}</CollectionTitle>
                </CollectionOverlay>
              </CollectionImage>
            </CollectionCard>
          ))}
        </HiddenCollectionsGrid>
      </CollectionsContainer>
    </CollectionsWrapper>
  );
};

export default Collections; 