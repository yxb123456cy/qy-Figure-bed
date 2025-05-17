<template>
  <div class="settings-panel">
    <div class="panel-content">
      <!-- 上传目录设置 -->
      <el-form-item label="上传目录">
        <div class="path-input">
          <el-input 
            v-model="settings.uploadPath" 
            placeholder="例如: i/{year}/{month}/{day}/"
          >
            <template #prepend>
              <el-icon><Folder /></el-icon>
            </template>
            <template #append>
              <el-tooltip content="支持变量: {year} {month} {day}" placement="top">
                <el-icon><InfoFilled /></el-icon>
              </el-tooltip>
            </template>
          </el-input>
        </div>
      </el-form-item>
      
      <!-- 命名规则设置 -->
      <el-form-item label="命名规则">
        <el-select 
          v-model="settings.nameRule"
          class="w-full"
        >
          <el-option
            v-for="rule in nameRules"
            :key="rule.value"
            :label="rule.label"
            :value="rule.value"
          >
            <div class="select-option">
              <span class="option-label">{{ rule.label }}</span>
              <span class="option-description">{{ rule.description }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>

      <!-- 图片格式设置 -->
      <el-form-item label="图片格式" class="image-formats-item">
        <el-checkbox-group 
          v-model="settings.allowedTypes" 
          class="image-type-group"
        >
          <el-checkbox 
            v-for="type in FILE_TYPES.image.mimeTypes"
            :key="type.value"
            :value="type.value"
            class="image-type-checkbox"
            border
          >
            {{ type.label }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <!-- 大小限制设置 -->
      <el-form-item label="大小限制">
        <div class="size-control">
          <div class="quality-indicator">
            <el-tag :type="sizeTagType" size="large" effect="light">
              {{ sizeLevelText }}
            </el-tag>
            <span class="quality-value">{{ settings.maxFileSize }}MB</span>
          </div>
          <el-slider
            v-model="settings.maxFileSize"
            :min="1"
            :max="50"
            :step="1"
            :marks="sizeSliderMarks"
            show-input
          />
        </div>
      </el-form-item>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { FileManager, FILE_TYPES, getSizeLevel, getSizeSliderMarks } from '../../../utils/fileManager/index.js'
import {Folder, InfoFilled} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";

// Props 定义
const props = defineProps({
  settings: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:settings'])

// ===== 状态定义 =====
const fieldErrors = ref({})

// ===== 计算属性 =====
const settings = computed({
  get: () => props.settings,
  set: (value) => emit('update:settings', value)
})

const nameRules = computed(() => FileManager.getNameRules())
const sizeSliderMarks = computed(() => getSizeSliderMarks())
const sizeLevelInfo = computed(() => getSizeLevel(settings.value.maxFileSize))
const sizeTagType = computed(() => sizeLevelInfo.value.type)
const sizeLevelText = computed(() => sizeLevelInfo.value.label)

// ===== 验证方法 =====
const validateField = (fieldKey) => {
  const value = settings.value[fieldKey]
  
  switch (fieldKey) {
    case 'uploadPath':
      if (!value?.trim()) {
        fieldErrors.value[fieldKey] = '请设置上传目录'
        return false
      }
      break
    case 'allowedTypes':
      if (!value?.length) {
        fieldErrors.value[fieldKey] = '请选择允许的文件类型'
        return false
      }
      break
  }
  
  delete fieldErrors.value[fieldKey]
  return true
}

const validate = async () => {
  const fieldsToValidate = ['uploadPath', 'allowedTypes']
  const errors = []
  
  fieldsToValidate.forEach(field => {
    if (!validateField(field)) {
      errors.push(fieldErrors.value[field])
    }
  })
  
  if (errors.length > 0) {
    ElMessage.error(errors[0])
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

// 暴露方法
defineExpose({
  validate
})
</script>

<style scoped>
@import './styles/common.css';

.image-type-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.image-type-checkbox {
  margin-right: 0 !important;
  margin-bottom: 8px;
}

.path-input {
  width: 100%;
}

.size-control {
  width: 100%;
}

.quality-indicator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.quality-value {
  font-size: 20px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

:deep(.el-slider) {
  margin: 12px 0;
}

/* 移动端优化 */
@media screen and (max-width: 768px) {
  .image-type-group {
    gap: 6px;
  }
  
  .image-type-checkbox {
    margin-bottom: 6px;
    
    :deep(.el-checkbox__label) {
      font-size: 13px;
      padding: 6px 10px;
    }
  }
  
  .quality-indicator {
    margin-bottom: 8px;
  }
  
  .quality-value {
    font-size: 16px;
  }
  
  :deep(.el-slider__input) {
    display: none;
  }
}

@media screen and (max-width: 480px) {
  .image-type-checkbox {
    flex: 1;
    min-width: calc(50% - 3px);
    
    :deep(.el-checkbox__label) {
      width: 100%;
      text-align: center;
    }
  }
}
</style>