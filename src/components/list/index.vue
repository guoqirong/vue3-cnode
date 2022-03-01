<template>
  <div class="list-body">
    <div v-for="(item, i) in listData" :key="i">
      <span>{{item.title}}</span>
      <!-- <list-item :itemData="item" @seeDetail="seeDetail"></list-item> -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ListComp',
  props: {
    listData: {
      typeof: Array,
      default: [],
    },
  },
  setup(props) {
    console.log(props?.listData);
    return {
      ...props
    }
  },
})
</script>

<style lang="scss" src="./index.scss"></style>