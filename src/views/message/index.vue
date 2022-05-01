<template>
  <div class="my-message">
    <page-wrapper>
      <!-- 左侧内容 -->
      <el-card class="box-card">
        <template #header>
          <span class="card-title">未读信息</span>
          <el-button
            class="all-read"
            v-if="message && message.hasnot_read_messages && message.hasnot_read_messages.length > 0"
            @click="readAll"
          >全部已读</el-button>
        </template>
        <template #default>
          <el-skeleton class="message-skeleton" :loading="isLoading" animated :rows="6">
            <template #default>
              <template v-if="message && message.hasnot_read_messages && message.hasnot_read_messages.length > 0">
                <div v-for="(item, i) in message.hasnot_read_messages" :key="i" class="notread-item">
                  <div class="user-img">
                    <el-avatar
                      shape="square"
                      :size="40"
                      :src="item.author.avatar_url"
                      :key="item.author.avatar_url"
                      :alt="item.author.loginname"
                    ></el-avatar>
                  </div>
                  <div class="read-messages-title">
                    <div class="title">{{item.author.loginname + '回复了您的话题'}}</div>
                    <div class="desc">{{formatDate(item.create_at, 'yyyy-MM-dd')}}</div>
                  </div>
                  <div class="read-btn"><el-button @click="readOne(item.id)">已读</el-button></div>
                  <div class="reply-content" v-html="item.reply.content"></div>
                  <div class="topic-title">话题：{{item.topic.title}}</div>
                </div>
              </template>
              <el-empty v-else description="暂无数据" />
            </template>
          </el-skeleton>
        </template>
      </el-card>
      <el-card class="box-card">
        <template #header>
          <span class="card-title">已读信息</span>
        </template>
        <template #default>
          <el-skeleton class="message-skeleton" :loading="isLoading" animated :rows="6">
            <template #default>
              <template v-if="message && message.has_read_messages && message.has_read_messages.length > 0">
                <div v-for="(item, i) in message.has_read_messages" :key="i" class="read-item">
                  <div class="user-img">
                    <el-avatar
                      shape="square"
                      :size="40"
                      :src="item.author.avatar_url"
                      :key="item.author.avatar_url"
                      :alt="item.author.loginname"
                    ></el-avatar>
                  </div>
                  <div class="read-messages-title">
                    <div class="title">{{item.author.loginname + '回复了您的话题'}}</div>
                    <div class="desc">{{formatDate(item.create_at, 'yyyy-MM-dd')}}</div>
                  </div>
                  <div class="reply-content" v-html="item.reply.content"></div>
                  <div class="topic-title">话题：{{item.topic.title}}</div>
                </div>
              </template>
              <el-empty v-else description="暂无数据" />
            </template>
          </el-skeleton>
        </template>
      </el-card>
      <!-- 右侧内容 -->
      <template #right>
        <user-info-comp />
        <client-qr-code-comp />
      </template>
    </page-wrapper>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import ClientQrCodeComp from '@/components/client-qr-code/index.vue';
import UserInfoComp from '@/components/user-info/index.vue';
import useHttpRequest from '@/utils/request';
import { useStore } from 'vuex';
import { ElEmpty, ElMessage, ElSkeleton } from 'element-plus';
import { authorType } from '../detail/index.vue';
import { changeLtGt, formatDate } from '@/utils';
import useEventBus from '@/utils/eventBus';

interface replyType {
  content: string;
  create_at: string;
  id: string;
  ups: string[];
}

interface topicType {
  id: string;
  last_reply_at: string;
  title: string;
}

interface messagesItemType {
  author: authorType;
  create_at: string;
  has_read: boolean;
  id: string;
  reply: replyType;
  topic: topicType;
  type: string;
}

interface messagesType {
  has_read_messages: messagesItemType[];
  hasnot_read_messages: messagesItemType[];
}


export default defineComponent({
  components: {
    ElSkeleton,
    ElEmpty,
    ClientQrCodeComp,
    UserInfoComp
  },
  setup() {
    const { state } = useStore();

    // 登录标识
    const token = computed(() => {
      return state.user.token;
    });

    // 列表数据获取
    const { isLoading, adornUrl, httpRequest } = useHttpRequest();
    const message = ref<messagesType>();
    const getData = () => {
      if (token.value) {
        httpRequest ({
          url: adornUrl(`/api/v1/messages`),
          method: 'get',
          params: {
            accesstoken: token.value,
            mdrender: true
          }
        }).then(({data}) => {
          data.data.has_read_messages.forEach((item: messagesItemType) => {
            item.reply.content = changeLtGt(item.reply.content);
          });
          data.data.hasnot_read_messages.forEach((item: messagesItemType) => {
            item.reply.content = changeLtGt(item.reply.content);
          });
          message.value = data.data;
        }).catch(e => {
          ElMessage.error('请求失败');
          console.error(e);
        })
      }
    };
    getData();

    // 标记消息已读
    const [ emitter ] = useEventBus();
    const { httpRequest: readHttpRequest } = useHttpRequest();
    const readAll = () => {
      readHttpRequest({
        url: adornUrl(`/api/v1/message/mark_all`),
        method: 'post',
        params: {
          accesstoken: token.value
        }
      }).then(() => {
        emitter.emit('read-msg');
        getData();
      }).catch(e => {
        ElMessage.error('请求失败');
        console.error(e);
      })
    };
    const readOne = (id: string) => {
      readHttpRequest({
        url: adornUrl(`/api/v1/message/mark_one/${id}`),
        method: 'post',
        params: {
          accesstoken: token.value
        }
      }).then(() => {
        emitter.emit('read-msg');
        getData();
      }).catch(e => {
        ElMessage.error('请求失败');
        console.error(e);
      })
    };

    return {
      message,
      isLoading,
      readAll,
      readOne,
      formatDate,
    }
  },
})
</script>


function item(item: any, arg1: (messagesItemType: any) => void) {
  throw new Error('Function not implemented.');
}
<style lang="scss" src="./index.scss"></style>