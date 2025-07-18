const fs = require('fs');
const path = require('path');

// Читаем маппинг URL'ов
const urlMappings = fs.readFileSync(
  path.join(__dirname, 'cloudinary-urls.txt'),
  'utf8'
)
.split('\n')
.filter(Boolean)
.reduce((acc, line) => {
  const [local, cloudinary] = line.split('|');
  acc[local] = cloudinary;
  return acc;
}, {});

// Функция для обновления путей в файле
function updateFilePaths(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;

  // Заменяем пути в файле
  for (const [localPath, cloudinaryUrl] of Object.entries(urlMappings)) {
    // Экранируем специальные символы в пути
    const escapedPath = localPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Ищем различные варианты путей (с /images/ и без)
    const patterns = [
      new RegExp(`/images/${escapedPath}`, 'g'),
      new RegExp(`"images/${escapedPath}"`, 'g'),
      new RegExp(`'images/${escapedPath}'`, 'g')
    ];

    patterns.forEach(pattern => {
      if (pattern.test(content)) {
        content = content.replace(pattern, `"${cloudinaryUrl}"`);
        hasChanges = true;
      }
    });
  }

  // Сохраняем изменения, только если были замены
  if (hasChanges) {
    console.log(`✏️ Updating paths in ${filePath}`);
    fs.writeFileSync(filePath, content);
  }
}

// Функция для рекурсивного обхода директории с исходным кодом
function processSourceDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processSourceDirectory(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js')) {
      updateFilePaths(fullPath);
    }
  }
}

// Обновляем пути в исходном коде
console.log('Updating image paths in source code...');
processSourceDirectory(path.join(__dirname, '../src'));
console.log('✨ All paths updated successfully!');
