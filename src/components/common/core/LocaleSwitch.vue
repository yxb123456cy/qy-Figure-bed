<template>
    <el-dropdown @command="handleCommand">
      <el-icon :size="20"><Opportunity /></el-icon>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="zh">中文</el-dropdown-item>
          <el-dropdown-item command="en">English</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </template>
  
  <script setup>
  import { Opportunity } from '@element-plus/icons-vue';
  
  const handleCommand = (command) => {
    locale.value = command;
  };
  </script>