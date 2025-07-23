import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, ShoppingCart, Heart, Calendar } from 'lucide-react';
import { getProductById } from '../data/products';
import { jsonProducts } from '../data/productLoader';
import { useCart } from '../context/CartContext';
import { Product } from '../types';

const ProductContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 120px 20px 24px 20px; /* Добавлен нижний отступ */
  
  @media (max-width: 768px) {
    padding: 100px 15px 18px 15px;
  }
  
  @media (max-width: 480px) {
    padding: 90px 12px 6px 12px; /* Меньший отступ на мобильном */
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  background: none;
  border: none;
  color: var(--text-light);
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    margin-bottom: 20px;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 15px;
    font-size: 0.85rem;
    gap: 8px;
  }
  
  &:hover {
    color: var(--primary-blue);
  }
`;

const ProductLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  margin-bottom: 24px; /* Добавлен нижний отступ */
  align-items: start;
  
  @media (max-width: 1200px) {
    gap: 50px;
  }
  
  @media (max-width: 900px) {
    grid-template-columns: 45% 55%;
    gap: 40px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
    margin-bottom: 18px;
  }
  
  @media (max-width: 480px) {
    gap: 20px;
    margin-bottom: 6px; /* Меньший отступ на мобильном */
  }
`;

const ImageSection = styled.div`
  position: sticky;
  top: 100px;
  height: fit-content;
  
  @media (max-width: 900px) {
    position: relative;
    top: auto;
  }
`;

const MainImage = styled.div<{ bgImage: string }>`
  width: 100%;
  height: 400px;
  background: url(${props => props.bgImage}) center no-repeat;
  background-size: contain;
  background-color: #ffffff;
  border-radius: 20px;
  margin-bottom: 20px;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 1200px) {
    height: 380px;
  }
  
  @media (max-width: 900px) {
    height: 350px;
    border-radius: 15px;
  }
  
  @media (max-width: 768px) {
    height: 300px;
    border-radius: 12px;
    margin-bottom: 15px;
  }
  
  @media (max-width: 480px) {
    height: 250px;
    border-radius: 10px;
    margin-bottom: 12px;
  }
`;

const ImageGallery = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  
  @media (max-width: 1200px) {
    gap: 10px;
  }
  
  @media (max-width: 768px) {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 10px;
    gap: 8px;
    
    &::-webkit-scrollbar {
      height: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: var(--primary-blue);
      border-radius: 10px;
    }
  }
  
  @media (max-width: 480px) {
    gap: 6px;
  }
`;

const ThumbnailImage = styled.div<{ $bgImage: string; $active: boolean }>`
  width: 80px;
  height: 80px;
  background: url(${props => props.$bgImage}) center no-repeat;
  background-size: contain;
  background-color: #ffffff;
  border-radius: 12px;
  cursor: pointer;
  border: 3px solid ${props => props.$active ? 'var(--primary-blue)' : 'transparent'};
  transition: all 0.3s ease;
  flex-shrink: 0;
  
  @media (max-width: 1200px) {
    width: 75px;
    height: 75px;
    border-radius: 10px;
  }
  
  @media (max-width: 900px) {
    width: 70px;
    height: 70px;
    border-radius: 8px;
  }
  
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    border-radius: 6px;
    border-width: 2px;
  }
  
  @media (max-width: 600px) {
    width: 45px;
    height: 45px;
    border-radius: 5px;
    border-width: 2px;
  }
  
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    border-radius: 4px;
    border-width: 2px;
  }
  
  @media (max-width: 400px) {
    width: 35px;
    height: 35px;
    border-radius: 3px;
    border-width: 1px;
  }
  
  &:hover {
    border-color: var(--primary-blue);
  }
