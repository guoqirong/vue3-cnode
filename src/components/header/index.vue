<template>
  <div class="navbar">
    <div class="navbar-content">
      <!-- logo -->
      <span
        class="navbar-logo"
        @click="gotoIndex">
        <img :src="logoImage" />
      </span>
      <!-- 右侧菜单 -->
      <span class="navbar-link navbar-noright-link">
        <span>
          <el-link :underline="false" @click="gotoIndex">首页</el-link>
        </span>
        <span v-if="token !== ''">
          <el-badge v-if="count > 0" :value="count" class="badge-item">
            <el-link :underline="false" @click="gotoMessage">消息</el-link>
          </el-badge>
          <el-link v-else :underline="false" @click="gotoMessage">消息</el-link>
        </span>
        <span v-if="token !== ''">
          <el-link :underline="false" @click="gotoCollect">收藏</el-link>
        </span>
        <span>
          <el-link
            :underline="false"
            href="https://github.com/guoqirong/vue3-cnode"
            target="_blank"
          >GitHub仓库</el-link>
        </span>
        <span v-if="token === ''">
          <el-link :underline="false" @click="gotoLogin">登录</el-link>
        </span>
        <span v-if="token !== ''">
          <el-link :underline="false" @click="logout">退出</el-link>
        </span>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref } from 'vue';
import { ElLink, ElBadge } from 'element-plus';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import useHttpRequest from '@/utils/request';
import { routerPush } from '@/utils';
import useEventBus from '@/utils/eventBus';

export default defineComponent({
  name: 'HeaderComp',
  components: { ElLink, ElBadge },
  setup() {
    const { state, commit } = useStore();
    const route = useRoute();
    const { adornUrl, httpRequest } = useHttpRequest();
    
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
        routerPush({
          path: '/'
        })
      }
    };
    
    // 通过消息模块已读信息更新未读数
    const [ emitter ] = useEventBus();
    emitter.on('read-msg', () => {
      getMassageCount();
    });

    // 获取未读信息数
    const count = ref(0);
    watch(token, (newVal) => {
      if (newVal) {
        getMassageCount();
      } else {
        commit('user/updateUserData', {});
      }
    });
    const getMassageCount = () => {
      httpRequest ({
        url: adornUrl(`/api/v1/message/count`),
        method: 'get',
        params: {
          accesstoken: token.value || ''
        }
      }).then(({data}) => {
        count.value = data.data;
      }).catch(e => {
        console.error(e);
      })
    }

    // 前往消息列表页面
    const gotoMessage = () => {
      if (route.path !== '/message') {
        routerPush({
          path: '/message'
        })
      }
    };

    // 前往收藏页面
    const gotoCollect = () => {
      if (route.path !== '/collect') {
        routerPush({
          path: '/collect'
        })
      }
    };

    // 前往登录页
    const gotoLogin = () => {
      if (route.path !== '/login') {
        routerPush({
          path: '/login'
        })
      }
    };

    // 退出登录
    const logout = () => {
      localStorage.removeItem('loginname')
      localStorage.removeItem('token')
      commit('user/updateToken', '');
      commit('user/updateSimpleUserData', {});
      gotoIndex();
    };

    return {
      logoImage,
      token,
      gotoIndex,
      count,
      gotoMessage,
      gotoCollect,
      gotoLogin,
      logout
    }
  },
})
</script>

<style lang="scss" src="./index.scss"></style>