const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Конфигурация Cloudinary
cloudinary.config({
  cloud_name: 'dvy87ylmu',
  api_key: '325396323925751',
  api_secret: 'feSgNDeL7yeNlbZAK0LWlOyGabQ'
});

// Папка с изображениями
const imagesDir = path.join(__dirname, '../public/images');

// Функция для рекурсивного обхода директории
async function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else {
      // Пропускаем файлы README и placeholder
      if (file.includes('README') || file.includes('placeholder')) continue;
      
      // Получаем относительный путь для структуры папок в Cloudinary
      const relativePath = path.relative(imagesDir, fullPath);
      const cloudinaryPath = relativePath.replace(/\\/g, '/');
      
      try {
        console.log(`Uploading ${cloudinaryPath}...`);
        const result = await cloudinary.uploader.upload(fullPath, {
          public_id: cloudinaryPath.replace(/\.[^/.]+$/, ''), // Убираем расширение файла
          resource_type: "auto" // Автоопределение типа ресурса (image/video)
        });
        console.log(`✅ Uploaded ${cloudinaryPath}`);
        console.log(`URL: ${result.secure_url}`);
        
        // Сохраняем маппинг путей
        fs.appendFileSync(
          path.join(__dirname, 'cloudinary-urls.txt'),
          `${relativePath}|${result.secure_url}\n`
        );
      } catch (error) {
        console.error(`❌ Error uploading ${cloudinaryPath}:`, error.message);
      }
    }
  }
}

// Очищаем файл с маппингом
fs.writeFileSync(path.join(__dirname, 'cloudinary-urls.txt'), '');

// Запускаем загрузку
console.log('Starting upload to Cloudinary...');
processDirectory(imagesDir)
  .then(() => {
    console.log('✨ All files uploaded successfully!');
    console.log('Check cloudinary-urls.txt for the mapping of local paths to Cloudinary URLs');
  })
  .catch(error => {
    console.error('Error during upload:', error);
  });
