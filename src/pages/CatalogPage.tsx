import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { Filter, Grid, List, X, ChevronDown, ChevronUp, Heart } from 'lucide-react';
import { products, brands, models } from '../data/products';
import { Product, FilterOptions, SortOptions } from '../types';

const CatalogContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 120px 20px 40px 20px; /* Добавил отступ сверху для sticky header */
  
  @media (max-width: 768px) {
    padding: 100px 15px 40px 15px;
  }
  
  @media (max-width: 480px) {
    padding: 90px 10px 30px 10px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  
  h1 {
    font-size: 2.5rem;
    color: var(--text-dark);
    
    @media (max-width: 768px) {
      font-size: 2rem;
    }
    
    @media (max-width: 480px) {
      font-size: 1.7rem;
    }
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
    margin-bottom: 30px;
  }
`;

const ViewControls = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  
  @media (max-width: 768px) {
    gap: 10px;
  }
  
  @media (max-width: 480px) {
    flex-wrap: wrap;
    gap: 8px;
  }
`;

const ViewButton = styled.button<{ $active: boolean }>`
  padding: 8px 12px;
  border: 2px solid ${props => props.$active ? 'var(--primary-blue)' : 'var(--border-light)'};
  background: ${props => props.$active ? 'var(--primary-blue)' : 'transparent'};
  color: ${props => props.$active ? 'white' : 'var(--text-dark)'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--primary-blue);
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background: var(--primary-yellow);
  color: var(--text-dark);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #FFE55C;
  }
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const FilterSidebar = styled.div<{ $isOpen: boolean }>`
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: white;
    z-index: 2000;
    padding: 20px;
    overflow-y: auto;
    transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    transition: transform 0.3s ease;
    pointer-events: auto;
    
    .filter-sections {
      margin-top: 40px;
    }
  }
`;

const FilterSection = styled.div`
  margin-bottom: 30px;
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: 15px;
    color: var(--text-dark);
    
    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
    
    @media (max-width: 480px) {
      font-size: 1rem;
      margin-bottom: 12px;
    }
  }
  
  @media (max-width: 768px) {
    margin-bottom: 25px;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 20px;
  }
`;

const FilterOption = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  
  input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid var(--border-light);
    border-radius: 4px;
    outline: none;
    cursor: pointer;
    position: relative;
    transition: all 0.2s ease;
    flex-shrink: 0; /* Предотвращает сжатие чекбокса */
    
    &:checked {
      background: var(--primary-yellow);
      border-color: var(--primary-yellow);
      
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 5px;
        height: 10px;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: translate(-50%, -60%) rotate(45deg); /* Центрирование галочки */
      }
    }
    
    &:hover {
      border-color: var(--primary-yellow);
    }
  }
  
  span {
    color: var(--text-dark);
    font-size: 0.95rem;
  }
  
  &:hover span {
    color: var(--primary-blue);
  }
`;

