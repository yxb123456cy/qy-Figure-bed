import { loadEnv } from 'vite';

export function formatLocalProxyOptions(mode) {
  const env = loadEnv(mode, process.cwd());
  const proxyKeys = JSON.parse(env.VITE_APP_VITE_PROXY_KEYS);
  const proxyConfig = {};
  
  proxyKeys.forEach(key => {
    proxyConfig[key] = {
      target: 'http://localhost:8080',
      changeOrigin: true
    };
  });
  
  return proxyConfig;
}