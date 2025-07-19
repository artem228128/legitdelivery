import { Product, ProductFromJSON } from '../types';

// Импорт всех JSON файлов
import aj1Products from '../products_jsons/aj1_products.json';
import aj3Products from '../products_jsons/aj3_products.json';
import aj5Products from '../products_jsons/aj5_products.json';
import aj1hProducts from '../products_jsons/aj1h_products.json';
import aj1mProducts from '../products_jsons/aj1m_products.json';
import air95Products from '../products_jsons/air95_products.json';
import airForce1Products from '../products_jsons/air_force_1_products.json';
import airJordan4Products from '../products_jsons/air_jordan_4_products.json';
import airmax1Products from '../products_jsons/airmax1_products.json';
import dunkProducts from '../products_jsons/dunk_products_final.json';
import forumProducts from '../products_jsons/forum_products.json';
import gazelProducts from '../products_jsons/gazel_products.json';
import newBalanceProducts from '../products_jsons/new_balance_products.json';
import offWhiteProducts from '../products_jsons/off_white_products.json';
import sambaProducts from '../products_jsons/samba_products.json';
import spezialProducts from '../products_jsons/spezial_products.json';
import vomero5Products from '../products_jsons/vomero5_products.json';
import yeezyProducts from '../products_jsons/yeezy_products.json';
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
    return 'Кроссовки';
  }
  if (modelLower.includes('air max') || modelLower.includes('air force')) {
    return 'Кроссовки';
  }
  if (modelLower.includes('yeezy')) {
    return 'Кроссовки';
  }
  if (modelLower.includes('dunk')) {
    return 'Кроссовки';
  }
  if (brandLower.includes('new balance')) {
    return 'Кроссовки';
  }
  if (brandLower.includes('adidas')) {
    return 'Кроссовки';
  }
  if (modelLower.includes('forum') || modelLower.includes('samba') || modelLower.includes('gazelle')) {
    return 'Кроссовки';
  }
  if (brandLower.includes('off-white') || brandLower.includes('off white')) {
    return 'Streetwear';
  }
  
  return 'Кроссовки';
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
  
  return {
    id: isCustom ? `custom_${index}_${jsonProduct.sku || Date.now()}` : `json_${index}_${jsonProduct.sku || Date.now()}`,
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

// Загрузка всех продуктов
const loadAllProducts = (): Product[] => {
  const allJsonProducts: ProductFromJSON[][] = [
    aj1Products as ProductFromJSON[],
    aj3Products as ProductFromJSON[],
    aj5Products as ProductFromJSON[],
    aj1hProducts as ProductFromJSON[],
    aj1mProducts as ProductFromJSON[],
    air95Products as ProductFromJSON[],
    airForce1Products as ProductFromJSON[],
    airJordan4Products as ProductFromJSON[],
    airmax1Products as ProductFromJSON[],
    dunkProducts as ProductFromJSON[],
    forumProducts as ProductFromJSON[],
    gazelProducts as ProductFromJSON[],
    newBalanceProducts as ProductFromJSON[],
    offWhiteProducts as ProductFromJSON[],
    sambaProducts as ProductFromJSON[],
    spezialProducts as ProductFromJSON[],
    vomero5Products as ProductFromJSON[],
    yeezyProducts as ProductFromJSON[],
  ];

  const convertedProducts: Product[] = [];
  let globalIndex = 0;

  // Сначала обрабатываем обычные товары
  allJsonProducts.forEach(productArray => {
    productArray.forEach(jsonProduct => {
      try {
        const convertedProduct = convertToProduct(jsonProduct, globalIndex, false);
        convertedProducts.push(convertedProduct);
        globalIndex++;
      } catch (error) {
        console.warn('Ошибка при конвертации продукта:', error);
      }
    });
  });

  // Затем обрабатываем кастомные товары
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