const PriceRange = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  
  input {
    width: 80px;
    padding: 8px;
    border: 1px solid var(--border-light);
    border-radius: 4px;
    text-align: center;
    font-size: 0.9rem;
    
    &:focus {
      outline: none;
      border-color: var(--primary-yellow);
    }
  }
  
  .apply-price {
    background: var(--primary-yellow);
    border: none;
    color: var(--text-dark);
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: 600;
    
    &:hover {
      background: #FFE55C;
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  .reset-price {
    background: none;
    border: 1px solid var(--border-light);
    color: var(--text-light);
    padding: 6px 10px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
    
    &:hover {
      border-color: var(--primary-blue);
      color: var(--primary-blue);
    }
  }
`;

const ClearFilters = styled.button`
  background: none;
  border: 1px solid var(--border-light);
  color: var(--text-light);
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  
  &:hover {
    border-color: var(--primary-blue);
    color: var(--primary-blue);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  z-index: 2100;
  @media (min-width: 769px) {
    display: none;
  }
`;

const ProductsSection = styled.div``;

const ProductsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  
  select {
    padding: 8px 12px;
    border: 1px solid var(--border-light);
    border-radius: 4px;
    background: white;
    color: var(--text-dark);
    cursor: pointer;
  }
`;

const ProductGrid = styled.div<{ view: 'grid' | 'list' }>`
  display: grid;
  grid-template-columns: ${props => props.view === 'grid' ? 'repeat(3, 1fr)' : '1fr'};
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: ${props => props.view === 'grid' ? 'repeat(2, 1fr)' : '1fr'};
    gap: 15px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: ${props => props.view === 'grid' ? 'repeat(2, 1fr)' : '1fr'};
    gap: 12px;
  }
`;

const ProductCard = styled(Link)<{ view: 'grid' | 'list' }>`
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  display: ${props => props.view === 'list' ? 'flex' : 'block'};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 768px) {
    border-radius: 12px;
    display: block; /* Всегда блочный на мобильных */
  }
  
  @media (max-width: 480px) {
    border-radius: 10px;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
    }
  }
`;

const ProductImage = styled.div<{ bgImage: string; view: 'grid' | 'list' }>`
  height: ${props => props.view === 'grid' ? '200px' : '150px'};
  width: ${props => props.view === 'list' ? '200px' : '100%'};
  background: url(${props => props.bgImage}) center no-repeat;
  background-size: contain;
  background-color: #ffffff;
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: 180px;
    width: 100%;
  }
  
  @media (max-width: 480px) {
    height: 160px;
  }
`;

const HeartButton = styled.button<{ isFavorite: boolean }>`
  position: absolute;
  top: 10px;
  right: 10px;
  background: ${props => props.isFavorite ? 'var(--primary-yellow)' : 'rgba(255, 255, 255, 0.9)'};
  border: 2px solid ${props => props.isFavorite ? 'var(--primary-yellow)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
  
  &:hover {
    background: ${props => props.isFavorite ? 'var(--primary-yellow)' : 'white'};
    border-color: var(--primary-yellow);
    transform: scale(1.1);
  }
  
  svg {
    width: 18px;
    height: 18px;
    fill: ${props => props.isFavorite ? 'var(--text-dark)' : 'transparent'};
    stroke: ${props => props.isFavorite ? 'var(--text-dark)' : 'var(--text-dark)'};
    stroke-width: 2;
  }
  
  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
  
  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
    
    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const ProductInfo = styled.div<{ view: 'grid' | 'list' }>`
  padding: 20px;
  flex: 1;
  
  @media (max-width: 768px) {
    padding: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
  }
  
  h3 {
    font-size: 1.3rem;
    margin-bottom: 10px;
    color: var(--text-dark);
    
    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
    
    @media (max-width: 480px) {
      font-size: 1rem;
    }
  }
  
  .brand {
    color: var(--text-light);
    margin-bottom: 15px;
    
    @media (max-width: 480px) {
      font-size: 0.9rem;
      margin-bottom: 10px;
    }
  }
  
  .price {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-blue);
    margin-bottom: 10px;
  }
  
  .description {
    color: var(--text-light);
    font-size: 0.9rem;
    display: ${props => props.view === 'list' ? 'block' : 'none'};
  }
  
  .release-date {
    color: var(--primary-yellow);
    font-size: 0.8rem;
    font-weight: 500;
    margin-bottom: 8px;
    
    @media (max-width: 480px) {
      font-size: 0.7rem;
    }
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 60px 20px;
  
  h3 {
    font-size: 1.5rem;
    color: var(--text-dark);
    margin-bottom: 15px;
  }
  
  p {
    color: var(--text-light);
    margin-bottom: 30px;
  }
`;

type NonNullableProduct = Omit<Product, 'model'> & { model: string };

// Фиксированное общее количество товаров
const TOTAL_PRODUCTS_COUNT = products.length;

const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(() => {
    const pageParam = searchParams.get('page');
    return pageParam ? parseInt(pageParam, 10) : 1;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    brands: [],
    models: [],
    priceRange: [0, 100000],
    sizes: [],
    inStock: true
  });
  
  // Состояние для отображения в инпутах
  const [priceInputs, setPriceInputs] = useState({
    min: '',
    max: ''
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  const [sortBy, setSortBy] = useState<SortOptions>({
    sortBy: 'newest',
    order: 'desc'
  });

  // Update the models array to only include non-null values
  const allModels = Array.from(new Set(products
    .map(p => p.model)
    .filter((model): model is string => model !== undefined && model !== null)));

  // Filter models based on selected brands
  const filteredModels = useMemo(() => {
    if (filters.brands.length === 0) {
      return allModels;
    }
    
    return Array.from(new Set(products
      .filter(product => filters.brands.includes(product.brand))
      .map(p => p.model)
      .filter((model): model is string => model !== undefined && model !== null)));
  }, [filters.brands]);

  const models = filteredModels;

  // Функция для определения новых релизов (за последние 3 месяца от 23.7.25)
  const isNewRelease = (releaseDate: string): boolean => {
    if (!releaseDate) return false;
    
    try {
      // Улучшенная обработка даты для iPhone
      let release: Date;
      
      // Пробуем разные форматы даты для лучшей совместимости с iPhone
      if (releaseDate.includes('-')) {
        // Проверяем формат MM-DD-YYYY (как в данных)
        const parts = releaseDate.split('-');
        if (parts.length === 3) {
          const month = parseInt(parts[0]) - 1; // месяцы в JS начинаются с 0
          const day = parseInt(parts[1]);
          const year = parseInt(parts[2]);
          release = new Date(year, month, day, 0, 0, 0, 0);
        } else {
          // Формат YYYY-MM-DD - добавляем время для лучшей совместимости
          release = new Date(releaseDate + 'T00:00:00.000Z');
        }
      } else if (releaseDate.includes('/')) {
        // Формат MM/DD/YYYY или DD/MM/YYYY
        const parts = releaseDate.split('/');
        if (parts.length === 3) {
          // Предполагаем формат MM/DD/YYYY для лучшей совместимости
          const month = parseInt(parts[0]) - 1; // месяцы в JS начинаются с 0
          const day = parseInt(parts[1]);
          const year = parseInt(parts[2]);
          release = new Date(year, month, day, 0, 0, 0, 0);
        } else {
          release = new Date(releaseDate);
        }
      } else {
        // Пробуем стандартный парсинг
        release = new Date(releaseDate);
      }
      
      if (isNaN(release.getTime())) {
        return false;
      }
      
      // Базовая дата: 23 июля 2025 года
      const baseDate = new Date(2025, 6, 23, 23, 59, 59, 999); // конец дня
      // 3 месяца назад от базовой даты
      const threeMonthsAgo = new Date(baseDate);
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      threeMonthsAgo.setDate(1); // начало месяца
      threeMonthsAgo.setHours(0, 0, 0, 0); // начало дня
      
      // Временная проверка: если текущая дата меньше базовой, используем текущую дату
      const now = new Date();
      const effectiveBaseDate = now < baseDate ? now : baseDate;
      const effectiveThreeMonthsAgo = new Date(effectiveBaseDate);
      effectiveThreeMonthsAgo.setMonth(effectiveThreeMonthsAgo.getMonth() - 3);
      effectiveThreeMonthsAgo.setDate(1); // начало месяца
      effectiveThreeMonthsAgo.setHours(0, 0, 0, 0); // начало дня
      
      return release >= effectiveThreeMonthsAgo && release <= effectiveBaseDate;
    } catch (error) {
      return false;
    }
  };



  // Функция для обновления страницы в URL
  const updatePage = useCallback((page: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      newSearchParams.delete('page');
    } else {
      newSearchParams.set('page', page.toString());
    }
    setSearchParams(newSearchParams);
    setCurrentPage(page);
  }, [searchParams, setSearchParams]);

  // Мемоизированная фильтрация продуктов
  const filteredProducts = useMemo(() => {
    setIsLoading(true);
    
    let filtered = [...products] as (Product | NonNullableProduct)[];
    
    // Debug: логируем начальное состояние
    console.log('=== FILTERING DEBUG ===');
    console.log('Initial products count:', filtered.length);
    console.log('Current filters:', filters);
    console.log('Search params:', searchParams.toString());
    
    // Search filter
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
      console.log('After search filter:', filtered.length);
    }
    
    // Special filters
    const filter = searchParams.get('filter');
    if (filter === 'new') {
      filtered = filtered.filter(product => product.isNew);
    } else if (filter === 'hits') {
      filtered = filtered.filter(product => product.isHit);
    } else if (filter === 'new-releases') {
      filtered = filtered.filter(product => product.releaseDate && isNewRelease(product.releaseDate));
    }
    
    // Categories filter - используем ТОЛЬКО состояние фильтров, не URL параметры
    const categoriesToFilter = filters.categories;
    
    // Отделяем специальные категории от обычных
    const specialCategories = categoriesToFilter.filter(cat => 
      cat === 'New Releases' || cat === 'Premium'
    );
    const regularCategories = categoriesToFilter.filter(cat => 
      cat !== 'New Releases' && cat !== 'Premium'
    );
    
    // Применяем обычные категории - ТОЛЬКО если есть активные фильтры
    if (regularCategories.length > 0) {
      filtered = filtered.filter(product => regularCategories.includes(product.category));
      console.log('After category filter:', filtered.length, 'categories:', regularCategories);
    } else {
      console.log('No category filters applied');
    }
    
    // Brands filter - используем ТОЛЬКО состояние фильтров, не URL параметры
    const brandsToFilter = filters.brands;
    
    // Применяем фильтр брендов - ТОЛЬКО если есть активные фильтры
    if (brandsToFilter.length > 0) {
      filtered = filtered.filter(product => brandsToFilter.includes(product.brand));
      console.log('After brand filter:', filtered.length, 'brands:', brandsToFilter);
    } else {
      console.log('No brand filters applied');
    }
    
    // Применяем специальные категории после фильтрации по брендам
    if (specialCategories.length > 0) {
      filtered = filtered.filter(product => {
        return specialCategories.some(category => {
          if (category === 'New Releases') {
            return product.releaseDate && isNewRelease(product.releaseDate);
          }
          if (category === 'Premium') {
            return product.price > 17000;
          }
          return false;
        });
      });
    }
    
    // Models filter - используем ТОЛЬКО состояние фильтров, не URL параметры
    const modelsToFilter = filters.models;
    
    if (modelsToFilter.length > 0) {
      filtered = filtered.filter(product => {
        if (!product.model) return false;
        return modelsToFilter.includes(product.model);
      }) as NonNullableProduct[];
      console.log('After model filter:', filtered.length, 'models:', modelsToFilter);
    } else {
      console.log('No model filters applied');
    }
    
    // Price range filter
    if (filters.priceRange && filters.priceRange.length === 2) {
      const [minPrice, maxPrice] = filters.priceRange;
      filtered = filtered.filter(product => 
        product.price >= minPrice && product.price <= maxPrice
      );
    }
    
    // Size filter
    if (filters.sizes && filters.sizes.length > 0) {
      filtered = filtered.filter(product => 
        filters.sizes!.some(size => product.sizes.includes(size))
      );
    }
    
    // In stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => product.inStock);
    }
    
    // Favorites filter
    if (showFavoritesOnly) {
      filtered = filtered.filter(product => favorites.includes(product.id));
    }
    
    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy.sortBy) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;

        case 'newest':
          comparison = (a.isNew ? 1 : 0) - (b.isNew ? 1 : 0);
          break;
        default:
          comparison = 0;
      }
      
      return sortBy.order === 'desc' ? -comparison : comparison;
    });
    
    console.log('Final filtered products:', filtered.length);
    console.log('=== END FILTERING DEBUG ===');
    setIsLoading(false);
    return filtered;
  }, [filters, sortBy, searchParams, favorites, showFavoritesOnly]);

  // Пагинация
  const ITEMS_PER_PAGE = 20;
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Простая функция для обновления URL
  const updateUrl = useCallback((newFilters: FilterOptions) => {
    const params = new URLSearchParams();
    
    // Сохраняем поиск и специальные фильтры
    const search = searchParams.get('search');
    const filter = searchParams.get('filter');
    if (search) params.set('search', search);
    if (filter) params.set('filter', filter);
    
    // Добавляем ТОЛЬКО активные фильтры (не пустые массивы)
    if (newFilters.brands.length > 0) {
      newFilters.brands.forEach(brand => params.append('brand', brand));
    }
    if (newFilters.categories.length > 0) {
      newFilters.categories.forEach(category => params.append('category', category));
    }
    if (newFilters.models.length > 0) {
      newFilters.models.forEach(model => params.append('model', model));
    }
    
    console.log('Updating URL with filters:', newFilters);
    console.log('New URL params:', params.toString());
    
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  // Инициализация фильтров из URL при загрузке компонента
  useEffect(() => {
    const brands = searchParams.getAll('brand');
    const categories = searchParams.getAll('category');
    const models = searchParams.getAll('model');
    const page = searchParams.get('page');
    
    console.log('Initializing filters from URL:', { brands, categories, models });
    
    // Если URL пустой, сбрасываем фильтры
    if (brands.length === 0 && categories.length === 0 && models.length === 0) {
      setFilters({
        categories: [],
        brands: [],
        models: [],
        priceRange: [0, 100000],
        sizes: [],
        inStock: true
      });
    } else {
      setFilters({
        categories,
        brands,
        models,
        priceRange: [0, 100000],
        sizes: [],
        inStock: true
      });
    }
    
    if (page) {
      const pageNumber = parseInt(page, 10);
      if (pageNumber > 0) setCurrentPage(pageNumber);
    }
  }, [searchParams]); // При изменении параметров URL

  // Сброс страницы при изменении фильтров
  const prevFiltersRef = useRef(filters);
  useEffect(() => {
    const filtersChanged = JSON.stringify(prevFiltersRef.current) !== JSON.stringify(filters);
    if (filtersChanged && JSON.stringify(prevFiltersRef.current) !== JSON.stringify({
      categories: [],
      brands: [],
      models: [],
      priceRange: [0, 100000],
      sizes: [],
      inStock: true
    })) {
      updatePage(1);
      prevFiltersRef.current = filters;
    }
  }, [filters, updatePage]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleFilterChange = useCallback((key: keyof FilterOptions, value: any) => {
    console.log('handleFilterChange called:', key, value);
    
    setFilters(prev => {
      let newFilters;
      
      if (key === 'priceRange') {
        const [min, max] = value;
        const minPrice = isNaN(min) ? 0 : Math.max(0, min);
        const maxPrice = isNaN(max) ? 100000 : Math.max(minPrice, max);
        newFilters = { ...prev, priceRange: [minPrice, maxPrice] as [number, number] };
      } else if (key === 'brands') {
        const array = prev[key] as string[];
        const newArray = array.includes(value) 
          ? array.filter(item => item !== value)
          : [...array, value];
        // При изменении брендов сбрасываем модели
        newFilters = { ...prev, [key]: newArray, models: [] };
      } else if (key === 'categories') {
        const array = prev[key] as string[];
        const newArray = array.includes(value) 
          ? array.filter(item => item !== value)
          : [...array, value];
        // При изменении категорий сбрасываем модели
        newFilters = { ...prev, [key]: newArray, models: [] };
      } else if (Array.isArray(prev[key])) {
        const array = prev[key] as string[];
        const newArray = array.includes(value)
          ? array.filter(item => item !== value)
          : [...array, value];
        newFilters = { ...prev, [key]: newArray };
      } else {
        newFilters = { ...prev, [key]: value };
      }
      
      console.log('New filters state:', newFilters);
      
      // СРАЗУ обновляем URL
      updateUrl(newFilters);
      
      return newFilters;
    });
  }, [updateUrl]);

  const handleSortChange = useCallback((value: string) => {
    const [sortBy, order] = value.split('-');
    setSortBy({
      sortBy: sortBy as SortOptions['sortBy'],
      order: order as SortOptions['order']
    });
  }, []);

  const clearFilters = useCallback(() => {
    const newFilters = {
      categories: [],
      brands: [],
      models: [],
      priceRange: [0, 100000] as [number, number],
      sizes: [],
      inStock: true
    };
    
    setFilters(newFilters);
    setPriceInputs({ min: '', max: '' });
    setShowFavoritesOnly(false);
    
    // Полностью очищаем URL от всех параметров
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  const toggleFavorite = useCallback((productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  // Категории из главной страницы
  const categories = [
    'Кросівки',
    'Сумки', 
    'Футболки',
    'Аксесуари',
    'Верхній одяг',
    'Худі/світшоти',
    'New Releases',
    'Premium'
  ];
  // Функция для получения размеров в зависимости от категории
  const getSizesForCategory = (category?: string): string[] => {
    if (category === 'Худі/світшоти' || category === 'Футболки' || category === 'Верхній одяг') {
      return ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    }
    // Для кросівок и других категорий (включая Off-White)
    return ['36', '36.5', '37.5', '38', '38.5', '39', '40', '40.5', '41', '42', '42.5', '43', '44', '44.5', '45', '46', '46.5', '47', '47.5'];
  };

  // Получаем размеры на основе активных фильтров категорий
  const getAvailableSizes = (): string[] => {
    if (filters.categories.length > 0) {
      // Если выбраны категории, показываем размеры для первой категории
      return getSizesForCategory(filters.categories[0]);
    }
    // Если категории не выбраны, показываем размеры для кросівок (по умолчанию)
    return getSizesForCategory('Кросівки');
  };

  const sizes = getAvailableSizes();

  const [openSections, setOpenSections] = useState({
    categories: false,
    brands: false,
    models: false,
    price: false,
    sizes: false,
    favorites: false,
  });

  // Функция для проверки наличия активных фильтров
  const hasActiveFilters = () => {
    const hasFilters = (
      filters.categories.length > 0 ||
      filters.brands.length > 0 ||
      filters.models.length > 0 ||
      (filters.sizes && filters.sizes.length > 0) ||
      (filters.priceRange && filters.priceRange.length === 2 && 
       (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 100000)) ||
      searchParams.get('search') ||
      searchParams.get('filter') ||
      showFavoritesOnly
    );
    
    console.log('hasActiveFilters check:', {
      categories: filters.categories.length,
      brands: filters.brands.length,
      models: filters.models.length,
      sizes: filters.sizes?.length || 0,
      priceRange: filters.priceRange,
      search: searchParams.get('search'),
      filter: searchParams.get('filter'),
      showFavoritesOnly,
      result: hasFilters
    });
    
    return hasFilters;
  };

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };



  return (
    <CatalogContainer>
      <Header>
        <h1>Каталог</h1>
        <ViewControls>
          <FilterButton onClick={() => setIsFilterOpen(true)}>
            <Filter size={16} />
            Фільтри
          </FilterButton>
          <ViewButton $active={view === 'grid'} onClick={() => setView('grid')}>
            <Grid size={16} />
          </ViewButton>
          <ViewButton $active={view === 'list'} onClick={() => setView('list')}>
            <List size={16} />
          </ViewButton>
        </ViewControls>
      </Header>
      
      <ContentContainer>
        <FilterSidebar $isOpen={isFilterOpen}>
          <CloseButton onClick={() => setIsFilterOpen(false)}>
            <X size={24} />
          </CloseButton>
          
          <div className="filter-sections">
            <FilterSection>
              <FilterSectionHeader onClick={() => toggleSection('categories')}>
                <h3>Категорія</h3>
                {openSections.categories ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
              </FilterSectionHeader>
              <Collapsible open={openSections.categories}>
                {categories.map(category => (
                  <FilterOption key={category}>
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={() => handleFilterChange('categories', category)}
                    />
                    <span>{category}</span>
                  </FilterOption>
                ))}
              </Collapsible>
            </FilterSection>
            
            <FilterSection>
              <FilterSectionHeader onClick={() => toggleSection('brands')}>
                <h3>Бренд</h3>
                {openSections.brands ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
              </FilterSectionHeader>
              <Collapsible open={openSections.brands}>
                <ScrollableOptions>
                  {brands.map(brand => (
                    <FilterOption key={brand}>
                      <input
                        type="checkbox"
                        checked={filters.brands.includes(brand)}
                        onChange={() => handleFilterChange('brands', brand)}
                      />
                      <span>{brand}</span>
                    </FilterOption>
                  ))}
                </ScrollableOptions>
              </Collapsible>
            </FilterSection>
            
            <FilterSection>
              <FilterSectionHeader onClick={() => toggleSection('models')}>
                <h3>Модель</h3>
                {openSections.models ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
              </FilterSectionHeader>
              <Collapsible open={openSections.models}>
                <ScrollableOptions>
                  {models.map(model => (
                    <FilterOption key={model}>
                      <input
                        type="checkbox"
                        checked={filters.models.includes(model)}
                        onChange={() => handleFilterChange('models', model)}
                      />
                      <span>{model}</span>
                    </FilterOption>
                  ))}
                </ScrollableOptions>
              </Collapsible>
            </FilterSection>
            
            <FilterSection>
              <FilterSectionHeader onClick={() => toggleSection('price')}>
                <h3>Ціна</h3>
                {openSections.price ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
              </FilterSectionHeader>
              <Collapsible open={openSections.price}>
                <PriceRange>
                  <input
                    type="number"
                    value={priceInputs.min}
                    onChange={(e) => setPriceInputs(prev => ({ ...prev, min: e.target.value }))}
                    placeholder="Від"
                    min="0"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    value={priceInputs.max}
                    onChange={(e) => setPriceInputs(prev => ({ ...prev, max: e.target.value }))}
                    placeholder="До"
                    min="0"
                  />
                  <button 
                    className="apply-price"
                    onClick={() => {
                      const minValue = parseInt(priceInputs.min) || 0;
                      const maxValue = parseInt(priceInputs.max) || 100000;
                      handleFilterChange('priceRange', [minValue, maxValue]);
                    }}
                    disabled={!priceInputs.min && !priceInputs.max}
                  >
                    Застосувати
                  </button>
                  {(filters.priceRange![0] !== 0 || filters.priceRange![1] !== 100000) && (
                    <button 
                      className="reset-price"
                      onClick={() => {
                        handleFilterChange('priceRange', [0, 100000]);
                        setPriceInputs({ min: '', max: '' });
                      }}
                    >
                      Скинути
                    </button>
                  )}
                </PriceRange>
              </Collapsible>
            </FilterSection>
            
            <FilterSection>
              <FilterSectionHeader onClick={() => toggleSection('sizes')}>
                <h3>Розмір</h3>
                {openSections.sizes ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
              </FilterSectionHeader>
              <Collapsible open={openSections.sizes}>
                <SizeGrid>
                  {sizes.map(size => (
                    <SizeOption key={size}>
                      <input
                        type="checkbox"
                        checked={filters.sizes?.includes(size)}
                        onChange={() => handleFilterChange('sizes', size)}
                      />
                      <span>{size}</span>
                    </SizeOption>
                  ))}
                </SizeGrid>
                <SizeGuideLink to="/size-guide">
                  Не знаєте свій розмір?
                </SizeGuideLink>
              </Collapsible>
            </FilterSection>
            
            <FilterSection>
              <FilterSectionHeader onClick={() => toggleSection('favorites')}>
                <h3>Обране</h3>
                {openSections.favorites ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
              </FilterSectionHeader>
              <Collapsible open={openSections.favorites}>
                <FilterOption>
                  <input
                    type="checkbox"
                    checked={showFavoritesOnly}
                    onChange={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  />
                  <span>Показати лише обрані товари ({favorites.length})</span>
                </FilterOption>
                {favorites.length > 0 && (
                  <button 
                    onClick={() => {
                      setFavorites([]);
                      localStorage.removeItem('favorites');
                    }}
                    style={{
                      background: 'none',
                      border: '1px solid var(--border-light)',
                      color: 'var(--text-light)',
                      padding: '8px 15px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      width: '100%',
                      marginTop: '10px',
                      fontSize: '0.9rem'
                    }}
                  >
                    Очистити обране
                  </button>
                )}
              </Collapsible>
            </FilterSection>
          </div>
          
          <ClearFilters onClick={clearFilters}>
            Очистити фільтри
          </ClearFilters>
        </FilterSidebar>
        
        <ProductsSection>
          <ProductsHeader>
            <span>
              {filteredProducts.length > 0 
                ? `Показано ${startIndex + 1}-${Math.min(endIndex, filteredProducts.length)} з ${hasActiveFilters() ? filteredProducts.length : TOTAL_PRODUCTS_COUNT} товарів`
                : 'Товари не знайдено'
              }
            </span>
            <select 
              value={`${sortBy.sortBy}-${sortBy.order}`}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="newest-desc">Спочатку нові</option>
              <option value="price-asc">Від дешевих до дорогих</option>
              <option value="price-desc">Від дорогих до дешевих</option>
              <option value="name-asc">За назвою А-Я</option>
              <option value="name-desc">За назвою Я-А</option>
            </select>
          </ProductsHeader>
          
          {isLoading ? (
            <div>Завантаження...</div>
          ) : (
            <>
              <ProductGrid view={view}>
                {currentProducts.map(product => (
                  <ProductCard key={product.id} to={`/product/${product.id}`} view={view}>
                    <ProductImage bgImage={product.image} view={view}>
                      <HeartButton 
                        isFavorite={favorites.includes(product.id)}
                        onClick={(e) => toggleFavorite(product.id, e)}
                      >
                        <Heart />
                      </HeartButton>
                    </ProductImage>
                    <ProductInfo view={view}>
                      <h3>{product.name}</h3>
                      <div className="brand">{product.brand}</div>
                      <div className="price">₴{product.price}</div>
                      {view === 'list' && (
                        <div className="description">{product.description}</div>
                      )}
                    </ProductInfo>
                  </ProductCard>
                ))}
              </ProductGrid>
              
              {/* Пагинация */}
              {totalPages > 1 && (
                <Pagination>
                  <PageButton 
                    onClick={() => updatePage(1)}
                    disabled={currentPage === 1}
                  >
                    ««
                  </PageButton>
                  <PageButton 
                    onClick={() => updatePage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    «
                  </PageButton>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber: number;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }
                    
                    return (
                      <PageButton
                        key={pageNumber}
                        $active={pageNumber === currentPage}
                        onClick={() => updatePage(pageNumber)}
                      >
                        {pageNumber}
                      </PageButton>
                    );
                  })}
                  
                  <PageButton 
                    onClick={() => updatePage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    »
                  </PageButton>
                  <PageButton 
                    onClick={() => updatePage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    »»
                  </PageButton>
                </Pagination>
              )}
            </>
          )}
        </ProductsSection>
      </ContentContainer>
    </CatalogContainer>
  );
};

// Добавляем новые стили для пагинации и загрузки
const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: var(--text-light);
  font-size: 1.1rem;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 40px;
  padding: 20px 0;
  
  @media (max-width: 768px) {
    margin-top: 30px;
    padding: 15px 0;
    gap: 6px;
  }
  
  @media (max-width: 480px) {
    margin-top: 20px;
    padding: 10px 0;
    gap: 4px;
    flex-wrap: wrap;
  }
`;

const PageButton = styled.button<{ $active?: boolean }>`
  min-width: 40px;
  height: 40px;
  padding: 8px 12px;
  border: 2px solid ${props => props.$active ? 'var(--primary-yellow)' : 'var(--border-light)'};
  background: ${props => props.$active ? 'var(--primary-yellow)' : 'white'};
  color: ${props => props.$active ? 'var(--text-dark)' : 'var(--text-dark)'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: ${props => props.$active ? '600' : '500'};
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover:not(:disabled) {
    border-color: var(--primary-yellow);
    background: ${props => props.$active ? 'var(--primary-yellow)' : 'rgba(255, 215, 0, 0.1)'};
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    min-width: 36px;
    height: 36px;
    font-size: 13px;
  }
  
  @media (max-width: 480px) {
    min-width: 32px;
    height: 32px;
    font-size: 12px;
    padding: 6px 8px;
  }
`;

const NewBadge = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  background: var(--success-green);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  z-index: 1;
`;

const HitBadge = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--primary-yellow);
  color: var(--text-dark);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  z-index: 1;
`;

const SizeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  gap: 8px;
  margin-top: 15px;
`;

const SizeOption = styled(FilterOption)`
  margin: 0;
  justify-content: center;
  padding: 8px;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  transition: all 0.2s ease;
  
  input[type="checkbox"] {
    display: none;
  }
  
  span {
    font-size: 0.9rem;
    font-weight: 500;
  }
  
  &:hover {
    border-color: var(--primary-yellow);
  }
  
  input[type="checkbox"]:checked + span {
    color: var(--primary-yellow);
  }
  
  input[type="checkbox"]:checked ~ & {
    border-color: var(--primary-yellow);
    background: rgba(255, 215, 0, 0.1);
  }
`;

const SizeGuideLink = styled(Link)`
  color: var(--primary-blue);
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 500;
  transition: color 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    color: #4169E1;
    text-decoration: underline;
  }
`;

const FilterSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
  margin-bottom: 10px;
  h3 {
    margin: 0;
    font-size: 1.2rem;
    color: var(--text-dark);
    font-weight: 600;
  }
  svg {
    transition: transform 0.2s;
  }
`;

const Collapsible = styled.div<{ open: boolean }>`
  max-height: ${props => props.open ? '1000px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s cubic-bezier(0.4,0,0.2,1);
`;

const ScrollableOptions = styled.div`
  max-height: 160px;
  overflow-y: auto;
  padding-right: 4px;
  margin-bottom: 10px;
  
  @media (max-width: 480px) {
    max-height: 200px;
  }
`;

export default CatalogPage;