<template>
  <div
    class="item-body"
    @click="$emit('seeDetail', itemData.id)">
    <div class="user-img">
      <el-avatar
        shape="square"
        :size="30"
        :src="itemData.author.avatar_url"
        :key="itemData.author.avatar_url"
        :alt="itemData.author.loginname"
      ></el-avatar>
    </div>
    <div class="reply-count">
      <span class="count-of-replies" title="回复数">{{itemData.reply_count}}</span>
      <span>/</span>
      <span class="count-of-visits" title="点击数">{{itemData.visit_count}}</span>
    </div>
    <div class="topic-tab" :style="{'width': !itemData.top && itemData.tab === 'dev' ? '' : '42px'}">
      <el-tag effect="dark" :type="itemData.top ? 'danger' : 'success'">
        {{getTopicTab(itemData.top, itemData.tab)}}
      </el-tag>
    </div>
    <div
      class="topic-title"
      :title="itemData.title"
      :style="{
        'width': !itemData.top && itemData.tab === 'dev' ? '' : 'calc(100% - 40px - 42px - 90px - 90px)'
      }"
    >{{itemData.title}}</div>
    <div class="created-time">{{formatDate(itemData.create_at, 'yyyy-MM-dd')}}</div>
  </div>
</template>

<script lang="ts">
import { formatDate, getTopicTab } from '@/utils'
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    // 列表项数据
    itemData: Object
  },
  setup(props) {
    return {
      ...props,
      formatDate,
      getTopicTab
    }
  },
})
</script>

<style lang="scss" src="./index.scss"></style>