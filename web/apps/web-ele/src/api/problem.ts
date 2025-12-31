import { requestClient } from '#/api/request';

/**
 * --- 基础模型定义 (Model Interfaces) ---
 */

export interface Tag {
  id: number;
  name: string;
}

export interface Example {
  id?: number;
  input_data: string;
  output_data: string;
}

export interface TestCase {
  id: number;
  data_type: string;
  weight: number;
  expected_output: string;
  input_file?: string; // 文件 URL 地址
  created_at: string;
}

export interface Solution {
  id: number;
  language: string;
  code: string;
  description?: string;
  user_name: string; // 由 resolve_user_name 处理得到
  created_at: string;
}

/**
 * --- 题目模型 (Problem Interfaces) ---
 */

// 题目列表项 (对应 ProblemListOut)
export interface ProblemListItem {
  id: number;
  title: string;
  difficulty: number;
  is_public: boolean;
  tags: Tag[];
  created_at: string;
}

// 题目详情 (对应 ProblemDetailOut)
export interface ProblemDetail extends ProblemListItem {
  description: string;
  input_description?: string;
  output_description?: string;
  analysis?: string;
  examples: Example[];
}

/**
 * --- API 输入模型 (Input/Payload Interfaces) ---
 */

export interface ProblemCreateInput {
  title: string;
  description: string;
  input_description?: string;
  output_description?: string;
  analysis?: string;
  difficulty: number;
  is_public: boolean;
  tag_ids: number[];
  examples: Example[]; // 支持嵌套创建样例
}

export interface SolutionInput {
  language: string;
  code: string;
  description?: string;
}

/**
 * --- API 请求函数 (API Methods) ---
 */

/** 获取题目列表 (包含公开题和自己创建的题) */
export function getProblemListApi() {
  return requestClient.get<ProblemListItem[]>('/api/problem/');
}

/** 获取题目详情 */
export function getProblemDetailApi(id: number) {
  return requestClient.get<ProblemDetail>(`/api/problem/${id}`);
}

/** 创建新题目 */
export function createProblemApi(data: ProblemCreateInput) {
  return requestClient.post<ProblemDetail>('/api/problem/', data);
}

/** 获取所有标签 (用于下拉选择) */
export function getTagsApi() {
  return requestClient.get<Tag[]>('/api/problem/tags/all');
}

/**
 * 上传测试用例
 * 注意：涉及文件上传，建议在组件内构建 FormData 传入
 */
export function uploadTestCaseApi(problemId: number, formData: FormData) {
  return requestClient.post<TestCase>(
    `/api/problem/${problemId}/testcases`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
  );
}

/** 为指定题目发布题解 */
export function createSolutionApi(problemId: number, data: SolutionInput) {
  return requestClient.post<Solution>(`/api/problem/${problemId}/solutions`, data);
}
