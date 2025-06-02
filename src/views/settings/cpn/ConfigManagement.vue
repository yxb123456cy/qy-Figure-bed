<template>
  <div class="settings-panel">
    <div class="panel-content">
      <!-- 信息提示卡片 -->
      <el-form-item class="info-card-item">
        <div class="info-card">
          <div class="info-title">
            <el-icon>
              <InfoFilled/>
            </el-icon>
            <span>配置管理说明</span>
          </div>
          <div class="info-content">
            您可以保存多个配置方案，方便在不同场景下快速切换。支持导入导出配置文件，便于在不同设备间同步设置。
          </div>
        </div>
      </el-form-item>

      <!-- 操作按钮组 -->
      <el-form-item class="actions-item">
        <el-button-group>
          <el-button @click="$refs.fileInput.click()">
            <el-icon>
              <Upload/>
            </el-icon>
            导入配置
          </el-button>
          <input
              ref="fileInput"
              type="file"
              accept=".json"
              style="display: none"
              @change="importConfigFile"
          >
          <el-button @click="importConfig">
            <el-icon>
              <Document/>
            </el-icon>
            剪贴板导入
          </el-button>
          <el-button @click="exportConfig">
            <el-icon>
              <Download/>
            </el-icon>
            导出配置
          </el-button>
          <el-button @click="showResetConfirm" type="danger">
            <el-icon>
              <RefreshRight/>
            </el-icon>
            重置设置
          </el-button>
        </el-button-group>
      </el-form-item>

      <!-- 保存配置区域 -->
      <el-form-item class="save-config-item">
        <div class="save-config">
          <el-input
              v-model="configName"
              class="config-input"
              placeholder="输入配置名称"
              clearable
          >
            <template #prefix>
              <el-icon>
                <Edit/>
              </el-icon>
            </template>
          </el-input>
          <el-button type="primary" @click="saveConfig" :disabled="!configName">
            <el-icon>
              <Plus/>
            </el-icon>
            保存配置
          </el-button>
        </div>
      </el-form-item>

      <!-- 配置列表 -->
      <el-form-item class="config-list-item">
        <div v-if="configList.length > 0" class="config-list">
          <el-card v-for="item in configList" :key="item.name" class="config-item" shadow="never">
            <div class="config-item-content">
              <div class="config-info">
                <div class="config-name">
                  <el-icon>
                    <Files/>
                  </el-icon>
                  <span class="name-text">{{ item.name }}</span>
                </div>
                <div class="config-time">
                  <span class="time-text">{{ formatTime(item.createTime) }}</span>
                </div>
              </div>

              <div class="config-actions">
                <el-tooltip content="应用此配置" placement="top">
                  <el-button type="primary" size="small" @click="applyConfig(item)">
                    <el-icon>
                      <Check/>
                    </el-icon>
                    应用
                  </el-button>
                </el-tooltip>

                <el-dropdown trigger="click" @command="handleCommand">
                  <el-button size="small">
                    <el-icon>
                      <More/>
                    </el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item :command="{ type: 'copy', item }">
                        <el-icon>
                          <CopyDocument/>
                        </el-icon>
                        复制
                      </el-dropdown-item>
                      <el-dropdown-item :command="{ type: 'rename', item }">
                        <el-icon>
                          <Edit/>
                        </el-icon>
                        改名
                      </el-dropdown-item>
                      <el-dropdown-item divided :command="{ type: 'delete', item }">
                        <el-icon>
                          <Delete/>
                        </el-icon>
                        删除
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </el-card>
        </div>
        <el-empty
            v-else
            description="暂无保存的配置"
            :image-size="120"
        >
          <template #image>
            <el-icon :size="40">
              <Files/>
            </el-icon>
          </template>
        </el-empty>
      </el-form-item>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {ConfigManager} from '../../..//utils/config/configManager.js'
import {
  Check,
  CopyDocument, Delete,
  Document,
  Download,
  Edit,
  Files,
  InfoFilled,
  More,
  Plus,
  RefreshRight, Upload
} from "@element-plus/icons-vue";

