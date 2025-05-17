// 文件类型配置
export const FILE_TYPES = {
  image: {
    label: '图片文件',
    mimeTypes: [
      { value: 'image/jpeg', label: 'JPEG', extensions: ['jpg', 'jpeg'] },
      { value: 'image/png', label: 'PNG', extensions: ['png'] },
      { value: 'image/gif', label: 'GIF', extensions: ['gif'] },
      { value: 'image/webp', label: 'WebP', extensions: ['webp'] },
      { value: 'image/avif', label: 'AVIF', extensions: ['avif'] },
      { value: 'image/x-icon', label: 'ICO', extensions: ['ico'] },
      { value: 'image/svg+xml', label: 'SVG', extensions: ['svg'] },
      { value: 'image/bmp', label: 'BMP', extensions: ['bmp'] },
      { value: 'image/tiff', label: 'TIFF', extensions: ['tiff', 'tif'] }
    ]
  }
}

// 文件命名规则
export const NAME_RULES = {
  'original': {
    value: 'original',
    label: '原文件名',
    description: '保持原始文件名'
  },
  'timestamp': {
    value: 'timestamp',
    label: '时间戳',
    description: '使用上传时的时间戳作为文件名'
  },
  'random': {
    value: 'random',
    label: '随机字符',
    description: '使用随机字符串作为文件名'
  }
}

// 默认设置
export const DEFAULT_SETTINGS = {
  uploadPath: 'i/{year}/{month}/{day}',
  nameRule: 'original',
  maxFileSize: 10, //默认10MB;
  // 默认允许上传的图片格式;
  allowedTypes: [
    'image/jpeg',
    'image/png', 
    'image/gif',
    'image/webp',
    'image/avif'
  ],
  image: {
    compressionRatio: 75,
    outputFormat: 'original'
  }
}