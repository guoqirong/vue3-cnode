<template>
  <div class="my-message">
    <!-- 左侧内容 -->
    <div class="lift-content">
      <el-card class="box-card">
        <template #header>
          <span class="card-title">我的收藏</span>
        </template>
        <div>
          <list-comp
            :isLoading="isLoading"
            :listData="collect"
            @seeDetail="seeDetail"
          />
        </div>
      </el-card>
    </div>
    <!-- 右侧内容 -->
    <div class="right-content">
      <user-info-comp />
      <client-qr-code-comp />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import ListComp from '@/components/list/index.vue';
import ClientQrCodeComp from '@/components/client-qr-code/index.vue';
import UserInfoComp from '@/components/user-info/index.vue';
import useHttpRequest from '@/utils/request';
import { topicListItemType } from '@/components/list-item/index.vue';
import { ElMessage } from 'element-plus';
import { useStore } from 'vuex';
import router from '@/router';

export default defineComponent({
  components: {
    ListComp,
    ClientQrCodeComp,
    UserInfoComp
  },
  setup() {
    const { state } = useStore();
    // 个人信息
    const userData = computed(() => {
      return state.user.simpleUserData;
    });

    // 列表数据获取
    const { isLoading, adornUrl, httpRequest } = useHttpRequest();
    const collect = ref<topicListItemType[]>([]);
    const getData = () => {
      if (userData.value && userData.value.loginname) {
        httpRequest ({
          url: adornUrl(`/api/v1/topic_collect/${userData.value.loginname}`),
          method: 'get'
        }).then(({data}) => {
          collect.value = data.data;
        }).catch(e => {
          ElMessage.error('请求失败');
          console.error(e);
        })
      } else {
      router.push('/index');
      }
    };
    getData();

    // 查看详情
    const seeDetail = (id: string) => {
      router.push({
        path: `/detail`,
        query: {
          id: id,
        }
      });
    };

    return {
      isLoading,
      collect,
      seeDetail,
    };
  },
})
</script>

<style lang="scss" src="./index.scss"></style>