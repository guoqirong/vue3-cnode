<template>
  <div>list</div>
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