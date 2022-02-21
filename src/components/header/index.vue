<template>
  <div class="navbar">
    <div class="navbar-content">
      <span class="navbar-logo" @click="gotoIndex">
        <img src="@/assets/images/logo.svg" />
      </span>
      <span class="navbar-link navbar-noright-link">
        <span><el-link :underline="false" @click="gotoIndex">首页</el-link></span>
        <span v-if="token !== ''">
          <el-badge v-if="count > 0" :value="count" class="badge-item">
            <el-link :underline="false" @click="gotoMessage">消息</el-link>
          </el-badge>
          <el-link v-else :underline="false" @click="gotoMessage">消息</el-link>
        </span>
        <span v-if="token !== ''"><el-link :underline="false" @click="gotoCollect">收藏</el-link></span>
        <span><el-link :underline="false" href="https://github.com/guoqirong/vue-cnode" target="_blank">GitHub仓库</el-link></span>
        <span v-if="token === ''"><el-link :underline="false" @click="gotoLogin">登录</el-link></span>
        <span v-if="token !== ''"><el-link :underline="false" @click="logout">退出</el-link></span>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup(props, centext) {
    computed: {
      // token: {
      //   get () { return centext.$store.state.user.token }
      // }
    }
    
  },
})
</script>

<style lang="scss" src="./index.less"></style>