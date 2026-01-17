// pages/ai-assistant/ai-assistant.js
const AIHelper = require('../../utils/ai-helper.js');
const { Storage, STORAGE_KEYS } = require('../../utils/storage.js');

Page({
  data: {
    conversations: [],
    inputText: ''
  },

  onLoad() {
    this.loadConversations();
  },

  loadConversations() {
    const conversations = Storage.get(STORAGE_KEYS.CONVERSATIONS) || [];
    this.setData({ conversations });
  },

  onInput(e) {
    this.setData({ inputText: e.detail.value });
  },

  quickAsk(e) {
    const question = e.currentTarget.dataset.question;
    this.setData({ inputText: question });
    this.send();
  },

  async send() {
    const message = this.data.inputText.trim();
    if (!message) return;

    const conversations = this.data.conversations;
    conversations.push({
      id: Date.now(),
      role: 'user',
      content: message,
      createTime: new Date().toISOString()
    });

    this.setData({
      conversations,
      inputText: ''
    });

    Storage.set(STORAGE_KEYS.CONVERSATIONS, conversations);

    try {
      const response = await AIHelper.chat(message);
      conversations.push({
        id: Date.now(),
        role: 'assistant',
        content: response.content,
        actions: response.actions,
        createTime: new Date().toISOString()
      });

      this.setData({ conversations });
      Storage.set(STORAGE_KEYS.CONVERSATIONS, conversations);

      this.scrollToBottom();
    } catch (error) {
      wx.showToast({ title: 'AI响应失败', icon: 'none' });
    }
  },

  scrollToBottom() {
    setTimeout(() => {
      wx.createSelectorQuery()
        .select('#chatContainer')
        .boundingClientRect()
        .exec();
    }, 100);
  }
});
