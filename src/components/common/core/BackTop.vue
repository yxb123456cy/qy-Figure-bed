<script setup lang="ts">
import { ElTooltip, ElProgress } from 'element-plus'
import { useBackTop } from '../../../hooks/useBackTop'

const { scrollPercentage, scrollToTop } = useBackTop()
</script>

<template>
  <el-tooltip
    effect="light"
    content="回到顶部"
    placement="bottom"
  >
      <el-progress
        type="circle"
        :percentage="scrollPercentage"
        :stroke-width="2"
        :show-text="false"
        :class="{'pointer': scrollPercentage > 0}"
        @click="scrollToTop"
        :width="30"
      />
  </el-tooltip>
</template>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>