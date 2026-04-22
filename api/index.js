// Vercel Serverless Function Entry
export default async function handler(req, res) {
  try {
    // 动态导入构建后的服务器
    const { default: app } = await import('../build/server/index.js');

    // 将 Vercel Request 转换为标准 Request
    const url = new URL(req.url || '/', `https://${req.headers.host}`);
    const request = new Request(url, {
      method: req.method,
      headers: req.headers,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : req.body
    });

    // 调用 Hono 应用
    const response = await app.fetch(request);

    // 转换响应
    res.status(response.status);
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    const body = await response.text();
    res.send(body);
  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
