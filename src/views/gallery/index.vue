<template>
  <div class="gallery-container">
    <section class="gallery-panel">
      <header class="gallery-toolbar">
        <div class="toolbar-left">
          <h3 class="toolbar-title">图库</h3>
          <el-tag v-if="hasImages" type="info" size="small" round>{{ currentFolderImages.length }}张</el-tag>
        </div>

        <div class="toolbar-right">
          <span class="select-label">存储</span>
          <el-select
              v-model="currentStorage"
              size="default"
              style="width: 120px"
              @change="handleStorageChange"
          >
            <el-option
                v-for="item in availableStorages"
                :key="item.type"
                :label="item.label"
                :value="item.type"
                :disabled="!isStorageConfigured(item.type)"
            >
              <span class="storage-option">
                <el-icon><component :is="item.icon"/></el-icon>
                {{ item.label }}
              </span>
            </el-option>
          </el-select>

          <span class="select-label">排序</span>
          <el-select v-model="sortType" size="default" style="width: 120px">
            <el-option
                v-for="option in sortOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
            >
              <div class="storage-option">
                <el-icon>
                  <component :is="option.icon"/>
                </el-icon>
                <span>{{ option.label }}</span>
              </div>
            </el-option>
          </el-select>
        </div>
      </header>

      <div class="gallery-content">
        <el-empty
            v-if="!hasImages"
            description="暂无图片"
        />

        <div v-else
             class="image-grid"
        >
          <article
              v-for="image in paginatedImages"
              :key="image.key"
              class="image-item"
          >
            <div class="item-preview">
              <el-image
                  :src="image.url"
                  fit="cover"
                  class="gallery-image"
                  :preview-src-list="[image.url]"
                  preview-teleported
                  :z-index="3000"
                  loading="eager"
                  @load="onImageLoad"
              >
                <template #placeholder>
                  <span class="image-placeholder">
                    <el-icon class="is-loading"><Loading/></el-icon>
                  </span>
                </template>
                <template #error>
                  <span class="image-error">加载失败</span>
                </template>
              </el-image>
            </div>

            <div class="image-info">
              <time class="image-date">
                <span>{{ formatDate(image.lastModified).date }}</span>
                <span>{{ formatDate(image.lastModified).time }}</span>
              </time>
            </div>

            <nav class="image-actions">
              <span class="action-buttons">
                <el-tooltip
                    v-for="action in actionButtons"
                    :key="action.type"
                    :content="action.label"
                    placement="top"
                >
                  <el-button
                      type="primary"
                      @click="copyImageUrl(image.url, image.key, action.type)"
                  >
                    <el-icon><component :is="action.icon"/></el-icon>
                  </el-button>
                </el-tooltip>
                
                <el-tooltip content="删除图片" placement="top">
                  <el-button
                      type="danger"
                      @click="deleteImage(image)"
                  >
                    <el-icon><Delete/></el-icon>
                  </el-button>
                </el-tooltip>
              </span>
            </nav>
          </article>
        </div>

        <el-pagination
            v-if="hasImages"
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[20, 40, 60]"
            :total="currentFolderImages.length"
            :loading="loading"
            :layout="paginationLayout"
            class="pagination-container"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {FileManager} from '../../utils/fileManager/index.js'
import {ImageHelper} from '../../utils/imageHelper/index.js'
import {ElMessage} from "element-plus";
import {Delete} from "@element-plus/icons-vue";

// 状态管理
const currentFolderImages = ref([])
const settings = ref(JSON.parse(localStorage.getItem('uploadSettings') || '{}'))
const currentPage = ref(1)
const pageSize = ref(Number(localStorage.getItem('galleryPageSize')) || 20)
const loading = ref(true)
const sortType = ref('time-desc')
const currentStorage = ref(localStorage.getItem('currentGalleryStorage') || settings.value.storageType)

// 存储配置
const availableStorages = FileManager.getSupportedStorages()
const isStorageConfigured = (type) => FileManager.isStorageConfigured(type, settings.value)

// 排序选项
const sortOptions = [
  {value: 'time-desc', label: '时间降序', icon: 'Timer'},
  {value: 'time-asc', label: '时间升序', icon: 'Timer'},
  {value: 'name-desc', label: '名称降序', icon: 'Document'},
  {value: 'name-asc', label: '名称升序', icon: 'Document'}
]

// 计算属性
const hasImages = computed(() => currentFolderImages.value.length > 0)
const paginatedImages = computed(() => {
  if (!hasImages.value) return []
  return sortImages(currentFolderImages.value).slice(
      (currentPage.value - 1) * pageSize.value,
      currentPage.value * pageSize.value
  )
})

// 排序函数
const sortImages = (images) => {
  const [field, direction] = sortType.value.split('-')
  const isDesc = direction === 'desc'

  return images.toSorted((a, b) => {
    const compareValue = field === 'time'
        ? new Date(b.lastModified || 0) - new Date(a.lastModified || 0)
        : b.key.localeCompare(a.key)
    return isDesc ? compareValue : -compareValue
  })
}

