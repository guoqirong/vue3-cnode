<template>
  <el-card
    class="box-card"
    v-if="!(token || authorData)">
    <span class="not-login">
      <div class="title">
        CNode：Node.js专业中文社区 
      </div>
      <div class="describe">
        <span class="not-bottom">当前为游客状态，您可以</span>
        <el-link
          :underline="false"
          @click="gotoLogin"
        >登录</el-link> 
      </div>
    </span>
  </el-card>
  <el-card
    class="box-card"
    v-if="token || authorData">
    <template #header>
      <span class="card-title">{{title}}</span>
    </template>
    <el-skeleton :loading="loading" animated>
      <template #template>
        <div class="user-skeleton">
          <el-skeleton-item class="skeleton-user-img" />
          <el-skeleton-item class="skeleton-user-name" />
          <el-skeleton-item class="skeleton-user-score" />
        </div>
      </template>
      <template #default>
        <div class="user" @click="gotoUserDetail">
          <div class="user-img">
            <el-avatar
              shape="square"
              :size="40"
              :src="userData.avatar_url || ''" :key="userData.avatar_url || ''"
              :alt="userData.loginname || ''"
            ></el-avatar>
          </div>
          <div class="user-name">{{userData.loginname || ''}}</div>
          <div v-if="userData.score" class="user-score">积分：{{userData.score || ''}}</div>
        </div>
      </template>
    </el-skeleton>
  </el-card>
  <el-card
    class="box-card list-card"
    v-if="isTopicsRepliesList && token && userData.recent_topics">
    <template #header>
      <span class="card-title">我的主题</span>
    </template>
    <div
      v-for="(item, i) in userData.recent_topics"
      :key="i"
      class="recent_topics">
      <div :title="item.title">{{item.title}}</div>
    </div>
    <div
      v-if="userData.recent_topics && userData.recent_topics.length < 1"
      class="recent_topics">
      <div>暂无数据</div>
    </div>
  </el-card>
  <el-card
    class="box-card list-card"
    v-if="isTopicsRepliesList && token && userData.recent_replies">
    <template #header>
      <span class="card-title">我的参与</span>
    </template>
    <div
      v-for="(item, i) in userData.recent_replies"
      :key="i"
      class="recent_topics">
      <div :title="item.title">{{item.title}}</div>
    </div>
    <div
      v-if="userData.recent_replies && userData.recent_replies.length < 1"
      class="recent_topics">
      <div>暂无数据</div>
    </div>
  </el-card>
</template>

<script lang="ts">
import { routerPush } from '@/utils';
import { ElSkeleton, ElSkeletonItem } from 'element-plus';
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'UserInfoComp',
  components: { ElSkeleton, ElSkeletonItem },
  props: {
    title: {
      type: String,
      default: '个人信息'
    },
    authorData: {
      type: Object,
      default: undefined,
    },
    authorLoading: Boolean,
    isTopicsRepliesList: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const { state } = useStore();
    const route = useRoute();

    // 登录标识
    const token = computed(() => {
      return state.user.token;
    });
    
    // 用户数据加载中
    const loading = computed(() => {
      return props.authorLoading ?? state.user.isLoading;
    });

    // 个人信息
    const userData = computed(() => {
      return props.authorData ?? state.user.userData;
    });
    
    // 前往登录页
    const gotoLogin = () => {
      if (route.path !== '/login') {
        routerPush({
          path: '/login'
        })
      }
    };
    
    // 前往用户详情页
    const gotoUserDetail = () => {
      routerPush({
        path: `/user/${userData.value.loginname}`
      });
    };

    return {
      token,
      loading,
      userData,
      gotoLogin,
      gotoUserDetail,
    }
  },
})
</script>

<style lang="scss" src="./index.scss"></style>