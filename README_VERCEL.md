# Деплой на Vercel

## Подготовка к деплою

### 1. Структура проекта
```
mysite/
├── api/                    # Vercel Serverless Functions
│   ├── tracking/
│   │   └── [trackingId].js
│   └── tracking-data.js
├── public/                 # Статические файлы
├── src/                    # React приложение
├── google-credentials.json # Google Service Account ключ
├── package.json
├── vercel.json            # Конфигурация Vercel
└── README_VERCEL.md
```

### 2. Установка зависимостей
```bash
npm install googleapis google-auth-library
```

### 3. Настройка Google Service Account
1. Создайте Service Account в Google Cloud Console
2. Скачайте JSON ключ
3. Переименуйте в `google-credentials.json`
4. Разместите в корне проекта

### 4. Настройка переменных окружения
В Vercel Dashboard добавьте:
- `GOOGLE_SHEETS_ID`: ID вашей Google таблицы

### 5. Деплой
```bash
# Установите Vercel CLI
npm i -g vercel

# Логин в Vercel
vercel login

# Деплой
vercel --prod
```

## API Endpoints

### GET /api/tracking/[trackingId]
Получение статуса по трек-номеру

**Пример:**
```
GET /api/tracking/ABC123
```

**Ответ:**
```json
{
  "success": true,
  "trackingId": "ABC123",
  "statusNumber": 5
}
```

### GET /api/tracking-data
Получение всех данных отслеживания

**Ответ:**
```json
{
  "success": true,
  "data": [
    {
      "trackingId": "ABC123",
      "status": 5
    }
  ]
}
```

## Важные моменты

1. **Google Service Account ключ** должен быть в корне проекта
2. **Google Sheets ID** настраивается в переменных окружения
3. **CORS** настраивается автоматически в Vercel
4. **Serverless Functions** имеют ограничения по времени выполнения (10 секунд)

## Локальная разработка

```bash
# Запуск React приложения
npm start

# Запуск локального сервера (для тестирования)
node server.js
```

## Мониторинг

В Vercel Dashboard можно отслеживать:
- Логи API функций
- Статистику запросов
- Ошибки и производительность 