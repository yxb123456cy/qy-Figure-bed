// 输出格式配置
export const OUTPUT_FORMATS = {
  'original': {
    value: 'original',
    label: '原格式',
    description: '保持原始格式不变'
  },
  'jpeg': {
    value: 'jpeg',
    label: 'JPEG',
    description: '适用于照片等复杂图像'
  },
  'png': {
    value: 'png',
    label: 'PNG',
    description: '适用于图标、截图等需要保持透明度的图像'
  },
  'webp': {
    value: 'webp',
    label: 'WebP',
    description: '谷歌开发的新一代图像格式，在保证图像质量的同时提供更小的文件体积'
  },
  'avif': {
    value: 'avif',
    label: 'AVIF',
    description: '新一代图像格式，提供更高的压缩率和图像质量'
  }
}

// 压缩质量等级配置
export const COMPRESSION_LEVELS = {
  original: {
    value: 100,
    label: '原图',
    type: 'info'
  },
  recommended: {
    value: 75,
    label: '推荐',
    type: 'success'
  },
  medium: {
    value: 50,
    label: '中等',
    type: 'primary'
  },
  high: {
    value: 25,
    label: '高压',
    type: 'warning'
  },
  extreme: {
    value: 0,
    label: '极限',
    type: 'danger'
  }
}

// 文件大小等级配置
export const SIZE_LEVELS = {
  recommended: {
    max: 10,
    label: '推荐',
    type: 'success'
  },
  medium: {
    max: 25,
    label: '适中',
    type: 'warning'
  },
  large: {
    max: 50,
    label: '较大',
    type: 'danger'
  }
}

// 获取压缩质量等级信息
export const getQualityLevel = (ratio) => {
  const levels = Object.values(COMPRESSION_LEVELS).sort((a, b) => b.value - a.value)
  return levels.find(level => ratio >= level.value) || COMPRESSION_LEVELS.extreme
}

// 获取文件大小等级信息
export const getSizeLevel = (size) => {
  return Object.values(SIZE_LEVELS).find(
    level => size <= level.max
  ) || SIZE_LEVELS.recommended
}

// 获取压缩质量滑块刻度
export const getQualitySliderMarks = () => {
  return {
    100: '原图',
    75: '推荐',
    50: '中等',
    25: '高压',
    0: '极限'
  }
}

// 获取文件大小滑块刻度
export const getSizeSliderMarks = () => {
  return {
    1: '1MB',
    10: '10MB',
    25: '25MB',
    50: '50MB'
  }
}