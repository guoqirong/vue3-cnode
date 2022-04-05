<template>
  <div class="lift-content">
    <slot></slot>
  </div>
  <div class="right-content">
    <slot name="right"></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PageWrapper',
})
</script>

<style lang="scss" src="./index.scss"></style>