<template>
  <div class="settings-container">
    <!-- 左侧设置面板 -->
    <section class="settings-main">
      <el-tabs
          v-model="activeMenu"
          class="settings-tabs"
          @tab-change="handleMenuSelect"
      >
        <el-tab-pane name="basic">
          <template #label>
            <div class="tab-label">
              <el-icon>
                <Setting/>
              </el-icon>
              <span>基础设置</span>
            </div>
          </template>
          <BasicSettings
              ref="basicSettingsRef"
              v-model:settings="settings"
          />
        </el-tab-pane>

        <el-tab-pane name="image">
          <template #label>
            <div class="tab-label">
              <el-icon>
                <Picture/>
              </el-icon>
              <span>图像处理</span>
            </div>
          </template>
          <ImageSettings v-model:settings="settings"/>
        </el-tab-pane>

        <el-tab-pane name="storage">
          <template #label>
            <div class="tab-label">
              <el-icon>
                <Box/>
              </el-icon>
              <span>存储配置</span>
            </div>
          </template>
          <StorageSettings
              ref="storageSettingsRef"
              v-model:settings="settings"
          />
        </el-tab-pane>

        <el-tab-pane name="config">
          <template #label>
            <div class="tab-label">
              <el-icon>
                <Files/>
              </el-icon>
              <span>配置管理</span>
            </div>
          </template>
          <ConfigManagement
              :settings="settings"
              @reset-settings="resetSettings"
          />
        </el-tab-pane>
      </el-tabs>

      <!-- 底部保存按钮 -->
      <div v-if="activeMenu !== 'config'" class="panel-footer">
        <el-button type="primary" @click="handleSaveSettings">
          <template #icon>
            <el-icon>
              <Check/>
            </el-icon>
          </template>
          保存设置
        </el-button>
      </div>
    </section>

    <!-- 右侧帮助面板 -->
    <aside class="help-panel">
      <div class="help-content">
        <div class="help-body">
          <template v-if="activeMenu === 'basic'">
            <h4>基础设置说明</h4>
            <p>配置上传目录、文件命名规则、支持的图片格式等基本参数。</p>
            <ul>
              <li>上传目录支持动态变量：{year}、{month}、{day}</li>
              <li>文件命名可选择多种规则，支持时间戳、随机字符等</li>
              <li>可限制上传文件的大小和格式</li>
            </ul>
          </template>

          <template v-else-if="activeMenu === 'image'">
            <h4>图像处理说明</h4>
            <p>配置图片压缩和转换参数，优化图片质量和大小。</p>
            <ul>
              <li>压缩质量影响图片文件大小和清晰度</li>
              <li>可选择输出格式进行图片转换</li>
              <li>建议根据实际需求调整参数</li>
            </ul>
          </template>

          <template v-else-if="activeMenu === 'storage'">
            <h4>存储配置说明</h4>
            <p>配置图片存储服务的连接参数。</p>
            <ul>
              <li>支持多种存储服务，可根据需求选择</li>
              <li>请确保填写正确的访问凭证</li>
              <li>建议使用自定义域名提升访问速度</li>
            </ul>
          </template>

          <template v-else>
            <h4>配置管理说明</h4>
            <p>管理多个配置方案，支持导入导出功能。</p>
            <ul>
              <li>可保存多个配置方案便于切换</li>
              <li>支持导入导出配置文件</li>
              <li>可随时重置恢复默认设置</li>
            </ul>
          </template>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import {ref, watch, provide} from 'vue'
import {onBeforeRouteLeave} from 'vue-router'
import {Box, Check, Files, Picture, Setting} from "@element-plus/icons-vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {FileManager} from "../../utils/fileManager/index.js";
import BasicSettings from "./cpn/BasicSettings.vue";
import StorageSettings from "./cpn/StorageSettings.vue";
import ConfigManagement from "./cpn/ConfigManagement.vue";
import ImageSettings from "./cpn/ImageSettings.vue";


// ===== 状态定义 =====
const activeMenu = ref('basic')
const settings = ref(null)
const hasUnsavedChanges = ref(false)

// 组件引用
const basicSettingsRef = ref(null)
const storageSettingsRef = ref(null)

// ===== 初始化逻辑 =====
const initSettings = () => {
  const defaultSettings = FileManager.getDefaultSettings()
  const savedSettings = localStorage.getItem('uploadSettings')

  if (savedSettings) {
    settings.value = {
      ...defaultSettings,
      ...JSON.parse(savedSettings),
      storageType: JSON.parse(savedSettings).storageType || defaultSettings.storageType
    }
  } else {
    settings.value = defaultSettings
  }
}

// 初始化设置
initSettings()

// ===== 变更监听 =====
watch(settings, () => {
  hasUnsavedChanges.value = true
}, {deep: true})

