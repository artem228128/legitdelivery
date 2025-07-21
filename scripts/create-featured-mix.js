const fs = require('fs');
const path = require('path');

// Путь к файлам
const PRODUCTS_DIR = path.join(__dirname, '../src/products_jsons');
const INPUT_FILE = path.join(PRODUCTS_DIR, 'mixed_products.json');
const OUTPUT_FILE = path.join(PRODUCTS_DIR, 'featured_mix.json');

// Количество товаров в финальном миксе
const FEATURED_COUNT = 100;

function createFeaturedMix() {
  console.log('🌟 Создаю Featured Mix...');
  
  try {
    // Загружаем полный микс
    const allProducts = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
    console.log(`📦 Загружено ${allProducts.length} товаров`);
    
    // Фильтруем лучшие товары (можно настроить критерии)
    const featured = allProducts
      .filter(product => {
        // Критерии отбора:
        const hasImages = product.images && product.images.length >= 3;
        const hasValidPrice = product.price && !product.price.includes('$0');
        const hasTitle = product.title && product.title.length > 10;
        
        return hasImages && hasValidPrice && hasTitle;
      })
      .slice(0, FEATURED_COUNT);
    
    // Добавляем метки featured
    featured.forEach((product, index) => {
      product.featured_id = index + 1;
      product.is_featured = true;
      product.featured_at = new Date().toISOString();
    });
    
    // Сохраняем результат
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(featured, null, 2));
    
    console.log(`🎉 Создан Featured Mix с ${featured.length} товарами`);
    console.log(`📁 Файл сохранен: ${OUTPUT_FILE}`);
    
    // Статистика по брендам
    const brands = {};
    featured.forEach(product => {
      const brand = product.brand || 'Unknown';
      brands[brand] = (brands[brand] || 0) + 1;
    });
    
    console.log('\n📊 Статистика по брендам:');
    Object.entries(brands)
      .sort(([,a], [,b]) => b - a)
      .forEach(([brand, count]) => {
        console.log(`   ${brand}: ${count} товаров`);
      });
      
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

// Запускаем
createFeaturedMix(); 