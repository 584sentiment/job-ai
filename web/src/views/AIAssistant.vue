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
            <div class="welcome-icon-wrapper">
              <svg class="welcome-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            <h2 class="welcome-title">欢迎使用AI求职助手！</h2>
            <p class="welcome-desc">我可以帮你准备面试、优化简历、分析岗位匹配度</p>
          </div>
          <div class="quick-actions">
            <button class="action-btn" @click="quickAsk('如何优化我的简历？')">
              <div class="action-icon">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div class="action-text">简历优化</div>
            </button>
            <button class="action-btn" @click="quickAsk('面试前如何准备？')">
              <div class="action-icon">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <div class="action-text">面试准备</div>
            </button>
            <button class="action-btn" @click="quickAsk('帮我分析岗位匹配度')">
              <div class="action-icon">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <div class="action-text">匹配分析</div>
            </button>
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
              <div class="ai-avatar">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <div class="message-content ai-message">
                <div class="message-text" v-html="formatMessage(message.content)"></div>
                <!-- 操作按钮 -->
                <div v-if="message.actions && message.actions.length > 0" class="message-actions">
                  <button
                    v-for="(action, index) in message.actions"
                    :key="index"
                    class="action-chip"
                    @click="handleActionClick(action)"
                  >
                    {{ action.text }}
                  </button>
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
            <div class="ai-avatar">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            <div class="message-content ai-message">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部输入框 -->
    <div class="input-area">
      <div class="input-wrapper">
        <textarea
          v-model="inputText"
          placeholder="输入你的问题..."
          rows="1"
          @keydown.enter.exact.prevent="sendMessage"
          class="chat-input"
        ></textarea>
        <button
          @click="sendMessage"
          :disabled="!inputText.trim() || isLoading"
          class="send-btn"
        >
          <svg v-if="!isLoading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
          <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- 底部导航 -->
    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
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
  background: linear-gradient(to bottom, #faf5ff 0%, #f5f5f5 100%);
}

.main-content {
  flex: 1;
  overflow: hidden;
  padding-bottom: 70px;
}

.scroll-container {
  height: calc(100vh - 140px);
  overflow-y: auto;
  padding: 16px;
}

/* 欢迎卡片 - 优化视觉层次和动画 */
.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 40px 24px;
  margin-bottom: 24px;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.25);
  position: relative;
  overflow: hidden;
}

.welcome-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: shimmer 8s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
  50% { transform: translate(-30%, -30%) rotate(180deg); }
}

.welcome-content {
  text-align: center;
  color: white;
  margin-bottom: 28px;
  position: relative;
  z-index: 1;
}

.welcome-icon-wrapper {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.welcome-icon {
  width: 40px;
  height: 40px;
  color: white;
}

.welcome-title {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 10px;
  font-family: 'Poppins', sans-serif;
}

.welcome-desc {
  font-size: 15px;
  opacity: 0.95;
  line-height: 1.5;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  position: relative;
  z-index: 1;
}

.action-btn {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 14px;
  padding: 20px 12px;
  text-align: center;
  cursor: pointer;
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  background: white;
}

.action-btn:active {
  transform: translateY(-1px);
}

.action-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 250ms ease;
}

.action-btn:hover .action-icon {
  transform: scale(1.05);
}

.action-text {
  font-size: 13px;
  font-weight: 600;
  color: #1e1b4b;
}

/* 对话容器 */
.chat-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 20px;
}

.message-bubble {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-bubble.user {
  flex-direction: row-reverse;
}

.ai-avatar {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.message-content {
  max-width: 75%;
  padding: 14px 18px;
  border-radius: 16px;
  word-wrap: break-word;
  transition: all 250ms ease;
}

.user-message {
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.ai-message {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(102, 126, 234, 0.1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.message-text {
  font-size: 15px;
  line-height: 1.7;
  white-space: pre-wrap;
  color: #1e1b4b;
}

.user-message .message-text {
  color: white;
}

.message-text :deep(ul) {
  margin: 10px 0;
  padding-left: 24px;
}

.message-text :deep(li) {
  margin: 6px 0;
}

.message-actions {
  margin-top: 14px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.action-chip {
  padding: 8px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.25);
}

.action-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.35);
}

.action-chip:active {
  transform: translateY(0);
}

/* 打字指示器 - 改进动画 */
.typing-indicator {
  display: flex;
  gap: 6px;
  padding: 8px 0;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #667eea;
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-12px);
    opacity: 1;
  }
}

/* 底部输入框 - 优化布局和交互 */
.input-area {
  position: fixed;
  bottom: 60px;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid #e2e8f0;
  padding: 14px 16px;
  z-index: 100;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.06);
}

.input-wrapper {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  gap: 12px;
  align-items: flex-end;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 8px 12px;
  transition: all 250ms ease;
}

.input-wrapper:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.chat-input {
  flex: 1;
  border: none;
  outline: none;
  resize: none;
  font-size: 15px;
  line-height: 1.5;
  color: #1e293b;
  background: transparent;
  font-family: inherit;
  min-height: 24px;
  max-height: 120px;
}

.chat-input::placeholder {
  color: #94a3b8;
}

.send-btn {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  color: white;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.send-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .scroll-container {
    height: calc(100vh - 120px);
    padding: 12px;
  }

  .welcome-card {
    padding: 32px 20px;
  }

  .welcome-title {
    font-size: 22px;
  }

  .quick-actions {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .action-btn {
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    text-align: left;
  }

  .action-icon {
    width: 40px;
    height: 40px;
    margin: 0;
  }

  .message-content {
    max-width: 85%;
  }

  .input-area {
    bottom: 50px;
    padding: 12px;
  }

  .input-wrapper {
    padding: 6px 10px;
  }

  .send-btn {
    width: 40px;
    height: 40px;
  }
}

/* 深色模式支持（可选） */
@media (prefers-color-scheme: dark) {
  .ai-assistant-page {
    background: linear-gradient(to bottom, #1e1b4b 0%, #0f172a 100%);
  }

  .ai-message {
    background: rgba(30, 27, 75, 0.95);
    border-color: rgba(102, 126, 234, 0.2);
  }

  .message-text {
    color: #e5e7eb;
  }

  .input-area {
    background: rgba(15, 23, 42, 0.95);
    border-top-color: #334155;
  }

  .input-wrapper {
    background: rgba(30, 27, 75, 0.95);
    border-color: #4c1d95;
  }

  .chat-input {
    color: #e5e7eb;
  }

  .chat-input::placeholder {
    color: #64748b;
  }
}
</style>
