FROM node:18-alpine

WORKDIR /app

# 复制 package.json
COPY package.json ./

# 安装依赖
RUN npm install --legacy-peer-deps

# 复制项目文件
COPY . .

# 暴露端口
EXPOSE 4000

# 启动命令
CMD ["npm", "run", "dev"]
