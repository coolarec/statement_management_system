<template>
  <div class="p-4 bg-gray-50 min-h-screen">
    <div class="max-w-6xl mx-auto">
      <!-- 页面头部 -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">创建新题目</h1>
          <p class="text-gray-500">发布题目到题库，包含描述、样例及权限设置</p>
        </div>
        <el-button type="primary" size="large" :loading="loading" @click="handleSubmit">
          <el-icon class="mr-1">
            <Upload />
          </el-icon> 发布题目
        </el-button>
      </div>

      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-row :gutter="24">
          <!-- 左侧：主要信息 -->
          <el-col :span="16">
            <el-card shadow="never" class="mb-6 rounded-xl border-none">
              <template #header><span class="font-bold text-lg">题目详情</span></template>

              <el-form-item label="题目标题" prop="title">
                <el-input v-model="form.title" placeholder="请输入直观的题目名称" size="large" />
              </el-form-item>

              <el-form-item label="题目描述 (Markdown)" prop="description">
                <!-- <el-input v-model="form.description" type="textarea" :rows="10" placeholder="详述背景、任务及限制..." /> -->
                <MdEditor v-model="form.description" />
              </el-form-item>

              <!-- <el-row :gutter="20">
                <el-col :span="12"> -->
              <el-form-item label="输入描述">
                <el-input v-model="form.input_description" type="textarea" :rows="3" placeholder="如：第一行输入一个整数N..." />
              </el-form-item>
              <!-- </el-col> -->
              <!-- <el-col :span="12"> -->
              <el-form-item label="输出描述">
                <el-input v-model="form.output_description" type="textarea" :rows="3" placeholder="如：输出N行结果..." />
              </el-form-item>
              <!-- </el-col>
              </el-row> -->
            </el-card>

            <!-- 样例管理区 -->
            <el-card shadow="never" class="rounded-xl border-none">
              <template #header>
                <div class="flex justify-between items-center">
                  <span class="font-bold text-lg">测试样例 (Examples)</span>
                  <el-button type="primary" link @click="addExample">
                    <el-icon class="mr-1">
                      <Plus />
                    </el-icon> 添加样例对
                  </el-button>
                </div>
              </template>

              <div v-for="(ex, index) in form.examples" :key="index" class="example-item">
                <div class="flex justify-between mb-2">
                  <span class="text-gray-400 text-xs uppercase font-bold">Example #{{ index + 1 }}</span>
                  <el-button v-if="form.examples.length > 1" type="danger" link
                    @click="removeExample(index)">删除</el-button>
                </div>
                <el-row :gutter="15">
                  <el-col :span="12">
                    <el-form-item label="样例输入">
                      <el-input v-model="ex.input_data" type="textarea" :rows="3" class="font-mono" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="样例输出">
                      <el-input v-model="ex.output_data" type="textarea" :rows="3" class="font-mono" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </el-col>

          <!-- 右侧：属性配置 -->
          <el-col :span="8">
            <el-card shadow="never" class="mb-6 rounded-xl border-none sticky top-4">
              <template #header><span class="font-bold">基础设置</span></template>

              <el-form-item label="难度评级">
                <el-rate v-model="form.difficulty" :max="5" show-score score-template="{value} 星" />
              </el-form-item>

              <el-form-item label="题目标签">
                <el-select v-model="form.tag_ids" multiple filterable placeholder="关联知识点" class="w-full">
                  <el-option v-for="tag in tagOptions" :key="tag.id" :label="tag.name" :value="tag.id" />
                </el-select>
              </el-form-item>

              <el-divider />

              <!-- 公共题库开关 -->
              <el-form-item label="发布选项">
                <div class="flex items-center justify-between w-full p-4 rounded-lg border border-blue-100 bg-blue-50">
                  <div>
                    <div class="text-blue-900 font-bold">公开题目</div>
                    <div class="text-blue-700 text-xs">开启后将出现在公共题库</div>
                  </div>
                  <el-switch v-model="form.is_public" />
                </div>
              </el-form-item>

              <el-form-item label="题目解析 (Analysis)">
                <el-input v-model="form.analysis" type="textarea" :rows="6" placeholder="输入解题思路（可留空）" />
              </el-form-item>

              <div class="mt-6">
                <el-button class="w-full" type="primary" size="large" @click="handleSubmit">确认提交</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import {
  ElCard, ElForm, ElFormItem, ElInput, ElRow, ElCol, ElRate, ElSelect,
  ElOption, ElButton, ElSwitch, ElIcon, ElDivider, ElMessage
} from 'element-plus';
import { Upload, Plus } from '@element-plus/icons-vue';
import type { FormInstance } from 'element-plus';
import { createProblemApi, getTagsApi, type Tag } from '#/api/problem';

import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { useRouter } from 'vue-router';

const router = useRouter();
const formRef = ref<FormInstance>();
const loading = ref(false);
const tagOptions = ref<Tag[]>([]);

const form = reactive({
  title: '',
  description: '',
  input_description: '',
  output_description: '',
  analysis: '',
  difficulty: 3,
  is_public: true,
  tag_ids: [] as number[],
  examples: [{ input_data: '', output_data: '' }]
});

const rules = {
  title: [{ required: true, message: '请输入题目标题', trigger: 'blur' }],
  description: [{ required: true, message: '请输入题目描述', trigger: 'blur' }]
};

onMounted(async () => {
  try {
    tagOptions.value = await getTagsApi();
  } catch (e) {
    console.error('加载标签失败');
  }
});

const addExample = () => form.examples.push({ input_data: '', output_data: '' });
const removeExample = (idx: number) => form.examples.splice(idx, 1);

const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        await createProblemApi(form);
        ElMessage.success('发布成功！');
        router.push('/problem/ProblemView');
        // 可选：跳转回列表页
      } catch (err: any) {
        ElMessage.error(err.message || '发布失败');
      } finally {
        loading.value = false;
      }
    }
  });
};
</script>

<style scoped>
.example-item {
  background-color: #fafafa;
  border: 1px dashed #dcdfe6;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 20px;
}

:deep(.el-card__header) {
  border-bottom: 1px solid #f2f2f2;
}

.font-mono :deep(textarea) {
  font-family: 'Courier New', Courier, monospace;
}
</style>
