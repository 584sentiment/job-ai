<template>
  <div class="ai-assistant-page">
    <!-- 顶部导航栏 -->
    <NavBar title="AI助手" />

    <!-- 主内容区域 -->
    <div class="main-content">
      <div class="scroll-container">
        <!-- 欢迎卡片 -->
        <div v-if="conversations.length === 0" class="welcome-card">
          <div class="welcome-content">
            <div class="welcome-icon">🤖</div>
            <h2 class="welcome-title">欢迎使用AI求职助手！</h2>
            <p class="welcome-desc">我可以帮你准备面试、优化简历、分析岗位匹配度</p>
          </div>
          <div class="quick-actions">
            <div class="action-btn" @click="quickAsk('如何优化我的简历？')">
              <div class="action-icon">📝</div>
              <div class="action-text">简历优化</div>
            </div>
            <div class="action-btn" @click="quickAsk('面试前如何准备？')">
              <div class="action-icon">💡</div>
              <div class="action-text">面试准备</div>
            </div>
            <div class="action-btn" @click="quickAsk('帮我分析岗位匹配度')">
              <div class="action-icon">📊</div>
              <div class="action-text">匹配分析</div>
            </div>
          </div>
        </div>

        <!-- 对话历史 -->
        <div class="chat-container">
          <div
            v-for="message in conversations"
            :key="message.id"
            :class="['message-bubble', message.role === 'user' ? 'user' : 'ai']"
          >
            <!-- AI消息 -->
            <template v-if="message.role === 'assistant'">
              <div class="ai-avatar">🤖</div>
              <div class="message-content ai-message">
                <div class="message-text" v-html="formatMessage(message.content)"></div>
                <!-- 操作按钮 -->
                <div v-if="message.actions && message.actions.length > 0" class="message-actions">
                  <n-button
                    v-for="(action, index) in message.actions"
                    :key="index"
                    type="primary"
                    size="small"
                    ghost
                    class="action-btn"
                    @click="handleActionClick(action)"
                  >
                    {{ action.text }}
                  </n-button>
                </div>
              </div>
            </template>

            <!-- 用户消息 -->
            <template v-else>
              <div class="message-content user-message">
                <div class="message-text">{{ message.content }}</div>
              </div>
            </template>
          </div>

          <!-- 加载动画 -->
          <div v-if="isLoading" class="message-bubble ai">
            <div class="ai-avatar">🤖</div>
            <div class="message-content ai-message">
              <n-spin size="small" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部输入框 -->
    <div class="input-area">
      <n-input
        v-model:value="inputText"
        type="textarea"
        placeholder="输入你的问题..."
        :autosize="{ minRows: 1, maxRows: 4 }"
        @keydown.enter.exact.prevent="sendMessage"
        class="chat-input"
      />
      <n-button
        type="primary"
        :loading="isLoading"
        :disabled="!inputText.trim()"
        @click="sendMessage"
        class="send-btn"
      >
        发送
      </n-button>
    </div>

    <!-- 底部导航 -->
    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { NInput, NButton, NSpin, useMessage } from 'naive-ui'
import NavBar from '@/components/NavBar.vue'
import BottomNav from '@/components/BottomNav.vue'
import aiAPI from '@/api/ai'
import type { AIMessage } from '@/types'

const message = useMessage()
const conversations = ref<AIMessage[]>([])
const inputText = ref('')
const isLoading = ref(false)

// 加载对话历史
onMounted(() => {
  loadConversations()
})

function loadConversations() {
  const saved = localStorage.getItem('ai_conversations')
  if (saved) {
    try {
      conversations.value = JSON.parse(saved)
    } catch (error) {
      console.error('加载对话历史失败:', error)
      conversations.value = []
    }
  }
}

function saveConversations() {
  localStorage.setItem('ai_conversations', JSON.stringify(conversations.value))
}

// 快捷提问
function quickAsk(question: string) {
  inputText.value = question
  sendMessage()
}

