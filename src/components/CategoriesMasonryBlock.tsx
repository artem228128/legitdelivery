import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const categories = [
  // Великий блок (2x2)
  {
    id: 'featured',
    label: 'NEW RELEASES',
    image: '"https://res.cloudinary.com/dvy87ylmu/image/upload/v1752849090/categories_masonry/featured.jpg"',
    link: '/catalog?filter=new',
    type: 'large'
  },
  // 4 квадратних блоки
  {
    id: 'sneakers',
    label: 'Кросівки',
    image: '"https://res.cloudinary.com/dvy87ylmu/image/upload/v1752849093/categories_masonry/sneakers.jpg"',
    link: '/catalog?category=sneakers',
    type: 'square'
  },
  {
    id: 'bags',
    label: 'Сумки',
    image: '"https://res.cloudinary.com/dvy87ylmu/image/upload/v1752849086/categories_masonry/bags.jpg"',
    link: '/catalog?category=bags',
    type: 'square'
  },
  {
    id: 'tshirts',
    label: 'Футболки',
    image: '"https://res.cloudinary.com/dvy87ylmu/image/upload/v1752849094/categories_masonry/tshirts.jpg"',
    link: '/catalog?category=tshirts',
    type: 'square'
  },
  {
    id: 'accessories',
    label: 'Аксесуари',
    image: '"https://res.cloudinary.com/dvy87ylmu/image/upload/v1752849086/categories_masonry/accessories.png"',
    link: '/catalog?category=accessories',
    type: 'square'
  },
  // 3 горизонтальних блоки
  {
    id: 'outerwear',
    label: 'Верхній одяг',
    image: '"https://res.cloudinary.com/dvy87ylmu/image/upload/v1752849092/categories_masonry/outerwear.png"',
    link: '/catalog?category=outerwear',
    type: 'horizontal'
  },
  {
    id: 'brands',
    label: 'ПРЕМІУМ БРЕНДИ',
    image: '"https://res.cloudinary.com/dvy87ylmu/image/upload/v1752849089/categories_masonry/brands.png"',
    link: '/catalog?filter=premium',
    type: 'horizontal'
  },
  {
    id: 'hoodies',
    label: 'Худі/світшоти',
    image: '"https://res.cloudinary.com/dvy87ylmu/image/upload/v1752849091/categories_masonry/hoodies.png"',
    link: '/catalog?category=hoodies',
    type: 'horizontal'
  }
];

const brands = [
  { label: 'Nike', link: '/catalog?brand=Nike' },
  { label: 'Adidas', link: '/catalog?brand=Adidas' },
  { label: 'Air Jordan', link: '/catalog?brand=Air Jordan' },
  { label: 'Yeezy', link: '/catalog?brand=Yeezy' },
  { label: 'New Balance', link: '/catalog?brand=New Balance' },
  { label: 'Off-White', link: '/catalog?brand=Off-White' },
];

const Container = styled.section`
  background: #f8f9fa;
  padding: 80px 0;
  
  @media (max-width: 768px) {
    padding: 60px 0;
  }
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Title = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 60px;
  color: var(--text-dark, #222);
  text-transform: uppercase;
  letter-spacing: 2px;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 40px;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
    margin-bottom: 30px;
  }
`;

const MasonryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 200px);
  gap: 20px;
  
  @media (max-width: 1200px) {
    grid-template-rows: repeat(2, 180px);
    gap: 16px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 160px);
    gap: 12px;
  }
  
  @media (max-width: 480px) {
    display: flex;
    overflow-x: auto;
    gap: 12px;
    padding: 0 20px;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    
    &::-webkit-scrollbar {
      height: 4px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 2px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: var(--primary-blue, #1E90FF);
      border-radius: 2px;
    }
  }
`;

const HorizontalRow = styled.div`
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 320px;
  gap: 20px;
  
  @media (max-width: 1200px) {
    gap: 16px;
    grid-template-rows: 280px;
  }
  
  @media (max-width: 768px) {
    gap: 12px;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(3, 280px);
  }
  
  @media (max-width: 480px) {
    display: flex;
    overflow-x: auto;
    gap: 12px;
    padding: 0 20px;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    
    &::-webkit-scrollbar {
      height: 4px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 2px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: var(--primary-blue, #1E90FF);
      border-radius: 2px;
    }
  }
`;

const CategoryCard = styled(Link)<{ $type: string }>`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  display: block;
  transition: all 0.3s ease;
  background: #f8f9fa;
  
  /* Layout based on type */
  ${props => props.$type === 'large' && `
    grid-column: span 2;
    grid-row: span 2;
  `}
  
  ${props => props.$type === 'square' && `
    grid-column: span 1;
    grid-row: span 1;
  `}
  
  ${props => props.$type === 'horizontal' && `
    grid-column: span 1;
    grid-row: span 1;
  `}
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 480px) {
    flex: 0 0 350px;
    height: 300px;
    scroll-snap-align: start;
    
    &:hover {
      transform: translateY(-2px);
    }
  }
`;

const CategoryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${CategoryCard}:hover & {
    transform: scale(1.05);
  }
`;

const CategoryOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0.1) 100%
  );
  display: flex;
  align-items: flex-end;
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const CategoryLabel = styled.h3<{ $type: string }>`
  color: white;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  
  ${props => props.$type === 'large' && `
    font-size: 2.5rem;
    
    @media (max-width: 1200px) {
      font-size: 2rem;
    }
    
    @media (max-width: 768px) {
      font-size: 1.8rem;
    }
    
    @media (max-width: 480px) {
      font-size: 1.8rem;
    }
  `}
  
  ${props => props.$type === 'square' && `
    font-size: 1.2rem;
    
    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
    
    @media (max-width: 480px) {
      font-size: 1.3rem;
    }
  `}
  
  ${props => props.$type === 'horizontal' && `
    font-size: 1.8rem;
    
    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
    
    @media (max-width: 480px) {
      font-size: 1.6rem;
    }
  `  }
`;

