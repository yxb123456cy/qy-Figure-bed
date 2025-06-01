import { BaseStorage } from './BaseStorage.js'
import COS, { CosObject, ETag, IsoDateTime, Key, Owner, StorageClass } from 'cos-js-sdk-v5'

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
   * 文件上传;
   * @param file
   * @returns {Promise<{url: string, key}>}
   */
  // 完成腾讯云cos文件上传; 使用了腾讯云cos的高级API;
  async upload(file) {
    try {
      //生成Key;
      const key = this.fileManager.generatePath(file.name)
      const data = await this.client.uploadFile({
        Bucket: this.bucket, // 填入您自己的存储桶，必须字段
        Region: this.region, // 存储桶所在地域，例如 ap-beijing，必须字段
        Key: key, // 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段
        Body: file, // 必须，上传文件对象，可以是 input[type="file"]标签选择本地文件后得到的 file 对象
        onTaskReady: function (taskId) {
          // 非必须
          console.log('腾讯云cos上传任务ID:', taskId)
        },
        onProgress: function (progressData) {
          // 非必须
          console.log(JSON.stringify(progressData))
        },
        // 支持自定义 headers 非必须
        Headers: { 'Content-Type': file.type },
      })
      console.log('腾讯云cos上传成功', data)
      return {
        url: this._generateUrl(key, `http://${this.bucket}.cos.${this.region}.myqcloud.com`),
        key,
      }
    } catch (err) {
      console.log('上传失败', err)
      this._handleError(err, '上传')
    }
  }

  /**
   * 文件删除;
   * @param key
   * @returns {Promise<void>}
   */
  async delete(key) {
    try {
      const res = await this.client.deleteObject({
        Bucket: this.bucket, // 填入您自己的存储桶，必须字段
        Region: this.region, // 存储桶所在地域，例如ap-beijing，必须字
        Key: key, // 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段
      })
      console.log(res)
      console.log(`腾讯云COS删除图片${key}的结果为${res.statusCode}`)
    } catch (error) {
      this._handleError(error, '删除')
    }
  }

  async listObjects(prefix = '') {
    try {
      // 采用腾讯云COS 获取对象列表API的 Promise写法;
      //  getBucket(params: COS.GetBucketParams): Promise<COS.GetBucketResult>;
      const res = await this.client.getBucket({
        Bucket: this.bucket, // 填入您自己的存储桶，必须字段
        Region: this.region, // 存储桶所在地域，例如ap-beijing，必须字段
        Prefix: prefix, // Prefix表示列出的object的key以prefix开始，非必须
      })
      console.log(res.Contents)
      return res.Contents.map((item) => ({
        key: item.Key,
        lastModified: item.LastModified,
        size: item.Size,
        url: this._generateUrl(item.Key, `http://${this.bucket}.cos.${this.region}.myqcloud.com`),
      }))
    } catch (error) {
      this._handleError(error, '获取文件列表')
    }
  }

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
