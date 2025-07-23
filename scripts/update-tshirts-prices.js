const fs = require('fs');
const path = require('path');

// Читаем файл tshirts.json
const tshirtsPath = path.join(__dirname, '../src/products_jsons/tshirts.json');
const tshirts = JSON.parse(fs.readFileSync(tshirtsPath, 'utf8'));

// Функция для генерации случайной цены в диапазоне
function getRandomPrice() {
  const minPrice = 3299; // 3299 грн
  const maxPrice = 5782; // 5782 грн
  const price = Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice;
  
  // Конвертируем в доллары (курс 42 грн за доллар)
  const priceUSD = Math.round(price / 42);
  
  return `$${priceUSD}`;
}

// Обновляем цены для каждого товара
tshirts.forEach(item => {
  if (item.price === '$0' || item.price === '$0.00' || !item.price) {
    item.price = getRandomPrice();
  } else {
    // Для существующих цен тоже генерируем новую
    item.price = getRandomPrice();
  }
});

// Записываем обновленный файл
fs.writeFileSync(tshirtsPath, JSON.stringify(tshirts, null, 2));

console.log(`Обновлено ${tshirts.length} товаров в tshirts.json`);
console.log('Цены установлены в диапазоне от $78 до $137 (3299-5782 грн)'); 