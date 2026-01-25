# 面经管理类型定义使用指南

## 类型定义位置

```typescript
// 导入类型
import type {
  Experience,
  ExperienceCreateRequest,
  ExperienceUpdateRequest,
  ExperienceQueryParams,
  ExperienceStats,
  ExperienceComment
} from '@/types'

// 导入枚举
import { ExperienceRound, ExperienceContentType } from '@/types'
```

## 核心类型说明

### 1. Experience - 面经实体

```typescript
const experience: Experience = {
  id: 1,
  positionId: 'pos_123',           // 可选，关联岗位
  userId: 100,
  companyName: '字节跳动',
  positionName: '前端开发工程师',
  interviewRound: '一面',
  interviewDate: '2025-01-20',
  content: '# 面试概述\n主要考察Vue3...',
  contentType: 'markdown',
  tags: ['Vue3', '性能优化', '源码'],
  isFavorite: 1,                   // 0/1
  isAnonymous: 1,                  // 0/1
  views: 128,
  comments: 8,
  createTime: '2025-01-20T10:00:00Z',
  updateTime: '2025-01-20T10:00:00Z'
}
```

### 2. ExperienceCreateRequest - 创建面经

```typescript
const createData: ExperienceCreateRequest = {
  companyName: '字节跳动',
  positionName: '前端开发工程师',
  interviewRound: '一面',
  interviewDate: '2025-01-20',
  content: '# 面试概述\n...',
  contentType: 'markdown',
  tags: ['Vue3', '性能优化'],
  isAnonymous: 1,
  // positionId 可选
}
```

### 3. ExperienceUpdateRequest - 更新面经

```typescript
const updateData: ExperienceUpdateRequest = {
  id: 1,
  content: '# 更新后的内容\n...',
  tags: ['Vue3', '性能优化', '源码'],
  // 其他字段可选
}
```

### 4. ExperienceQueryParams - 查询参数

```typescript
const queryParams: ExperienceQueryParams = {
  current: 1,
  size: 10,
  positionId: 'pos_123',          // 可选：筛选特定岗位的面经
  keyword: 'Vue3',                 // 可选：关键词搜索
  isFavorite: 1,                   // 可选：只看收藏
  tags: ['Vue3', '性能优化'],     // 可选：标签筛选
  sortField: 'createTime',        // 可选：排序字段
  sortOrder: 'desc'               // 可选：排序方向
}
```

### 5. ExperienceStats - 统计信息

```typescript
const stats: ExperienceStats = {
  total: 100,
  favorites: 30,
  totalViews: 5000,
  totalComments: 200,
  byRound: {
    '笔试': 20,
    '一面': 40,
    '二面': 25,
    '终面': 15
  },
  byCompany: {
    '字节跳动': 30,
    '腾讯': 25,
    '阿里巴巴': 20
  },
  byTags: {
    'Vue3': 50,
    'React': 40,
    '性能优化': 35
  }
}
```

### 6. ExperienceComment - 评论实体

```typescript
const comment: ExperienceComment = {
  id: 1,
  experienceId: 100,
  userId: 1001,
  userNickname: '求职小王',
  userAvatar: 'https://...',
  parentId: 0,                     // 0表示一级评论
  replyToUserId: 1002,             // 可选：回复的用户ID
  replyToNickname: '前端工程师',   // 可选：回复的用户昵称
  content: '非常详细的面经，感谢分享！',
  likes: 10,
  isLiked: false,
  createTime: '2025-01-21T10:00:00Z',
  updateTime: '2025-01-21T10:00:00Z'
}
```

## 在组件中使用示例

### 在 Vue 组件中

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Experience, ExperienceQueryParams } from '@/types'

// 定义响应式数据
const experiences = ref<Experience[]>([])
const loading = ref(false)

// 查询参数
const queryParams: ExperienceQueryParams = {
  current: 1,
  size: 10
}

// 加载面经列表
async function loadExperiences() {
  loading.value = true
  try {
    const response = await experienceApi.getExperiencesPage(queryParams)
    experiences.value = response.data || []
  } catch (error) {
    console.error('加载面经失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadExperiences()
})

// 创建面经
async function createExperience() {
  const createData: ExperienceCreateRequest = {
    companyName: '字节跳动',
    positionName: '前端开发工程师',
    interviewRound: '一面',
    interviewDate: '2025-01-20',
    content: '# 面试概述\n...',
    contentType: 'markdown',
    tags: ['Vue3'],
    isAnonymous: 1
  }

  await experienceApi.createExperience(createData)
}
</script>
```

### 在 Pinia Store 中

```typescript
// stores/experience.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Experience, ExperienceCreateRequest } from '@/types'

export const useExperienceStore = defineStore('experience', () => {
  const experiences = ref<Experience[]>([])
  const currentExperience = ref<Experience | null>(null)

  // 计算属性
  const favoriteExperiences = computed(() =>
    experiences.value.filter(exp => exp.isFavorite === 1)
  )

  // 方法
  async function fetchExperiences() {
    // API 调用
  }

  async function createExperience(data: ExperienceCreateRequest) {
    // API 调用
  }

  function toggleFavorite(id: number) {
    const exp = experiences.value.find(e => e.id === id)
    if (exp) {
      exp.isFavorite = exp.isFavorite === 1 ? 0 : 1
    }
  }

  return {
    experiences,
    currentExperience,
    favoriteExperiences,
    fetchExperiences,
    createExperience,
    toggleFavorite
  }
})
```

## 枚举使用示例

```typescript
import { ExperienceRound, ExperienceContentType } from '@/types'

// 使用枚举
const round = ExperienceRound.FIRST_ROUND  // '一面'
const contentType = ExperienceContentType.MARKDOWN  // 'markdown'

// 枚举转数组用于下拉选择
const roundOptions = Object.values(ExperienceRound)
// ['笔试', '一面', '二面', '三面', '终面', 'HR面']

// 类型判断
function getRoundText(round: string): string {
  const rounds = Object.values(ExperienceRound)
  return rounds.includes(round as ExperienceRound) ? round : '未知'
}
```

## API 响应类型

```typescript
import type {
  ExperienceResponse,
  ExperienceListResponse
} from '@/types'

// 单个面经响应
const response: ExperienceResponse = {
  code: 200,
  message: 'success',
  data: {
    id: 1,
    companyName: '字节跳动',
    // ... 其他字段
  }
}

// 面经列表响应
const listResponse: ExperienceListResponse = {
  code: 200,
  message: 'success',
  data: [
    { id: 1, /* ... */ },
    { id: 2, /* ... */ }
  ]
}
```

## 类型安全的好处

使用这些类型定义可以获得：

1. **类型检查**：编译时发现类型错误
2. **智能提示**：IDE 自动补全字段
3. **重构安全**：修改类型时自动发现所有使用位置
4. **文档作用**：类型即文档，明确数据结构
5. **团队协作**：统一的数据契约

## 注意事项

1. **所有日期使用 ISO 8801 格式**：`'2025-01-20'` 或 `'2025-01-20T10:00:00Z'`
2. **isFavorite 和 isAnonymous 使用 0/1**：而不是 boolean
3. **标签使用数组**：`['Vue3', '性能优化']`
4. **可选字段使用 ?**：如 `positionId?`、`replyToUserId?`
5. **内容格式默认 markdown**：如果不确定可以不传 `contentType`
