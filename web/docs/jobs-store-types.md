# Jobs Store TypeScript 类型定义

## 概述

将 `jobs.js` 重构为 `jobs.ts`，添加完整的 TypeScript 类型定义。

## 创建的文件

### 1. `src/store/jobs.ts`
完整的 TypeScript 版本的岗位 Store，包含：

- **类型导入**
```typescript
import type { Position, PositionStatus, PositionQueryParams } from '@/types'
```

- **状态定义**
```typescript
const jobs = ref<Position[]>([])
const loading = ref<boolean>(false)
const currentFilter = ref<number | string | 'all'>('all')
const searchKeyword = ref<string>('')
```

- **方法类型注解**
```typescript
async function fetchJobs(params?: Partial<PositionQueryParams>): Promise<void>
async function filterByStatus(status: number | string | 'all'): Promise<void>
async function searchJobs(keyword: string): Promise<void>
async function setFilter(filter: number | string | 'all'): Promise<void>
async function resetFilter(): Promise<void>
async function addJob(job: Partial<Position>): Promise<void>
async function updateJob(id: number | string, updates: Partial<Position>): Promise<void>
async function deleteJob(id: number | string): Promise<void>

function getJobById(id: number | string): Position | undefined
```

### 2. `src/store/types.ts`
Store 相关的类型定义：

- **JobsState** - Store 状态接口
- **JobStatistics** - 岗位统计接口
- **JobFilterOption** - 筛选器选项接口
- **JobFormData** - 岗位表单数据接口（支持新旧字段名兼容）

## 类型特性

### 1. 完整的类型推断
```typescript
// 所有方法都有完整的参数和返回值类型
async function fetchJobs(params?: Partial<PositionQueryParams>): Promise<void>

// 计算属性有明确的返回类型
const filteredJobs = computed<Position[]>(() => {
  return jobs.value
})

const jobStats = computed(() => {
  return {
    total: jobs.value.length,
    pending: jobs.value.filter(j => j.status === PositionStatus.TO_BE_DELIVERED).length,
    // ...
  }
})
```

### 2. 联合类型支持
```typescript
// 支持 number | string | 'all' 的筛选值
async function filterByStatus(status: number | string | 'all'): Promise<void>

// 支持旧字段名兼容
async function addJob(job: Partial<Position>): Promise<void>
  // 自动处理 company/companyName 等字段映射
}
```

### 3. 严格类型检查
```typescript
// ID 参数支持 number 或 string
function getJobById(id: number | string): Position | undefined

// 确保使用枚举值
params.status = statusValue as PositionStatus
```

## 使用示例

```typescript
import { useJobsStore } from '@/store/jobs'
import type { JobFormData, JobStatistics } from '@/store/types'

const jobsStore = useJobsStore()

// 类型安全的调用
await jobsStore.fetchJobs({ status: PositionStatus.DELIVERED })

// 类型安全的表单数据
const formData: JobFormData = {
  companyName: '字节跳动',
  positionName: '前端工程师',
  status: PositionStatus.TO_BE_DELIVERED
}
await jobsStore.addJob(formData)

// 类型安全的统计
const stats: JobStatistics = jobsStore.jobStats
```

## 优势

1. **类型安全** - 编译时检查类型错误
2. **IDE 支持** - 自动补全和类型提示
3. **重构友好** - 修改类型时能发现所有受影响的地方
4. **文档化** - 类型即文档，代码即说明
5. **后端对齐** - 类型定义与后端 API 保持一致
