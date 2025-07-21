import { Product, ProductFromJSON } from '../types';

// Используем готовый смешанный файл вместо отдельных файлов
import allProductsMixed from '../products_jsons/all_products_mixed.json';
import customSneakersProducts from '../products_jsons/custom_sneakers.json';

// Функция для преобразования цены из строки в число (в гривнах)
const parsePrice = (priceStr: string): number => {
  const numericPrice = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
  // Конвертируем доллары в гривны (курс 42 гривны за доллар)
  return Math.round(numericPrice * 42);
};

// Функция для определения категории по модели
const getCategory = (model: string, brand: string): string => {
  const modelLower = model.toLowerCase();
  const brandLower = brand.toLowerCase();
  
  if (modelLower.includes('jordan') || modelLower.includes('aj')) {
    return 'Кросівки';
  }
  if (modelLower.includes('air max') || modelLower.includes('air force')) {
    return 'Кросівки';
  }
  if (modelLower.includes('yeezy')) {
    return 'Кросівки';
  }
  if (modelLower.includes('dunk')) {
    return 'Кросівки';
  }
  if (brandLower.includes('new balance')) {
    return 'Кросівки';
  }
  if (brandLower.includes('adidas')) {
    return 'Кросівки';
  }
  if (modelLower.includes('forum') || modelLower.includes('samba') || modelLower.includes('gazelle')) {
    return 'Кросівки';
  }
  if (brandLower.includes('off-white') || brandLower.includes('off white')) {
    return 'Одяг';
  }
  
  return 'Кросівки';
};

// Функция для генерации размеров
const generateSizes = (): string[] => {
  return ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];
};

// Функция для определения новинки (за последние 2 года)
const isNewProduct = (releaseDate: string): boolean => {
  if (!releaseDate) return false;
  const release = new Date(releaseDate);
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
  return release > twoYearsAgo;
};

// Функция для определения хитов (популярные бренды/модели)
const isHitProduct = (title: string, brand: string): boolean => {
  const titleLower = title.toLowerCase();
  const brandLower = brand.toLowerCase();
  
  const hitKeywords = [
    'jordan 1', 'jordan 4', 'air max', 'air force', 'yeezy', 'dunk', 
    'off-white', 'travis scott', 'fragment', 'chicago', 'bred', 'royal',
    '1906', 'new balance'
  ];
  
  return hitKeywords.some(keyword => titleLower.includes(keyword)) ||
         ['nike', 'adidas', 'air jordan', 'new balance'].includes(brandLower);
};

// Функция для преобразования ProductFromJSON в Product
const convertToProduct = (jsonProduct: ProductFromJSON, index: number, isCustom: boolean = false): Product => {
  const price = parsePrice(jsonProduct.price);
  
  // Используем ID из JSON файла если есть, иначе генерируем
  let productId;
  if (jsonProduct.id) {
    productId = jsonProduct.id;
  } else {
    productId = isCustom ? `custom_${jsonProduct.sku || Date.now()}` : `json_${jsonProduct.sku || Date.now()}`;
  }
  
  return {
    id: productId,
    name: jsonProduct.title,
    price: price,
    originalPrice: price > 2500 ? Math.round(price * 1.2) : undefined,
    image: jsonProduct.images[0] || '',
    images: jsonProduct.images.slice(0, 8), // Максимум 8 изображений
    category: getCategory(jsonProduct.model, jsonProduct.brand),
    brand: jsonProduct.brand,
    model: jsonProduct.model,
    description: jsonProduct.description || `${jsonProduct.brand} ${jsonProduct.model}. Оригинальная модель с высоким качеством материалов и современным дизайном.`,
    sizes: generateSizes(),
    inStock: Math.random() > 0.1, // 90% товаров в наличии
    isNew: isNewProduct(jsonProduct.release_date),
    isHit: isHitProduct(jsonProduct.title, jsonProduct.brand),
    rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10, // Рейтинг от 3.5 до 5.0
  };
};

// Загрузка всех продуктов из готового смешанного файла
const loadAllProducts = (): Product[] => {
  const convertedProducts: Product[] = [];
  let globalIndex = 0;

  // Используем готовый смешанный файл (данные уже перемешаны)
  const mixedProducts = allProductsMixed as ProductFromJSON[];
  
  // Загружаем все товары из смешанного файла
  mixedProducts.forEach(jsonProduct => {
    try {
      const convertedProduct = convertToProduct(jsonProduct, globalIndex, false);
      convertedProducts.push(convertedProduct);
      globalIndex++;
    } catch (error) {
      console.warn('Ошибка при конвертации продукта:', error);
    }
  });

  // Добавляем кастомные товары
  const customProducts = customSneakersProducts as ProductFromJSON[];
  customProducts.forEach(jsonProduct => {
    try {
      const convertedProduct = convertToProduct(jsonProduct, globalIndex, true);
      convertedProducts.push(convertedProduct);
      globalIndex++;
    } catch (error) {
      console.warn('Ошибка при конвертации кастомного продукта:', error);
    }
  });

  console.log(`Загружено ${convertedProducts.length} товаров из смешанного файла`);
  return convertedProducts;
};

// Экспорт
export const jsonProducts = loadAllProducts();

// Функции для фильтрации
export const getJsonProductsByBrand = (brand: string): Product[] => {
  return jsonProducts.filter(product => 
    product.brand.toLowerCase().includes(brand.toLowerCase())
  );
};

export const getJsonProductsByCategory = (category: string): Product[] => {
  return jsonProducts.filter(product => product.category === category);
};

export const getJsonNewProducts = (): Product[] => {
  return jsonProducts.filter(product => product.isNew);
};

export const getJsonHitProducts = (): Product[] => {
  return jsonProducts.filter(product => product.isHit);
};

export const getRandomJsonProducts = (count: number): Product[] => {
  const shuffled = [...jsonProducts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}; 