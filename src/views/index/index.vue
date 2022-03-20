<template>
  <div class="content-body">
    <!-- 左侧内容 -->
    <div class="lift-content">
      <el-card class="box-card">
        <!-- tab标签 -->
        <el-tabs
          v-model="activeTypeName"
          class="topic-tabs"
          @tab-click="handleTabClick">
          <el-tab-pane
            v-for="(item, i) in topicTypeList"
            :key="i"
            :label="item.name"
            :name="item.key"
          ></el-tab-pane>
          <!-- 列表 -->
          <list-comp
            :isLoading="isLoading"
            :limit="limit"
            :listData="listData"
            @seeDetail="seeDetail"
          />
          <!-- 分页 -->
          <el-pagination
            class="pagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :pager-count="5"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400">
          </el-pagination>
        </el-tabs>
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
import useHttpRequest, { resDataType } from '@/utils/request';
import { ElCard, ElMessage, ElTabPane, ElTabs } from 'element-plus';
import { defineComponent, ref } from 'vue';
import { topicListItemType } from '@/components/list-item/index.vue';
import ListComp from '@/components/list/index.vue';
import ClientQrCodeComp from '@/components/client-qr-code/index.vue';
import UserInfoComp from '@/components/user-info/index.vue';
import { topicTypeList } from '@/constant';
import { AxiosResponse } from 'axios';
import { useRoute, useRouter } from 'vue-router';

interface getTopicListType {
  page?: number;
  tab?: string;
  limit?: number;
  mdrender?: boolean;
}

export default defineComponent({
  components: {
    ElCard,
    ElTabs,
    ElTabPane,
    ListComp,
    ClientQrCodeComp,
    UserInfoComp
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    // 列表数据获取
    const { isLoading, adornUrl, httpRequest } = useHttpRequest();
    const listData = ref<topicListItemType[]>([]);
    const getTopicList = (data: getTopicListType) => {
      httpRequest({
        url: adornUrl('/api/v1/topics'),
        method: 'get',
        params: {
          page: page.value ?? 1,
          tab: activeTypeName.value ?? 'all',
          limit: limit.value ?? 20,
          mdrender: false,
          ...data
        }
      }).then((res: AxiosResponse<resDataType<topicListItemType[]>>) => {
        if (res?.data?.success) {
          listData.value = res?.data.data ?? [];
        }
      }).catch((e) => {
        ElMessage.error('请求失败');
        console.error(e);
      })
    };

    // 类型tab选中态及点击事件
    const activeTypeName = ref('all');
    const handleTabClick = (tab: { paneName: string; }) => {
      page.value = 1;
      activeTypeName.value = tab.paneName;
      getTopicList({
        tab: tab.paneName
      });
    };

    // 页码、页面显示条数、换页及切换显示条数
    const page = ref(1);
    const limit = ref(20);
    const handleCurrentChange = (val: number) => {
      page.value = val;
      getTopicList({
        page: val
      });
    };
    const handleSizeChange = (val: number) => {
      page.value = 1;
      limit.value = val;
      getTopicList({
        limit: val
      });
    };

    // 初始化获取数据、根据路由修改tab、页码及页面显示条数
    const [tab, pageNum, limitNum] = String(route.params.listParm).split('|') ?? [];
    if (tab && pageNum && limitNum) {
      activeTypeName.value = tab;
      page.value = Number(pageNum);
      limit.value = Number(limitNum);
    }
    getTopicList({});

    // 查看详情
    const seeDetail = (id: string) => {
      router.push({
        path: `/detail`,
        query: {
          id: id,
          listParm: `${activeTypeName.value}|${page.value}|${limit.value}`
        }
      })
    }

    return {
      topicTypeList,
      isLoading,
      listData,
      activeTypeName,
      handleTabClick,
      seeDetail,
      page,
      limit,
      handleCurrentChange,
      handleSizeChange,
    }
  },
})
</script>

<style lang="scss" src="./index.scss"></style>