// 发送消息
async function sendMessage() {
  const text = inputText.value.trim()
  if (!text || isLoading.value) return

  // 添加用户消息
  const userMessage: AIMessage = {
    id: Date.now(),
    role: 'user',
    content: text,
    createTime: new Date().toISOString()
  }
  conversations.value.push(userMessage)
  saveConversations()

  // 清空输入框
  inputText.value = ''
  isLoading.value = true

  // 滚动到底部
  await scrollToBottom()

  try {
    // 调用AI接口
    const response = await aiAPI.chat(text)

    // 后端返回格式：{ code, message, data: { content, actions } }
    const data = response.data || response

    conversations.value.push({
      id: Date.now(),
      role: 'assistant',
      content: data.content,
      actions: data.actions,
      createTime: new Date().toISOString()
    })
    saveConversations()
  } catch (error) {
    message.error('AI响应失败，请稍后重试')
    console.error('AI chat error:', error)
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}

// 处理操作按钮点击
function handleActionClick(action: any) {
  const actionMap: Record<string, string> = {
    'view_interview_tips': '请告诉我面试技巧',
    'mock_interview': '开始模拟面试',
    'view_template': '查看简历模板',
    'diagnose_resume': '诊断我的简历',
    'analyze_job': '帮我分析这个岗位',
    'optimize_resume': '如何优化简历',
    'interview_prep': '面试准备建议',
    'view_application_tips': '投递技巧',
    'compare_offer': '如何对比Offer'
  }

  const question = actionMap[action.action]
  if (question) {
    quickAsk(question)
  }
}

// 格式化消息内容（支持markdown）
function formatMessage(content: string) {
  // 简单的markdown格式化
  return content
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/- (.*?)(<br>|$)/g, '<li>$1</li>')
    .replace(/<li>/g, '<ul><li>')
    .replace(/<\/li>/g, '</li></ul>')
    .replace(/<\/ul><ul>/g, '')
}

// 滚动到底部
async function scrollToBottom() {
  await nextTick()
  const container = document.querySelector('.scroll-container')
  if (container) {
    container.scrollTop = container.scrollHeight
  }
}
</script>

<style scoped>
.ai-assistant-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.main-content {
  flex: 1;
  overflow: hidden;
  padding-bottom: 70px; /* 为底部输入框留出空间 */
}

.scroll-container {
  height: calc(100vh - 140px); /* 减去顶部导航和底部输入框的高度 */
  overflow-y: auto;
  padding: 16px;
}

/* 欢迎卡片 */
.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 32px 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.welcome-content {
  text-align: center;
  color: white;
  margin-bottom: 24px;
}

.welcome-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.welcome-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.welcome-desc {
  font-size: 14px;
  opacity: 0.9;
}

.quick-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.action-btn {
  flex: 1;
  max-width: 100px;
  background: white;
  border-radius: 12px;
  padding: 16px 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.action-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.action-text {
  font-size: 12px;
  font-weight: 500;
  color: #333;
}

/* 对话容器 */
.chat-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-bubble {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.message-bubble.user {
  flex-direction: row-reverse;
}

.ai-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 20px;
}

.message-content {
  max-width: 75%;
  padding: 12px 16px;
  border-radius: 12px;
  word-wrap: break-word;
}

.user-message {
  background: #2563eb;
  color: white;
}

.ai-message {
  background: white;
  border-left: 3px solid #667eea;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.message-text {
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.user-message .message-text {
  color: white;
}

.message-text :deep(ul) {
  margin: 8px 0;
  padding-left: 20px;
}

.message-text :deep(li) {
  margin: 4px 0;
}

.message-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* 底部输入框 */
.input-area {
  position: fixed;
  bottom: 60px; /* 在底部导航之上 */
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e5e7eb;
  padding: 12px 16px;
  display: flex;
  gap: 12px;
  align-items: flex-end;
  z-index: 100;
}

.chat-input {
  flex: 1;
}

.send-btn {
  flex-shrink: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .scroll-container {
    height: calc(100vh - 120px);
  }

  .message-content {
    max-width: 85%;
  }

  .input-area {
    bottom: 50px;
  }
}
</style>
