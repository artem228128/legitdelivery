import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const categories = [
  {
    label: 'Кросівки',
    image: '/images/categories_grid/sneakers.jpg',
    link: '/catalog?category=sneakers',
  },
  {
    label: 'Сумки',
    image: '/images/categories_grid/bags.jpg',
    link: '/catalog?category=bags',
  },
  {
    label: 'Аксесуари',
    image: '/images/categories_grid/accessories.jpg',
    link: '/catalog?category=accessories',
  },
  {
    label: 'SALE',
    image: '/images/categories_grid/sale.jpg',
    link: '/catalog?filter=sale',
  },
  {
    label: 'NEW RELEASES',
    image: '/images/categories_grid/new-releases.jpg',
    link: '/catalog?filter=new',
  },
  {
    label: 'Футболки',
    image: '/images/categories_grid/tshirts.jpg',
    link: '/catalog?category=tshirts',
  },
  {
    label: 'Верхній одяг',
    image: '/images/categories_grid/outerwear.jpg',
    link: '/catalog?category=outerwear',
  },
  {
    label: 'Худі/світшоти',
    image: '/images/categories_grid/hoodies.jpg',
    link: '/catalog?category=hoodies',
  },
];

const brands = [
  { label: 'Nike', link: '/catalog?brand=Nike' },
  { label: 'Adidas', link: '/catalog?brand=Adidas' },
  { label: 'Air Jordan', link: '/catalog?brand=Air Jordan' },
  { label: 'Yeezy', link: '/catalog?brand=Yeezy' },
  { label: 'New Balance', link: '/catalog?brand=New Balance' },
  { label: 'Off-White', link: '/catalog?brand=Off-White' },
];

const BlockWrapper = styled.section`
  width: 100%;
  background: #f8f9fa;
  padding: 40px 0 40px 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 28px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 1024px) {
    gap: 18px;
  }
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 16px;
  }
  @media (max-width: 480px) {
    gap: 10px;
    padding: 0 6px;
  }
`;

const Card = styled(Link)`
  display: block;
  position: relative;
  width: 100%;
  height: 220px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 16px rgba(0,0,0,0.07);
  text-decoration: none;
  transition: box-shadow 0.2s, transform 0.2s;
  cursor: pointer;
  background: #222;

  &:hover {
    box-shadow: 0 8px 32px rgba(0,0,0,0.13);
    transform: translateY(-4px) scale(1.02);
  }
  @media (max-width: 900px) {
    height: 140px;
  }
  @media (max-width: 480px) {
    height: 90px;
  }
`;

const CardImage = styled.div<{ $src: string }>`
  width: 100%;
  height: 100%;
  background: url(${props => props.$src}) center center/cover no-repeat;
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 1;
`;

const CardLabel = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 2;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 700;
  padding: 18px 22px 14px 16px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.45);
  letter-spacing: 0.01em;
  background: linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,0.55) 100%);
  border-radius: 0 0 0 12px;
  @media (max-width: 900px) {
    font-size: 1rem;
    padding: 10px 12px 8px 10px;
  }
  @media (max-width: 480px) {
    font-size: 0.95rem;
    padding: 7px 8px 7px 7px;
  }
`;

const BrandRow = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 18px;
  max-width: 1200px;
  margin: 38px auto 0 auto;
  padding: 0 20px;
  @media (max-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-top: 22px;
  }
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin-top: 12px;
    padding: 0 6px;
  }
`;

const BrandLink = styled(Link)`
  color: #222;
  font-size: 1.15rem;
  font-weight: 700;
  text-decoration: none;
  padding: 10px 0;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 1px 6px rgba(0,0,0,0.06);
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  letter-spacing: 0.01em;
  text-align: center;
  width: 100%;
  display: block;
  &:hover {
    background: #222;
    color: #fff;
    box-shadow: 0 4px 16px rgba(0,0,0,0.13);
  }
  @media (max-width: 900px) {
    font-size: 1rem;
    padding: 8px 0;
  }
  @media (max-width: 480px) {
    font-size: 0.97rem;
    padding: 7px 0;
  }
`;

const CategoriesGridBlock: React.FC = () => (
  <BlockWrapper>
    <Grid>
      {categories.map(cat => (
        <Card to={cat.link} key={cat.label}>
          <CardImage $src={cat.image} />
          <CardLabel>{cat.label}</CardLabel>
        </Card>
      ))}
    </Grid>
    <BrandRow>
      {brands.map(brand => (
        <BrandLink to={brand.link} key={brand.label}>{brand.label}</BrandLink>
      ))}
    </BrandRow>
  </BlockWrapper>
);

export default CategoriesGridBlock; 