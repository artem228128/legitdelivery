const fs = require('fs');
const path = require('path');

// Читаем файл hoodies.json
const hoodiesPath = path.join(__dirname, '../src/products_jsons/hoodies.json');
const hoodies = JSON.parse(fs.readFileSync(hoodiesPath, 'utf8'));

// Функция для генерации случайной цены в диапазоне
function getRandomPrice() {
  const minPrice = 3920; // 3920 грн
  const maxPrice = 6940; // 6940 грн
  const price = Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice;
  
  // Конвертируем в доллары (курс 42 грн за доллар)
  const priceUSD = Math.round(price / 42);
  
  return `$${priceUSD}`;
}

// Обновляем цены для каждого товара
hoodies.forEach(item => {
  if (item.price === '$0' || item.price === '$0.00' || !item.price) {
    item.price = getRandomPrice();
  } else {
    // Для существующих цен тоже генерируем новую
    item.price = getRandomPrice();
  }
});

// Записываем обновленный файл
fs.writeFileSync(hoodiesPath, JSON.stringify(hoodies, null, 2));

console.log(`Обновлено ${hoodies.length} товаров в hoodies.json`);
console.log('Цены установлены в диапазоне от $93 до $165 (3920-6940 грн)'); 