<template>
  <div class="content-body">
    <div class="lift-content">
      <el-card class="box-card">
        <el-tabs v-model="activeTypeName" class="demo-tabs" @tab-click="handleTabClick">
          <el-tab-pane v-for="(item, i) in topicTypeList" :key="i" :label="item.name" :name="item.key"></el-tab-pane>
          <list-comp :key="listData" :listData="listData"/>
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
  </div>
</template>

<script lang="ts">
import useHttpRequest from '@/utils/request'
import { ElCard, ElTabPane, ElTabs } from 'element-plus';
import { defineComponent, ref } from 'vue'
import ListComp from '@/components/list/index.vue'
import { topicTypeList } from '@/constant'
interface getTopicListType {
  page?: number;
  tab?: string;
  limit?: number;
  mdrender?: boolean;
}

export default defineComponent({
  components: { ElCard, ElTabs, ElTabPane, ListComp },
  setup() {
    // 列表数据获取
    const { adornUrl, httpRequest } = useHttpRequest();
    const listData = ref([]);
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
      }).then((res: any) => {
        if (res?.data?.success) {
          listData.value = res?.data.data;
        }
      }).catch((e: any) => {
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

    // 初始化获取数据
    getTopicList({});

    return {
      topicTypeList,
      listData,
      activeTypeName,
      handleTabClick,
      page,
      limit,
      handleCurrentChange,
      handleSizeChange,
    }
  },
})
</script>

<style lang="scss" src="./index.scss"></style>