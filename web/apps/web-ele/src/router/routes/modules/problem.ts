import type { RouteRecordRaw } from 'vue-router'

const problem: RouteRecordRaw = {
  path: '/problem',
  name: 'Problem',
  component: () => import('#/layouts/basic.vue'),
  meta: { title: '问题管理' },
  children: [
    { path: '', name: 'ProblemList', component: () => import('#/views/problem/index.vue'), meta: { title: '问题列表' } }
  ]
}

export default [problem]   // ❌ 改为数组
