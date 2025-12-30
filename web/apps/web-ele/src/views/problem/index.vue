<template>
  <div class="p-4">
    <el-card>
      <div class="text-lg font-bold mb-2">Problem 模块</div>

      <el-button type="primary" @click="load">加载数据</el-button>

      <div class="mt-4 text-green-600">
        {{ data }}
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getProblemListApi } from '#/api/problem'

const data = ref('')

const load = async () => {
  const res = await getProblemListApi()
  data.value = res?.[0]?.title ?? ''
}
</script>
