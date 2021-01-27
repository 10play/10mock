#!/usr/bin/env node
import app from './app';
import stdio from 'stdio';

const ops = stdio.getopt({
  'port': {key: 'p', args: 1, default: '8000', required: false, description: 'The port that the 10mock will run on'},
  'proxy': {key: 'x', args: 1, default: false, required: false, description: 'The proxy url for a real server'},
});


const PORT = ops?.port || 8000;
if (ops?.proxy) {
  process.env.PROXY_URL = ops?.proxy as string
}
app.listen(PORT, () => {
  console.log(`[10mock]: Server is running at https://localhost:${PORT}${ops?.proxy ? `proxy set to: ${ops?.proxy}` : ''}`);
});
