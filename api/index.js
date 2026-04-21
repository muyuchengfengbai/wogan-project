// Vercel Serverless Function 入口
// 适配 React Router 7 + Hono 应用

export default async function handler(req, res) {
  try {
    // 导入构建后的 Hono 应用
    const { default: app } = await import('../build/server/index.js');

    // 构建完整的 URL
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const url = `${protocol}://${host}${req.url}`;

    // 创建标准 Request 对象
    const request = new Request(url, {
      method: req.method,
      headers: req.headers,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body),
    });

    // 调用 Hono 应用的 fetch 方法
    const response = await app.fetch(request, {
      // 传递 Vercel 环境变量
      env: process.env,
    });

    // 设置响应状态码
    res.status(response.status);

    // 复制响应头
    for (const [key, value] of response.headers.entries()) {
      res.setHeader(key, value);
    }

    // 发送响应体
    if (response.body) {
      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        const json = await response.json();
        res.json(json);
      } else if (contentType.includes('text/')) {
        const text = await response.text();
        res.send(text);
      } else {
        const buffer = await response.arrayBuffer();
        res.send(Buffer.from(buffer));
      }
    } else {
      res.end();
    }
  } catch (error) {
    console.error('❌ Serverless Function Error:', error);
    console.error('Stack:', error.stack);

    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      details: process.env.NODE_ENV === 'production' ? undefined : {
        stack: error.stack,
        cause: error.cause,
      }
    });
  }
}
