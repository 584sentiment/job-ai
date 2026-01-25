# 面经管理 API 使用指南

## 导入方式

```typescript
// 导入所有API函数
import * as experienceApi from '@/api/experience'

// 或按需导入
import {
  createExperience,
  getExperiencesPage,
  toggleExperienceFavorite,
  getExperienceComments
} from '@/api/experience'
```

## 在 Vue 组件中使用

### 1. 获取面经列表（分页）

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getExperiencesPage } from '@/api/experience'
import type { Experience, ExperienceQueryParams } from '@/types'

const experiences = ref<Experience[]>([])
const loading = ref(false)
const pagination = ref({
  current: 1,
  size: 10,
  total: 0
})

// 加载面经列表
async function loadExperiences() {
  loading.value = true

  const params: ExperienceQueryParams = {
    current: pagination.value.current,
    size: pagination.value.size
  }

  try {
    const response = await getExperiencesPage(params)

    if (response.code === 200 && response.data) {
      experiences.value = response.data
      // 注意：实际分页信息可能需要从响应的其他字段获取
    }
  } catch (error) {
    console.error('加载面经失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadExperiences()
})
</script>
```

### 2. 创建面经

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { createExperience } from '@/api/experience'
import type { ExperienceCreateRequest } from '@/types'

const form = ref<ExperienceCreateRequest>({
  companyName: '',
  positionName: '',
  interviewRound: '',
  interviewDate: '',
  content: '',
  contentType: 'markdown',
  tags: [],
  isAnonymous: 1
})

async function handleSubmit() {
  try {
    const response = await createExperience(form.value)

    if (response.code === 200) {
      alert('面经创建成功！')
      // 跳转到详情页或列表页
    }
  } catch (error) {
    console.error('创建失败:', error)
    alert('创建失败，请重试')
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <!-- 表单内容 -->
    <button type="submit">保存面经</button>
  </form>
</template>
```

### 3. 切换收藏状态

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { toggleExperienceFavorite } from '@/api/experience'

const props = defineProps<{
  experience: Experience
}>()

const isFavorite = ref(props.experience.isFavorite === 1)

async function handleToggleFavorite() {
  try {
    const response = await toggleExperienceFavorite(props.experience.id)

    if (response.code === 200) {
      isFavorite.value = response.data.isFavorite
      // 显示提示
      alert(response.data.isFavorite ? '已收藏' : '已取消收藏')
    }
  } catch (error) {
    console.error('操作失败:', error)
  }
}
</script>

<template>
  <button @click="handleToggleFavorite">
    <i :class="isFavorite ? 'fas fa-star text-yellow-500' : 'far fa-star'"></i>
  </button>
</template>
```

### 4. 获取详情并增加浏览量

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getExperienceById, incrementExperienceViews } from '@/api/experience'
import type { Experience } from '@/types'

const route = useRoute()
const experience = ref<Experience | null>(null)

async function loadDetail() {
  const id = Number(route.query.id || route.params.id)

  try {
    // 并行执行：获取详情 + 增加浏览量
    const [detailRes, viewRes] = await Promise.all([
      getExperienceById(id),
      incrementExperienceViews(id)
    ])

    if (detailRes.code === 200 && detailRes.data) {
      experience.value = detailRes.data
    }
  } catch (error) {
    console.error('加载详情失败:', error)
  }
}

onMounted(() => {
  loadDetail()
})
</script>
```

### 5. 评论功能

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  getExperienceComments,
  createExperienceComment,
  likeExperienceComment
} from '@/api/experience'
import type { ExperienceComment } from '@/types'

const props = defineProps<{
  experienceId: number
}>()

const comments = ref<ExperienceComment[]>([])
const newComment = ref('')

// 加载评论
async function loadComments() {
  const response = await getExperienceComments(props.experienceId, 1, 20)
  if (response.code === 200 && response.data) {
    comments.value = response.data
  }
}

// 发表评论
async function submitComment() {
  if (!newComment.value.trim()) return

  const response = await createExperienceComment({
    experienceId: props.experienceId,
    content: newComment.value
  })

  if (response.code === 200 && response.data) {
    comments.value.unshift(response.data)
    newComment.value = ''
  }
}

// 点赞评论
async function handleLike(comment: ExperienceComment) {
  const response = await likeExperienceComment(comment.id)
  if (response.code === 200) {
    comment.likes = response.data.likes
    comment.isLiked = !comment.isLiked
  }
}
</script>

<template>
  <div>
    <!-- 评论列表 -->
    <div v-for="comment in comments" :key="comment.id">
      <p>{{ comment.content }}</p>
      <button @click="handleLike(comment)">
        👍 {{ comment.likes }}
      </button>
    </div>

    <!-- 发表评论 -->
    <textarea v-model="newComment" />
    <button @click="submitComment">发表</button>
  </div>
</template>
```

## 在 Pinia Store 中使用

```typescript
// stores/experience.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as experienceApi from '@/api/experience'
import type { Experience, ExperienceCreateRequest, ExperienceQueryParams } from '@/types'

