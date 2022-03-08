<template>
  <el-config-provider :locale="locale">
    <header-comp/>
    <router-view/>
    <footer-comp/>
  </el-config-provider>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, watch } from 'vue';
import { ElConfigProvider, ElMessage } from 'element-plus';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import HeaderComp from '@/components/header/index.vue';
import FooterComp from '@/components/footer/index.vue';
import { useStore } from 'vuex';
import useHttpRequest from './utils/request';

export default defineComponent({
  components: { HeaderComp, FooterComp, ElConfigProvider },
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
      } else {
        commit('user/updateUserData', {});
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

    return {
      locale: zhCn,
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
}
html, body {
  height: 100%;
  margin: 0;
}
</style>
