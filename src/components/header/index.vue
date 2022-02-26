<template>
  <div class="navbar">
    <div class="navbar-content">
      <!-- logo -->
      <span class="navbar-logo" @click="gotoIndex">
        <img :src="logoImage" />
      </span>
      <!-- 右侧菜单 -->
      <span class="navbar-link navbar-noright-link">
        <span><el-link :underline="false" @click="gotoIndex">首页</el-link></span>
        <span v-if="token !== ''">
          <el-badge v-if="count > 0" :value="count" class="badge-item">
            <el-link :underline="false" @click="gotoMessage">消息</el-link>
          </el-badge>
          <el-link v-else :underline="false" @click="gotoMessage">消息</el-link>
        </span>
        <span v-if="token !== ''"><el-link :underline="false" @click="gotoCollect">收藏</el-link></span>
        <span><el-link :underline="false" href="https://github.com/guoqirong/vue3-cnode" target="_blank">GitHub仓库</el-link></span>
        <span v-if="token === ''"><el-link :underline="false" @click="gotoLogin">登录</el-link></span>
        <span v-if="token !== ''"><el-link :underline="false" @click="logout">退出</el-link></span>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { ElLink, ElBadge } from 'element-plus'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  components: { ElLink, ElBadge },
  setup() {
    const { state } = useStore();
    const route = useRoute();
    const router = useRouter();
    // 获取本地logo图片
    const logoImage = computed(() => {
      return require('@/assets/images/logo.svg');
    });
    // 获取store里的用户登录态
    const token = computed(() => {
      return state.user.token;
    });
    // 前往首页
    const gotoIndex = () => {
      if (route.path !== '/index') {
        router.push({
          path: '/'
        })
      }
    };
    // 前往登录页
    const gotoLogin = () => {
      if (route.path !== '/login') {
        router.push({
          path: '/login'
        })
      }
    };
    return {
      logoImage,
      token,
      gotoIndex,
      gotoLogin
    }
  },
})
</script>

<style lang="scss" src="./index.scss"></style>