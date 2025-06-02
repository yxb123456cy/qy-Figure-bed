import { defineConfig, loadEnv } from 'vite';
import getPlugins from './vite/core/plugins';
import getBuildConfig from './vite/core/build';
import resolveConfig from './vite/core/resolve';
import { formatLocalProxyOptions } from './vite/core/proxy';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, './');
  const config = {
    build: getBuildConfig(command, mode),
    plugins: getPlugins(env),
    resolve: resolveConfig
  };

  // 开发模式启用代理
  if (env.VITE_APP_COMMAND === 'dev') {
    config.server = { proxy: formatLocalProxyOptions(mode) };
  }

  return config;
});