`;

const ProductInfo = styled.div`
  h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    color: var(--text-dark);
    line-height: 1.2;
    
    @media (max-width: 900px) {
      font-size: 2rem;
    }
    
    @media (max-width: 768px) {
      font-size: 1.8rem;
      margin-bottom: 8px;
    }
    
    @media (max-width: 480px) {
      font-size: 1.5rem;
      margin-bottom: 6px;
    }
  }
  
  .brand {
    font-size: 1.2rem;
    color: var(--text-light);
    margin-bottom: 20px;
    
    @media (max-width: 768px) {
      font-size: 1rem;
      margin-bottom: 15px;
    }
    
    @media (max-width: 480px) {
      font-size: 0.9rem;
      margin-bottom: 12px;
    }
  }
  
  .description {
    font-size: 1.1rem;
    line-height: 1.6;
    color: var(--text-dark);
    margin-bottom: 30px;
    
    @media (max-width: 768px) {
      font-size: 1rem;
      margin-bottom: 20px;
      line-height: 1.5;
    }
    
    @media (max-width: 480px) {
      font-size: 0.9rem;
      margin-bottom: 15px;
      line-height: 1.4;
    }
  }
`;

const PriceSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 10px;
    margin-bottom: 20px;
  }
  
  @media (max-width: 480px) {
    gap: 8px;
    margin-bottom: 15px;
  }
  
  .current-price {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--primary-blue);
    
    @media (max-width: 900px) {
      font-size: 2rem;
    }
    
    @media (max-width: 768px) {
      font-size: 1.8rem;
    }
    
    @media (max-width: 480px) {
      font-size: 1.5rem;
    }
  }
  
  .original-price {
    font-size: 1.5rem;
    color: var(--text-light);
    text-decoration: line-through;
    
    @media (max-width: 900px) {
      font-size: 1.2rem;
    }
    
    @media (max-width: 768px) {
      font-size: 0.9rem;
    }
    
    @media (max-width: 600px) {
      font-size: 0.8rem;
    }
    
    @media (max-width: 480px) {
      font-size: 0.75rem;
    }
    
    @media (max-width: 400px) {
      font-size: 0.7rem;
    }
  }
  
  .discount {
    background: var(--success-green);
    color: white;
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 0.9rem;
    font-weight: 600;
    
    @media (max-width: 768px) {
      padding: 2px 4px;
      font-size: 0.6rem;
      border-radius: 6px;
    }
    
    @media (max-width: 400px) {
      font-size: 0.55rem;
      padding: 1px 3px;
    }
  }
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    margin-bottom: 20px;
    gap: 8px;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 15px;
    gap: 6px;
  }
  
  .stars {
    display: flex;
    gap: 2px;
  }
  
  .rating-text {
    color: var(--text-light);
    
    @media (max-width: 768px) {
      font-size: 0.9rem;
    }
    
    @media (max-width: 480px) {
      font-size: 0.8rem;
    }
  }
`;

const ReleaseDate = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  padding: 8px 12px;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 215, 0, 0.3);
  
  @media (max-width: 768px) {
    margin-bottom: 15px;
    padding: 6px 10px;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 12px;
    padding: 5px 8px;
  }
  
  .release-icon {
    color: var(--primary-yellow);
    font-size: 1.1rem;
    
    @media (max-width: 480px) {
      font-size: 1rem;
    }
  }
  
  .release-text {
    font-size: 0.9rem;
    color: var(--text-dark);
    font-weight: 500;
    
    @media (max-width: 480px) {
      font-size: 0.8rem;
    }
  }
  
  .release-date {
    font-size: 0.9rem;
    color: var(--text-light);
    
    @media (max-width: 480px) {
      font-size: 0.8rem;
    }
  }
`;

const OptionsSection = styled.div`
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 15px;
  }
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: 15px;
    color: var(--text-dark);
    
    @media (max-width: 768px) {
      font-size: 1rem;
      margin-bottom: 10px;
    }
    
    @media (max-width: 480px) {
      font-size: 0.9rem;
      margin-bottom: 8px;
    }
  }
