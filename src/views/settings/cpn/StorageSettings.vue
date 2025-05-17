<template>
  <div class="settings-panel">
    <div class="panel-content">
      <!-- 存储类型选择 -->
      <el-tag>请在阿里云OSS管理控制台创建跨域规则，不然测试通过不了</el-tag>
      <el-form-item label="存储类型" class="storage-type-item" label-width="100px">
        <div class="type-and-test">
          <el-select v-model="storageSettings.storageType" class="storage-type-select">
            <el-option
              v-for="storage in supportedStorages"
              :key="storage.type"
              :value="storage.type"
              :label="storage.label"
            >
              <div class="select-option">
                <el-icon><component :is="storage.icon" /></el-icon>
                <span class="option-label">{{ storage.label }}</span>
                <span class="option-description">{{ storage.description }}</span>
              </div>
            </el-option>
          </el-select>
          <el-button 
            type="primary" 
            @click="testConnection" 
            class="test-btn"
          >
            <el-icon><Connection /></el-icon>
            测试
          </el-button>
        </div>
      </el-form-item>

      <!-- 存储服务配置 -->
      <!-- 通用配置项 -->
      <el-form-item label="自定义域" label-width="100px">
        <el-input 
          v-model="currentStorageConfig.customDomain"
          placeholder="自定义域名（可选）"
          @input="updateStorageConfig('customDomain', $event)"
        >
          <template #prefix>
            <el-icon><Monitor /></el-icon>
          </template>
        </el-input>
        <div class="form-tip">设置后将使用此域名访问文件，否则使用默认域名</div>
      </el-form-item>

      <!-- 动态渲染存储特定配置 -->
      <template v-for="field in storageFields" :key="field.key">
        <el-form-item 
          :label="field.label"
          :required="field.required"
          :error="fieldErrors[field.key]"
          label-width="100px"
        >
          <el-input
            :model-value="currentStorageConfig[field.key]"
            :type="field.type || 'text'"
            :placeholder="field.placeholder"
            :show-password="field.type === 'password'"
            @update:model-value="updateStorageConfig(field.key, $event)"
            @blur="validateField(field.key)"
          >
            <template #prefix>
              <el-icon><component :is="field.icon" /></el-icon>
            </template>
          </el-input>
        </el-form-item>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { FileManager, STORAGE_SERVICES } from '../../../utils/fileManager/index.js'
import {ElMessage} from "element-plus";
import {Connection, Monitor} from "@element-plus/icons-vue";

const props = defineProps({
  settings: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:settings'])

// ===== 状态定义 =====
const fieldErrors = ref({})
const supportedStorages = FileManager.getSupportedStorages()

// ===== 计算属性 =====
const storageSettings = computed({
  get: () => props.settings,
  set: (value) => emit('update:settings', value)
})

const currentStorageConfig = computed({
  get: () => storageSettings.value[storageSettings.value.storageType] || {},
  set: (value) => {
    emit('update:settings', {
      ...storageSettings.value,
      [storageSettings.value.storageType]: value
    })
  }
})

const storageFields = computed(() => {
  const service = STORAGE_SERVICES[storageSettings.value.storageType]
  return service ? service.fields : []
})

// ===== 监听器 =====
watch(() => storageSettings.value.storageType, () => {
  fieldErrors.value = {}
}, { immediate: true })

// ===== 验证方法 =====
const validateField = (fieldKey) => {
  const field = storageFields.value.find(f => f.key === fieldKey)
  const value = currentStorageConfig.value[fieldKey]
  
  if (field?.required && !value?.trim()) {
    fieldErrors.value[fieldKey] = `${field.label}为必填项`
    return false
  }
  
  delete fieldErrors.value[fieldKey]
  return true
}

const validate = async () => {
  // 如果所有必填字段都为空，则视为有效配置
  const requiredFields = storageFields.value.filter(field => field.required)
  const allFieldsEmpty = requiredFields.every(field => 
    !currentStorageConfig.value[field.key]?.trim()
  )
  
  if (allFieldsEmpty) {
    return {
      valid: true,
      errors: []
    }
  }
  
  // 如果有部分字段填写，则需要验证所有必填字段
  const errors = []
  requiredFields.forEach(field => {
    if (!validateField(field.key)) {
      errors.push(fieldErrors.value[field.key])
    }
  })
  
  if (errors.length > 0) {
    ElMessage.error(errors[0])
    return {
      valid: false,
      errors
    }
  }

  // 验证存储配置的有效性
  const type = storageSettings.value.storageType
  const config = storageSettings.value[type]
  const configValidation = FileManager.validateConfig(type, config)

  if (!configValidation.isValid) {
    ElMessage.error(configValidation.message || '存储配置无效')
    return {
      valid: false,
      errors: [configValidation.message]
    }
  }

  return {
    valid: true,
    errors: []
  }
}

// ===== 事件处理 =====
const testConnection = async () => {
  const validation = await validate()
  if (!validation.valid) return false
  
  try {
    const storage = FileManager.createStorage(
      storageSettings.value.storageType,
      storageSettings.value
    )
    const result = await storage.testConnection()
    
    ElMessage[result.success ? 'success' : 'error'](
      result.message
    )
    
    return result.success
  } catch (error) {
    ElMessage.error(error.message)
    return false
  }
}

const updateStorageConfig = (key, value) => {
  const newConfig = {
    ...currentStorageConfig.value,
    [key]: value
  }
  
  emit('update:settings', {
    ...storageSettings.value,
    [storageSettings.value.storageType]: newConfig
  })
}

// 暴露方法
defineExpose({ validate, testConnection })
</script>

<style scoped>
@import './styles/common.css';

.form-tip {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
  line-height: 1.4;
}

.storage-type-select {
  flex: 1;
  min-width: 0;
}

.type-and-test {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.test-btn {
  flex-shrink: 0;
  white-space: nowrap;
  min-width: 80px;
}

/* 移动端优化 */
@media screen and (max-width: 768px) {
  .type-and-test {
    gap: 8px;
  }
  
  .test-btn {
    padding: 0 12px;
  }
}

@media screen and (max-width: 480px) {
  .type-and-test {
    flex-direction: column;
    gap: 12px;
  }
  
  .test-btn {
    width: 100%;
    height: 36px;
  }
}
</style>