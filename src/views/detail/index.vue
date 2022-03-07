<template>
  <div class="detail-body">
    <div class="lift-content">
      <el-card class="box-card">
        <template #header>
          <el-page-header class="card-title" @back="goBack" content="话题详情"></el-page-header>
        </template>
        <span class="my-topic-title">
          <div class="topic-title">
            <div class="title-left">
              <div class="topic-title-tab" :style="{'width': !topic.top && topic.tab === 'dev' ? '' : '40px'}">
                <el-tag effect="dark" :type="topic.top ? 'danger' : 'success'">
                  {{topic.top ? '置顶' : topic.tab === 'good' ? '精华' : topic.tab === 'share' ? '分享' : topic.tab === 'ask' ? '问答' : topic.tab === 'job' ? '招聘' : topic.tab === 'dev' ? '客户端测试' : '全部'}}
                </el-tag>
              </div>
              <div class="title-name" :style="{'width': !topic.top && topic.tab === 'dev' ? '' : 'calc(100% - 40px)'}">{{topic.title}}</div>
              <div class="topic-title-desc">{{'● ' +formatDate((topic.create_at || ''), 'yyyy-MM-dd') + ' ● ' + (topic.author && topic.author.loginname ? topic.author.loginname : '')}}</div>
            </div>
            <div class="title-right">
              <el-button @click="collectClick" type="warning" :icon="topic.is_collect ? 'el-icon-star-on' : 'el-icon-star-off'" circle plain size="small"></el-button>
            </div>
          </div>
          <div class="topic-content" v-html="topic.content"></div>
        </span>
      </el-card>
      <el-card class="box-card" v-if="topic.replies && topic.replies.length > 0">
        <template #header>
          <span class="card-replies-title">回复</span>
        </template>
        <div v-for="(item, i) in topic.replies" :key="i" class="replie-item">
          <div class="replie-user-img">
            <el-avatar shape="square" :size="40" :src="item.author.avatar_url"></el-avatar>
          </div>
          <div class="replie-title">{{item.author.loginname + '回复了您的话题'}}</div>
          <div class="replie-desc">{{formatDate(item.create_at, 'yyyy-MM-dd')}}</div>
          <div class="replie-content" v-html="item.content"></div>
        </div>
      </el-card>
    </div>
    <div class="right-content">
      <user-info-comp title="作者" :authorData="topic.author" />
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
import { ElMessage } from 'element-plus';
import { formatDate } from '@/utils';

export default defineComponent({
  components: { UserInfoComp, ClientQrCodeComp },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { state } = useStore();

    const { isLoading, adornUrl, httpRequest } = useHttpRequest();
    const topic = ref();
    const getData = () => {
      httpRequest ({
        url: adornUrl(`/api/v1/topic/${route.query.id}`),
        method: 'get',
        params: {
          mdrender: true,
          accesstoken: state.user.token || ''
        }
      }).then(({data}) => {
        data.data.content = imgContent(data.data.content);
        data.data.replies.forEach((item: { content: string; }) => {
          item.content = imgContent(item.content);
        });
        topic.value = data.data;
      }).catch(e => {
        ElMessage.error('请求失败');
        console.error(e);
      })
    };

    const imgContent = (content: string) => {
      let str = content;
      // 匹配图片（g表示匹配所有结果i表示区分大小写）
      let imgReg = /<img.*?(?:>|\/>)/gi;
      let arr = str.match(imgReg);
      if (arr && arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
          let imgArr = arr[i].split(' ');
          let img = '';
          for (let key in imgArr) {
            if (key === '0') {
              img = imgArr[key] + ' style="width: 100%"';
            } else {
              img = img + ' ' + imgArr[key];
            }
          }
          str = str.replace(arr[i], img);
        }
      }
      // 匹配p标签（g表示匹配所有结果i表示区分大小写）
      let pReg = /<p.*?(?:>)/gi;
      let arrp = str.match(pReg);
      if (arrp && arrp.length > 0) {
        for (let i = 0; i < arrp.length; i++) {
          let pArr = arrp[i].split('');
          let p = '';
          for (let key in pArr) {
            if (key === '1') {
              p = p + pArr[key] + ' style="word-wrap: break-word;word-break: break-all;"';
            } else {
              p = p + pArr[key];
            }
          }
          str = str.replace(arrp[i], p);
        }
      }
      return str;
    };

    getData();

    return {
      topic,
      formatDate
    }
  },
})
</script>

<style lang="scss" src="./index.scss"></style>