`;

const SizeOptions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    gap: 8px;
    margin-bottom: 15px;
  }
  
  @media (max-width: 480px) {
    gap: 6px;
    margin-bottom: 12px;
  }
`;

const SizeButton = styled.button<{ $active: boolean }>`
  padding: 10px 15px;
  border: 2px solid ${props => props.$active ? 'var(--primary-blue)' : 'var(--border-light)'};
  background: ${props => props.$active ? 'var(--primary-blue)' : 'white'};
  color: ${props => props.$active ? 'white' : 'var(--text-dark)'};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  min-width: 44px;
  
  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 0.9rem;
    min-width: 40px;
    min-height: 40px;
  }
  
  @media (max-width: 480px) {
    padding: 6px 10px;
    font-size: 0.8rem;
    min-width: 36px;
    min-height: 36px;
  }
  
  &:hover:not(:disabled) {
    border-color: var(--primary-blue);
  }
  
  &:disabled {
    background: var(--bg-light);
    border-color: var(--border-light);
    color: var(--text-light);
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const ColorOptions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  
  @media (max-width: 600px) {
    gap: 9px;
  }
  
  @media (max-width: 480px) {
    gap: 8px;
  }
  
  @media (max-width: 400px) {
    gap: 2px;
    margin-bottom: 3px;
  }
`;

const ColorButton = styled.button<{ color: string; $active: boolean }>`
  width: 40px;
  height: 40px;
  border: 3px solid ${props => props.$active ? 'var(--primary-blue)' : 'var(--border-light)'};
  background: ${props => {
    const colorMap: { [key: string]: string } = {
      'Белый': '#ffffff',
      'Черный': '#000000',
      'Синий': '#0000ff',
      'Красный': '#ff0000',
      'Зеленый': '#00ff00',
      'Серый': '#808080',
      'Желтый': '#ffff00'
    };
    return colorMap[props.color] || '#cccccc';
  }};
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }
  
  @media (max-width: 600px) {
    width: 34px;
    height: 34px;
  }
  
  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    border-width: 2px;
  }
  
  @media (max-width: 400px) {
    width: 28px;
    height: 28px;
    border-width: 1.5px;
  }
  
  &:hover {
    border-color: var(--primary-blue);
  }
`;

const SizeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  
  h3 {
    margin: 0;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 12px;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 10px;
  }
