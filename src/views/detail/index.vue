<template>
  <div class="detail-body">
    <page-wrapper>
      <el-card class="box-card">
        <!-- 详情头部信息 -->
        <template #header>
          <el-page-header
            class="card-title"
            @back="goBack"
            content="话题详情"
          ></el-page-header>
          <el-button
            v-if="userName === topic?.author.loginname"
            class="edit-topic-btn"
            type="primary"
            @click="editTopic"
          >编辑话题</el-button>
        </template>
        <span class="my-topic">
          <el-skeleton class="detail-skeleton" :loading="isLoading" animated :rows="20">
            <template #default>
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
                    v-if="!!token"
                    circle
                    plain
                    size="large"
                    type="warning"
                    :icon="topic?.is_collect ? StarFilled : Star"
                    @click="collectClick"
                  ></el-button>
                </div>
              </div>
            </template>
          </el-skeleton>
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
          <div class="replie-up">
            <div class="icon up-icon" @click="likeAndUnlike(item.id)"></div>
            <span v-if="item.ups.length">{{item.ups.length}}</span>
          </div>
          <div class="icon replie-icon" @click="changeRepliceItemState(i)"></div>
          <div class="replie-desc">{{formatDate(item.create_at, 'yyyy-MM-dd')}}</div>
          <div class="replie-content" v-html="item?.content"></div>
          <el-form
            v-if="item.isReplie"
            :ref="(el) => item.formRef = el"
            class="replies-form replie-edit-wrapper"
            :model="item"
            :rules="rules"
            label-width="0"
          >
            <el-form-item label="" prop="replieContent">
              <editor
                api-key="mh2f2ffdlr2zzaky3yk52tx8rtxrxnbt1a6p7p7jx96hy70r"
                :init="init"
                v-model="item.replieContent"
              ></editor>
            </el-form-item>
            <el-form-item class="is-last">
              <el-button type="primary" @click="replieTopic(item.formRef, item.id, item.replieContent)">回复</el-button>
              <el-button @click="changeRepliceItemState(i)">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
      <el-card class="box-card">
        <template #header>
          <span class="card-replies-title">添加回复</span>
        </template>
        <el-form
          ref="form"
          class="replies-form"
          :model="topicReplieForm"
          :rules="rules"
          label-width="0"
        >
          <el-form-item label="" prop="content">
            <editor
              api-key="mh2f2ffdlr2zzaky3yk52tx8rtxrxnbt1a6p7p7jx96hy70r"
              :init="init"
              v-model="topicReplieForm.content"
            ></editor>
          </el-form-item>
          <el-form-item class="is-last">
            <el-button type="primary" @click="replieTopic(form)">回复</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <template #right>
        <user-info-comp
          title="作者"
          :authorData="topic?.author"
          :authorLoading="isLoading"
        />
        <client-qr-code-comp />
      </template>
    </page-wrapper>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, Ref, ref } from 'vue';
import PageWrapper from '@/components/page-wrapper/index.vue';
import UserInfoComp from '@/components/user-info/index.vue';
import ClientQrCodeComp from '@/components/client-qr-code/index.vue';
import useHttpRequest from '@/utils/request';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { ElAvatar, ElButton, ElCard, ElForm, ElFormItem, ElMessage, ElPageHeader, ElSkeleton } from 'element-plus';
import { Star, StarFilled } from '@element-plus/icons-vue'
import { changeLtGt, formatDate, getTopicTab, routerPush } from '@/utils';
import Editor from '@tinymce/tinymce-vue';

