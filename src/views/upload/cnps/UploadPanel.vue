<template>
    <section class="upload-panel">
      <el-upload
        class="upload-area"
        drag
        action="#"
        :auto-upload="false"
        :on-change="handleFileChange"
        :show-file-list="false"
        multiple
      >
        <div class="upload-content">
          <div class="upload-illustration">
            <el-icon>
              <Upload />
            </el-icon>
            <div class="upload-cloud">
              <i class="cloud-icon" v-for="i in 2" :key="i"></i>
            </div>
          </div>
          <p class="panel-desc">支持拖拽或点击上传，可批量处理图片</p>
        </div>
      </el-upload>
  
      <div class="upload-actions">
        <el-button
          type="primary"
          size="large"
          :loading="uploading"
          :disabled="!hasImages"
          @click="$emit('upload')"
        >
          <template #icon>
            <el-icon>
              <Upload />
            </el-icon>
          </template>
          {{ uploading ? '正在上传...' : '开始上传' }}
        </el-button>
      </div>
    </section>
  </template>
  
  <script setup>
  import { Upload } from '@element-plus/icons-vue'
  
  
  defineProps({
    uploading: Boolean,
    hasImages: Boolean
  })
  
  const emit = defineEmits(['file-change', 'upload'])
  
  const handleFileChange = (file) => {
    emit('file-change', file)
  }
  </script>
  
  <style scoped>
  .upload-panel {
    flex: 0 0 400px;
    background: var(--el-bg-color);
    border-radius: 12px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    box-shadow: var(--el-box-shadow-lighter);
    height: 100%;
    min-height: 260px;
    max-height: 100%;
    overflow: hidden;
  }
  
  .panel-desc {
    margin: 0 0 8px;
    font-size: 14px;
    color: var(--el-text-color-secondary);
  }
  
  .upload-area :deep(.el-upload) {
    width: 100%;
    height: 100%;
    display: flex;
  }
  
  .upload-area :deep(.el-upload-dragger) {
    width: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px dashed var(--el-border-color);
    border-radius: 12px;
    transition: all 0.3s;
    background: var(--el-color-primary-light-9);
  
    &:hover {
      border-color: var(--el-color-primary);
      transform: translateY(-2px);
    }
  }
  
  .upload-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    padding: 32px 20px;
  }
  
  .upload-illustration {
    position: relative;
    width: 120px;
    height: 120px;
  }
  
  .upload-illustration .el-icon {
    font-size: 64px;
    color: var(--el-color-primary);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  .upload-cloud {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  
  .cloud-icon {
    position: absolute;
    background: var(--el-color-primary-light-7);
    border-radius: 50%;
    opacity: 0.2;
  
    &:nth-child(1) {
      width: 60px;
      height: 60px;
      top: 0;
      left: 0;
    }
  
    &:nth-child(2) {
      width: 80px;
      height: 80px;
      bottom: 0;
      right: 0;
    }
  }
  
  .upload-actions {
    display: flex;
    justify-content: center;
  }
  
  .upload-actions .el-button {
    min-width: 160px;
  }
  
  @media screen and (max-width: 768px) {
    .upload-panel {
      padding: 20px;
      flex: 0;
    }
  
    .upload-area :deep(.el-upload-dragger) {
      height: 200px;
    }
  }
  </style>