export const useExperienceStore = defineStore('experience', () => {
  const experiences = ref<Experience[]>([])
  const currentExperience = ref<Experience | null>(null)
  const loading = ref(false)
  const pagination = ref({
    current: 1,
    size: 10,
    total: 0
  })

  // 计算属性
  const favoriteExperiences = computed(() =>
    experiences.value.filter(exp => exp.isFavorite === 1)
  )

  // 方法
  async function fetchExperiences(params?: Partial<ExperienceQueryParams>) {
    loading.value = true
    try {
      const queryParams: ExperienceQueryParams = {
        current: pagination.value.current,
        size: pagination.value.size,
        ...params
      }

      const response = await experienceApi.getExperiencesPage(queryParams)

      if (response.code === 200 && response.data) {
        experiences.value = response.data
      }
    } catch (error) {
      console.error('加载面经失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchExperienceById(id: number) {
    loading.value = true
    try {
      const response = await experienceApi.getExperienceById(id)

      if (response.code === 200 && response.data) {
        currentExperience.value = response.data
        // 同时增加浏览量
        await experienceApi.incrementExperienceViews(id)
      }

      return currentExperience.value
    } catch (error) {
      console.error('加载详情失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function createExperience(data: ExperienceCreateRequest) {
    try {
      const response = await experienceApi.createExperience(data)

      if (response.code === 200 && response.data) {
        experiences.value.unshift(response.data)
        return response.data
      }
    } catch (error) {
      console.error('创建失败:', error)
      throw error
    }
  }

  async function deleteExperience(id: number) {
    try {
      const response = await experienceApi.deleteExperience(id)

      if (response.code === 200) {
        const index = experiences.value.findIndex(e => e.id === id)
        if (index !== -1) {
          experiences.value.splice(index, 1)
        }
      }
    } catch (error) {
      console.error('删除失败:', error)
      throw error
    }
  }

  async function toggleFavorite(id: number) {
    try {
      const response = await experienceApi.toggleExperienceFavorite(id)

      if (response.code === 200) {
        const exp = experiences.value.find(e => e.id === id)
        if (exp) {
          exp.isFavorite = response.data.isFavorite ? 1 : 0
        }
        return response.data
      }
    } catch (error) {
      console.error('操作失败:', error)
      throw error
    }
  }

  return {
    experiences,
    currentExperience,
    loading,
    pagination,
    favoriteExperiences,
    fetchExperiences,
    fetchExperienceById,
    createExperience,
    deleteExperience,
    toggleFavorite
  }
})
```

## 错误处理

### 统一错误处理

```typescript
// utils/errorHandler.ts
import type { ApiResponse } from '@/types'

export function handleApiError<T>(
  response: ApiResponse<T>,
  defaultMessage: string = '操作失败'
): never {
  const message = response.message || defaultMessage
  alert(message)
  throw new Error(message)
}

// 使用
import { handleApiError } from '@/utils/errorHandler'

async function loadExperiences() {
  const response = await getExperiencesPage(params)

  if (response.code !== 200) {
    handleApiError(response, '加载面经失败')
  }

  // 正常处理
}
```

### 使用 Toast 替代 alert

```typescript
// 使用 Element Plus 或其他 UI 库
import { ElMessage } from 'element-plus'

async function createExperience(data: ExperienceCreateRequest) {
  try {
    const response = await experienceApi.createExperience(data)

    if (response.code === 200) {
      ElMessage.success('面经创建成功！')
    } else {
      ElMessage.error(response.message || '创建失败')
    }
  } catch (error) {
    ElMessage.error('网络错误，请重试')
  }
}
```

## API 端点说明

| 函数名 | HTTP方法 | 端点 | 说明 |
|--------|----------|------|------|
| createExperience | POST | /experiences | 创建面经 |
| updateExperience | PUT | /experiences/{id} | 更新面经 |
| deleteExperience | DELETE | /experiences/{id} | 删除面经 |
| getExperienceById | GET | /experiences/{id} | 获取详情 |
| getExperiencesPage | POST | /experiences/page | 分页查询 |
| getAllExperiences | GET | /experiences/all | 获取所有 |
| getExperiencesByPosition | GET | /experiences/position/{positionId} | 按岗位查询 |
| toggleExperienceFavorite | POST | /experiences/{id}/favorite | 切换收藏 |
| getFavoriteExperiences | GET | /experiences/favorites | 收藏列表 |
| searchExperiences | POST | /experiences/search | 搜索 |
| getExperienceStats | GET | /experiences/stats | 统计信息 |
| incrementExperienceViews | POST | /experiences/{id}/view | 增加浏览量 |
| getExperienceComments | GET | /experiences/{id}/comments | 评论列表 |
| createExperienceComment | POST | /experiences/comments | 创建评论 |
| deleteExperienceComment | DELETE | /experiences/comments/{id} | 删除评论 |
| likeExperienceComment | POST | /experiences/comments/{id}/like | 点赞评论 |
| unlikeExperienceComment | DELETE | /experiences/comments/{id}/like | 取消点赞 |
| getHotTags | GET | /experiences/tags/hot | 热门标签 |
| getExperiencesByTags | POST | /experiences/tags/filter | 按标签查询 |
| batchDeleteExperiences | POST | /experiences/batch-delete | 批量删除 |
| batchUpdateTags | POST | /experiences/batch-update-tags | 批量更新标签 |

## 注意事项

1. **所有API都需要认证**：确保在调用前用户已登录
2. **错误处理**：统一处理错误，给用户友好提示
3. **加载状态**：使用 loading 状态提升用户体验
4. **类型安全**：充分利用 TypeScript 类型检查
5. **数据缓存**：可考虑使用 Pinia 缓存已加载的数据