export interface authorType {
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
  isReplie: boolean;
  replieContent: string;
  formRef: Ref<unknown>;
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
  components: {
    ElCard,
    ElPageHeader,
    ElButton,
    ElAvatar,
    ElSkeleton,
    ElForm,
    ElFormItem,
    Editor,
    PageWrapper,
    UserInfoComp,
    ClientQrCodeComp
  },
  setup() {
    const route = useRoute();
    const { state } = useStore();
    
    // 富文本初始配置项
    const init = {
      height: 200, //富文本高度
      width: '100%', //富文本宽度
      language_url: (state.grobal.entryUrl ?? '.') + '/tinymce-langs/zh_CN.js', //中文包
      language: 'zh_CN', //中文
      browser_spellcheck: true, // 拼写检查
      branding: false, // 去水印
      elementpath: true, //禁用编辑器底部的状态栏
      statusbar: true, // 隐藏编辑器底部的状态栏
      paste_data_images: true, // 是否允许粘贴图像
      menubar: false, // 隐藏最上方menu
      fontsize_formats: '14px 16px 18px 20px 24px 26px 28px 30px 32px 36px', //字体大小
      font_formats:'微软雅黑=Microsoft YaHei,Helvetica Neue;PingFang SC;sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun;serifsans-serif;Terminal=terminal;monaco;Times New Roman=times new roman;times', //字体
      file_picker_types: 'image',
      images_upload_credentials: false,
      plugins: [
        'advlist autolink lists link image charmap print preview anchor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table paste code help wordcount',
      ],
      toolbar: 'fontselect fontsizeselect link lineheight forecolor backcolor bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | image quicklink h2 h3 blockquote table numlist bullist preview fullscreen',
    };

    // 用户名
    const userName = computed(() => {
      return state.user.simpleUserData.loginname;
    });

    // 获取话题数据
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
        data.data.replies.forEach((item: topicRepliesType) => {
          item.content = changeLtGt(item.content);
          item.isReplie = false;
          item.formRef = ref<InstanceType<typeof ElForm>>();
          item.replieContent = '';
        });
        topic.value = data.data;
      }).catch(e => {
        ElMessage.error('请求失败');
        console.error(e);
      })
    };

    getData();

    // 返回列表
    const goBack = () => {
      if (route.query.listParm) {
        routerPush({
          name: 'index',
          params: {
            listParm: String(route.query.listParm)
          }
        })
      } else if (route.query.userName) {
        routerPush(`/user/${route.query.userName}`)
      } else {
        routerPush('/collect')
      }
    };

    // 修改话题
    const editTopic = () => {
      if (route.query.userName) {
        routerPush({
          path: `/edit-topic/${topic.value?.id}`,
          query: {
            userName: route.query.userName
          }
        });
      } else {
        routerPush({
          path: `/edit-topic/${topic.value?.id}`,
          query: {
            listParm: String(route.query.listParm)
          }
        });
      }
    };

    // 收藏和取消收藏
    const { httpRequest: collectHttpRequest } = useHttpRequest();
    const collectClick = () => {
      if (topic.value && topic.value.is_collect) {
        topicDeCollect()
      } else {
        topicCollect()
      }
    };
    const topicCollect = () => {
      collectHttpRequest({
        url: adornUrl(`/api/v1/topic_collect/collect`),
        method: 'post',
        data: {
          topic_id: topic.value && topic.value.id,
          accesstoken: localStorage.getItem('token') || ''
        }
      }).then(() => {
        if (topic.value) topic.value.is_collect = true;
        ElMessage.success('收藏成功');
      }).catch(e => {
        ElMessage.error('请求失败');
        console.error(e);
      });
    };
    const topicDeCollect = () => {
      collectHttpRequest({
        url: adornUrl(`/api/v1/topic_collect/de_collect`),
        method: 'post',
        data: {
          topic_id: topic.value && topic.value.id,
          accesstoken: localStorage.getItem('token') || ''
        }
      }).then(() => {
        if (topic.value) topic.value.is_collect = false;
        ElMessage.success('取消收藏成功');
      }).catch(e => {
        ElMessage.error('请求失败');
        console.error(e);
      });
    };
    
    // 为评论点赞和取消点赞
    const { httpRequest: likeHttpRequest } = useHttpRequest();
    const likeAndUnlike = (id: number) => {
      likeHttpRequest({
        url: adornUrl(`/api/v1/reply/${id}/ups`),
        method: 'post',
        data: {
          accesstoken: localStorage.getItem('token') || ''
        }
      }).then(({ data }) => {
        if (data.action === 'up') {
          ElMessage.success('点赞成功');
        } else {
          ElMessage.success('取消点赞成功');
        }
        getData();
      }).catch(e => {
        const { data } = e.response;
        if (data.error_msg) {
          ElMessage.error(data.error_msg);
          return;
        }
        ElMessage.error('请求失败');
        console.error(e);
      });
    };
    
    // 表单ref
    const form = ref<InstanceType<typeof ElForm>>();
    // 表单值对象
    const topicReplieForm = reactive({
      id: undefined,
      content: '',
    });
    // 表单校验规则
    const rules = reactive({
      content: [
        { required: true, message: '请输入内容', trigger: 'blur' },
      ],
      replieContent: [
        { required: true, message: '请输入内容', trigger: 'blur' },
      ],
    });
    // 回复话题
    const { httpRequest: replieHttpRequest } = useHttpRequest();
    const replieTopic = async (formEl: InstanceType<typeof ElForm> | undefined, replyId?: number, content?: string) => {
      if (!formEl) return;
      await formEl.validate((valid, fields) => {
        if (valid) {
          replieTopicRequest(replyId, content);
        } else {
          console.log('error submit!', fields);
        }
      });
    };
    const replieTopicRequest = (replyId?: number, content?: string) => {
      replieHttpRequest({
        url: adornUrl(`/api/v1/topic/${topic.value?.id}/replies`),
        method: 'post',
        data: {
          accesstoken: localStorage.getItem('token') || '',
          content: content ?? topicReplieForm.content,
          reply_id: replyId,
        }
      }).then(() => {
        topicReplieForm.content = '';
        getData();
      }).catch(e => {
        ElMessage.error('请求失败');
        console.error(e);
      });
    };

    const changeRepliceItemState = (i: number) => {
      if(topic.value) {
        const replies = topic.value?.replies;
        const userName = replies[i].author.loginname;
        replies[i].isReplie = !replies[i].isReplie;
        replies[i].replieContent = replies[i].isReplie ? `<div class="markdown-text"><p><a href="/user/${userName}">@${userName}</a>&nbsp;</p></div>` : '';
        topic.value = {
          ...topic.value,
          replies: replies
        }
      }
    };

    return {
      userName,
      editTopic,
      topic,
      isLoading,
      token: state.user.token,
      Star,
      StarFilled,
      formatDate,
      getTopicTab,
      goBack,
      collectClick,
      likeAndUnlike,
      init,
      form,
      topicReplieForm,
      rules,
      replieTopic,
      changeRepliceItemState,
      replieTopicRequest,
    }
  },
})
</script>

<style lang="scss" src="./index.scss"></style>