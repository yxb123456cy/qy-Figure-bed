import { createFilter } from 'vite'

// 构建信息：在构建完成后生成报告
export const buildInfoPlugin = () => ({
  name: 'build-info',
  apply: 'build',

  async closeBundle() {
    const { performance } = await import('node:perf_hooks')
    const { getBuildSize } = await import('./utils.js')
    
    console.log('\n📦 构建报告:')
    console.log(`构建耗时: ${(performance.now() / 1000).toFixed(2)}s`)
    console.log(`产物大小: ${await getBuildSize('dist')} MB`)
  }
})

// 热更新守护：防止频繁刷新
export const hmrGuardPlugin = () => ({
  name: 'hmr-guard',
  enforce: 'post',

  handleHotUpdate({ file, server }) {
    if (file.includes('config')) {
      server.ws.send({
        type: 'full-reload',
        path: '*'
      })
      return []
    }
  }
})
