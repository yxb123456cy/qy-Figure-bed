import { BaseStorage } from './BaseStorage.js'
import ObsClient from 'esdk-obs-browserjs'

export class HuaweiOBSStorage extends BaseStorage {
  constructor(config) {
    super(config)
    // 创建ObsClient实例
    this.client = new ObsClient({
      access_key_id: config.accessKey,
      secret_access_key: config.secretKey,
      //'OBS服务的对应Server 例:obs.ap-southeast-1.myhuaweicloud.com',
      server: `https://${config.server}`,
    })
    this.client.initLog({
      level: 'info', // 配置日志级别 info级别日志;
    })
    this.server = config.server
    this.bucket = config.bucket //对应存储桶;
  }

  async upload(file) {
    try {
      //生成Key;
      const key = this.fileManager.generatePath(file.name)
      this.client.putObject({
        Bucket: this.bucket,
        Key: key,
        SourceFile: file,
        ACL: this.client.enums.AclPublicRead,
      })
      console.log('华为云OBS上传成功')
      return {
        //https://qy-image-web-site.obs.cn-south-1.myhuaweicloud.com/i/2025/06/03/14.jpg
        url: this._generateUrl(key, `https://${this.bucket}.${this.server}`),
        key,
      }
    } catch (err) {
      console.log('上传失败', err)
      this._handleError(err, '上传')
    }
  }

  async delete(key) {
    try {
      const res = await this.client.deleteObject({ Bucket: this.bucket, Key: key })
      console.log(`华为云OBS删除图片${key}的结果为${res.CommonMsg.Status}`)
    } catch (error) {
      this._handleError(error, '删除')
    }
  }

  async listObjects(prefix) {
    try {
      let data
      const res = await this.client.listObjects({
        Bucket: this.bucket,
        Prefix: prefix,
        MaxKeys: 100,
      })
      console.log(res.InterfaceResult.Contents)
      data = res.InterfaceResult.Contents
      return data.map((item) => ({
        key: item.Key,
        lastModified: item.LastModified,
        size: item.Size,
        url: this._generateUrl(item.Key, `https://${this.bucket}.${this.server}`),
      }))
    } catch (error) {
      this._handleError(error, '获取文件列表')
    }
  }

  //通过存储桶是否存在来测试连通性;
  async testConnection() {
    try {
      const acl = await this.client.setBucketAcl({
        Bucket: this.bucket,
        ACL: this.client.enums.AclPublicReadWriteDelivered,
      })
      console.log('acl:', acl)
      const res = await this.client.headBucket({ Bucket: this.bucket })
      console.log('华为云OBS连通性测试结果:', res.CommonMsg.Status)
      if (res.CommonMsg.Status === 200) return this._formatTestResult(true)
    } catch (error) {
      console.log(error)
      return this._formatTestResult(false, this._parseError(error))
    }
  }

  _parseError(error) {
    console.log('华为云OBS连通性检测失败:', error)
    return error.message || '未知错误'
  }
}
