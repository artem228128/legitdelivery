const fs = require('fs');
const path = require('path');

// Путь к папке с JSON файлами
const PRODUCTS_DIR = path.join(__dirname, '../src/products_jsons');
const OUTPUT_FILE = path.join(PRODUCTS_DIR, 'mixed_products.json');

// Список файлов для смешивания (можно добавить или убрать)
const FILES_TO_MIX = [
  'aj1_products.json',
  'yeezy_products.json',
  'dunk_products_final.json',
  'air_force_1_products.json',
  'new_balance_products.json',
  'off_white_products.json',
  'samba_products.json',
  'aj1h_products.json',
  'aj1m_products.json',
  'air95_products.json',
  'airmax1_products.json',
  'vomero5_products.json'
];

// Количество товаров из каждого файла
const PRODUCTS_PER_FILE = 50;

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function mixProducts() {
  console.log('🔄 Начинаю смешивание продукции...');
  
  let allProducts = [];
  
  FILES_TO_MIX.forEach(filename => {
    const filePath = path.join(PRODUCTS_DIR, filename);
    
    try {
      if (fs.existsSync(filePath)) {
        console.log(`📦 Загружаю ${filename}...`);
        const products = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Берем случайные продукты из файла
        const shuffled = shuffleArray(products);
        const selected = shuffled.slice(0, Math.min(PRODUCTS_PER_FILE, products.length));
        
        // Добавляем категорию к каждому продукту
        const categoryName = filename.replace('_products.json', '').replace('_final', '');
        selected.forEach(product => {
          product.category = categoryName;
          product.source_file = filename;
        });
        
        allProducts = allProducts.concat(selected);
        console.log(`✅ Добавлено ${selected.length} товаров из ${filename}`);
      } else {
        console.log(`⚠️  Файл ${filename} не найден`);
      }
    } catch (error) {
      console.error(`❌ Ошибка при загрузке ${filename}:`, error.message);
    }
  });
  
  // Финальное перемешивание всех товаров
  console.log('🔀 Финальное перемешивание...');
  const finalMix = shuffleArray(allProducts);
  
  // Добавляем уникальные ID
  finalMix.forEach((product, index) => {
    product.mix_id = index + 1;
    product.mixed_at = new Date().toISOString();
  });
  
  // Сохраняем результат
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalMix, null, 2));
  
  console.log(`🎉 Готово! Создан файл с ${finalMix.length} товарами`);
  console.log(`📁 Файл сохранен: ${OUTPUT_FILE}`);
  
  // Статистика по категориям
  const categories = {};
  finalMix.forEach(product => {
    categories[product.category] = (categories[product.category] || 0) + 1;
  });
  
  console.log('\n📊 Статистика по категориям:');
  Object.entries(categories).forEach(([category, count]) => {
    console.log(`   ${category}: ${count} товаров`);
  });
}

// Запускаем скрипт
mixProducts(); 