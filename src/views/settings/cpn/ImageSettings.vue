<template>
  <div class="settings-panel">
    <div class="panel-content">
      <!-- 输出格式设置 -->
      <el-form-item label="输出格式">
        <el-select v-model="imageSettings.outputFormat" class="w-full">
          <el-option
            v-for="format in outputFormats"
            :key="format.value"
            :label="format.label"
            :value="format.value"
          >
            <div class="select-option">
              <span class="option-label">{{ format.label }}</span>
              <span class="option-description">{{ format.description }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      
      <!-- 压缩质量设置 -->
      <el-form-item label="压缩质量">
        <div class="compression-slider">
          <div class="quality-indicator">
            <el-tag :type="qualityTagType" size="large" effect="light">
              {{ qualityLevelText }}
            </el-tag>
            <span class="quality-value">{{ imageSettings.compressionRatio }}%</span>
          </div>
          <el-slider
            v-model="imageSettings.compressionRatio"
            :min="0"
            :max="100"
            :step="1"
            :marks="sliderMarks"
            show-input
          />
        </div>
      </el-form-item>

    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { FileManager, getQualityLevel, getQualitySliderMarks } from '../../../utils/fileManager/index.js'

// Props & Emits
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
const imageSettings = computed({
  get: () => props.settings.image,
  set: (val) => {
    emit('update:settings', {
      ...props.settings,
      image: val
    })
  }
})

const sliderMarks = computed(() => getQualitySliderMarks())
const qualityLevelInfo = computed(() => getQualityLevel(imageSettings.value.compressionRatio))
const qualityTagType = computed(() => qualityLevelInfo.value.type)
const qualityLevelText = computed(() => qualityLevelInfo.value.label)
const outputFormats = FileManager.getOutputFormats()

// ===== 验证方法 =====
const validate = async () => {
  // 图像设置暂时没有必填项,返回验证通过
  return {
    valid: true,
    errors: []
  }
}

// 暴露方法
defineExpose({
  validate
})
</script>

<style scoped>
@import './styles/common.css';

/* 仅保留组件特有的样式 */
.compression-slider {
  width: 100%;
}
</style> 