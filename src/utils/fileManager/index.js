import { STORAGE_SERVICES, validateStorageConfig } from '../config/storageServices'
import { FILE_TYPES, NAME_RULES, DEFAULT_SETTINGS } from '../config/fileTypes'
import {
  OUTPUT_FORMATS,
  COMPRESSION_LEVELS,
  SIZE_LEVELS,
  getQualityLevel,
  getSizeLevel,
  getQualitySliderMarks,
  getSizeSliderMarks,
} from '../config/imageConfig'
import ImageCompressor from '../imageCompressor'
import { ALiYunOSSStorage } from '../storage/ALiYunOSSStorage.js'
import { TencentCOSStorage } from '../storage/TencentCOSStorage.js'
import { GitHubStorage } from '../storage/GitHubStorage.js'

/**
 * 暂时先只实现阿里云oss的;
 * @type {{oss: ALiYunOSSStorage}}
 */
// 存储服务映射
const STORAGE_CLASSES = {
  oss: ALiYunOSSStorage,
  cos: TencentCOSStorage,
  github: GitHubStorage,
}

/**
 * 文件管理器类
 * 用于处理文件上传的验证、路径生成、存储配置等
 */
export class FileManager {
  constructor(config = {}) {
    this.config = {
      uploadPath: config.uploadPath || DEFAULT_SETTINGS.uploadPath,
      nameRule: config.nameRule || DEFAULT_SETTINGS.nameRule,
      allowedTypes: config.allowedTypes || DEFAULT_SETTINGS.allowedTypes,
      maxFileSize: config.maxFileSize || DEFAULT_SETTINGS.maxFileSize,
    }

    this.imageCompressor = new ImageCompressor(config.image)
  }

  /**
   * 验证并处理文件
   */
  async processFile(file) {
    const validationResult = this.validateFile(file)
    if (validationResult !== true) {
      return { file: null, error: validationResult }
    }

    try {
      if (file.type.startsWith('image/')) {
        const compressedFile = await this.imageCompressor.compress(file)
        return { file: compressedFile, error: null }
      }

      return { file, error: null }
    } catch (error) {
      return { file: null, error: error.message }
    }
  }

  /**
   * 验证文件
   */
  validateFile(file) {
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > this.config.maxFileSize) {
      return `文件大小超过限制(${this.config.maxFileSize}MB)`
    }

    if (!this.config.allowedTypes.includes(file.type)) {
      return '不支持的文件格式'
    }

    return true
  }

  /**
   * 生成上传路径
   */
  generatePath(filename) {
    const date = new Date()
    const path = this.config.uploadPath
      .replace('{year}', date.getFullYear())
      .replace('{month}', String(date.getMonth() + 1).padStart(2, '0'))
      .replace('{day}', String(date.getDate()).padStart(2, '0'))

    const processedFilename = this._generateFilename(filename)
    return this._normalizePath(`${path}/${processedFilename}`)
  }

  /**
   * 生成文件名
   * @private
   */
  _generateFilename(originalFilename) {
    const ext = originalFilename.split('.').pop().toLowerCase()
    let basename

    switch (this.config.nameRule) {
      case 'timestamp':
        basename = Date.now().toString()
        break

      case 'random':
        basename = Math.random().toString(36).substring(2, 10)
        break

      case 'original':
      default:
        basename = originalFilename
          .split('.')[0]
          .replace(/[^a-zA-Z0-9-_.]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '')
    }

    return `${basename}.${ext}`
  }

  /**
   * 规范化路径
   * @private
   */
  _normalizePath(path) {
    return path.replace(/\/+/g, '/').replace(/^\//, '').replace(/\/$/, '')
  }

  // 静态方法
  static createStorage(type, config) {
    const validation = validateStorageConfig(type, config)
    if (!validation.isValid) {
      throw new Error(validation.message)
    }

    const StorageClass = STORAGE_CLASSES[type]
    if (!StorageClass) {
      throw new Error('不支持的存储类型')
    }

    const fileManager = new FileManager({
      uploadPath: config.uploadPath,
      nameRule: config.nameRule,
    })

    return new StorageClass({
      ...config[type],
      fileManager,
    })
  }

  static validateConfig(type, config) {
    return validateStorageConfig(type, config)
  }

  /**
   * 检查存储配置是否完整
   * @param {string} type - 存储类型
   * @param {Object} config - 配置对象
   * @returns {boolean} 配置是否完整
   */
  static isStorageConfigured(type, config) {
    if (!config || !type) return false

    const validation = validateStorageConfig(type, config)
    return validation.isValid && config[type] && Object.keys(config[type]).length > 0
  }

  /**
   * 获取默认设置
   * @returns {Object} 默认设置对象
   */
  static getDefaultSettings() {
    return {
      ...DEFAULT_SETTINGS,
      allowedTypes: [...DEFAULT_SETTINGS.allowedTypes],
      image: { ...DEFAULT_SETTINGS.image },
    }
  }

  /**
   * 获取文件命名规则列表
   * @returns {Object} 命名规则对象
   */
  static getNameRules() {
    return { ...NAME_RULES }
  }

  /**
   * 获取图片输出格式列表
   * @returns {Object} 输出格式对象
   */
  static getOutputFormats() {
    return { ...OUTPUT_FORMATS }
  }

  /**
   * 获取支持的存储服务列表
   * @returns {Object} 存储服务配置对象
   */
  static getSupportedStorages() {
    return { ...STORAGE_SERVICES }
  }
}

// 导出配置和辅助函数
export {
  STORAGE_SERVICES,
  FILE_TYPES,
  NAME_RULES,
  OUTPUT_FORMATS,
  COMPRESSION_LEVELS,
  SIZE_LEVELS,
  getQualityLevel,
  getSizeLevel,
  getQualitySliderMarks,
  getSizeSliderMarks,
  DEFAULT_SETTINGS,
}
