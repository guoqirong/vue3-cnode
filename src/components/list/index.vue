<template>
  <div class="list-body">
    <div v-for="(item, i) in listData" :key="i">
      <list-item :itemData="item" @seeDetail="seeDetail"></list-item>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ListItem from '@/components/list-item/index.vue';

export default defineComponent({
  name: 'ListComp',
  components: { ListItem },
  props: {
    // 列表数据
    listData: {
      typeof: Array,
      default: [],
    },
  },
  setup(props, content) {
    // 查看详情
    const seeDetail = (v: string) => {
      content.emit('seeDetail', v);
    }
    return {
      ...props,
      seeDetail,
    }
  },
})
</script>

<style lang="scss" src="./index.scss"></style>