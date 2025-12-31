<template>
  <div class="p-4 bg-gray-50 min-h-screen">
    <el-card shadow="never" class="rounded-xl border-none">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-xl font-bold">题目管理库</span>
          <el-button type="primary" @click="fetchList">刷新列表</el-button>
        </div>
      </template>

      <!-- 题目表格 -->
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="题目名称" min-width="200">
          <template #default="{ row }">
            <span class="font-bold">{{ row.title }}</span>
            <el-tag v-if="!row.is_public" type="info" size="small" class="ml-2">私有</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="难度" width="150">
          <template #default="{ row }">
            <el-rate v-model="row.difficulty" disabled />
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180">
          <template #default="{ row }">
            {{ new Date(row.created_at).toLocaleDateString() }}
          </template>
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column label="快捷管理" width="250" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" plain @click="openDrawer(row, 'testcase')">
              测试点
            </el-button>
            <el-button type="success" size="small" plain @click="openDrawer(row, 'solution')">
              写题解
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 右侧遮罩抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      :title="drawerTitle"
      size="45%"
      destroy-on-close
    >
      <div v-if="activeProblem" class="px-4">
        <!-- 切换：增加测试点 -->
        <div v-if="drawerType === 'testcase'">
          <el-alert title="请上传输入文件(.in/.txt)并填写期望输出" type="info" show-icon :closable="false" class="mb-4" />

          <el-form label-position="top">
            <el-form-item label="测试点权重 (Weight)">
              <el-input-number v-model="testCaseForm.weight" :min="1" :max="100" />
            </el-form-item>
            <el-form-item label="数据类型">
              <el-select v-model="testCaseForm.data_type" class="w-full">
                <el-option label="字符串 (String)" value="string" />
                <el-option label="整数 (Integer)" value="int" />
              </el-select>
            </el-form-item>
            <el-form-item label="输入文件 (Input File)">
              <el-upload
                drag
                action="#"
                :auto-upload="false"
                :limit="1"
                :on-change="handleFileChange"
              >
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              </el-upload>
            </el-form-item>
            <el-form-item label="期望输出 (Expected Output)">
              <el-input v-model="testCaseForm.expected_output" type="textarea" :rows="4" />
            </el-form-item>
            <el-button type="primary" class="w-full" @click="submitTestCase">保存测试点</el-button>
          </el-form>
        </div>

        <!-- 切换：增加题解 -->
        <div v-if="drawerType === 'solution'">
          <el-form label-position="top">
            <el-form-item label="编程语言">
              <el-select v-model="solutionForm.language" class="w-full">
                <el-option label="Python 3" value="Python" />
                <el-option label="C++" value="C++" />
                <el-option label="Java" value="Java" />
              </el-select>
            </el-form-item>
            <el-form-item label="核心代码">
              <el-input
                v-model="solutionForm.code"
                type="textarea"
                :rows="10"
                placeholder="请粘贴标准解法代码..."
                class="font-mono"
              />
            </el-form-item>
            <el-form-item label="解题思路说明">
              <el-input v-model="solutionForm.description" type="textarea" :rows="4" />
            </el-form-item>
            <el-button type="success" class="w-full" @click="submitSolution">发布题解</el-button>
          </el-form>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import {
  ElMessage, ElMessageBox, ElDrawer, ElTable, ElTableColumn,
  ElCard, ElRate, ElButton, ElTag, ElForm, ElFormItem,
  ElInput, ElInputNumber, ElSelect, ElOption, ElUpload, ElIcon
} from 'element-plus';
import { UploadFilled } from '@element-plus/icons-vue';
import { getProblemListApi, uploadTestCaseApi, createSolutionApi } from '#/api/problem';

const loading = ref(false);
const tableData = ref([]);
const drawerVisible = ref(false);
const drawerType = ref<'testcase' | 'solution'>('testcase');
const drawerTitle = ref('');
const activeProblem = ref<any>(null);

// 测试点表单数据
const testCaseForm = reactive({
  weight: 1,
  data_type: 'string',
  expected_output: '',
  file: null as File | null
});

// 题解表单数据
const solutionForm = reactive({
  language: 'Python',
  code: '',
  description: ''
});

// 获取题目列表
const fetchList = async () => {
  loading.value = true;
  try {
    tableData.value = await getProblemListApi();
  } finally {
    loading.value = false;
  }
};

onMounted(fetchList);

// 打开侧边栏
const openDrawer = (problem: any, type: 'testcase' | 'solution') => {
  activeProblem.value = problem;
  drawerType.value = type;
  drawerTitle.value = type === 'testcase'
    ? `管理测试点: ${problem.title}`
    : `撰写题解: ${problem.title}`;

  // 重置表单
  testCaseForm.expected_output = '';
  testCaseForm.file = null;
  solutionForm.code = '';

  drawerVisible.value = true;
};

// 处理文件上传变化
const handleFileChange = (file: any) => {
  testCaseForm.file = file.raw;
};

// 提交测试点 (FormData 格式)
const submitTestCase = async () => {
  if (!testCaseForm.file) return ElMessage.warning('请先选择输入文件');

  const fd = new FormData();
  fd.append('input_file', testCaseForm.file);
  fd.append('expected_output', testCaseForm.expected_output);
  fd.append('weight', testCaseForm.weight.toString());
  fd.append('data_type', testCaseForm.data_type);

  try {
    await uploadTestCaseApi(activeProblem.value.id, fd);
    ElMessage.success('测试点上传成功');
    drawerVisible.value = false;
  } catch (e: any) {
    ElMessage.error('上传失败: ' + e.message);
  }
};

// 提交题解
const submitSolution = async () => {
  if (!solutionForm.code) return ElMessage.warning('代码不能为空');

  try {
    await createSolutionApi(activeProblem.value.id, solutionForm);
    ElMessage.success('题解已发布');
    drawerVisible.value = false;
  } catch (e: any) {
    ElMessage.error('发布失败');
  }
};
</script>

<style scoped>
.font-mono :deep(textarea) {
  font-family: 'Fira Code', 'Courier New', monospace;
  background-color: #f8f9fa;
}

:deep(.el-drawer__header) {
  margin-bottom: 0;
  padding: 20px;
  font-weight: bold;
  border-bottom: 1px solid #eee;
}

.example-box {
  border-left: 4px solid #409eff;
}
</style>
