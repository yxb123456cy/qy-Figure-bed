<template>
    <div class="upload-container">
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
                <Upload/>
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
              @click="uploadFiles"
          >
            <template #icon>
              <el-icon>
                <Upload/>
              </el-icon>
            </template>
            {{ uploading ? '正在上传...' : '开始上传' }}
          </el-button>
        </div>
      </section>
  
      <section class="preview-panel" :class="{ 'has-images': hasImages }">
        <template v-if="hasImages">
          <div class="preview-header">
            <div class="header-left">
              <h3 class="preview-title">图片列表</h3>
              <el-tag type="info" size="small" round>{{ imageList.length }}张</el-tag>
            </div>
            <el-button type="danger" link :disabled="uploading" @click="clearImageList">
              <template #icon>
                <el-icon>
                  <Delete/>
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
                        <PictureFilled/>
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
                        <CircleCheck/>
                      </el-icon>
                    </div>
                  </template>
                  <template v-else-if="image.status === IMAGE_STATUS.ERROR">
                    <div class="error-badge">
                      <el-icon>
                        <CircleClose/>
                      </el-icon>
                    </div>
                  </template>
                  <template v-else>
                    <div class="waiting-badge">
                      <el-icon>
                        <Upload/>
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
                          @click="copyImageUrl(image.uploadedUrl, image.file.name, action.type)"
                      >
                        <el-icon>
                          <component :is="action.icon"/>
                        </el-icon>
                      </el-button>
                    </el-tooltip>
  
                    <el-button
                        circle
                        link
                        type="danger"
                        :disabled="uploading"
                        @click="deleteImage(image)"
                    >
                      <el-icon>
                        <Delete/>
                      </el-icon>
                    </el-button>
                  </template>
  
                  <template v-else>
                    <el-button
                        link
                        type="danger"
                        :disabled="uploading && image.status === IMAGE_STATUS.UPLOADING"
                        @click="removeFromList(image)"
                    >
                      <template #icon>
                        <el-icon>
                          <Delete/>
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
          <el-empty description="暂无待上传的图片"/>
        </div>
      </section>
    </div>
  </template>
  
  <script setup>
  import {ref, computed} from 'vue'
  import {FileManager} from '../../utils/fileManager/index.js'
  import {ImageCompressor} from '../../utils/imageCompressor/index.js'
  import {ImageHelper} from '../../utils/imageHelper/index.js'
  import {CircleCheck, CircleClose, Delete, PictureFilled, Upload} from "@element-plus/icons-vue";
  import {ElMessage} from "element-plus";
  
  const IMAGE_STATUS = {
    WAITING: 'waiting',
    UPLOADING: 'uploading',
    SUCCESS: 'success',
    ERROR: 'error'
  }
  
  const imageList = ref([])
  const uploading = ref(false)
  const settings = ref(JSON.parse(localStorage.getItem('uploadSettings') || '{}'))
  const fileManager = new FileManager(settings.value)
  
  const hasImages = computed(() => imageList.value.length > 0)
  const pendingImages = computed(() => imageList.value.filter(img => img.status !== IMAGE_STATUS.SUCCESS))
  const storageType = computed(() => settings.value.storageType)
  
  const actionButtons = [
    {type: 'url', icon: 'Link', label: '复制URL'},
    {type: 'md', icon: 'Document', label: '复制Markdown'},
    {type: 'html', icon: 'Edit', label: '复制HTML'}
  ]
  
  const getItemClass = (image) => ({
    'is-success': image.status === IMAGE_STATUS.SUCCESS,
    'is-uploading': image.status === IMAGE_STATUS.UPLOADING,
    'is-error': image.status === IMAGE_STATUS.ERROR
  })
  
  const handleFileChange = (file) => {
    const validationResult = fileManager.validateFile(file.raw)
    if (validationResult !== true) {
      ElMessage.error(validationResult)
      return
    }
  
    const reader = new FileReader()
    reader.onload = ({target}) => {
      imageList.value.push({
        url: target.result,
        uploadedUrl: '',
        file: file.raw,
        status: IMAGE_STATUS.WAITING,
        progress: 0,
        key: ''
      })
    }
    reader.readAsDataURL(file.raw)
  }
  
  const uploadFiles = async () => {
    if (!FileManager.isStorageConfigured(storageType.value, settings.value)) {
      ElMessage.error('请先完成存储配置')
      return
    }
  
    uploading.value = true
    const uploader = FileManager.createStorage(storageType.value, settings.value)
    const imageCompressor = new ImageCompressor(settings.value.image)
  
    try {
      await Promise.all(
          pendingImages.value.map(async (image) => {
            image.status = IMAGE_STATUS.UPLOADING
            try {
              const processedFile = await imageCompressor.compress(image.file)
              const {url, key} = await uploader.upload(processedFile)
              Object.assign(image, {
                status: IMAGE_STATUS.SUCCESS,
                uploadedUrl: url,
                key
              })
            } catch (error) {
              image.status = IMAGE_STATUS.ERROR
              throw new Error(`图片 ${image.file.name} 上传失败: ${error.message}`)
            }
          })
      )
      ElMessage.success('所有图片上传完成')
    } catch (error) {
      ElMessage.error(error.message)
    } finally {
      uploading.value = false
    }
  }
  
  const copyImageUrl = (url, filename, format) => ImageHelper.copyImageUrl(url, filename, format)
  const deleteImage = async (image) => {
    const storage = FileManager.createStorage(storageType.value, settings.value)
    await ImageHelper.deleteImage(storage, image, () => {
      imageList.value = imageList.value.filter(item => item !== image)
    })
  }
  const clearImageList = () => ImageHelper.clearImages(() => imageList.value = [])
  const removeFromList = (image) => imageList.value = imageList.value.filter(item => item !== image)
  const formatFileSize = (size) => {
    if (size < 1024) return size + ' B'
    if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB'
    return (size / (1024 * 1024)).toFixed(1) + ' MB'
  }
  </script>
  
  <style scoped>
  .upload-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  /* 左侧上传面板 */
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
  
  .upload-area {
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
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
  
  /* 右侧预览面板 */
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
  
  /* 响应式设计 */
  @media screen and (max-width: 768px) {
    .upload-panel {
      padding: 20px;
      flex: 0;
    }
  
    .upload-area :deep(.el-upload-dragger) {
      height: 200px;
    }
  }
  
  @media screen and (min-width: 768px) {
    .upload-container {
      flex-direction: row;
    }
  }
  
  .upload-container :deep(.el-upload) {
    --el-upload-dragger-padding-horizontal: 0 !important;
  }
  </style>