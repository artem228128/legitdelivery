import { Product } from '../types';
import { 
  jsonProducts, 
  getJsonProductsByBrand, 
  getJsonProductsByCategory, 
  getJsonNewProducts, 
  getJsonHitProducts,
  getRandomJsonProducts 
} from './productLoader';

// Используем только продукты из JSON файлов
const staticProducts: Product[] = [];

// Объединяем статические продукты с JSON продуктами
export const products: Product[] = [...staticProducts, ...jsonProducts];

console.log(`Загружено ${products.length} продуктов из JSON файлов`);

// Обновленные функции для работы со всеми продуктами
export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByBrand = (brand: string): Product[] => {
  return products.filter(product => 
    product.brand.toLowerCase().includes(brand.toLowerCase())
  );
};

export const getProductsByModel = (model: string): Product[] => {
  return products.filter(product => 
    product.model?.toLowerCase().includes(model.toLowerCase())
  );
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const getNewProducts = (): Product[] => {
  return products.filter(product => product.isNew);
};

export const getHitProducts = (): Product[] => {
  return products.filter(product => product.isHit);
};

export const getRandomProducts = (count: number): Product[] => {
  const shuffled = [...products].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(product =>
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.brand.toLowerCase().includes(lowercaseQuery) ||
    product.category.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery)
  );
};

// Получение уникальных брендов
export const brands = Array.from(new Set(products.map(product => product.brand))).sort();

// Получение уникальных моделей
export const models = Array.from(new Set(products.map(product => product.model).filter(Boolean))).sort();

// Получение уникальных категорий
const uniqueCategories = Array.from(new Set(products.map(product => product.category))).sort();

export const categories = uniqueCategories.map(categoryName => ({
  id: categoryName.toLowerCase().replace(/\s+/g, '_'),
  name: categoryName,
  image: getCategoryImage(categoryName)
}));

function getCategoryImage(categoryName: string): string {
  switch (categoryName.toLowerCase()) {
    case 'кросівки':
      return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop';
    case 'одяг':
      return 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=300&fit=crop';
    case 'аксесуари':
      return 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop';
    default:
      return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop';
  }
}

// Статистика продуктов
export const getProductStats = () => {
  return {
    total: products.length,
    inStock: products.filter(p => p.inStock).length,
    new: products.filter(p => p.isNew).length,
    hits: products.filter(p => p.isHit).length,
    brands: brands.length,
    categories: categories.length,
    avgPrice: Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length),
    priceRange: {
      min: Math.min(...products.map(p => p.price)),
      max: Math.max(...products.map(p => p.price))
    }
  };
}; 