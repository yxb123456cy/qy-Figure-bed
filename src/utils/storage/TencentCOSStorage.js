import { BaseStorage } from './BaseStorage.js'
import COS from 'cos-js-sdk-v5'

export class TencentCOSStorage extends BaseStorage {
  /**
   * @param {Object} config - 腾讯云COS配置
   * @param {string} config.region -腾讯云COS终端节点
   * @param {string} config.secretId - 访问密钥ID
   * @param {string} config.secretKey - 访问密钥密码
   * @param {string} config.bucket - Bucket名称
   */
  constructor(config) {
    super(config)
    /**
     * 注册腾讯云cos客户端;
     * @type {COS}
     */
    const cos = new COS({
      SecretId: config.secretId,
      SecretKey: config.secretKey,
      Timeout: 1500, //设置超时时间;1.5s
      Domain: `${config.bucket}.cos.${config.region}.myqcloud.com`,
    })
    // 腾讯云cos客户端;
    this.client = cos
    this.region = config.region
    this.bucket = config.bucket
  }

  /**
   * 文件上传
   * @param file
   * @returns {Promise<void>}
   */
  async upload(file) {}

  /**
   * 文件删除;
   * @param key
   * @returns {Promise<void>}
   */
  async delete(key) {}

  /**
   * 获取文件列表;
   * @param prefix
   * @returns {Promise<void>}
   */
  async listObjects(prefix = '') {}

  /**
   * 腾讯云COS连接测试成功->编写完成;
   * @returns {Promise<{success: boolean, message: string|string}>}
   */
  async testConnection() {
    try {
      const res = await this.client.headBucket({
        Bucket: this.bucket, // 格式：BucketName-APPID
        Region: this.region, // 存储桶所在地域
      })
      console.log('腾讯云COS连通性测试结果:', res)
      return this._formatTestResult(true)
    } catch (error) {
      console.log(error)
      return this._formatTestResult(false, this._parseError(error))
    }
  }

  /**
   * 错误处理;
   * @param error
   * @private
   */
  _parseError(error) {
    console.log('腾讯云cos连通性检测失败:', error)
    return error.message || '未知错误'
  }
}
