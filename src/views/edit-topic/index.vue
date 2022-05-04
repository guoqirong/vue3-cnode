<template>
  <div class="edit-topic-body">
    <page-wrapper>
      <el-card class="box-card">
        <!-- 新增、编辑头部信息 -->
        <template #header>
          <el-page-header
            class="card-title"
            @back="goBack"
            :content="route?.name === 'addTopic' ? '发布话题' : '编辑话题'"
          ></el-page-header>
        </template>
        <span class="edit-topic">
          <el-skeleton class="edit-skeleton" :loading="isLoading" animated :rows="20">
            <template #default>
              <el-form
                ref="form"
                class="edit-form"
                :model="topicForm"
                :rules="rules"
                label-width="auto"
                label-position="top"
              >
                <el-form-item label="版块" prop="tab">
                  <el-select
                    v-model="topicForm.tab"
                    placeholder=""
                  >
                    <el-option
                      v-for="item in topicTypeList"
                      :key="item.key"
                      :label="item.name"
                      :value="item.key"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="标题" prop="title">
                  <el-input v-model="topicForm.title" />
                </el-form-item>
                <el-form-item label="内容" prop="content">
                  <editor
                    api-key="mh2f2ffdlr2zzaky3yk52tx8rtxrxnbt1a6p7p7jx96hy70r"
                    :init="init"
                    v-model="topicForm.content"
                  ></editor>
                </el-form-item>
                <el-form-item class="is-last">
                  <el-button type="primary" :loading="IsSubmitLoading" @click="onSubmit(form)">提交</el-button>
                </el-form-item>
              </el-form>
            </template>
          </el-skeleton>
        </span>
      </el-card>
      <template #right>
        <user-info-comp :isTopicsRepliesList="false" />
        <client-qr-code-comp />
      </template>
    </page-wrapper>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue';
import { ElButton, ElCard, ElForm, ElFormItem, ElMessage, ElPageHeader, ElSelect, ElSkeleton } from 'element-plus';
import PageWrapper from '@/components/page-wrapper/index.vue';
import UserInfoComp from '@/components/user-info/index.vue';
import ClientQrCodeComp from '@/components/client-qr-code/index.vue';
import Editor from '@tinymce/tinymce-vue';
import { topicTypeList } from '@/constant';
import { useRoute } from 'vue-router';
import useHttpRequest from '@/utils/request';
import { useStore } from 'vuex';
import { changeLtGt, routerPush } from '@/utils';

export default defineComponent({
  components: {
    ElCard,
    ElPageHeader,
    ElSkeleton,
    ElForm,
    ElFormItem,
    ElSelect,
    ElButton,
    Editor,
    PageWrapper,
    UserInfoComp,
    ClientQrCodeComp
  },
  setup() {
    const { state } = useStore();
    // 用户登录态
    const token = computed(() => {
      return state.user.token;
    });
    const route = useRoute();
    // 表单值对象
    const topicForm = reactive({
      id: undefined,
      title: '',
      tab: '',
      content: '',
    });
    
    // 返回
    const goBack = () => {
      if (route.name === 'addTopic') {
        routerPush({
        name: 'index',
        params: {
          listParm: String(route.query.listParm),
        }
      });
      } else if (route.query.userName) {
        routerPush({
          path: `/detail`,
          query: {
            id: route.params.id,
            userName: route.query.userName,
          }
        });
      } else {
        routerPush({
          path: `/detail`,
          query: {
            id: route.params.id,
            listParm: route.query.listParm,
          }
        });
      }
    };
    
    const { isLoading, adornUrl, httpRequest } = useHttpRequest();
    const getData = () => {
      httpRequest ({
        url: adornUrl(`/api/v1/topic/${route.params.id}`),
        method: 'get',
        params: {
          mdrender: true,
          accesstoken: state.user.token || ''
        }
      }).then(({data}) => {
        data.data.content = changeLtGt(data.data.content);
        Object.assign(topicForm, data.data);
      }).catch(e => {
        ElMessage.error('请求失败');
        console.error(e);
      })
    };
    if (route.params.id) getData();

    // 表单ref
    const form = ref<InstanceType<typeof ElForm>>();
    // 表单校验规则
    const rules = reactive({
      title: [
        { required: true, message: '请输入标题', trigger: 'blur' },
      ],
      tab: [
        { required: true, message: '请选择版块', trigger: 'change' },
      ],
      content: [
        { required: true, message: '请输入内容', trigger: 'blur' },
      ],
    });
    // 富文本初始配置项
    const init = {
      height: 500, //富文本高度
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

    // 表单提交事件
    const onSubmit = async (formEl: InstanceType<typeof ElForm> | undefined) => {
      if (!formEl) return;
      await formEl.validate((valid, fields) => {
        if (valid) {
          setEditData();
        } else {
          console.log('error submit!', fields);
        }
      });
    };
    
    // 添加或修改请求
    const { isLoading: IsSubmitLoading, httpRequest: submitHttpRequest } = useHttpRequest();
    const setEditData = () => {
      submitHttpRequest({
        url: adornUrl(`/api/v1/topics${route.name === 'addTopic' ? '' : '/update'}`),
        method: 'post',
        data: {
          topic_id: topicForm.id,
          title: topicForm.title,
          content: topicForm.content,
          tab: 'dev',
          accesstoken: token.value,
        }
      }).then(({ data }) => {
        if (data?.success) {
          ElMessage.success(route.name === 'addTopic' ? '发布成功' : '修改成功');
          goBack();
        }
      }).catch(e => {
        ElMessage.error(route.name === 'addTopic' ? '发布失败' : '修改失败');
        console.error(e);
      });
    };

    return {
      goBack,
      route,
      isLoading,
      form,
      topicForm,
      rules,
      init,
      topicTypeList: topicTypeList.filter(item => !['all', 'good'].includes(item.key)),
      onSubmit,
      IsSubmitLoading,
    };
  },
})
</script>

<style lang="scss" src="./index.scss"></style>