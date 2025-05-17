import {ElMessage, ElMessageBox} from "element-plus";

export class ConfigManager {
  /**
   * 从本地存储加载配置列表
   * @param {string} storageKey - localStorage的键名
   * @returns {Array} 配置列表
   */
  static loadConfigList(storageKey = 'settingsConfigs') {
    try {
      const savedConfigs = localStorage.getItem(storageKey)
      return savedConfigs ? JSON.parse(savedConfigs) : []
    } catch (error) {
      ElMessage.error('加载配置列表失败')
      console.error('加载配置列表失败:', error)
      return []
    }
  }

  /**
   * 保存配置列表到本地存储
   * @param {Array} configList - 配置列表
   * @param {string} storageKey - localStorage的键名
   */
  static saveConfigList(configList, storageKey = 'settingsConfigs') {
    try {
      localStorage.setItem(storageKey, JSON.stringify(configList))
    } catch (error) {
      ElMessage.error('保存配置列表失败')
      console.error('保存配置列表失败:', error)
    }
  }

  /**
   * 导出配置到文件
   * @param {Object} settings - 配置对象
   * @param {string} prefix - 文件名前缀
   */
  static exportConfig(settings, prefix = 'settings') {
    try {
      // 创建完整的配置对象，包含必要的结构
      const configData = {
        settings: settings,
        createTime: new Date().toISOString()
      }
      
      const blob = new Blob([JSON.stringify(configData, null, 2)], { 
        type: 'application/json' 
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${prefix}-${new Date().toISOString().slice(0,10)}.json`
      link.click()
      URL.revokeObjectURL(url)
      
      ElMessage.success('配置已导出')
    } catch (error) {
      ElMessage.error('导出失败：' + error.message)
    }
  }

  /**
   * 从剪贴板导入配置
   * @param {Function} onSuccess - 导入成功的回调函数
   */
  static async importFromClipboard(onSuccess) {
    try {
      const text = await navigator.clipboard.readText()
      let configData = JSON.parse(text)
      
      // 处理直接导入的settings对象的情况
      if (!configData.settings && typeof configData === 'object') {
        configData = { settings: configData }
      }
      
      if (!configData || !configData.settings || typeof configData.settings !== 'object') {
        throw new Error('无效的配置数据')
      }

      onSuccess(configData.settings)
      ElMessage.success('配置已导入')
    } catch (error) {
      ElMessage.error('导入失败：' + error.message)
    }
  }

  /**
   * 生成时间戳格式的名称
   * @returns {string} 格式化的时间戳
   */
  static generateTimestamp() {
    return new Date().toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/[\/\s:]/g, '')
  }

  /**
   * 应用配置
   * @param {Object} config - 要应用的配置
   * @param {Object} currentSettings - 当前设置对象的引用
   * @returns {Promise<void>}
   */
  static async applyConfig(config, currentSettings) {
    await ElMessageBox.confirm('确定要应用该配置吗？当前未保存的设置将被覆盖。', '提示', {
      type: 'warning'
    })
    
    Object.assign(currentSettings, config.settings)
    localStorage.setItem('uploadSettings', JSON.stringify(config.settings))
    ElMessage.success('配置已应用')
  }

  /**
   * 重命名配置
   * @param {Object} config - 要重命名的配置
   * @param {Array} configList - 配置列表
   * @returns {Promise<void>}
   */
  static async renameConfig(config, configList) {
    const { value } = await ElMessageBox.prompt('请输入新的配置名称', '重命名配置', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputValue: config.name,
      inputValidator: (value) => {
        if (!value.trim()) return '配置名称不能为空'
        const exists = configList.some(item => 
          item.name === value.trim() && item !== config
        )
        return exists ? '配置名称已存在' : true
      }
    })

    const index = configList.findIndex(item => item.name === config.name)
    if (index > -1) {
      configList[index] = { ...config, name: value.trim() }
      this.saveConfigList(configList)
      ElMessage.success('重命名成功')
    }
  }

  /**
   * 导入配置文件
   * @param {File} file - 配置文件
   * @param {Array} configList - 配置列表
   * @param {Object} currentSettings - 当前设置对象的引用
   * @returns {Promise<void>}
   */
  static importConfigFile(file, configList, currentSettings) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          let configData = JSON.parse(e.target.result)
          
          // 处理直接导入的settings对象的情况
          if (!configData.settings && typeof configData === 'object') {
            configData = { settings: configData }
          }

          if (!configData.settings || typeof configData.settings !== 'object') {
            throw new Error('无效的配置文件')
          }

          const timestamp = this.generateTimestamp()
          const newConfig = {
            name: `导入配置_${timestamp}`,
            settings: configData.settings,
            createTime: new Date().toISOString()
          }

          configList.push(newConfig)
          this.saveConfigList(configList)
          
          // 自动应用配置
          Object.assign(currentSettings, configData.settings)
          localStorage.setItem('uploadSettings', JSON.stringify(configData.settings))
          
          ElMessage.success('配置已导入并自动应用')
          resolve()
        } catch (error) {
          ElMessage.error('导入失败：' + error.message)
          reject(error)
        }
      }
      reader.readAsText(file)
    })
  }

  /**
   * 删除配置
   * @param {Object} config - 要删除的配置
   * @param {Array} configList - 配置列表
   * @returns {Promise<void>}
   */
  static async deleteConfig(config, configList) {
    await ElMessageBox.confirm(
      `确定要删除该配置吗？此操作不可恢复。`,
      '提示',
      { type: 'warning' }
    )
    
    const index = configList.findIndex(item => item.name === config.name)
    if (index > -1) {
      configList.splice(index, 1)
      this.saveConfigList(configList)
      ElMessage.success('配置已删除')
    }
  }

  /**
   * 保存新配置
   * @param {string} name - 配置名称
   * @param {Object} settings - 当前设置
   * @param {Array} configList - 配置列表
   * @returns {boolean} 是否保存成功
   */
  static saveNewConfig(name, settings, configList) {
    const trimmedName = name.trim()
    
    if (!trimmedName) {
      ElMessage.warning('请输入配置名称')
      return false
    }

    if (configList.some(config => config.name === trimmedName)) {
      ElMessage.warning('配置名称已存在')
      return false
    }

    const newConfig = {
      name: trimmedName,
      settings: { ...settings },
      createTime: new Date().toISOString()
    }

    configList.push(newConfig)
    this.saveConfigList(configList)
    ElMessage.success('配置保存成功')
    return true
  }
}