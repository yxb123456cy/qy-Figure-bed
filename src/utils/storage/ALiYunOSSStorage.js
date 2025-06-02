import OSS from 'ali-oss'
import { BaseStorage } from './BaseStorage'

/**
 * 阿里云OSS存储适配器
 */
export class ALiYunOSSStorage extends BaseStorage {
    /**
     * @param {Object} config - OSS配置
     * @param {string} config.endpoint - OSS终端节点
     * @param {string} config.accessKey - 访问密钥ID
     * @param {string} config.secretKey - 访问密钥密码
     * @param {string} config.bucket - Bucket名称
     */
    constructor(config) {
        super(config)

        this.client = new OSS({
            endpoint: config.endpoint,
            accessKeyId: config.accessKey,
            accessKeySecret: config.secretKey,
            bucket: config.bucket,
            secure: true
        })

        this.endpoint = config.endpoint
    }

    async upload(file) {
        try {
            const key = this.fileManager.generatePath(file.name)

            await this.client.put(key, file, {
                headers: { 'Content-Type': file.type }
            })

            return {
                url: this._generateUrl(
                    key,
                    `https://${this.bucket}.${this.endpoint}`
                ),
                key
            }
        } catch (error) {
            this._handleError(error, '上传')
        }
    }

    async delete(key) {
        try {
            await this.client.delete(key)
        } catch (error) {
            this._handleError(error, '删除')
        }
    }

    async listObjects(prefix = '') {
        try {
            const result = await this.client.list({
                prefix,
                'max-keys': 1000
            })
            return result.objects.map(item => ({
                key: item.name,
                lastModified: item.lastModified,
                size: item.size,
                url: this._generateUrl(
                    item.name,
                    `https://${this.bucket}.${this.endpoint}`
                )
            }))
        } catch (error) {
            this._handleError(error, '获取文件列表')
        }
    }

    async testConnection() {
        try {
            await this.client.list({ 'max-keys': 1 })
            return this._formatTestResult(true)
        } catch (error) {
            return this._formatTestResult(false, this._parseError(error))
        }
    }

    _parseError(error) {
        if (error.name === 'ConnectionError' || error.status === -1) {
            return '网络连接失败，请检查：\n1. Endpoint 是否正确\n2. 网络是否正常'
        }
        if (error.code === 'NoSuchBucket') {
            return 'Bucket不存在'
        }
        if (error.code === 'AccessDenied') {
            return '访问被拒绝，请检查权限配置'
        }
        if (error.code === 'InvalidAccessKeyId') {
            return 'AccessKey无效'
        }
        if (error.code === 'SignatureDoesNotMatch') {
            return 'SecretKey无效'
        }
        if (error.status && error.status !== 200) {
            return `请求失败(${error.status})：${error.message || '未知错误'}`
        }
        return error.message || '未知错误'
    }
}