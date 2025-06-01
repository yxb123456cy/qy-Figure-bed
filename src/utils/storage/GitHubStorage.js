import { BaseStorage } from './BaseStorage.js'
import COS from 'cos-js-sdk-v5'
import { Base64 } from 'js-base64'

/**
 * @param {Object} config - gitHub仓储配置;
 * @param {string} config.repoName - gitHub repoName;
 * @param {string} config.repoOwner - gitHub repoOwner;
 * @param {string} config.githubToken - gitHub token;
 * @param {string} config.bucket - Bucket名称
 */
export class GitHubStorage extends BaseStorage {
  constructor(config) {
    super(config)
    this.repoOwner = config.repoOwner
    this.repoName = config.repoName
    this.bucket = config.bucket
    this.githubToken = config.githubToken
  }

  _parseError(error) {
    console.log('Github上传图片失败:', error)
    return error.message || '未知错误'
  }

  async testConnection() {
    try {
      const text = 'github连通性测试字符串'
      // 2. GitHub API 配置
      const repoOwner = this.repoOwner
      const repoName = this.repoName
      const filePath = `test/test.txt` // 仓库中的文件路径
      const accessToken = this.githubToken

      const  base64 = Base64.encode(text)
      // 3. 发送 PUT 请求
      const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
        method: 'PUT',
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Test upload string',
          content: base64,
          branch: 'main',
        }),
      })

      const data = await response.json()
      if (response.ok) {
        console.log('gitHub仓储连通性测试结果:', true)
        return this._formatTestResult(true)
      } else {
        console.log('gitHub仓储连通性测试结果:', data.message)
        return this._formatTestResult(false)
      }
    } catch (error) {
      console.log(error)
      return this._formatTestResult(false, this._parseError(error))
    }
  }

  // 文件转 Base64
  _readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  async upload(file) {
    try {
      const key = this.fileManager.generatePath(file.name)
      // 1. 读取文件为 Base64
      const base64 = await this._readFileAsBase64(file)

      // 2. GitHub API 配置
      const repoOwner = this.repoOwner
      const repoName = this.repoName
      const filePath = `${this.bucket}/${key}` // 仓库中的存储路径
      const githubToken = this.githubToken // 前端明文存储不安全！

      // 3. 构造请求体
      const content = base64.split(',')[1] // 去除 dataURL 前缀
      const requestBody = {
        message: `Upload: ${key}`,
        content: content,
        branch: 'main',
      }
      // 4. 发送 PUT 请求
      const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
        method: 'PUT',
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })
      const result = await response.json()
      console.log(result)
      /**
       * @param {string} content.download_url
       */
      if (response.ok) {
        console.log(`上传成功！文件地址：${result.content.download_url}`, 'success')
        return {
          url: this._generateUrl(key, `${result.content.download_url}`),
          key,
        }
      } else {
        console.log(`上传失败：${result.message}`, 'error')
      }
    } catch (error) {
      console.log(`错误：${error.message}`, 'error')
    }
  }
}
