<template>
  <div class="detail-body">
    <div class="lift-content">
      <el-card class="box-card">
        <template #header>
          <el-page-header
            class="card-title"
            @back="goBack"
            content="话题详情"
          ></el-page-header>
        </template>
        <span class="my-topic-title">
          <div class="topic-title">
            <div class="title-left">
              <div
              class="topic-title-tab"
              :style="{
                width: !topic?.top && topic?.tab === 'dev' ? '' : '50px'
              }">
                <el-tag effect="dark" :type="topic?.top ? 'danger' : 'success'">
                  {{getTopicTab(topic?.top, topic?.tab)}}
                </el-tag>
              </div>
              <div
                class="title-name"
                :style="{
                  'width': !topic?.top && topic?.tab === 'dev' ? '' : 'calc(100% - 50px)'
                }"
              >{{topic?.title}}</div>
              <div class="topic-title-desc">
                <span>{{'● ' + formatDate((topic?.create_at || ''), 'yyyy-MM-dd')}}</span>
                <span>{{'● ' + (topic?.author && topic?.author.loginname ? topic?.author.loginname : '')}}</span>
              </div>
            </div>
            <div class="title-right">
              <el-button
                circle
                plain
                size="large"
                type="warning"
                :icon="topic?.is_collect ? Star : StarFilled"
                @click="collectClick"
              ></el-button>
            </div>
          </div>
          <div class="topic-content" v-html="topic?.content"></div>
        </span>
      </el-card>
      <el-card class="box-card" v-if="topic?.replies && topic.replies?.length > 0">
        <template #header>
          <span class="card-replies-title">回复</span>
        </template>
        <div v-for="(item, i) in topic?.replies" :key="i" class="replie-item">
          <div class="replie-user-img">
            <el-avatar shape="square" :size="40" :src="item.author.avatar_url"></el-avatar>
          </div>
          <div class="replie-title">{{item.author.loginname + '回复了您的话题'}}</div>
          <div class="replie-desc">{{formatDate(item.create_at, 'yyyy-MM-dd')}}</div>
          <div class="replie-content" v-html="item?.content"></div>
        </div>
      </el-card>
    </div>
    <div class="right-content">
      <user-info-comp title="作者" :authorData="topic?.author" />
      <client-qr-code-comp />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import UserInfoComp from '@/components/user-info/index.vue';
import ClientQrCodeComp from '@/components/client-qr-code/index.vue';
import useHttpRequest from '@/utils/request';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ElAvatar, ElButton, ElCard, ElMessage, ElPageHeader } from 'element-plus';
import { Star, StarFilled } from '@element-plus/icons-vue'
import { changeLtGt, formatDate, getTopicTab } from '@/utils';

interface authorType {
  loginname: string;
  avatar_url: string;
}

interface topicRepliesType {
  id: string;
  author: authorType;
  content: string;
  ups: string[];
  create_at: string;
  reply_id: null;
  is_uped: boolean;
}

interface topicDetailType {
  id: string;
  author_id: string;
  tab: string;
  content: string;
  title: string;
  last_reply_at: string;
  good: boolean;
  top: boolean;
  reply_count: number;
  visit_count: number;
  create_at: string;
  author: authorType;
  replies: topicRepliesType[];
  is_collect: boolean;
}

export default defineComponent({
  components: { ElCard, ElPageHeader, ElButton, ElAvatar, UserInfoComp, ClientQrCodeComp },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { state } = useStore();

    const { isLoading, adornUrl, httpRequest } = useHttpRequest();
    const topic = ref<topicDetailType>();
    const getData = () => {
      httpRequest ({
        url: adornUrl(`/api/v1/topic/${route.query.id}`),
        method: 'get',
        params: {
          mdrender: true,
          accesstoken: state.user.token || ''
        }
      }).then(({data}) => {
        data.data.content = changeLtGt(data.data.content);
        data.data.replies.forEach((item: { content: string; }) => {
          item.content = changeLtGt(item.content);
        });
        topic.value = data.data;
      }).catch(e => {
        ElMessage.error('请求失败');
        console.error(e);
      })
    };

    getData();

    const goBack = () => {
      router.push({
        name: 'index',
        params: {
          listParm: String(route.query.listParm)
        }
      })
    };

    return {
      topic,
      Star,
      StarFilled,
      formatDate,
      getTopicTab,
      goBack,
    }
  },
})
</script>

<style lang="scss" src="./index.scss"></style>