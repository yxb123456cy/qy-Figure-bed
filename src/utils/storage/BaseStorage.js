/**
 * 存储适配器基类
 */
export class BaseStorage {
    /**
     * @param {Object} config - 配置对象
     * @param {string} config.bucket - 存储桶名称
     * @param {string} [config.customDomain] - 自定义域名
     * @param {Object} config.fileManager - 文件管理器实例
     */
    constructor(config) {
      this.config = config
      this.bucket = config.bucket
      this.customDomain = config.customDomain
      this.fileManager = config.fileManager
    }
  
    /**
     * 上传文件
     * @param {File} file - 文件对象
     * @returns {Promise<{url: string, key: string}>}
     */
    async upload(file) {
      throw new Error('需要实现upload方法')
    }
  
    /**
     * 删除文件
     * @param {string} key - 文件标识符
     * @returns {Promise<void>}
     */
    async delete(key) {
      throw new Error('需要实现delete方法')
    }
  
    /**
     * 获取文件列表
     * @param {string} prefix - 前缀
     * @returns {Promise<Array<{key: string, url: string, lastModified: Date, size: number}>>}
     */
    async listObjects(prefix) {
      throw new Error('需要实现listObjects方法')
    }
  
    /**
     * 测试连接
     * @returns {Promise<{success: boolean, message: string}>}
     */
    async testConnection() {
      throw new Error('需要实现testConnection方法')
    }
  
    /**
     * 统一的错误处理
     * @protected
     * @param {Error} error - 错误对象
     * @param {string} operation - 操作类型
     * @throws {Error} 包含详细错误信息的Error对象
     */
    _handleError(error, operation) {
      console.error(`${operation}错误:`, error)
      throw new Error(`${operation}失败：${this._parseError(error)}`)
    }
  
    /**
     * 通用错误解析
     * @protected
     * @abstract
     * @param {Error} error - 错误对象
     * @returns {string} 错误信息
     */
    _parseError(error) {
      throw new Error('需要实现_parseError方法')
    }
  
    /**
     * 生成完整URL
     * @protected
     * @param {string} key - 文件键值
     * @param {string} defaultDomain - 默认域名
     * @returns {string} 完整的文件URL
     */
    _generateUrl(key, defaultDomain) {
      if (this.customDomain) {
        return `https://${this.customDomain}/${key}`
      }
      return `${defaultDomain}/${key}`
    }
  
    /**
     * 统一的连接测试结果格式化
     * @protected
     * @param {boolean} success - 是否成功
     * @param {string} [message] - 错误信息
     * @returns {Object} 格式化的测试结果
     */
    _formatTestResult(success, message = '') {
      return {
        success,
        message: success ? '连接测试成功' : `连接测试失败：${message}`
      }
    }
  }