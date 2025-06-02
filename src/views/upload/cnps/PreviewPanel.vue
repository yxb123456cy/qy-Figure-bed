<template>
    <section class="preview-panel" :class="{ 'has-images': hasImages }">
      <template v-if="hasImages">
        <div class="preview-header">
          <div class="header-left">
            <h3 class="preview-title">图片列表</h3>
            <el-tag type="info" size="small" round>{{ imageList.length }}张</el-tag>
          </div>
          <el-button type="danger" link :disabled="uploading" @click="$emit('clear')">
            <template #icon>
              <el-icon>
                <Delete />
              </el-icon>
            </template>
            清空
          </el-button>
        </div>
  
        <div class="preview-list">
          <div
            v-for="(image, index) in imageList"
            :key="index"
            class="preview-item"
            :class="getItemClass(image)"
          >
            <div class="item-preview">
              <el-image
                :src="image.url"
                fit="cover"
                :preview-src-list="[image.url]"
                preview-teleported
              >
                <template #error>
                  <div class="image-error">
                    <el-icon>
                      <PictureFilled />
                    </el-icon>
                  </div>
                </template>
              </el-image>
  
              <div class="item-overlay">
                <template v-if="image.status === IMAGE_STATUS.UPLOADING">
                  <el-progress
                    type="circle"
                    :percentage="image.progress || 0"
                    :width="36"
                    :stroke-width="4"
                    status="warning"
                  />
                </template>
                <template v-else-if="image.status === IMAGE_STATUS.SUCCESS">
                  <div class="success-badge">
                    <el-icon>
                      <CircleCheck />
                    </el-icon>
                  </div>
                </template>
                <template v-else-if="image.status === IMAGE_STATUS.ERROR">
                  <div class="error-badge">
                    <el-icon>
                      <CircleClose />
                    </el-icon>
                  </div>
                </template>
                <template v-else>
                  <div class="waiting-badge">
                    <el-icon>
                      <Upload />
                    </el-icon>
                  </div>
                </template>
              </div>
            </div>
  
            <div class="item-info">
              <div class="info-text">
                <span class="file-name" :title="image.file.name">{{ image.file.name }}</span>
                <span class="file-size">{{ formatFileSize(image.file.size) }}</span>
              </div>
  
              <div class="item-actions">
                <template v-if="image.status === IMAGE_STATUS.SUCCESS">
                  <el-tooltip
                    v-for="action in actionButtons"
                    :key="action.type"
                    :content="action.label"
                    placement="top"
                  >
                    <el-button
                      circle
                      link
                      type="primary"
                      @click="handleCopy(image, action.type)"
                    >
                      <el-icon>
                        <component :is="action.icon" />
                      </el-icon>
                    </el-button>
                  </el-tooltip>
  
                  <el-button
                    circle
                    link
                    type="danger"
                    :disabled="uploading"
                    @click="$emit('delete', image)"
                  >
                    <el-icon>
                      <Delete />
                    </el-icon>
                  </el-button>
                </template>
  
                <template v-else>
                  <el-button
                    link
                    type="danger"
                    :disabled="uploading && image.status === IMAGE_STATUS.UPLOADING"
                    @click="$emit('remove', image)"
                  >
                    <template #icon>
                      <el-icon>
                        <Delete />
                      </el-icon>
                    </template>
                    清除
                  </el-button>
                </template>
              </div>
            </div>
          </div>
        </div>
      </template>
  
      <div v-else class="preview-empty">
        <el-empty description="暂无待上传的图片" />
      </div>
    </section>
  </template>
  
  <script setup>
  import { 
    CircleCheck, 
    CircleClose, 
    Delete, 
    Document,
    Edit,
    Link,
    PictureFilled, 
    Upload 
  } from '@element-plus/icons-vue'
  import { computed } from 'vue'
  
  const IMAGE_STATUS = {
    WAITING: 'waiting',
    UPLOADING: 'uploading',
    SUCCESS: 'success',
    ERROR: 'error'
  }
  
  const actionButtons = [
    { type: 'url', icon: Link, label: '复制URL' },
    { type: 'md', icon: Document, label: '复制Markdown' },
    { type: 'html', icon: Edit, label: '复制HTML' }
  ]
  
  const props = defineProps({
    imageList: Array,
    uploading: Boolean
  })
  
  const hasImages = computed(() => props.imageList.length > 0)
  
  const emit = defineEmits(['copy', 'delete', 'clear', 'remove'])
  
  const getItemClass = (image) => ({
    'is-success': image.status === IMAGE_STATUS.SUCCESS,
    'is-uploading': image.status === IMAGE_STATUS.UPLOADING,
    'is-error': image.status === IMAGE_STATUS.ERROR
  })
  
  const formatFileSize = (size) => {
    if (size < 1024) return size + ' B'
    if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB'
    return (size / (1024 * 1024)).toFixed(1) + ' MB'
  }
  
  const handleCopy = (image, format) => {
    emit('copy', {
      image,
      format
    })
  }
  </script>
  
  <style scoped>
  .preview-panel {
    flex: 1;
    background: var(--el-bg-color);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    box-shadow: var(--el-box-shadow-lighter);
  
    &:not(.has-images) {
      padding: 29px;
      justify-content: center;
    }
  
    &.has-images {
      height: 100%;
      overflow: hidden;
    }
  }
  
  .preview-header {
    padding: 16px 24px;
    border-bottom: 1px solid var(--el-border-color-lighter);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .preview-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }
  
  .preview-list {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-height: 0;
  }
  
  .preview-item {
    display: flex;
    gap: 16px;
    padding: 12px;
    border-radius: 8px;
    background: var(--el-bg-color-page);
    border: 1px solid var(--el-border-color-lighter);
    transition: all 0.3s;
  
    &:hover {
      border-color: var(--el-color-primary-light-5);
    }
  
    &.is-success {
      border-color: var(--el-color-success-light-5);
    }
  
    &.is-error {
      border-color: var(--el-color-danger-light-5);
    }
  }
  
  .item-preview {
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 8px;
    overflow: hidden;
    flex-shrink: 0;
  }
  
  .item-preview :deep(.el-image) {
    width: 100%;
    height: 100%;
  }
  
  .item-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .success-badge,
  .error-badge,
  .waiting-badge {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }
  
  .success-badge {
    background: var(--el-color-success);
    color: white;
  }
  
  .error-badge {
    background: var(--el-color-danger);
    color: white;
  }
  
  .waiting-badge {
    background: var(--el-color-info);
    color: white;
  }
  
  .item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 0;
  }
  
  .info-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .file-name {
    font-size: 14px;
    color: var(--el-text-color-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .file-size {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
  
  .item-actions {
    display: flex;
    gap: 4px;
    justify-content: flex-end;
  }
  
  .preview-empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--el-text-color-secondary);
  }
  
  @media screen and (min-width: 768px) {
    .upload-container {
      flex-direction: row;
    }
  }
  </style>