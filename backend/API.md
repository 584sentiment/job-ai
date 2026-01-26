# API 文档

## 基础信息

- **Base URL**: `http://localhost:8080`（开发环境）
- **认证方式**: JWT Bearer Token
- **响应格式**: JSON

## 统一响应格式

### 成功响应

```json
{
  "code": 200,
  "message": "操作成功",
  "data": { ... }
}
```

### 错误响应

```json
{
  "code": 400,
  "message": "请求参数错误",
  "data": null
}
```

### 分页响应

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "list": [ ... ],
    "total": 100,
    "page": 1,
    "pageSize": 10,
    "totalPages": 10
  }
}
```

## 状态码

| Code | 说明 |
|------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权，请重新登录 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 409 | 资源冲突（如手机号已注册） |
| 500 | 服务器内部错误 |
| 501 | 功能暂未实现 |

---

## 用户认证

### 注册

**POST** `/users/register`

**请求体**:

```json
{
  "phone": "13800138000",
  "password": "123456",
  "nickname": "张三"
}
```

**响应**:

```json
{
  "code": 201,
  "message": "注册成功",
  "data": {
    "user": {
      "id": "user-id",
      "phone": "13800138000",
      "nickname": "张三",
      "avatar": null,
      "bio": null,
      "createTime": "2025-01-26T00:00:00.000Z",
      "updateTime": "2025-01-26T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 登录

**POST** `/users/login`

**请求体**:

```json
{
  "phone": "13800138000",
  "password": "123456"
}
```

**响应**:

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 获取当前用户信息

**GET** `/users/current`

**请求头**:

```
Authorization: Bearer {token}
```

**响应**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": "user-id",
    "phone": "13800138000",
    "nickname": "张三",
    "avatar": null,
    "bio": null,
    "createTime": "2025-01-26T00:00:00.000Z",
    "updateTime": "2025-01-26T00:00:00.000Z"
  }
}
```

### 更新用户信息

**PUT** `/users`

**请求头**:

```
Authorization: Bearer {token}
```

**请求体**:

```json
{
  "nickname": "李四",
  "avatar": "https://example.com/avatar.jpg",
  "bio": "这是我的简介",
  "email": "user@example.com"
}
```

### 修改密码

**POST** `/users/change-password`

**请求头**:

```
Authorization: Bearer {token}
```

**请求体**:

```json
{
  "oldPassword": "123456",
  "newPassword": "654321"
}
```

### 登出

**POST** `/users/logout`

**请求头**:

```
Authorization: Bearer {token}
```

---

## 岗位管理

### 分页查询岗位列表

**POST** `/positions/page`

**请求头**:

```
Authorization: Bearer {token}
```

**请求体**:

```json
{
  "page": 1,
  "pageSize": 10,
  "status": "applied",
  "keyword": "字节跳动",
  "isCollected": false
}
```

**响应**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "list": [ ... ],
    "total": 50,
    "page": 1,
    "pageSize": 10,
    "totalPages": 5
  }
}
```

### 获取岗位详情

**GET** `/positions/:id`

**请求头**:

```
Authorization: Bearer {token}
```

### 创建岗位

**POST** `/positions`

**请求头**:

```
Authorization: Bearer {token}
```

**请求体**:

```json
{
  "company": "字节跳动",
  "position": "前端工程师",
  "channel": "招聘网站",
  "location": "北京",
  "salary": "25-40K",
  "jd": "负责产品前端开发...",
  "contact": "hr@example.com",
  "remark": "备注信息",
  "status": "applied",
  "applyDate": "2025-01-26",
  "timeline": [ ... ]
}
```

### 更新岗位

**PUT** `/positions`

**请求头**:

```
Authorization: Bearer {token}
```

**请求体**:

```json
{
  "id": "position-id",
  "company": "字节跳动",
  "position": "前端工程师",
  ...
}
```

### 删除岗位

**DELETE** `/positions/:id`

**请求头**:

```
Authorization: Bearer {token}
```

### 切换收藏状态

**POST** `/positions/:id/collect`

**请求头**:

```
Authorization: Bearer {token}
```

---

## 面试管理

### 创建面试记录

**POST** `/interviews`

**请求头**:

```
Authorization: Bearer {token}
```

**请求体**:

```json
{
  "positionId": "position-id",
  "company": "字节跳动",
  "position": "前端工程师",
  "round": "一面",
  "date": "2025-02-01",
  "time": "14:00",
  "location": "北京海淀区",
  "form": "现场面试",
  "status": "upcoming",
  "aiPrepList": [
    { "id": 1, "text": "复习前端核心技能", "completed": false }
  ]
}
```

### 更新面试记录

**PUT** `/interviews/:id`

**请求头**:

```
Authorization: Bearer {token}
```

### 删除面试记录

**DELETE** `/interviews/:id`

**请求头**:

```
Authorization: Bearer {token}
```

### 获取岗位的面试列表

**GET** `/interviews/position/:positionId`

**请求头**:

```
Authorization: Bearer {token}
```

### 分页查询面试记录

**POST** `/interviews/page`

**请求头**:

```
Authorization: Bearer {token}
```

**请求体**:

```json
{
  "page": 1,
  "pageSize": 10,
  "status": "upcoming",
  "positionId": "position-id"
}
```

### 获取面试详情

**GET** `/interviews/:id`

**请求头**:

```
Authorization: Bearer {token}
```

---

## 面经管理

### 创建面经

**POST** `/experiences`

**请求头**:

```
Authorization: Bearer {token}
```

**请求体**:

```json
{
  "positionId": "position-id",
  "company": "字节跳动",
  "position": "前端工程师",
  "content": "面试经验内容...",
  "tags": ["Vue3", "TypeScript"],
  "category": "technical",
  "interviewDate": "2025-01-26",
  "isPublic": true
}
```

### 更新面经

**PUT** `/experiences/:id`

**请求头**:

```
Authorization: Bearer {token}
```

### 删除面经

**DELETE** `/experiences/:id`

**请求头**:

```
Authorization: Bearer {token}
```

### 获取面经详情

**GET** `/experiences/:id`

**请求头**:

```
Authorization: Bearer {token}
```

### 分页查询面经

**POST** `/experiences/page`

**请求头**:

```
Authorization: Bearer {token}
```

**请求体**:

```json
{
  "page": 1,
  "pageSize": 10,
  "category": "technical",
  "positionId": "position-id",
  "tags": ["Vue3"]
}
```

### 获取所有面经

**GET** `/experiences/all`

**请求头**:

```
Authorization: Bearer {token}
```

### 切换收藏状态

**POST** `/experiences/:id/favorite`

**请求头**:

```
Authorization: Bearer {token}
```

### 搜索面经

**POST** `/experiences/search`

**请求头**:

```
Authorization: Bearer {token}
```

**请求体**:

```json
{
  "keyword": "字节跳动"
}
```

### 批量删除面经

**POST** `/experiences/batch-delete`

**请求头**:

```
Authorization: Bearer {token}
```

**请求体**:

```json
{
  "ids": ["id1", "id2", "id3"]
}
```

---

## 面试总结

### 创建总结

**POST** `/summaries`

**请求头**:

```
Authorization: Bearer {token}
```

**请求体**:

```json
{
  "interviewId": "interview-id",
  "positionId": "position-id",
  "company": "字节跳动",
  "position": "前端工程师",
  "round": "一面",
  "content": {
    "strengths": ["技术基础扎实"],
    "weaknesses": ["算法需加强"],
    "questions": ["请介绍一下你的项目"],
    "improvements": ["多刷算法题"],
    "overall": "整体表现良好"
  }
}
```

### 获取总结详情

**GET** `/summaries/:id`

**请求头**:

```
Authorization: Bearer {token}
```

### 更新总结

**PUT** `/summaries/:id`

**请求头**:

```
Authorization: Bearer {token}
```

### 删除总结

**DELETE** `/summaries/:id`

**请求头**:

```
Authorization: Bearer {token}
```

### 分页查询总结

**POST** `/summaries/page`

**请求头**:

```
Authorization: Bearer {token}
```

**请求体**:

```json
{
  "page": 1,
  "pageSize": 10,
  "interviewId": "interview-id",
  "positionId": "position-id"
}
```

---

## 健康检查

### 健康检查

**GET** `/health`

**响应**:

```json
{
  "status": "ok",
  "timestamp": "2025-01-26T00:00:00.000Z"
}
```

---

## 错误示例

### 400 Bad Request

```json
{
  "code": 400,
  "message": "手机号和密码不能为空",
  "data": null
}
```

### 401 Unauthorized

```json
{
  "code": 401,
  "message": "未授权，请重新登录",
  "data": null
}
```

### 404 Not Found

```json
{
  "code": 404,
  "message": "岗位不存在",
  "data": null
}
```

### 409 Conflict

```json
{
  "code": 409,
  "message": "该手机号已注册",
  "data": null
}
```

### 500 Internal Server Error

```json
{
  "code": 500,
  "message": "服务器内部错误",
  "data": null
}
```
