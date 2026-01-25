# 组件开发速查表

本文档提供了常用组件的快速查找指南，按照优先级排序。

## 🎯 组件查找优先级

1. ✅ **Headless UI** (已安装)
2. 🔍 **Tailwind Components**
3. 🔍 **shadcn-vue**
4. 🔍 **naive-ui**
5. 🛠️ **自己实现**

---

## 1️⃣ Headless UI (已安装)

项目已安装 `@headlessui/vue`，优先使用此库的组件。

### 常用组件

#### Dialog (对话框)
```vue
<script setup>
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import { ref } from 'vue'

const isOpen = ref(true)
</script>

<template>
  <Dialog :open="isOpen" @close="isOpen = false">
    <div class="fixed inset-0 bg-black/30" />
    <div class="fixed inset-0 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4">
        <DialogPanel class="bg-white rounded-lg p-6 max-w-md w-full">
          <DialogTitle class="text-lg font-bold">标题</DialogTitle>
          <!-- 内容 -->
        </DialogPanel>
      </div>
    </div>
  </Dialog>
</template>
```

#### Menu (菜单)
```vue
<script setup>
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
</script>

<template>
  <Menu as="div" class="relative inline-block text-left">
    <MenuButton class="px-4 py-2 bg-white border rounded">选项</MenuButton>
    <MenuItems>
      <MenuItem v-slot="{ active }">
        <button :class="{ 'bg-blue-500': active }">选项 1</button>
      </MenuItem>
    </MenuItems>
  </Menu>
</template>
```

#### Disclosure (折叠面板)
```vue
<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
</script>

<template>
  <Disclosure>
    <DisclosureButton>点击展开</DisclosureButton>
    <DisclosurePanel>内容</DisclosurePanel>
  </Disclosure>
</template>
```

#### Listbox (下拉列表)
```vue
<script setup>
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { ref } from 'vue'

const selected = ref('选项1')
</script>

<template>
  <Listbox v-model="selected">
    <ListboxButton>{{ selected }}</ListboxButton>
    <ListboxOptions>
      <ListboxOption value="选项1" />
      <ListboxOption value="选项2" />
    </ListboxOptions>
  </Listbox>
</template>
```

#### Switch (开关)
```vue
<script setup>
import { Switch } from '@headlessui/vue'
import { ref } from 'vue'

const enabled = ref(false)
</script>

<template>
  <Switch v-model="enabled" class="relative inline-flex h-6 w-11">
    <span class="sr-only">开关</span>
    <span class="translate-x-1" :class="{ 'translate-x-6': enabled }" />
  </Switch>
</template>
```

#### Tabs (标签页)
```vue
<script setup>
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
</script>

<template>
  <TabGroup>
    <TabList>
      <Tab>标签 1</Tab>
      <Tab>标签 2</Tab>
    </TabList>
    <TabPanels>
      <TabPanel>内容 1</TabPanel>
      <TabPanel>内容 2</TabPanel>
    </TabPanels>
  </TabGroup>
</template>
```

#### Transition (过渡动画)
```vue
<script setup>
import { Transition } from '@headlessui/vue'
import { ref } from 'vue'

const show = ref(true)
</script>

<template>
  <Transition
    enter="transition duration-200 ease-out"
    enter-from="transform opacity-0"
    enter-to="transform opacity-100"
  >
    <div v-if="show">内容</div>
  </Transition>
</template>
```

### 完整组件列表

- Button
- Dialog
- Disclosure
- Fieldset
- Input
- Label
- Legend
- Listbox
- Menu
- Popover
- Portal
- Radio Group
- Switch
- Tab Group
- Transition
- Combobox

📖 **官方文档**: https://headlessui.com/vue

---

## 2️⃣ Tailwind Components

Tailwind UI 提供了丰富的组件示例。

### 常用组件位置

- **Forms**: https://tailwindui.com/components/application-ui/forms
- **Navigation**: https://tailwindui.com/components/application-ui/navigation
- **Overlays**: https://tailwindui.com/components/application-ui/overlays
- **Feedback**: https://tailwindui.com/components/application-ui/feedback

### 免费组件

Tailwind UI 部分组件免费，但完整版需要付费。

📖 **官方文档**: https://tailwindui.com/components
🆓 **Tailwind Components**: https://tailwindcomponents.com/ (免费社区组件)

---

## 3️⃣ shadcn-vue

基于 Radix UI 的高质量 Vue 组件，需要手动安装。

### 安装

```bash
npx shadcn-vue@latest init
npx shadcn-vue@latest add button
npx shadcn-vue@latest add dialog
```

### 常用组件

- Accordion
- Alert
- Avatar
- Badge
- Button
- Calendar
- Card
- Checkbox
- Dialog
- Dropdown Menu
- Form
- Input
- Select
- Sheet
- Table
- Tabs
- Toast

📖 **官方文档**: https://www.shadcn-vue.com/

---

## 4️⃣ naive-ui

Vue 3 组件库，提供完整的 UI 组件。

### 安装

```bash
npm install naive-ui
```

### 常用组件

- Button, Input, Select
- Card, Collapse, DataTable
- Dialog, Message, Notification
- Form, Tree, Upload
- 等等...

📖 **官方文档**: https://www.naiveui.com/

---

## 🔧 安装额外组件库

### shadcn-vue

```bash
# 初始化
npx shadcn-vue@latest init

# 添加组件
npx shadcn-vue@latest add button
npx shadcn-vue@latest add dialog
```

### naive-ui

```bash
npm install naive-ui
```

然后在 `main.js` 中配置：

```javascript
import naive from 'naive-ui'

app.use(naive)
```

---

## 📋 组件选择决策树

```
需要新组件？
    │
    ├─ 需要交互？(对话框、下拉等)
    │   └─→ Headless UI ✅
    │
    ├─ 需要完整 UI 设计？
    │   ├─→ Tailwind Components
    │   └─→ shadcn-vue (需安装)
    │
    ├─ 需要 Data Display？
    │   └─→ naive-ui (需安装)
    │
    └─ 以上都没有？
        └─→ 自己实现 🛠️
```

---

## 🎨 样式指南

### 使用 Tailwind 类

```vue
<!-- ✅ 推荐 -->
<div class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
  按钮
</div>

<!-- ❌ 避免 -->
<style>
.button {
  padding: 1rem;
  background: blue;
}
</style>
```

### 响应式设计

```vue
<div class="px-4 md:px-6 lg:px-8">
  响应式内边距
</div>
```

---

## 📚 最佳实践

1. **优先复用** - 查找现有组件再实现
2. **保持一致** - 使用相同的设计语言
3. **可访问性** - Headless UI 已内置 ARIA 支持
4. **性能优先** - 避免过度使用动画和效果
5. **类型安全** - 使用 TypeScript 组件获得类型提示

---

## 🚀 快速开始

### 1. 查找组件
```
需要什么组件？
→ 查看本文档对应章节
→ 点击官方文档链接
→ 查找示例代码
```

### 2. 复制代码
```
从官方文档复制示例
→ 根据需要修改样式
→ 集成到项目中
```

### 3. 测试
```
开发环境测试
→ 检查响应式
→ 验证可访问性
```
