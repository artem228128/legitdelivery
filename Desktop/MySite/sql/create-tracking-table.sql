-- Создание таблицы tracking в Supabase
CREATE TABLE IF NOT EXISTS tracking (
  id BIGSERIAL PRIMARY KEY,
  tracking_id TEXT NOT NULL UNIQUE,
  status INTEGER NOT NULL DEFAULT 1,
  delivery_date TEXT,
  customer_name TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Создание индекса для быстрого поиска по tracking_id (нечувствительный к регистру)
CREATE INDEX IF NOT EXISTS idx_tracking_id_lower ON tracking (LOWER(tracking_id));

-- Добавление RLS (Row Level Security) - опционально
ALTER TABLE tracking ENABLE ROW LEVEL SECURITY;

-- Удаляем существующие политики если есть
DROP POLICY IF EXISTS "Allow all access" ON tracking;

-- Создаем единую политику для всех операций
CREATE POLICY "Allow all access" ON tracking FOR ALL USING (true);

-- Вставка тестовых данных
INSERT INTO tracking (tracking_id, status, delivery_date, customer_name) 
VALUES 
  ('TEST123', 1, '2025-01-25', 'Тестовый клиент'),
  ('XYZ789', 7, '2025-01-20', 'Клиент 2')
ON CONFLICT (tracking_id) DO NOTHING; 