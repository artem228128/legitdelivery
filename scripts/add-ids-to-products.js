const fs = require('fs');
const path = require('path');

// Путь к смешанному файлу
const PRODUCTS_FILE = path.join(__dirname, '../src/products_jsons/all_products_mixed.json');

function addIdsToProducts() {
  console.log('🔄 Добавляю стабильные ID к товарам...');
  
  try {
    // Загружаем продукты
    const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
    console.log(`📦 Загружено ${products.length} товаров`);
    
    // Добавляем ID к каждому товару
    const updatedProducts = products.map((product, index) => {
      // Создаем стабильный ID на основе SKU или других уникальных данных
      let id;
      
      if (product.sku) {
        // Используем SKU как основу для ID
        id = `json_${product.sku}`;
      } else if (product.title && product.brand) {
        // Если нет SKU, создаем ID из названия и бренда
        const cleanTitle = product.title.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const cleanBrand = product.brand.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        id = `json_${cleanBrand}_${cleanTitle.substring(0, 20)}_${index}`;
      } else {
        // Fallback - используем индекс
        id = `json_product_${index}`;
      }
      
      return {
        ...product,
        id: id,
        stable_id: true // Маркер что ID стабильный
      };
    });
    
    // Проверяем на дубликаты ID
    const ids = updatedProducts.map(p => p.id);
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
      console.warn('⚠️  Найдены дублирующиеся ID, добавляю суффиксы...');
      
      const idCounts = {};
      const finalProducts = updatedProducts.map(product => {
        let id = product.id;
        if (idCounts[id]) {
          idCounts[id]++;
          id = `${product.id}_${idCounts[id]}`;
        } else {
          idCounts[id] = 1;
        }
        return { ...product, id };
      });
      
      // Сохраняем обновленный файл
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(finalProducts, null, 2));
      console.log(`✅ Добавлены стабильные ID к ${finalProducts.length} товарам`);
    } else {
      // Сохраняем обновленный файл
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(updatedProducts, null, 2));
      console.log(`✅ Добавлены стабильные ID к ${updatedProducts.length} товарам`);
    }
    
    // Статистика
    const idTypes = {
      sku: updatedProducts.filter(p => p.id.includes(p.sku)).length,
      generated: updatedProducts.filter(p => !p.id.includes(p.sku)).length
    };
    
    console.log(`📊 Статистика ID:`);
    console.log(`   - На основе SKU: ${idTypes.sku}`);
    console.log(`   - Сгенерированные: ${idTypes.generated}`);
    console.log(`📁 Файл обновлен: ${PRODUCTS_FILE}`);
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    process.exit(1);
  }
}

// Запускаем скрипт
addIdsToProducts(); 