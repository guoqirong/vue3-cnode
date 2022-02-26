<template>
  <header-comp/>
  <router-view/>
  <footer-comp/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HeaderComp from '@/components/header/index.vue';
import FooterComp from '@/components/footer/index.vue';
import { useStore } from 'vuex';
export default defineComponent({
  components: { HeaderComp, FooterComp },
  mounted () {
    // 获取本地登录态
    const store = useStore();
    store.commit('user/updateToken', localStorage.getItem('token') || '');
  }
})
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body {
  margin: 0;
}
</style>
