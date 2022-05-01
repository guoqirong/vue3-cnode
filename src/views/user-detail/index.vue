<template>
  <div class="user-info">
    <page-wrapper>
      <!-- 左侧内容 -->
      <el-card class="box-card user-base-info">
        <template #header>
          <span class="card-title">基本信息</span>
        </template>
        <div>
        <el-skeleton :loading="isLoading" animated>
          <template #template>
            <div class="user-skeleton">
              <el-skeleton-item class="skeleton-user-img" />
              <el-skeleton-item class="skeleton-user-name" />
              <el-skeleton-item class="skeleton-user-score" />
            </div>
          </template>
          <template #default>
            <div class="user">
              <div class="user-img">
                <el-avatar
                  shape="square"
                  :size="40"
                  :src="userData && userData.avatar_url || ''" :key="userData && userData.avatar_url || ''"
                  :alt="userData && userData.loginname || ''"
                ></el-avatar>
              </div>
              <div class="user-name">{{userData && userData.loginname || ''}}</div>
              <div v-if="userData && userData.score" class="user-score">积分：{{userData && userData.score || ''}}</div>
            </div>
          </template>
        </el-skeleton>
        </div>
      </el-card>
      <el-card class="box-card">
        <template #header>
          <span class="card-title">我的话题</span>
        </template>
        <div>
          <list-comp
            :isLoading="isLoading"
            isSimpleItem
            :listData="userData && userData.recent_topics || []"
            @seeDetail="seeDetail"
          />
        </div>
      </el-card>
      <el-card class="box-card">
        <template #header>
          <span class="card-title">我的参与</span>
        </template>
        <div>
          <list-comp
            :isLoading="isLoading"
            isSimpleItem
            :listData="userData && userData.recent_replies || []"
            :isTopicsRepliesList="false"
            @seeDetail="seeDetail"
          />
        </div>
      </el-card>
      <!-- 右侧内容 -->
      <template #right>
        <user-info-comp
          :authorData="userData"
          :authorLoading="isLoading"
          :isTopicsRepliesList="false"
        />
        <client-qr-code-comp />
      </template>
    </page-wrapper>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import ListComp from '@/components/list/index.vue';
import ClientQrCodeComp from '@/components/client-qr-code/index.vue';
import UserInfoComp from '@/components/user-info/index.vue';
import useHttpRequest from '@/utils/request';
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';
import { userDataType } from '@/store/modules/user';
import { routerPush } from '@/utils';

export default defineComponent({
  components: {
    ListComp,
    ClientQrCodeComp,
    UserInfoComp
  },
  setup() {
    const route = useRoute();
    // 列表数据获取
    const { isLoading, adornUrl, httpRequest } = useHttpRequest();
    const userData = ref<userDataType>();
    const getUserData = () => {
      httpRequest ({
        url: adornUrl(`/api/v1/user/${route.params.userName}`),
        method: 'get'
      }).then(({data}) => {
        userData.value = data.data;
      }).catch(e => {
        ElMessage.error('请求失败');
        console.error(e)
      })
    };
    getUserData();

    // 查看详情
    const seeDetail = (id: string) => {
      routerPush({
        path: `/detail`,
        query: {
          id: id,
          userName: route.params.userName
        }
      });
    };

    return {
      isLoading,
      userData,
      seeDetail,
    }
  },
})
</script>

<style lang="scss" src="./index.scss"></style>