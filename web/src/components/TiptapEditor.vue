<template>
  <div class="tiptap-editor">
    <!-- 工具栏 -->
    <div v-if="!readonly" class="editor-toolbar">
      <!-- 文本格式 -->
      <div class="toolbar-group">
        <button
          @click="editor?.chain().focus().toggleBold().run()"
          :class="{ 'is-active': editor?.isActive('bold') }"
          class="toolbar-btn"
          title="粗体 (Ctrl+B)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"></path>
          </svg>
        </button>
        <button
          @click="editor?.chain().focus().toggleItalic().run()"
          :class="{ 'is-active': editor?.isActive('italic') }"
          class="toolbar-btn"
          title="斜体 (Ctrl+I)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 4h4m-2 0v16m-4 0h8"></path>
          </svg>
        </button>
        <button
          @click="editor?.chain().focus().toggleUnderline().run()"
          :class="{ 'is-active': editor?.isActive('underline') }"
          class="toolbar-btn"
          title="下划线 (Ctrl+U)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v7a5 5 0 0010 0V4M5 20h14"></path>
          </svg>
        </button>
        <button
          @click="editor?.chain().focus().toggleStrike().run()"
          :class="{ 'is-active': editor?.isActive('strike') }"
          class="toolbar-btn"
          title="删除线"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 12H7m10 0a4 4 0 01-4 4H9a4 4 0 01-4-4m12 0a4 4 0 01-4 4H9a4 4 0 01-4-4"></path>
          </svg>
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- 标题 -->
      <div class="toolbar-group">
        <button
          @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="{ 'is-active': editor?.isActive('heading', { level: 1 }) }"
          class="toolbar-btn"
          title="一级标题"
        >
          <span class="text-sm font-bold">H1</span>
        </button>
        <button
          @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="{ 'is-active': editor?.isActive('heading', { level: 2 }) }"
          class="toolbar-btn"
          title="二级标题"
        >
          <span class="text-sm font-bold">H2</span>
        </button>
        <button
          @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
          :class="{ 'is-active': editor?.isActive('heading', { level: 3 }) }"
          class="toolbar-btn"
          title="三级标题"
        >
          <span class="text-sm font-bold">H3</span>
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- 列表 -->
      <div class="toolbar-group">
        <button
          @click="editor?.chain().focus().toggleBulletList().run()"
          :class="{ 'is-active': editor?.isActive('bulletList') }"
          class="toolbar-btn"
          title="无序列表"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <button
          @click="editor?.chain().focus().toggleOrderedList().run()"
          :class="{ 'is-active': editor?.isActive('orderedList') }"
          class="toolbar-btn"
          title="有序列表"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 6h13M7 12h13M7 18h13M2 6h.01M2 12h.01M2 18h.01"></path>
          </svg>
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- 代码块 -->
      <div class="toolbar-group">
        <button
          @click="editor?.chain().focus().toggleCodeBlock().run()"
          :class="{ 'is-active': editor?.isActive('codeBlock') }"
          class="toolbar-btn"
          title="代码块"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
          </svg>
        </button>
        <button
          @click="editor?.chain().focus().toggleCode().run()"
          :class="{ 'is-active': editor?.isActive('code') }"
          class="toolbar-btn"
          title="行内代码"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- 对齐 -->
      <div class="toolbar-group">
        <button
          @click="editor?.chain().focus().setTextAlign('left').run()"
          :class="{ 'is-active': editor?.isActive({ textAlign: 'left' }) }"
          class="toolbar-btn"
          title="左对齐"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h10M4 18h14"></path>
          </svg>
        </button>
        <button
          @click="editor?.chain().focus().setTextAlign('center').run()"
          :class="{ 'is-active': editor?.isActive({ textAlign: 'center' }) }"
          class="toolbar-btn"
          title="居中对齐"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M7 12h10M5 18h14"></path>
          </svg>
        </button>
        <button
          @click="editor?.chain().focus().setTextAlign('right').run()"
          :class="{ 'is-active': editor?.isActive({ textAlign: 'right' }) }"
          class="toolbar-btn"
          title="右对齐"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M10 12h10M6 18h14"></path>
          </svg>
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- 插入 -->
      <div class="toolbar-group">
        <button
          @click="addLink"
          :class="{ 'is-active': editor?.isActive('link') }"
          class="toolbar-btn"
          title="插入链接"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
          </svg>
        </button>
        <button
          @click="addImage"
          class="toolbar-btn"
          title="插入图片"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </button>
        <button
          @click="editor?.chain().focus().setHorizontalRule().run()"
          class="toolbar-btn"
          title="分割线"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
          </svg>
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- 其他操作 -->
      <div class="toolbar-group">
        <button
          @click="editor?.chain().focus().undo().run()"
          :disabled="!editor?.can().undo()"
          class="toolbar-btn"
          title="撤销 (Ctrl+Z)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
          </svg>
        </button>
        <button
          @click="editor?.chain().focus().redo().run()"
          :disabled="!editor?.can().redo()"
          class="toolbar-btn"
          title="重做 (Ctrl+Shift+Z)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- 编辑器内容区域 -->
    <editor-content :editor="editor" class="editor-content" />

    <!-- 只读模式下的内容显示 -->
    <div v-if="readonly" class="editor-readonly" v-html="modelValue"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';

