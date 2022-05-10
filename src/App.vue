<template>
  <el-config-provider :locale="locale">
    <el-scrollbar
      ref="scrollbarRef"
      height="100vh"
      @scroll="scroll">
      <!-- 主体内容 -->
      <header-comp />
      <router-view />
      <footer-comp />
      <!-- 返回头部 -->
      <el-button
        v-if="top > 200"
        class="back-top"
        size="large"
        :icon="CaretTop"
        circle
        @click="backTop"
      ></el-button>
    </el-scrollbar>
  </el-config-provider>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { ElMessage, ElScrollbar } from 'element-plus';
import { CaretTop } from '@element-plus/icons-vue'
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import HeaderComp from '@/components/header/index.vue';
import FooterComp from '@/components/footer/index.vue';
import { useStore } from 'vuex';
import useHttpRequest from './utils/request';

export default defineComponent({
  components: { HeaderComp, FooterComp },
  setup() {
    const { isLoading, adornUrl, httpRequest } = useHttpRequest();
    const { state, commit } = useStore();

    const token = computed(() => {
      return state.user.token;
    })

    // 获取用户信息
    watch(token, (newVal) => {
      if (newVal) {
        getUserData(state.user.simpleUserData.loginname);
      }
    });
    watch(isLoading, (val) => {
      commit('user/updateLoading', val);
    });
    const getUserData = (loginname: string) => {
      httpRequest ({
        url: adornUrl(`/api/v1/user/${loginname}`),
        method: 'get'
      }).then(({data}) => {
        commit('user/updateUserData', data.data);
      }).catch(e => {
        ElMessage.error('请求失败');
        console.error(e)
      })
    };

    onMounted(() => {
      // 获取本地登录态
      commit('user/updateSimpleUserData', {loginname: localStorage.getItem('loginname') || ''});
      commit('user/updateToken', localStorage.getItem('token') || '');
    });

    // 滚动事件、滚动位置
    const top = ref(0);
    const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();
    const scroll = (data: { scrollTop: number; }) => {
      top.value = data.scrollTop;
    };

    // 返回头部
    const backTop = () => {
      scrollbarRef.value?.setScrollTop(0);
    }

    return {
      locale: zhCn,
      top,
      scrollbarRef,
      scroll,
      CaretTop,
      backTop,
    };
  }
})
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #e1e1e1;
  color: #2c3e50;
  min-height: 100%;
  .back-top {
    position: fixed;
    right: 40px;
    bottom: 100px;
  }
}
html, body {
  height: 100%;
  margin: 0;
}
</style>
