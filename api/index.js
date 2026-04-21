import { createRequestHandler } from '@react-router/node';
import { installGlobals } from '@react-router/node';

installGlobals();

const build = await import('./build/server/index.js');

export default async function handler(req, res) {
  const requestHandler = createRequestHandler(build);
  return requestHandler(req, res);
}