const BrandsRow = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 30px;
    margin-top: 30px;
  }
  
  @media (max-width: 480px) {
    gap: 20px;
    margin-top: 25px;
  }
`;

const BrandLink = styled(Link)`
  color: var(--text-dark, #222);
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  
  &:hover {
    border-color: var(--text-dark, #222);
    background: rgba(34, 34, 34, 0.05);
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 6px 12px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 5px 10px;
  }
`;

const ScrollHint = styled.div`
  text-align: center;
  margin: 20px 0;
  color: var(--text-light, #666);
  font-size: 0.9rem;
  font-weight: 500;
  animation: fadeInOut 3s ease-in-out;
  
  @keyframes fadeInOut {
    0%, 100% { opacity: 0; }
    20%, 80% { opacity: 1; }
  }
`;

const ScrollIcon = styled.span`
  display: inline-block;
  margin-left: 8px;
  animation: swipe 2s ease-in-out infinite;
  
  @keyframes swipe {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(10px); }
  }
`;

const CategoriesMasonryBlock: React.FC = () => {
  const [isMobile, setIsMobile] = React.useState(false);
  const [showScrollHint, setShowScrollHint] = React.useState(true);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  React.useEffect(() => {
    if (isMobile) {
      const handleScroll = () => {
        setShowScrollHint(false);
      };
      
      const gridElement = document.querySelector('[data-masonry-grid]');
      if (gridElement) {
        gridElement.addEventListener('scroll', handleScroll, { once: true });
        return () => gridElement.removeEventListener('scroll', handleScroll);
      }
    }
  }, [isMobile]);

  const topCategories = categories.filter(cat => cat.type !== 'horizontal');
  const horizontalCategories = categories.filter(cat => cat.type === 'horizontal');

  return (
    <Container>
      <Content>
        <Title>КАТЕГОРІЇ</Title>
        <MasonryGrid data-masonry-grid>
          {isMobile ? (
            // На мобільних - всі категорії в одному скролі
            <>
              {categories.map((category) => (
                <CategoryCard 
                  key={category.id} 
                  to={category.link}
                  $type={category.type}
                >
                  <CategoryImage 
                    src={category.image} 
                    alt={category.label}
                    loading="lazy"
                  />
                  <CategoryOverlay>
                    <CategoryLabel $type={category.type}>
                      {category.label}
                    </CategoryLabel>
                  </CategoryOverlay>
                </CategoryCard>
              ))}
            </>
          ) : (
            // На десктопі - розділений layout
            <>
              {topCategories.map((category) => (
                <CategoryCard 
                  key={category.id} 
                  to={category.link}
                  $type={category.type}
                >
                  <CategoryImage 
                    src={category.image} 
                    alt={category.label}
                    loading="lazy"
                  />
                  <CategoryOverlay>
                    <CategoryLabel $type={category.type}>
                      {category.label}
                    </CategoryLabel>
                  </CategoryOverlay>
                </CategoryCard>
              ))}
              
              <HorizontalRow>
                {horizontalCategories.map((category) => (
                  <CategoryCard 
                    key={category.id} 
                    to={category.link}
                    $type={category.type}
                  >
                    <CategoryImage 
                      src={category.image} 
                      alt={category.label}
                      loading="lazy"
                    />
                    <CategoryOverlay>
                      <CategoryLabel $type={category.type}>
                        {category.label}
                      </CategoryLabel>
                    </CategoryOverlay>
                  </CategoryCard>
                ))}
              </HorizontalRow>
            </>
          )}
        </MasonryGrid>
        
        {isMobile && (
          <ScrollHint>
            Свайп для перегляду
            <ScrollIcon>→</ScrollIcon>
          </ScrollHint>
        )}
        
        <BrandsRow>
          {brands.map((brand) => (
            <BrandLink key={brand.label} to={brand.link}>
              {brand.label}
            </BrandLink>
          ))}
        </BrandsRow>
      </Content>
    </Container>
  );
};

export default CategoriesMasonryBlock; 