// 日期格式化
const formatDate = (() => {
  const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  })
  const timeFormatter = new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })

  const cache = new Map()

  return (date) => {
    if (!date) return {date: '', time: ''}

    const cacheKey = date.toString()
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)
    }

    const d = new Date(date)
    const formatted = {
      date: dateFormatter.format(d),
      time: timeFormatter.format(d)
    }

    cache.set(cacheKey, formatted)
    return formatted
  }
})()

// 事件处理
const handleStorageChange = async () => {
  try {
    loading.value = true
    // 只保存当前gallery视图的存储选择，不影响全局设置
    localStorage.setItem('currentGalleryStorage', currentStorage.value)
    await loadImages()
  } finally {
    loading.value = false
  }
}

// 图片操作
const copyImageUrl = (url, filename, format) => {
  ImageHelper.copyImageUrl(url, filename, format)
}

const deleteImage = async (image) => {
  const storage = FileManager.createStorage(currentStorage.value, settings.value)
  await ImageHelper.deleteImage(storage, image, () => {
    currentFolderImages.value = currentFolderImages.value.filter(item => item.key !== image.key)
  })
}

// 优化图片加载处理函数
const onImageLoad = (e) => {
  const img = e?.target
  if (img instanceof HTMLElement) {
    img.style.opacity = '1'
  }
}

// 加载图片
const loadImages = async () => {
  if (!isStorageConfigured(currentStorage.value)) {
    ElMessage.error('请先完成存储配置')
    return
  }

  try {
    const storage = FileManager.createStorage(currentStorage.value, settings.value)
    const uploadPath = settings.value.uploadPath?.trim()?.replace(/^\/+|\/+$/g, '')?.split('/')[0] || 'i'
    const response = await storage.listObjects(uploadPath)
    currentFolderImages.value = response
        .filter(item => item.key.startsWith(uploadPath + '/'))
        .map(({key, url, lastModified}) => ({key, url, lastModified}))
  } catch (error) {
    console.error('加载图片错误:', error)
    ElMessage.error('加载失败：' + error.message)
  }
}

// 操作按钮配置
const actionButtons = [
  {type: 'url', icon: 'Link', label: '复制URL'},
  {type: 'md', icon: 'Document', label: '复制Markdown'},
  {type: 'html', icon: 'Edit', label: '复制HTML'}
]

// 分页事件处理
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
  localStorage.setItem('galleryPageSize', val)
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

// 生命周期
onMounted(loadImages)

// 添加响应式 layout
const paginationLayout = computed(() => {
  return window.innerWidth <= 768
      ? 'sizes, prev, pager, next'  // 移动端移除 jumper
      : 'sizes, prev, pager, next, jumper'  // PC端显示 jumper
})
</script>

<style scoped>
.gallery-panel {
  height: 100%;
  background: var(--el-bg-color);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: var(--el-box-shadow-lighter);
  overflow: hidden;
}

.gallery-toolbar {
  padding: 16px 24px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--el-bg-color);
}

.toolbar-left, .toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolbar-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.select-label {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
}

.storage-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.gallery-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 0;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  width: 100%;
}

.image-item {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  width: 100%;
  aspect-ratio: 1;
}

.item-preview {
  width: 100%;
  height: 100%;
  position: relative;
}

.gallery-image {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

:deep(.el-image img) {
  opacity: 0;
  transition: opacity 0.3s ease-out;
}

.image-actions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
  padding: 6px;
  display: flex;
  justify-content: center;
}

.image-item:hover .image-actions {
  opacity: 1;
  transform: translateY(-100%);
}

.action-buttons {
  pointer-events: auto;
  display: flex;
  gap: 8px;
}

.action-buttons .el-button {
  width: 40px;
  height: 40px;
  padding: 8px;
  font-size: 18px;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-buttons .el-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.action-buttons .el-button.el-button--danger {
  background: rgba(245, 108, 108, 0.5);
}

.action-buttons .el-button.el-button--danger:hover {
  background: rgba(245, 108, 108, 0.8);
}

.image-info {
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 8px;
  font-size: 12px;
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
  opacity: 0;
}

.image-item:hover .image-info {
  transform: translateY(100%);
  opacity: 1;
}

.image-date {
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: 0.9;
}

.image-placeholder, .image-error {
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-fill-color-light);
}

.image-placeholder .el-icon {
  font-size: 24px;
  color: var(--el-text-color-secondary);
}

.image-error {
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  padding-top: 20px;
  border-top: 1px solid var(--el-border-color-lighter);
}

@media screen and (max-width: 768px) {
  .gallery-toolbar {
    padding: 12px;
  }

  .el-select {
    width: 44px !important;
    margin-left: 8px;
  }

  :deep(.el-input__wrapper) {
    padding: 0 8px;
  }

  :deep(.el-input__inner) {
    display: none;
  }

  .image-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .action-buttons {
    gap: 4px;
  }

  .action-buttons .el-button {
    width: 24px;
    height: 24px;
    font-size: 16px;
  }

  /* 移动端直接显示时间信息和操作按钮 */
  .image-info {
    transform: translateY(100%);
    opacity: 1;
  }

  .image-actions {
    transform: translateY(-100%);
    opacity: 1;
  }
}

@media screen and (max-width: 375px) {
  .image-grid {
    grid-template-columns: 1fr;
  }
}
</style>