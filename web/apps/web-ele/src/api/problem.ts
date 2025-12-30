import { requestClient } from '#/api/request';

export interface Problem {
  id: number
  title: string
}

export function getProblemListApi() {
  return requestClient.get<Problem[]>('/problem')
}
