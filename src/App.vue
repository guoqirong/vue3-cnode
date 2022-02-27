<template>
  <el-config-provider :locale="locale">
    <header-comp/>
    <router-view/>
    <footer-comp/>
  </el-config-provider>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import HeaderComp from '@/components/header/index.vue';
import FooterComp from '@/components/footer/index.vue';
import { useStore } from 'vuex';
export default defineComponent({
  components: { HeaderComp, FooterComp, ElConfigProvider },
  mounted () {
    // 获取本地登录态
    const store = useStore();
    store.commit('user/updateToken', localStorage.getItem('token') || '');
  },
  setup() {
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
  text-align: center;
  background-color: #e1e1e1;
  color: #2c3e50;
}
body {
  margin: 0;
}
</style>