`;

const SizeGuideLink = styled(Link)`
  color: var(--primary-blue);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  transition: color 0.3s ease;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
  
  &:hover {
    color: #4169E1;
    text-decoration: underline;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 0; /* Убираем отступ снизу */
  flex-direction: row; /* Всегда в строку */
  
  @media (max-width: 768px) {
    gap: 12px;
    margin-bottom: 0;
  }
  
  @media (max-width: 480px) {
    gap: 10px;
    margin-bottom: 0;
  }
`;

const AddToCartButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: var(--primary-blue);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 50px;
  
  @media (max-width: 768px) {
    padding: 12px 24px;
    font-size: 1rem;
    min-height: 45px;
    gap: 8px;
  }
  
  @media (max-width: 480px) {
    padding: 10px 20px;
    font-size: 0.9rem;
    min-height: 40px;
    gap: 6px;
  }
  
  &:hover {
    background: #4169E1;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(30, 144, 255, 0.3);
  }
  
  &:disabled {
    background: var(--text-light);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  svg {
    @media (max-width: 900px) {
      width: 12px;
      height: 12px;
    }
    
    @media (max-width: 768px) {
      width: 10px;
      height: 10px;
    }
    
    @media (max-width: 600px) {
      width: 9px;
      height: 9px;
    }
    
    @media (max-width: 480px) {
      width: 8px;
      height: 8px;
    }
    
    @media (max-width: 400px) {
      width: 7px;
      height: 7px;
    }
  }
`;

const SecondaryButton = styled.button`
  padding: 15px 20px;
  background: white;
  border: 2px solid var(--border-light);
  color: var(--text-dark);
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 50px;
  
  @media (max-width: 768px) {
    padding: 12px 18px;
    min-height: 48px;
  }
  
  @media (max-width: 600px) {
    padding: 11px 16px;
    min-height: 46px;
  }
  
  @media (max-width: 480px) {
    padding: 10px 15px;
    min-height: 44px;
  }
  
  @media (max-width: 400px) {
    padding: 8px 12px;
    min-height: 40px;
  }
  
  &:hover {
    border-color: var(--primary-blue);
    color: var(--primary-blue);
  }
  
  svg {
    @media (max-width: 768px) {
      width: 18px;
      height: 18px;
    }
    
    @media (max-width: 600px) {
      width: 17px;
      height: 17px;
    }
    
    @media (max-width: 480px) {
      width: 16px;
      height: 16px;
    }
  }
`;

const NotFound = styled.div`
  text-align: center;
  padding: 100px 20px;
  
  h1 {
    font-size: 2rem;
    color: var(--text-dark);
    margin-bottom: 20px;
  }
  
  p {
    color: var(--text-light);
    margin-bottom: 30px;
  }
`;

const SimilarProductsSection = styled.section`
  margin-top: 60px;
  padding: 40px 0;
  background: var(--bg-light);
  
  @media (max-width: 768px) {
    margin-top: 40px;
    padding: 30px 0;
  }
  
  @media (max-width: 480px) {
    margin-top: 30px;
    padding: 20px 0;
  }
  
  h2 {
    text-align: center;
    font-size: 2rem;
    color: var(--text-dark);
    margin-bottom: 30px;
    
    @media (max-width: 768px) {
      font-size: 1.5rem;
      margin-bottom: 20px;
    }
    
    @media (max-width: 480px) {
      font-size: 1.3rem;
      margin-bottom: 15px;
    }
  }
`;

const SimilarProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 15px;
    padding: 0 15px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 10px;
    padding: 0 10px;
  }
`;

const SimilarProductCard = styled(Link)`
  display: block;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const SimilarProductImage = styled.div<{ bgImage: string }>`
  width: 100%;
  height: 200px;
  background-image: url(${props => props.bgImage});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #f8f9fa;
  
  @media (max-width: 768px) {
    height: 150px;
  }
  
  @media (max-width: 480px) {
    height: 120px;
  }
`;

