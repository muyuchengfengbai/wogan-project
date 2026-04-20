-- 沃柑平台数据库初始化脚本
-- 创建时间: 2026-04-19

-- 1. 商品表
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    grade VARCHAR(50),
    price DECIMAL(10, 2) NOT NULL,
    stock_kg INTEGER DEFAULT 0,
    origin VARCHAR(255),
    description TEXT,
    image_url TEXT,
    specification VARCHAR(255),
    batch_no VARCHAR(100),
    sales_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 订单表
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_no VARCHAR(100) UNIQUE NOT NULL,
    user_id INTEGER,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(50),
    receiver_name VARCHAR(100),
    receiver_phone VARCHAR(20),
    receiver_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. 订单明细表
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    product_name VARCHAR(255),
    price DECIMAL(10, 2),
    quantity INTEGER,
    subtotal DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. 溯源记录表
CREATE TABLE IF NOT EXISTS traceability (
    id SERIAL PRIMARY KEY,
    batch_no VARCHAR(100) NOT NULL,
    product_id INTEGER REFERENCES products(id),
    action_type VARCHAR(50),
    action_date DATE,
    location VARCHAR(255),
    operator VARCHAR(100),
    details TEXT,
    temperature DECIMAL(5, 2),
    humidity DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. 果园传感器数据表
CREATE TABLE IF NOT EXISTS orchard_sensors (
    id SERIAL PRIMARY KEY,
    sensor_name VARCHAR(100),
    temperature DECIMAL(5, 2),
    humidity DECIMAL(5, 2),
    soil_moisture DECIMAL(5, 2),
    light_intensity INTEGER,
    location VARCHAR(255),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入示例数据

-- 示例商品
INSERT INTO products (name, grade, price, stock_kg, origin, description, image_url, specification, batch_no, sales_count) VALUES
('精品沃柑', 'A+', 12.80, 5000, '广西武鸣', '果大皮薄，汁多味甜，富含维生素C', 'https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=400', '5kg/箱', 'WG20260401', 1280),
('特级沃柑', 'A', 9.90, 8000, '四川眉山', '自然成熟，口感细腻，无籽率高', 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400', '3kg/箱', 'WG20260402', 856),
('优选沃柑', 'B+', 6.50, 12000, '云南红河', '性价比之选，适合家庭日常食用', 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400', '10kg/箱', 'WG20260403', 2341);

-- 示例订单
INSERT INTO orders (order_no, user_id, total_amount, status, payment_method, receiver_name, receiver_phone, receiver_address) VALUES
('WG1713456789001', 1001, 128.00, 'delivered', 'alipay', '张三', '13800138000', '广东省广州市天河区XX路XX号'),
('WG1713456789002', 1002, 99.00, 'shipped', 'wechat', '李四', '13900139000', '上海市浦东新区XX街XX号'),
('WG1713456789003', 1003, 65.00, 'pending', 'alipay', '王五', '13700137000', '北京市朝阳区XX大厦XX室');

-- 示例订单明细
INSERT INTO order_items (order_id, product_id, product_name, price, quantity, subtotal) VALUES
(1, 1, '精品沃柑', 12.80, 10, 128.00),
(2, 2, '特级沃柑', 9.90, 10, 99.00),
(3, 3, '优选沃柑', 6.50, 10, 65.00);

-- 示例溯源记录
INSERT INTO traceability (batch_no, product_id, action_type, action_date, location, operator, details, temperature, humidity) VALUES
('WG20260401', 1, '种植', '2025-11-01', '广西武鸣果园A区', '张师傅', '选用优质苗木，科学施肥', 22.5, 65.0),
('WG20260401', 1, '施肥', '2025-12-15', '广西武鸣果园A区', '李师傅', '有机肥料，绿色种植', 18.3, 70.2),
('WG20260401', 1, '采摘', '2026-03-20', '广西武鸣果园A区', '王师傅', '人工采摘，当日发货', 25.1, 58.5),
('WG20260401', 1, '包装', '2026-03-20', '武鸣分拣中心', '赵师傅', '自动化分拣，冷链包装', 15.0, 55.0),
('WG20260401', 1, '发货', '2026-03-21', '武鸣物流中心', '刘师傅', '冷链运输，48小时送达', 8.0, 60.0);

-- 示例传感器数据
INSERT INTO orchard_sensors (sensor_name, temperature, humidity, soil_moisture, light_intensity, location) VALUES
('A区1号传感器', 24.5, 62.3, 45.8, 85000, '广西武鸣果园A区'),
('A区2号传感器', 23.8, 64.1, 48.2, 82000, '广西武鸣果园A区'),
('B区1号传感器', 25.2, 60.5, 42.5, 88000, '广西武鸣果园B区');

-- 创建索引以提升查询性能
CREATE INDEX IF NOT EXISTS idx_products_batch_no ON products(batch_no);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_traceability_batch_no ON traceability(batch_no);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- 完成
SELECT 'Database initialized successfully!' as message;
