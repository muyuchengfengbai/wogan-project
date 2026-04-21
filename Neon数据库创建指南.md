# Neon 数据库创建指南

## 📦 第一步：注册 Neon 账号

1. **访问**：https://neon.tech

2. **点击**：`Sign Up`

3. **选择登录方式**（推荐用 GitHub）：
   - 用 GitHub 登录（最快）
   - 或用邮箱注册

---

## 🗄️ 第二步：创建数据库项目

### 1. 创建项目

登录后会自动进入创建页面，填写：

- **Project name**: `wogan-db`
- **Region**: 选择 `Asia Pacific (Singapore)` 或 `Asia Pacific (Tokyo)`（离中国最近）
- **Postgres version**: 保持默认（最新版本）

点击：`Create Project`

### 2. 保存连接信息

创建成功后，会显示连接字符串，**务必保存**：

```
postgresql://username:password@ep-xxxxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

**格式说明**：
- `username`: 数据库用户名
- `password`: 数据库密码
- `ep-xxxxx.ap-southeast-1.aws.neon.tech`: 数据库主机
- `neondb`: 数据库名称

---

## 🔧 第三步：初始化数据库

### 方法 1：使用 Neon SQL Editor（推荐）

1. **在 Neon 控制台**，点击左侧 `SQL Editor`

2. **复制并执行以下 SQL**：

```sql
-- 创建商品表
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  grade VARCHAR(20) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_kg DECIMAL(10,2) NOT NULL,
  origin VARCHAR(100),
  description TEXT,
  image_url TEXT,
  specification VARCHAR(50),
  batch_no VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建订单表
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_no VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  shipping_address TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建订单项表
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  product_name VARCHAR(100) NOT NULL,
  quantity_kg DECIMAL(10,2) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL
);

-- 创建溯源表
CREATE TABLE traceability (
  id SERIAL PRIMARY KEY,
  batch_no VARCHAR(50) UNIQUE NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  origin VARCHAR(100) NOT NULL,
  harvest_date DATE NOT NULL,
  quality_grade VARCHAR(20) NOT NULL,
  pesticide_test VARCHAR(50),
  fertilizer_info TEXT,
  processing_info TEXT,
  storage_info TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建果园传感器表
CREATE TABLE orchard_sensors (
  id SERIAL PRIMARY KEY,
  sensor_type VARCHAR(50) NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  location VARCHAR(100),
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入示例商品数据
INSERT INTO products (name, grade, price, stock_kg, origin, description, batch_no, specification) VALUES
('广西武鸣沃柑', '精品果', 12.80, 500.00, '广西武鸣', '果大皮薄，汁多味甜，富含维生素C', 'WG20240101', '5斤装'),
('广西武鸣沃柑', '一级果', 9.90, 800.00, '广西武鸣', '品质优良，性价比高', 'WG20240102', '5斤装'),
('广西武鸣沃柑', '精品果', 15.80, 300.00, '广西武鸣', '特级精选，送礼佳品', 'WG20240103', '10斤装');

-- 插入示例溯源数据
INSERT INTO traceability (batch_no, product_name, origin, harvest_date, quality_grade, pesticide_test, fertilizer_info, processing_info, storage_info) VALUES
('WG20240101', '广西武鸣沃柑', '广西武鸣县', '2024-01-15', '精品果', '农残检测合格', '有机肥料', '自动化分拣', '冷链运输'),
('WG20240102', '广西武鸣沃柑', '广西武鸣县', '2024-01-16', '一级果', '农残检测合格', '有机肥料', '人工分拣', '常温运输'),
('WG20240103', '广西武鸣沃柑', '广西武鸣县', '2024-01-17', '精品果', '农残检测合格', '有机肥料', '自动化分拣', '冷链运输');

-- 插入示例传感器数据
INSERT INTO orchard_sensors (sensor_type, value, unit, location) VALUES
('temperature', 25.5, '°C', '1号果园'),
('humidity', 65.0, '%', '1号果园'),
('soil_moisture', 45.0, '%', '1号果园'),
('light_intensity', 8500.0, 'lux', '1号果园');
```

3. **点击**：`Run` 执行

4. **验证**：执行以下查询确认数据已插入
```sql
SELECT * FROM products;
SELECT * FROM traceability;
SELECT * FROM orchard_sensors;
```

---

### 方法 2：使用本地 psql 命令

如果你熟悉命令行：

```bash
# 连接到 Neon 数据库
psql "postgresql://username:password@ep-xxxxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# 执行初始化脚本
\i /home/xiaobai/code/biye/woganproject/anything/apps/web/init_database.sql
```

---

## ✅ 第四步：验证数据库

在 Neon SQL Editor 中执行：

```sql
-- 查看所有表
\dt

-- 查看商品数据
SELECT id, name, grade, price, stock_kg FROM products;

-- 查看溯源数据
SELECT batch_no, product_name, quality_grade FROM traceability;

-- 查看传感器数据
SELECT sensor_type, value, unit FROM orchard_sensors;
```

**预期结果**：
- 5 张表：products, orders, order_items, traceability, orchard_sensors
- 3 条商品数据
- 3 条溯源数据
- 4 条传感器数据

---

## 📋 第五步：复制连接字符串

在 Neon 控制台：

1. **点击**：`Dashboard`

2. **找到**：`Connection String`

3. **复制完整的连接字符串**：
```
postgresql://username:password@ep-xxxxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

**保存这个字符串**，下一步部署 Vercel 时需要用到！

---

## 🎯 下一步

数据库创建完成后，继续：

1. **访问 Vercel**：https://vercel.com
2. **导入 GitHub 仓库**
3. **配置环境变量**（使用刚才的连接字符串）
4. **部署项目**

---

## 💡 提示

- Neon 免费版限制：
  - 存储：0.5 GB
  - 计算：100 小时/月
  - 对于毕业设计完全够用！

- 如果需要更多资源，可以升级到 Pro 版（$19/月）

---

## 需要帮助？

完成后告诉我：
1. 数据库创建成功了吗？
2. 连接字符串已保存了吗？
3. 准备好部署到 Vercel 了吗？
