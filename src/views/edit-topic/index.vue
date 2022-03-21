<template>
  <div class="edit-topic-body">
    <div class="lift-content">
      <el-card class="box-card">
        <!-- 新增、编辑头部信息 -->
        <template #header>
          <el-page-header
            class="card-title"
            @back="goBack"
            content="发布话题"
          ></el-page-header>
        </template>
        <span class="my-topic">
          <el-skeleton class="detail-skeleton" :loading="false" animated :rows="20">
            <template #default>
              <el-form
                ref="form"
                :model="sizeForm"
                label-width="auto"
                label-position="top"
              >
                <el-form-item label="Activity name">
                  <el-input v-model="sizeForm.name" />
                </el-form-item>
                <el-form-item label="Activity zone">
                  <el-select
                    v-model="sizeForm.region"
                    placeholder="please select your zone"
                  >
                    <el-option label="Zone one" value="shanghai" />
                    <el-option label="Zone two" value="beijing" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit">Create</el-button>
                  <el-button>Cancel</el-button>
                </el-form-item>
              </el-form>
            </template>
          </el-skeleton>
          <div class="topic-content" v-html="topic?.content"></div>
        </span>
      </el-card>
    </div>
    <div class="right-content">
      <user-info-comp />
      <client-qr-code-comp />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { ElButton, ElCard, ElForm, ElFormItem, ElPageHeader, ElSelect, ElSkeleton } from 'element-plus';
import UserInfoComp from '@/components/user-info/index.vue';
import ClientQrCodeComp from '@/components/client-qr-code/index.vue';

export default defineComponent({
  components: {
    ElCard,
    ElPageHeader,
    ElSkeleton,
    ElForm,
    ElFormItem,
    ElSelect,
    ElButton,
    UserInfoComp,
    ClientQrCodeComp
  },
  setup() {
    const sizeForm = reactive({
      name: '',
      region: '',
    });

    return {
      sizeForm,
    };
  },
})
</script>

<style lang="scss" src="./index.scss"></style>