interface Props {
  modelValue: string;
  readonly?: boolean;
  placeholder?: string;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
  placeholder: '请输入内容...'
});

const emit = defineEmits<Emits>();

// 创建 lowlight 实例用于代码高亮
const lowlight = createLowlight(common);

// 初始化编辑器
const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      codeBlock: false, // 禁用默认的代码块，使用 CodeBlockLowlight
    }),
    Underline,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-blue-600 underline hover:text-blue-800',
      },
    }),
    Image.configure({
      HTMLAttributes: {
        class: 'max-w-full h-auto rounded-lg',
      },
    }),
    Placeholder.configure({
      placeholder: props.placeholder,
    }),
    CodeBlockLowlight.configure({
      lowlight,
      HTMLAttributes: {
        class: 'code-block-wrapper',
      },
    }),
  ],
  editable: !props.readonly,
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML());
  },
  editorProps: {
    attributes: {
      class: 'prose prose-sm max-w-none focus:outline-none',
    },
  },
});

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  (value) => {
    if (editor.value && value !== editor.value.getHTML()) {
      editor.value.commands.setContent(value, false);
    }
  }
);

// 组件卸载时销毁编辑器
onBeforeUnmount(() => {
  editor.value?.destroy();
});

/**
 * 添加链接
 */
function addLink() {
  const url = window.prompt('请输入链接地址：');

  if (url && editor.value) {
    editor.value.chain().focus().setLink({ href: url }).run();
  }
}

/**
 * 添加图片
 */
function addImage() {
  const url = window.prompt('请输入图片地址：');

  if (url && editor.value) {
    editor.value.chain().focus().setImage({ src: url }).run();
  }
}

// 暴露编辑器实例供父组件使用
defineExpose({
  editor,
});
</script>

<style scoped>
.tiptap-editor {
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  overflow: hidden;
  background: white;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  flex-wrap: wrap;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 0.125rem;
}

.toolbar-divider {
  width: 1px;
  height: 1.25rem;
  background: #cbd5e1;
  margin: 0 0.25rem;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: none;
  background: transparent;
  color: #64748b;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.toolbar-btn:hover:not(:disabled) {
  background: #e2e8f0;
  color: #1e293b;
}

.toolbar-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toolbar-btn.is-active {
  background: #dbeafe;
  color: #0369a1;
}

.editor-content {
  padding: 1rem;
  min-height: 300px;
  max-height: 500px;
  overflow-y: auto;
}

.editor-readonly {
  padding: 1rem;
}

/* 编辑器内部样式 */
:deep(.ProseMirror) {
  outline: none;
}

:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  color: #94a3b8;
  pointer-events: none;
  height: 0;
}

/* 标题样式 */
:deep(.ProseMirror h1) {
  font-size: 1.875rem;
  font-weight: 700;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  line-height: 1.2;
  color: #1e293b;
}

:deep(.ProseMirror h2) {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
  line-height: 1.3;
  color: #1e293b;
}

:deep(.ProseMirror h3) {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  line-height: 1.4;
  color: #334155;
}

/* 段落样式 */
:deep(.ProseMirror p) {
  margin-bottom: 0.75rem;
  line-height: 1.75;
  color: #1e293b;
}

/* 列表样式 */
:deep(.ProseMirror ul),
:deep(.ProseMirror ol) {
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}

:deep(.ProseMirror li) {
  margin: 0.25rem 0;
  line-height: 1.75;
}

:deep(.ProseMirror ul) {
  list-style-type: disc;
}

:deep(.ProseMirror ol) {
  list-style-type: decimal;
}

/* 代码块样式 */
:deep(.ProseMirror pre) {
  background: #1e293b;
  color: #f8fafc;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1rem 0;
  font-family: 'Courier New', Courier, monospace;
}

:deep(.ProseMirror code) {
  background: #f1f5f9;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
  font-family: 'Courier New', Courier, monospace;
  color: #e11d48;
}

:deep(.ProseMirror pre code) {
  background: transparent;
  padding: 0;
  color: inherit;
}

/* 链接样式 */
:deep(.ProseMirror a) {
  color: #2563eb;
  text-decoration: underline;
}

:deep(.ProseMirror a:hover) {
  color: #1d4ed8;
}

/* 图片样式 */
:deep(.ProseMirror img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

/* 分割线样式 */
:deep(.ProseMirror hr) {
  border: none;
  border-top: 2px solid #e2e8f0;
  margin: 2rem 0;
}

/* 分隔线样式 */
:deep(.ProseMirror blockquote) {
  border-left: 4px solid #e2e8f0;
  padding-left: 1rem;
  margin: 1rem 0;
  color: #64748b;
  font-style: italic;
}

/* 文本对齐 */
:deep(.ProseMirror [style*="text-align: center"]) {
  text-align: center;
}

:deep(.ProseMirror [style*="text-align: right"]) {
  text-align: right;
}

:deep(.ProseMirror [style*="text-align: justify"]) {
  text-align: justify;
}
</style>
