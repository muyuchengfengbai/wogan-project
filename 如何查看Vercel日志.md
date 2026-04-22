# 如何查看 Vercel 函数日志

## 方法 1：通过 Vercel 控制台

1. 打开项目页面：https://vercel.com/muyuchengfengbais-projects/wogan-project

2. 点击顶部的 **Deployments** 标签

3. 点击最新的部署（绿色的 Ready）

4. 向下滚动找到 **Functions** 部分

5. 点击 `api/index.js` 函数

6. 查看 **Runtime Logs** - 这里会显示：
   - console.log 输出
   - 错误堆栈
   - 导入失败信息

## 方法 2：通过实时日志

1. 在项目页面点击 **Logs** 标签（顶部导航）

2. 选择 **Functions** 过滤器

3. 刷新你的网站触发错误

4. 实时查看错误日志

## 方法 3：通过 Vercel CLI

```bash
vercel logs wogan-project --follow
```

## 需要关注的错误信息

- ❌ `Cannot find module '../build/server/index.js'` - 路径问题
- ❌ `DATABASE_URL is not defined` - 环境变量未配置
- ❌ `app.fetch is not a function` - 导入的对象不正确
- ❌ `Timeout` - 函数执行超时

## 请把日志发给我

复制完整的错误信息，包括：
- 错误类型
- 错误消息
- 堆栈跟踪
- 任何 console.log 输出