const props = defineProps({
  settings: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['reset-settings'])

// ===== 状态定义 =====
const configName = ref('')
const configList = ref([])
const fileInput = ref(null)

// ===== 方法定义 =====
const loadConfigList = () => {
  configList.value = ConfigManager.loadConfigList()
}

// 应用配置
const applyConfig = (config) => {
  ConfigManager.applyConfig(config, props.settings)
}

// 复制配置
const copyConfig = async (config) => {
  try {
    await navigator.clipboard.writeText(JSON.stringify(config.settings, null, 2))
    ElMessage.success('配置已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败：' + error.message)
  }
}

// 重命名配置
const renameConfig = (config) => {
  ConfigManager.renameConfig(config, configList.value)
}

// 导入配置文件
const importConfigFile = async (event) => {
  const file = event.target.files[0]
  if (file) {
    await ConfigManager.importConfigFile(file, configList.value, props.settings)
    event.target.value = ''
  }
}

// 从剪贴板导入
const importConfig = async () => {
  await ConfigManager.importFromClipboard((settings) => {
    const timestamp = ConfigManager.generateTimestamp()
    const newConfig = {
      name: `导入配置_${timestamp}`,
      settings,
      createTime: new Date().toISOString()
    }

    configList.value.push(newConfig)
    ConfigManager.saveConfigList(configList.value)

    // 自动应用配置
    Object.assign(props.settings, settings)
    localStorage.setItem('uploadSettings', JSON.stringify(settings))
  })
}

// 导出配置
const exportConfig = () => {
  ConfigManager.exportConfig(props.settings)
}

// 格式化时间
const formatTime = (timeStr) => {
  const date = new Date(timeStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 显示重置确认框
const showResetConfirm = () => {
  ElMessageBox.confirm(
      '确定要重置所有设置吗？当前未保存的设置将被覆盖。',
      '提示',
      {
        type: 'warning'
      }
  ).then(() => {
    emit('reset-settings')
    ElMessage.success('设置已重置')
  }).catch(() => {
  })
}

// 显示删除确认框
const showDeleteConfirm = (config) => {
  ConfigManager.deleteConfig(config, configList.value)
}

// 保存配置
const saveConfig = () => {
  if (ConfigManager.saveNewConfig(configName.value, props.settings, configList.value)) {
    configName.value = ''
  }
}

// 添加处理下拉菜单命令的方法
const handleCommand = ({type, item}) => {
  switch (type) {
    case 'copy':
      copyConfig(item)
      break
    case 'rename':
      renameConfig(item)
      break
    case 'delete':
      showDeleteConfirm(item)
      break
  }
}

// ===== 生命周期 =====
onMounted(() => {
  loadConfigList()
})
</script>

<style scoped>
@import './styles/common.css';

/* 信息卡片 */
.info-card {
  background-color: var(--el-color-info-light-9);
  border-radius: 8px;
  padding: 16px;
  width: 100%;
}

.info-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.info-content {
  color: var(--el-text-color-secondary);
  font-size: 13px;
  line-height: 1.6;
}

/* 按钮组 */
:deep(.el-button-group) {
  display: flex;
  width: 100%;
  gap: 12px;

  &::before,
  &::after {
    display: none;
  }

  .el-button {
    flex: 1;
    justify-content: center;

    .el-icon {
      margin-right: 6px;
    }
  }
}

/* 保存配置区域 */
.save-config {
  display: flex;
  gap: 12px;
  width: 100%;
}

.config-input {
  flex: 1;
}

/* 配置列表 */
.config-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  width: 100%;
}

.config-item {
  box-shadow: none;
}

.config-item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.config-info {
  flex: 1;
  min-width: 0;
}

.config-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin-bottom: 6px;

  .el-icon {
    color: var(--el-text-color-secondary);
  }
}

.name-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
}

.config-time {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.config-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

/* 空状态 */
:deep(.el-empty) {
  width: 100%;
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
  :deep(.el-button-group) {
    flex-wrap: wrap;
    gap: 8px;
  }

  :deep(.el-button-group .el-button) {
    width: calc(50% - 4px);
  }

  .config-list {
    grid-template-columns: 1fr;
  }

  .name-text {
    max-width: 200px;
  }
}

@media screen and (max-width: 480px) {
  :deep(.el-button-group) {
    flex-direction: column;
  }

  :deep(.el-button-group .el-button) {
    width: 100%;
  }

  .config-list {
    grid-template-columns: 1fr;
  }

  .name-text {
    max-width: 180px;
  }
}
</style>
