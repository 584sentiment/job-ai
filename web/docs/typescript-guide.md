# TypeScript 类型定义使用指南

## 概述

项目已配置 TypeScript，核心数据类型与后端保持一致，减少字段转换。

## 类型文件结构

```
src/types/
├── index.ts       # 统一导出入口
├── enums.ts       # 枚举类型定义
├── position.ts    # 岗位相关类型
└── user.ts        # 用户相关类型
```

## 核心枚举

### PositionStatus (岗位状态)

```typescript
import { PositionStatus } from '@/types'

// 使用枚举
const status = PositionStatus.TO_BE_DELIVERED  // 0
const status = PositionStatus.DELIVERED        // 1
const status = PositionStatus.IN_PROCESS       // 2
const status = PositionStatus.OFFER            // 3
const status = PositionStatus.JOINED           // 4
const status = PositionStatus.NOT_PASS         // -1
const status = PositionStatus.REJECTED         // 5
```

### 获取状态标签和样式

```typescript
import { getStatusLabel, getStatusClass } from '@/utils/mappers'

// 获取状态标签
getStatusLabel(PositionStatus.TO_BE_DELIVERED)  // '待投递'

// 获取样式类
getStatusClass(PositionStatus.TO_BE_DELIVERED)  // 'bg-yellow-100 text-yellow-700'
```

## 核心类型

### Position (岗位信息)

```typescript
import type { Position } from '@/types'

const position: Position = {
  id: 1,
  companyName: '字节跳动',
  positionName: '前端开发工程师',
  deliveryChannel: '内推',
  deliveryDate: '2026-01-24T12:00:00.000Z',
  workLocation: '北京',
  salaryRange: '25-40K',
  jobDescription: '负责前端开发...',
  contactName: '张三',
  contactPhone: '13800138000',
  remarks: '备注信息',
  status: PositionStatus.DELIVERED,  // 数字枚举值
  isCollected: 0,
  interviewRecordList: [],
  createTime: '2026-01-24T12:00:00.000Z',
  updateTime: '2026-01-24T12:00:00.000Z'
}
```

### PositionCreateRequest (创建/更新岗位)

```typescript
import type { PositionCreateRequest } from '@/types'

const createData: PositionCreateRequest = {
  companyName: '字节跳动',
  positionName: '前端开发工程师',
  deliveryChannel: '内推',
  deliveryDate: new Date().toISOString(),
  workLocation: '北京',
  salaryRange: '25-40K',
  status: PositionStatus.TO_BE_DELIVERED
}
```

### ApiResponse (通用响应)

```typescript
import type { ApiResponse, PositionListResponse } from '@/types'

// 岗位列表响应
const response: PositionListResponse = {
  code: 200,
  message: 'success',
  data: {
    records: [/* Position[] */],
    total: 100,
    current: 1,
    size: 10,
    pages: 10
  }
}
```

## API 使用示例

```typescript
import * as positionApi from '@/api/position'
import type { PositionQueryParams } from '@/types'

// 获取岗位列表
const params: PositionQueryParams = {
  current: 1,
  size: 10,
  status: PositionStatus.DELIVERED
}

const result = await positionApi.getPositions(params)
// result.data.records 是 Position[]
// result.code 是 number
```

## 在 Vue 组件中使用

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { Position } from '@/types'
import { PositionStatus, getStatusLabel } from '@/types'
import { getStatusClass } from '@/utils/mappers'

const positions = ref<Position[]>([])

const getLabel = (status: PositionStatus) => {
  return getStatusLabel(status)
}
</script>

<template>
  <div v-for="position in positions" :key="position.id">
    <span :class="getStatusClass(position.status)">
      {{ getLabel(position.status) }}
    </span>
    <p>{{ position.companyName }}</p>
    <p>{{ position.positionName }}</p>
  </div>
</template>
```

## 类型检查

运行类型检查：
```bash
npm run type-check
```

构建时自动进行类型检查：
```bash
npm run build
```

## 注意事项

1. **字段名一致性**: 类型定义已与后端保持一致，使用 `companyName` 而非 `company`
2. **状态值**: 使用 `PositionStatus` 枚举而非字符串
3. **日期格式**: 使用 ISO 8601 字符串格式
4. **可选字段**: 使用 `Partial<T>` 处理部分更新的场景
