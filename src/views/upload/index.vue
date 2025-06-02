<template>
  <div class="upload-container">
    <UploadPanel
      :uploading="uploading"
      :has-images="hasImages"
      @file-change="handleFileChange"
      @upload="uploadFiles"
    />
    
    <PreviewPanel
      :image-list="imageList"
      :uploading="uploading"
      @delete="deleteImage"
      @clear="clearImageList"
      @remove="removeFromList"
      @copy="handleCopy"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { FileManager } from '../../utils/fileManager/index.js'
import { ImageCompressor } from '../../utils/imageCompressor/index.js'
import { ElMessage } from "element-plus";
import { ImageHelper } from '../../utils/imageHelper/index.js'
import UploadPanel from './cnps/UploadPanel.vue'
import PreviewPanel from './cnps/PreviewPanel.vue'

const imageList = ref([])
const uploading = ref(false)
const settings = ref(JSON.parse(localStorage.getItem('uploadSettings') || '{}'))
const fileManager = new FileManager(settings.value)

const hasImages = computed(() => imageList.value.length > 0)
const pendingImages = computed(() => imageList.value.filter(img => img.status !== 'success'))
const storageType = computed(() => settings.value.storageType)

const handleFileChange = (file) => {
  const validationResult = fileManager.validateFile(file.raw)
  if (validationResult !== true) {
    ElMessage.error(validationResult)
    return
  }

  const reader = new FileReader()
  reader.onload = ({ target }) => {
    imageList.value.push({
      url: target.result,
      uploadedUrl: '',
      file: file.raw,
      status: 'waiting',
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
        image.status = 'uploading'
        try {
          const processedFile = await imageCompressor.compress(image.file)
          const { url, key } = await uploader.upload(processedFile)
          Object.assign(image, {
            status: 'success',
            uploadedUrl: url,
            key
          })
        } catch (error) {
          image.status = 'error'
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

const handleCopy = ({ image, format }) => {
  ImageHelper.copyImageUrl(image.uploadedUrl, image.file.name, format)
}

const deleteImage = async (image) => {
  const storage = FileManager.createStorage(storageType.value, settings.value)
  await ImageHelper.deleteImage(
    storage, 
    image,
    () => {
      imageList.value = imageList.value.filter(item => item !== image)
    }
  )
}

// 使用ImageHelper处理清空
const clearImageList = () => {
  ImageHelper.clearImages(() => {
    imageList.value = []
  })
}

const removeFromList = (image) => {
  imageList.value = imageList.value.filter(item => item !== image)
}
</script>

<style scoped>
.upload-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media screen and (min-width: 768px) {
  .upload-container {
    flex-direction: row;
  }
}
</style>