const SimilarProductInfo = styled.div`
  padding: 12px;
  
  @media (max-width: 768px) {
    padding: 10px;
  }
  
  @media (max-width: 480px) {
    padding: 8px;
  }
  
  h3 {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-dark);
    margin: 0 0 4px 0;
    line-height: 1.2;
    
    @media (max-width: 480px) {
      font-size: 0.8rem;
    }
  }
  
  .brand {
    font-size: 0.8rem;
    color: var(--text-light);
    margin-bottom: 6px;
    
    @media (max-width: 480px) {
      font-size: 0.75rem;
    }
  }
  
  .price {
    font-size: 1rem;
    font-weight: 700;
    color: var(--primary-blue);
    
    @media (max-width: 480px) {
      font-size: 0.9rem;
    }
  }
`;

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [iconSize, setIconSize] = useState(22);

  // Все возможные размеры обуви
  // Функция для получения размеров в зависимости от категории
  const getSizesForCategory = (category?: string): string[] => {
    if (category === 'Худі/світшоти' || category === 'Футболки' || category === 'Верхній одяг') {
      return ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    }
    // Для кросівок и других категорий (включая Off-White)
    return ['36', '36.5', '37.5', '38', '38.5', '39', '40', '40.5', '41', '42', '42.5', '43', '44', '44.5', '45', '46', '46.5', '47', '47.5'];
  };

  const allSizes = getSizesForCategory(product?.category);

  useEffect(() => {
    if (id) {
      console.log('Loading product with ID:', id);
      const foundProduct = getProductById(id);
      console.log('Found product:', foundProduct);
      setProduct(foundProduct || null);
      setIsLoading(false);
      
      if (foundProduct) {
        setSelectedColor(foundProduct.colors?.[0] || '');
      }
    } else {
      console.log('No product ID provided');
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const updateIconSize = () => {
      if (window.innerWidth <= 480) setIconSize(20); // Увеличено с 18 до 20
      else if (window.innerWidth <= 768) setIconSize(20);
      else setIconSize(22);
    };
    updateIconSize();
    window.addEventListener('resize', updateIconSize);
    return () => window.removeEventListener('resize', updateIconSize);
  }, []);

  const handleAddToCart = () => {
    if (product && selectedSize) {
      addToCart(product, selectedSize, 1, selectedColor);
      // You could show a toast notification here
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // --- Избранное ---
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const isFavorite = product ? favorites.includes(product.id) : false;
  const toggleFavorite = () => {
    if (!product) return;
    setFavorites(prev => {
      let newFavorites;
      if (prev.includes(product.id)) {
        newFavorites = prev.filter(id => id !== product.id);
      } else {
        newFavorites = [...prev, product.id];
      }
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  if (isLoading) {
    return (
      <ProductContainer>
        <p>Завантаження...</p>
      </ProductContainer>
    );
  }

  if (!product) {
    return (
      <ProductContainer>
        <NotFound>
          <h1>Товар не знайдено</h1>
          <p>Вибачте, запитуваний товар не існує</p>
          <AddToCartButton onClick={handleGoBack}>
            Повернутися назад
          </AddToCartButton>
        </NotFound>
      </ProductContainer>
    );
  }

  const images = product.images || [product.image];
  const currentImage = images[currentImageIndex];
  
  const discount = product.originalPrice ? 
    Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  // Функция для форматирования даты релиза
  const formatReleaseDate = (dateString: string): string => {
    if (!dateString) return '';
    
    try {
      // Улучшенная обработка даты для iPhone
      let date: Date;
      
      // Пробуем разные форматы даты для лучшей совместимости с iPhone
      if (dateString.includes('-')) {
        // Проверяем формат MM-DD-YYYY (как в данных)
        const parts = dateString.split('-');
        if (parts.length === 3) {
          const month = parseInt(parts[0]) - 1; // месяцы в JS начинаются с 0
          const day = parseInt(parts[1]);
          const year = parseInt(parts[2]);
          date = new Date(year, month, day, 0, 0, 0, 0);
        } else {
          // Формат YYYY-MM-DD - добавляем время для лучшей совместимости
          date = new Date(dateString + 'T00:00:00.000Z');
        }
      } else if (dateString.includes('/')) {
        // Формат MM/DD/YYYY или DD/MM/YYYY
        const parts = dateString.split('/');
        if (parts.length === 3) {
          // Предполагаем формат MM/DD/YYYY для лучшей совместимости
          const month = parseInt(parts[0]) - 1; // месяцы в JS начинаются с 0
          const day = parseInt(parts[1]);
          const year = parseInt(parts[2]);
          date = new Date(year, month, day, 0, 0, 0, 0);
        } else {
          date = new Date(dateString);
        }
      } else {
        // Пробуем стандартный парсинг
        date = new Date(dateString);
      }
      
      // Если дата невалидная, возвращаем исходную строку
      if (isNaN(date.getTime())) {
        return dateString;
      }
      
      // Используем более простой формат для лучшей совместимости
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      
      // Пробуем украинскую локализацию, если не работает - используем английскую
      try {
        return date.toLocaleDateString('uk-UA', options);
      } catch {
        return date.toLocaleDateString('en-US', options);
      }
    } catch (error) {
      // В случае любой ошибки возвращаем исходную строку
      return dateString;
    }
  };

  // Получаем похожие продукты (той же модели, но разные цвета/версии)
  const similarProducts = jsonProducts
    .filter((p: Product) => p.model === product.model && p.id !== product.id)
    .slice(0, 4);

  return (
    <ProductContainer>
      <BackButton onClick={handleGoBack}>
        <ArrowLeft size={20} />
        Назад до каталогу
      </BackButton>
      
      <ProductLayout>
        <ImageSection>
          <MainImage bgImage={currentImage} />
          {images.length > 1 && (
            <ImageGallery>
              {images.map((image, index) => (
                <ThumbnailImage
                  key={index}
                  $bgImage={image}
                  $active={index === currentImageIndex}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </ImageGallery>
          )}
        </ImageSection>
        
        <ProductInfo>
          <h1>{product.name}</h1>
          <div className="brand">{product.brand}</div>
          <div className="description">{product.description}</div>
          
          <PriceSection>
            <span className="current-price">{product.price.toLocaleString()} ₴</span>
            {product.originalPrice && (
              <>
                <span className="original-price">{product.originalPrice.toLocaleString()} ₴</span>
                <span className="discount">-{discount}%</span>
              </>
            )}
          </PriceSection>
          

          
          {product.releaseDate && (
            <ReleaseDate>
              <Calendar size={16} className="release-icon" />
              <span className="release-text">Дата релізу:</span>
              <span className="release-date">{formatReleaseDate(product.releaseDate)}</span>
            </ReleaseDate>
          )}
          
          <OptionsSection>
            <SizeHeader>
              <h3>Розмір</h3>
              <SizeGuideLink to="/size-guide">
                Не знаєте свій розмір?
              </SizeGuideLink>
            </SizeHeader>
            <SizeOptions>
              {allSizes.map(size => (
                <SizeButton
                  key={size}
                  $active={selectedSize === size}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </SizeButton>
              ))}
            </SizeOptions>
          </OptionsSection>
          
          {product.colors && product.colors.length > 0 && (
            <OptionsSection>
              <h3>Колір</h3>
              <ColorOptions>
                {product.colors.map(color => (
                  <ColorButton
                    key={color}
                    color={color}
                    $active={selectedColor === color}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </ColorOptions>
            </OptionsSection>
          )}
          
          <ActionButtons>
            <AddToCartButton
              onClick={handleAddToCart}
              disabled={!selectedSize || !product.inStock}
            >
              <ShoppingCart size={iconSize} />
              {product.inStock ? 'Додати в кошик' : 'Немає в наявності'}
            </AddToCartButton>
            <SecondaryButton
              onClick={toggleFavorite}
              style={{
                background: isFavorite ? 'var(--primary-yellow)' : 'white',
                borderColor: isFavorite ? 'var(--primary-yellow)' : 'var(--border-light)',
                transition: 'all 0.3s',
              }}
              aria-label={isFavorite ? 'Видалити з вибраного' : 'Додати в вибране'}
            >
              <Heart
                size={20}
                fill={isFavorite ? 'var(--text-dark)' : 'none'}
                stroke={isFavorite ? 'var(--text-dark)' : 'var(--text-dark)'}
                strokeWidth={2}
              />
            </SecondaryButton>
            {/* Кнопка поделиться удалена */}
          </ActionButtons>
          {/* Удалён блок Features */}
        </ProductInfo>
      </ProductLayout>
      
      {/* Секция похожих моделей */}
      <SimilarProductsSection>
        <h2>Схожі моделі</h2>
        <SimilarProductsGrid>
          {similarProducts.map(similarProduct => (
            <SimilarProductCard key={similarProduct.id} to={`/product/${similarProduct.id}`}>
              <SimilarProductImage bgImage={similarProduct.image} />
              <SimilarProductInfo>
                <h3>{similarProduct.name}</h3>
                <div className="brand">{similarProduct.brand}</div>
                <div className="price">₴{similarProduct.price.toLocaleString()}</div>
              </SimilarProductInfo>
            </SimilarProductCard>
          ))}
        </SimilarProductsGrid>
      </SimilarProductsSection>
    </ProductContainer>
  );
};

export default ProductPage; 