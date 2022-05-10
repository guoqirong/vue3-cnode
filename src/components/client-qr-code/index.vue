<template>
  <el-card class="box-card">
    <template #header>
      <span class="card-title">客户端二维码</span>
    </template>
    <el-image
      class="qr-image"
      src="https://static.cnodejs.org/FtG0YVgQ6iginiLpf9W4_ShjiLfU"
      fit="fill"
    ></el-image>
    <div class="client-box">
      <el-link
        :underline="false"
        href="https://github.com/soliury/noder-react-native"
        target="_blank"
      >客户端源码地址</el-link> 
    </div>
  </el-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ClientQrCodeComp',
})
</script>

<style lang="scss" src="./index.scss"></style>