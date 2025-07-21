const fs = require('fs');
const path = require('path');

// Путь к папке с JSON файлами
const PRODUCTS_DIR = path.join(__dirname, '../src/products_jsons');
const OUTPUT_FILE = path.join(PRODUCTS_DIR, 'all_products_mixed.json');

// ВСЕ файлы с продукцией
const ALL_PRODUCT_FILES = [
  'aj1_products.json',
  'aj1h_products.json', 
  'aj1m_products.json',
  'aj3_products.json',
  'aj5_products.json',
  'air95_products.json',
  'air_force_1_products.json',
  'air_jordan_4_products.json',
  'airmax1_products.json',
  'custom_sneakers.json',
  'dunk_products_final.json',
  'forum_products.json',
  'gazel_products.json',
  'new_balance_products.json',
  'off_white_products.json',
  'samba_products.json',
  'spezial_products.json',
  'vomero5_products.json',
  'yeezy_products.json'
];

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function mixAllProducts() {
  console.log('🔄 Начинаю смешивание ВСЕХ товаров...');
  
  let allProducts = [];
  let totalFiles = 0;
  let totalProducts = 0;
  
  ALL_PRODUCT_FILES.forEach(filename => {
    const filePath = path.join(PRODUCTS_DIR, filename);
    
    try {
      if (fs.existsSync(filePath)) {
        console.log(`📦 Загружаю ВСЕ товары из ${filename}...`);
        const products = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Добавляем категорию к каждому товару
        const categoryName = filename.replace('_products.json', '').replace('_final', '');
        products.forEach(product => {
          product.category = categoryName;
          product.source_file = filename;
        });
        
        allProducts = allProducts.concat(products);
        totalFiles++;
        console.log(`✅ Добавлено ${products.length} товаров из ${filename}`);
        totalProducts += products.length;
      } else {
        console.log(`⚠️  Файл ${filename} не найден`);
      }
    } catch (error) {
      console.error(`❌ Ошибка при загрузке ${filename}:`, error.message);
    }
  });
  
  console.log(`\n📊 Итого загружено: ${totalProducts} товаров из ${totalFiles} файлов`);
  
  // Финальное перемешивание всех товаров
  console.log('🔀 Финальное перемешивание...');
  const finalMix = shuffleArray(allProducts);
  
  // Добавляем уникальные ID
  finalMix.forEach((product, index) => {
    product.global_id = index + 1;
    product.mixed_at = new Date().toISOString();
  });
  
  // Сохраняем результат
  console.log('💾 Сохраняю файл...');
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalMix, null, 2));
  
  console.log(`🎉 ГОТОВО! Создан файл со ВСЕМИ ${finalMix.length} товарами`);
  console.log(`📁 Файл сохранен: ${OUTPUT_FILE}`);
  console.log(`📏 Размер файла: ${(fs.statSync(OUTPUT_FILE).size / 1024 / 1024).toFixed(2)} MB`);
  
  // Детальная статистика по категориям
  const categories = {};
  const brands = {};
  
  finalMix.forEach(product => {
    // По категориям
    categories[product.category] = (categories[product.category] || 0) + 1;
    
    // По брендам
    const brand = product.brand || 'Unknown';
    brands[brand] = (brands[brand] || 0) + 1;
  });
  
  console.log('\n📊 Статистика по категориям:');
  Object.entries(categories)
    .sort(([,a], [,b]) => b - a)
    .forEach(([category, count]) => {
      console.log(`   ${category}: ${count} товаров`);
    });
    
  console.log('\n🏷️  Топ-10 брендов:');
  Object.entries(brands)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .forEach(([brand, count]) => {
      console.log(`   ${brand}: ${count} товаров`);
    });
}

// Запускаем скрипт
mixAllProducts(); 