// ===== 事件处理 =====
const handleMenuSelect = (index) => {
  activeMenu.value = index
}

const handleSaveSettings = async () => {
  try {
    // 使用 Promise.all 并行验证
    const [basicValidation, storageValidation] = await Promise.all([
      basicSettingsRef.value?.validate(),
      storageSettingsRef.value?.validate()
    ])

    // 如果基础设置验证失败
    if (basicValidation && !basicValidation.valid) {
      activeMenu.value = 'basic'
      return false
    }

    // 如果存储设置验证失败
    if (storageValidation && !storageValidation.valid) {
      activeMenu.value = 'storage'
      return false
    }

    // 保存设置
    localStorage.setItem('uploadSettings', JSON.stringify(settings.value))
    hasUnsavedChanges.value = false
    ElMessage.success('设置已保存')
    return true
  } catch (error) {
    ElMessage.error(error.message)
    return false
  }
}

const resetSettings = () => {
  settings.value = FileManager.getDefaultSettings()
  localStorage.setItem('uploadSettings', JSON.stringify(settings.value))
  hasUnsavedChanges.value = false
}

// ===== 路由守卫 =====
onBeforeRouteLeave((to, from, next) => {
  if (hasUnsavedChanges.value) {
    ElMessageBox.confirm('有未保存的更改，确定要离开吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
        .then(() => next())
        .catch(() => next(false))
  } else {
    next()
  }
})

// 使用 provide/inject 共享设置状态
provide('settings', settings)
provide('hasUnsavedChanges', hasUnsavedChanges)
</script>

<style scoped>
.settings-container {
  height: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 20px;
}

.settings-main {
  background: var(--el-bg-color);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: var(--el-box-shadow-lighter);
}

.settings-tabs {
  flex: 1;
  min-height: 0;
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-tabs__nav) {
  border-radius: 8px;
}

:deep(.el-tabs__item) {
  padding: 0 24px;
  height: 40px;
  line-height: 40px;
}

/* 优化移动端标签显示 */
:deep(.el-tabs--top) {
  --el-tabs-header-height: auto;
}

:deep(.el-tabs__nav-wrap) {
  padding: 8px;
}

.panel-footer {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--el-border-color-lighter);
  display: flex;
  justify-content: center;
}

/* 右侧帮助面板 */
.help-panel {
  height: 100%;
}

.help-content {
  background: var(--el-bg-color);
  border-radius: 8px;
  padding: 16px;
  box-shadow: var(--el-box-shadow-lighter);
}

.help-body {
  color: var(--el-text-color-regular);
  font-size: 13px;
  line-height: 1.5;
}

.help-body h4 {
  margin: 0 0 8px;
  font-size: 14px;
  color: var(--el-text-color-primary);
  position: relative;
  padding-left: 12px;
}

.help-body h4::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 14px;
  background: var(--el-color-primary);
  border-radius: 1px;
}

.help-body p {
  margin: 0 0 8px;
  color: var(--el-text-color-regular);
}

.help-body ul {
  margin: 0;
  padding-left: 12px;
}

.help-body li {
  margin-bottom: 4px;
  color: var(--el-text-color-regular);
  position: relative;
  list-style: none;
  padding-left: 12px;
}

.help-body li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--el-text-color-secondary);
}

.help-body li:last-child {
  margin-bottom: 0;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .help-panel {
    display: none;
  }
}

/* 增强的响应式设计 */
@media screen and (max-width: 1200px) {
  .settings-container {
    grid-template-columns: minmax(0, 1fr) 260px;
    gap: 16px;
  }
}

@media screen and (max-width: 768px) {
  .settings-container {
    display: block;
    grid-template-columns: 1fr;
    gap: 12px;
  }

  /* 优化移动端标签栏 */
  :deep(.el-tabs__nav) {
    padding: 4px;
  }

  :deep(.el-tabs__item) {
    padding: 0 12px;
    height: 36px;
    line-height: 36px;

    .tab-label {
      font-size: 13px;

      /* 在移动端保留图标但缩小尺寸 */

      .el-icon {
        font-size: 16px;
      }
    }
  }

  /* 优化底部按钮 */
  .panel-footer {
    margin-top: 12px;
    padding-top: 12px;

    .el-button {
      width: 100%;
      max-width: 200px;
    }
  }
}

/* 小屏幕设备的额外优化 */
@media screen and (max-width: 480px) {
  .settings-main {
    padding: 8px;
  }

  :deep(.el-tabs__item) {
    height: 36px;
    line-height: 36px;
    font-size: 12px;
  }


  /* 优化输入框和选择器 */
  :deep(.el-input),
  :deep(.el-select) {
    width: 100%;
  }

  /* 调整底部按钮大小 */
  .panel-footer .el-button {
    height: 40px;
    font-size: 14px;
  }
}
</style>