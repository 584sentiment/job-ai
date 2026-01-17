// 主应用脚本

// 应用状态
const AppState = {
  currentPage: 'home',
  currentFilter: 'all',
  selectedJob: null
};

// 页面路由配置
const pages = {
  home: renderHomePage,
  'add-job': renderAddJobPage,
  'job-detail': renderJobDetailPage,
  interviews: renderInterviewsPage,
  experience: renderExperiencePage,
  'ai-assistant': renderAIAssistantPage,
  profile: renderProfilePage
};

// TabBar配置
const tabBarItems = [
  { id: 'home', icon: 'fa-briefcase', label: '岗位' },
  { id: 'interviews', icon: 'fa-calendar', label: '面试' },
  { id: 'experience', icon: 'fa-book', label: '面经' },
  { id: 'ai-assistant', icon: 'fa-robot', label: 'AI助手', isAI: true },
  { id: 'profile', icon: 'fa-user', label: '我的' }
];

// ==================== 主页（岗位列表）====================
function renderHomePage() {
  const jobs = DataUtils.getJobs(AppState.currentFilter);
  const interviewCount = jobs.filter(j => j.status === 'interview').length;

  return `
    <!-- 页面头部 -->
    <div class="page-header">
      <button class="back-btn" style="visibility: hidden;">
        <i class="fas fa-chevron-left"></i>
      </button>
      <h1>我的岗位</h1>
      <button class="back-btn" onclick="showSettingsMenu()">
        <i class="fas fa-ellipsis-v"></i>
      </button>
    </div>

    <!-- 主内容 -->
    <div class="main-content">
      <!-- 搜索框 -->
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input type="text" placeholder="搜索公司或岗位名称..." onchange="handleSearch(this.value)">
      </div>

      <!-- AI智能分析卡片 -->
      <div class="ai-card fade-in">
        <div class="flex items-center gap-2 mb-3">
          <span class="text-2xl">🤖</span>
          <span class="font-bold text-gray-900">AI 智能分析</span>
        </div>
        <div class="text-sm text-gray-700 mb-3">
          你有 <strong class="text-purple-600">${interviewCount}</strong> 个岗位进入面试阶段
        </div>
        ${interviewCount > 0 ? `
          <div class="bg-white rounded-lg p-3 mb-3">
            <div class="flex items-center gap-2 mb-2">
              <span>💡</span>
              <span class="text-sm font-medium text-gray-900">重点推荐准备</span>
            </div>
            ${jobs.filter(j => j.status === 'interview').slice(0, 1).map(job => `
              <div class="text-sm text-gray-700 mb-2">${job.company} - ${job.position}</div>
              <div class="flex gap-2 mb-3">
                <span class="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                  匹配度 ${job.aiMatchScore?.overall || 85}%
                </span>
                <span class="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                  面试概率高
                </span>
              </div>
            `).join('')}
            <button class="btn btn-primary btn-block btn-sm" onclick="navigateTo('job-detail', {id: ${jobs.find(j => j.status === 'interview')?.id}})">
              立即准备
            </button>
          </div>
        ` : ''}
        <div class="flex items-center gap-2 text-xs text-gray-600">
          <span>📊</span>
          <span>本周数据分析：投递 ${jobs.length} 个 | 面试 ${interviewCount} 场</span>
        </div>
      </div>

      <!-- 筛选标签 -->
      <div class="filter-tags">
        <button class="filter-tag ${AppState.currentFilter === 'all' ? 'active' : ''}" onclick="setFilter('all')">
          全部
        </button>
        <button class="filter-tag ${AppState.currentFilter === 'pending' ? 'active' : ''}" onclick="setFilter('pending')">
          待投递
        </button>
        <button class="filter-tag ${AppState.currentFilter === 'applied' ? 'active' : ''}" onclick="setFilter('applied')">
          已投递
        </button>
        <button class="filter-tag ${AppState.currentFilter === 'interview' ? 'active' : ''}" onclick="setFilter('interview')">
          面试中
        </button>
        <button class="filter-tag ${AppState.currentFilter === 'offered' ? 'active' : ''}" onclick="setFilter('offered')">
          已录用
        </button>
      </div>

      <!-- 岗位列表 -->
      <div class="jobs-list">
        ${jobs.length > 0 ? jobs.map(job => `
          <div class="card clickable" onclick="navigateTo('job-detail', {id: ${job.id}})">
            <div class="flex items-start justify-between mb-2">
              <div class="flex-1">
                <h3 class="font-bold text-gray-900 mb-1">${job.company}</h3>
                <p class="text-sm text-gray-600">${job.position}</p>
              </div>
              <span class="status-badge ${StatusMap[job.status].class}">${StatusMap[job.status].text}</span>
            </div>
            <div class="flex items-center gap-4 text-xs text-gray-500 mt-2">
              <span><i class="fas fa-map-marker-alt mr-1"></i>${job.location}</span>
              <span><i class="fas fa-yen-sign mr-1"></i>${job.salary}</span>
              <span><i class="fas fa-clock mr-1"></i>${job.applyDate}</span>
            </div>
            ${job.aiMatchScore ? `
              <div class="mt-3 pt-3 border-t border-gray-100">
                <div class="flex items-center justify-between text-xs mb-1">
                  <span class="text-gray-600">AI匹配度</span>
                  <span class="font-bold text-purple-600">${job.aiMatchScore.overall}%</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-bar-fill" style="width: ${job.aiMatchScore.overall}%"></div>
                </div>
              </div>
            ` : ''}
          </div>
        `).join('') : `
          <div class="empty-state">
            <i class="fas fa-inbox text-6xl mb-4"></i>
            <p>暂无岗位数据</p>
          </div>
        `}
      </div>
    </div>

    <!-- 浮动添加按钮 -->
    <button class="fab ai-gradient" onclick="navigateTo('add-job')">
      <i class="fas fa-plus text-white text-xl"></i>
    </button>

    ${renderTabBar()}
  `;
}

// ==================== 添加岗位页 ====================
function renderAddJobPage() {
  return `
    <div class="page-header">
      <button class="back-btn" onclick="navigateTo('home')">
        <i class="fas fa-chevron-left"></i>
      </button>
      <h1>添加岗位</h1>
      <div style="width: 32px;"></div>
    </div>

    <div class="main-content">
      <form id="jobForm" onsubmit="handleSaveJob(event)">
        <!-- 基础信息 -->
        <div class="form-section">
          <h3 class="text-sm font-bold text-gray-900 mb-3">基础信息</h3>

          <div class="form-group">
            <label class="form-label required">公司名称</label>
            <input type="text" class="form-input" name="company" required placeholder="请输入公司名称">
          </div>

          <div class="form-group">
            <label class="form-label required">岗位名称</label>
            <input type="text" class="form-input" name="position" required placeholder="请输入岗位名称">
          </div>

          <div class="form-group">
            <label class="form-label required">投递渠道</label>
            <select class="form-select" name="channel" required>
              <option value="">请选择</option>
              <option value="招聘网站">招聘网站</option>
              <option value="企业官网">企业官网</option>
              <option value="内推">内推</option>
              <option value="宣讲会">宣讲会</option>
              <option value="其他">其他</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">工作地点</label>
            <input type="text" class="form-input" name="location" placeholder="请输入工作地点">
          </div>

          <div class="form-group">
            <label class="form-label">薪资范围</label>
            <input type="text" class="form-input" name="salary" placeholder="例如：20-35K">
          </div>

          <div class="form-group">
            <label class="form-label required">投递日期</label>
            <input type="date" class="form-input" name="applyDate" required value="${DateFormat.format(new Date(), 'YYYY-MM-DD')}">
          </div>
        </div>

        <!-- JD输入 -->
        <div class="form-section mt-6">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-bold text-gray-900">岗位JD</h3>
            <button type="button" class="btn btn-primary btn-sm" onclick="handleParseJD()">
              <i class="fas fa-magic"></i>
              AI智能解析
            </button>
          </div>
          <div class="form-group">
            <textarea class="form-textarea" name="jd" id="jdInput" placeholder="粘贴JD文本，AI将自动提取关键信息..." rows="8"></textarea>
            <div class="text-xs text-gray-500 mt-2">
              <i class="fas fa-lightbulb mr-1"></i>
              AI将自动提取：岗位职责、技能要求、薪资范围
            </div>
          </div>
        </div>

        <!-- 其他信息 -->
        <div class="form-section mt-6">
          <h3 class="text-sm font-bold text-gray-900 mb-3">其他信息</h3>

          <div class="form-group">
            <label class="form-label">联系人</label>
            <input type="text" class="form-input" name="contact" placeholder="HR姓名和联系方式">
          </div>

          <div class="form-group">
            <label class="form-label">备注</label>
            <textarea class="form-textarea" name="remark" placeholder="内推人、岗位亮点等" rows="3"></textarea>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="bottom-actions">
          <button type="button" class="btn btn-secondary btn-block" onclick="navigateTo('home')">
            取消
          </button>
          <button type="submit" class="btn btn-primary btn-block">
            保存
          </button>
        </div>
      </form>
    </div>
  `;
}

// ==================== 岗位详情页 ====================
function renderJobDetailPage() {
  const job = AppState.selectedJob;
  if (!job) {
    return renderHomePage();
  }

  return `
    <div class="page-header">
      <button class="back-btn" onclick="navigateTo('home')">
        <i class="fas fa-chevron-left"></i>
      </button>
      <h1>岗位详情</h1>
      <button class="back-btn" onclick="showJobMenu(${job.id})">
        <i class="fas fa-ellipsis-v"></i>
      </button>
    </div>

    <div class="main-content">
      <!-- 基础信息卡片 -->
      <div class="card">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h2 class="text-xl font-bold text-gray-900 mb-1">${job.company}</h2>
            <p class="text-base text-gray-600">${job.position}</p>
          </div>
          <span class="status-badge ${StatusMap[job.status].class}">${StatusMap[job.status].text}</span>
        </div>

        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div class="text-gray-500 mb-1"><i class="fas fa-map-marker-alt mr-1"></i>地点</div>
            <div class="font-medium">${job.location}</div>
          </div>
          <div>
            <div class="text-gray-500 mb-1"><i class="fas fa-yen-sign mr-1"></i>薪资</div>
            <div class="font-medium">${job.salary}</div>
          </div>
          <div>
            <div class="text-gray-500 mb-1"><i class="fas fa-road mr-1"></i>渠道</div>
            <div class="font-medium">${job.channel}</div>
          </div>
          <div>
            <div class="text-gray-500 mb-1"><i class="fas fa-calendar mr-1"></i>投递日期</div>
            <div class="font-medium">${job.applyDate}</div>
          </div>
        </div>
      </div>

      <!-- AI匹配度分析卡片 -->
      ${job.aiMatchScore ? `
        <div class="ai-card fade-in">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-lg">🎯</span>
            <span class="font-bold text-gray-900">AI 岗位匹配度分析</span>
          </div>

          <div class="match-score">
            <div class="match-score-item">
              <div class="match-score-label">技能</div>
              <div class="match-score-value ${job.aiMatchScore.skills >= 80 ? 'high' : 'medium'}">${job.aiMatchScore.skills}%</div>
            </div>
            <div class="match-score-item">
              <div class="match-score-label">经验</div>
              <div class="match-score-value ${job.aiMatchScore.experience >= 80 ? 'high' : 'medium'}">${job.aiMatchScore.experience}%</div>
            </div>
            <div class="match-score-item">
              <div class="match-score-label">学历</div>
              <div class="match-score-value high">${job.aiMatchScore.education}%</div>
            </div>
            <div class="match-score-item">
              <div class="match-score-label">薪资</div>
              <div class="match-score-value ${job.aiMatchScore.salary >= 80 ? 'high' : job.aiMatchScore.salary >= 60 ? 'medium' : 'low'}">${job.aiMatchScore.salary}%</div>
            </div>
          </div>

          <div class="mb-3">
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-700">总体匹配度</span>
              <span class="font-bold text-purple-600">${job.aiMatchScore.overall}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-bar-fill" style="width: ${job.aiMatchScore.overall}%"></div>
            </div>
          </div>

          <div class="space-y-2 mb-3">
            <div class="flex items-start gap-2 text-sm">
              <span class="text-green-600">✅</span>
              <span class="text-gray-700">优势：学历完全符合要求</span>
            </div>
            <div class="flex items-start gap-2 text-sm">
              <span class="text-orange-600">⚠️</span>
              <span class="text-gray-700">建议：补充更多项目经验</span>
            </div>
          </div>

          <button class="btn btn-outline btn-block btn-sm" onclick="showMatchDetail()">
            查看详细分析
          </button>
        </div>
      ` : ''}

      <!-- 进度时间线 -->
      <div class="card">
        <h3 class="text-sm font-bold text-gray-900 mb-3">进度时间线</h3>
        <div class="space-y-3">
          ${job.timeline && job.timeline.length > 0 ? job.timeline.map((item, index) => `
            <div class="flex gap-3">
              <div class="flex flex-col items-center">
                <div class="w-3 h-3 rounded-full ${index === 0 ? 'bg-purple-600' : 'bg-gray-300'}"></div>
                ${index < job.timeline.length - 1 ? '<div class="w-0.5 flex-1 bg-gray-200"></div>' : ''}
              </div>
              <div class="flex-1 pb-3">
                <div class="text-sm font-medium text-gray-900">${item.status}</div>
                <div class="text-xs text-gray-500">${item.date} ${item.desc ? '- ' + item.desc : ''}</div>
              </div>
            </div>
          `).join('') : '<div class="text-sm text-gray-500">暂无进度记录</div>'}
        </div>
      </div>

      <!-- JD内容 -->
      ${job.jd ? `
        <div class="card">
          <h3 class="text-sm font-bold text-gray-900 mb-3">岗位JD</h3>
          <div class="text-sm text-gray-700 whitespace-pre-line">${job.jd}</div>
        </div>
      ` : ''}

      <!-- 操作按钮 -->
      <div class="bottom-actions">
        <button class="btn btn-secondary" onclick="editJob(${job.id})">
          <i class="fas fa-edit"></i>
          编辑
        </button>
        <button class="btn btn-primary" onclick="addInterview(${job.id})">
          <i class="fas fa-plus"></i>
          添加面试
        </button>
      </div>
    </div>
  `;
}

// ==================== 面试列表页 ====================
function renderInterviewsPage() {
  const interviews = DataUtils.getInterviews();
  const upcoming = interviews.filter(i => i.status === 'upcoming');
  const completed = interviews.filter(i => i.status === 'completed');

  return `
    <div class="page-header">
      <h1>我的面试</h1>
      <div style="width: 32px;"></div>
    </div>

    <div class="main-content">
      <!-- Tab切换 -->
      <div class="flex border-b border-gray-200 mb-4">
        <button class="flex-1 py-3 text-sm font-medium ${true ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}">
          即将到来 (${upcoming.length})
        </button>
        <button class="flex-1 py-3 text-sm font-medium ${false ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}">
          已完成 (${completed.length})
        </button>
      </div>

      <!-- AI准备清单卡片 -->
      ${upcoming.length > 0 ? `
        <div class="ai-card fade-in">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <span class="text-lg">⏰</span>
              <span class="font-bold text-gray-900">面试倒计时：${DateFormat.relative(upcoming[0].date)}</span>
            </div>
            <span class="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
              高优先级
            </span>
          </div>

          <div class="text-sm text-gray-700 mb-4">
            <strong>${upcoming[0].company} - ${upcoming[0].position}（${upcoming[0].round}）</strong>
          </div>

          ${upcoming[0].aiPrepList && upcoming[0].aiPrepList.length > 0 ? `
            <div class="bg-white rounded-lg p-3 mb-3">
              <div class="text-sm font-semibold text-gray-900 mb-2">📋 AI准备清单</div>
              <div class="space-y-2">
                ${upcoming[0].aiPrepList.slice(0, 4).map(item => `
                  <label class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" ${item.completed ? 'checked' : ''} class="w-4 h-4 text-purple-600 rounded" onchange="togglePrepItem(${upcoming[0].id}, ${item.id})">
                    <span class="${item.completed ? 'line-through text-gray-400' : ''}">${item.text}</span>
                  </label>
                `).join('')}
              </div>
            </div>

            <button class="btn btn-primary btn-block" onclick="startMockInterview(${upcoming[0].id})">
              <i class="fas fa-comments"></i>
              开始模拟面试
            </button>
          ` : ''}
        </div>
      ` : ''}

      <!-- 面试列表 -->
      <div class="space-y-3">
        ${upcoming.length > 0 ? upcoming.map(interview => `
          <div class="card clickable" onclick="showInterviewDetail(${interview.id})">
            <div class="flex items-start justify-between mb-2">
              <div>
                <h3 class="font-bold text-gray-900 mb-1">${interview.company}</h3>
                <p class="text-sm text-gray-600">${interview.position} - ${interview.round}</p>
              </div>
              <span class="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                即将到来
              </span>
            </div>
            <div class="flex items-center gap-4 text-xs text-gray-500">
              <span><i class="fas fa-calendar mr-1"></i>${interview.date}</span>
              <span><i class="fas fa-clock mr-1"></i>${interview.time}</span>
              <span><i class="fas fa-map-marker-alt mr-1"></i>${interview.location}</span>
            </div>
          </div>
        `).join('') : `
          <div class="empty-state">
            <i class="fas fa-calendar-check text-6xl mb-4"></i>
            <p>暂无即将到来的面试</p>
          </div>
        `}
      </div>
    </div>

    ${renderTabBar()}
  `;
}

// ==================== 面经管理页 ====================
function renderExperiencePage() {
  const experiences = DataUtils.getExperiences();
  const favorites = experiences.filter(e => e.isFavorite);

  return `
    <div class="page-header">
      <h1>面经管理</h1>
      <button class="btn btn-primary btn-sm" onclick="showAddExperience()">
        <i class="fas fa-plus mr-1"></i>
        添加
      </button>
    </div>

    <div class="main-content">
      <!-- 搜索框 -->
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input type="text" placeholder="搜索公司或岗位..." onchange="handleSearchExp(this.value)">
      </div>

      <!-- Tab切换 -->
      <div class="flex border-b border-gray-200 mb-4">
        <button class="flex-1 py-3 text-sm font-medium ${true ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}">
          全部 (${experiences.length})
        </button>
        <button class="flex-1 py-3 text-sm font-medium ${false ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}">
          我的收藏 (${favorites.length})
        </button>
      </div>

      <!-- 面经列表 -->
      <div class="space-y-3">
        ${experiences.length > 0 ? experiences.map(exp => `
          <div class="card">
            <div class="flex items-start justify-between mb-2">
              <div>
                <h3 class="font-bold text-gray-900 mb-1">${exp.company} - ${exp.position}</h3>
                <p class="text-xs text-gray-500">${exp.round} | ${exp.date}</p>
              </div>
              <button onclick="toggleFavorite(${exp.id})" class="text-${exp.isFavorite ? 'yellow' : 'gray'}-400">
                <i class="fas fa-star"></i>
              </button>
            </div>

            <div class="flex flex-wrap gap-2 mb-3">
              ${exp.tags.map(tag => `
                <span class="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">${tag}</span>
              `).join('')}
            </div>

            <div class="text-sm text-gray-700 line-clamp-3 mb-3">
              ${exp.content.substring(0, 150)}...
            </div>

            <div class="flex gap-2">
              <button class="btn btn-secondary btn-sm" onclick="viewExperience(${exp.id})">
                查看详情
              </button>
              <button class="btn btn-outline btn-sm" onclick="shareExperience(${exp.id})">
                <i class="fas fa-share-alt"></i>
                分享
              </button>
            </div>
          </div>
        `).join('') : `
          <div class="empty-state">
            <i class="fas fa-book text-6xl mb-4"></i>
            <p>暂无面经记录</p>
          </div>
        `}
      </div>
    </div>

    ${renderTabBar()}
  `;
}

// ==================== AI助手页 ====================
function renderAIAssistantPage() {
  const conversations = DataUtils.getConversations();

  return `
    <div class="page-header">
      <h1>AI求职助手</h1>
      <button class="back-btn" onclick="clearChatHistory()">
        <i class="fas fa-trash-alt"></i>
      </button>
    </div>

    <div class="main-content" style="padding-bottom: 120px;">
      <!-- 欢迎卡片 -->
      ${conversations.length <= 1 ? `
        <div class="ai-card fade-in">
          <div class="flex items-start gap-3">
            <div class="w-12 h-12 ai-gradient rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-2xl">🤖</span>
            </div>
            <div class="flex-1">
              <h2 class="text-lg font-bold text-gray-900 mb-1">欢迎使用AI求职助手！</h2>
              <p class="text-sm text-gray-600">我可以帮你准备面试、优化简历、分析岗位匹配度</p>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3 mt-4">
            <button class="bg-white rounded-xl p-3 text-center border border-gray-200 hover:border-purple-300 transition-colors" onclick="askAI('如何准备前端岗位面试？')">
              <div class="text-2xl mb-1">📝</div>
              <div class="text-xs text-gray-700">简历优化</div>
            </button>
            <button class="bg-white rounded-xl p-3 text-center border border-gray-200 hover:border-purple-300 transition-colors" onclick="askAI('面试前如何准备？')">
              <div class="text-2xl mb-1">💡</div>
              <div class="text-xs text-gray-700">面试准备</div>
            </button>
            <button class="bg-white rounded-xl p-3 text-center border border-gray-200 hover:border-purple-300 transition-colors" onclick="askAI('帮我分析岗位匹配度')">
              <div class="text-2xl mb-1">📊</div>
              <div class="text-xs text-gray-700">匹配分析</div>
            </button>
          </div>
        </div>

        <!-- 快速问题 -->
        <div class="mt-5">
          <h3 class="text-sm font-semibold text-gray-700 mb-3">快速提问</h3>
          <div class="space-y-2">
            <button class="w-full text-left bg-white rounded-xl p-4 border border-gray-200 hover:border-purple-300 transition-colors" onclick="askAI('如何准备前端岗位面试？')">
              <div class="flex items-center gap-2">
                <span class="text-purple-500">💬</span>
                <span class="text-sm text-gray-700">如何准备前端岗位面试？</span>
              </div>
            </button>
            <button class="w-full text-left bg-white rounded-xl p-4 border border-gray-200 hover:border-purple-300 transition-colors" onclick="askAI('简历如何突出项目经验？')">
              <div class="flex items-center gap-2">
                <span class="text-purple-500">💬</span>
                <span class="text-sm text-gray-700">简历如何突出项目经验？</span>
              </div>
            </button>
            <button class="w-full text-left bg-white rounded-xl p-4 border border-gray-200 hover:border-purple-300 transition-colors" onclick="askAI('面试后如何跟进HR？')">
              <div class="flex items-center gap-2">
                <span class="text-purple-500">💬</span>
                <span class="text-sm text-gray-700">面试后如何跟进HR？</span>
              </div>
            </button>
          </div>
        </div>
      ` : ''}

      <!-- 对话历史 -->
      <div class="mt-6 space-y-4" id="chatContainer">
        ${conversations.map(msg => {
          if (msg.role === 'user') {
            return `
              <div class="flex justify-end">
                <div class="message-bubble user">
                  ${msg.content}
                </div>
              </div>
            `;
          } else {
            return `
              <div class="flex gap-3">
                <div class="w-8 h-8 ai-gradient rounded-full flex items-center justify-center flex-shrink-0">
                  <span class="text-sm">🤖</span>
                </div>
                <div class="flex-1">
                  <div class="message-bubble ai">
                    <div class="text-sm text-gray-800 whitespace-pre-line">${msg.content}</div>
                    ${msg.actions ? `
                      <div class="flex gap-2 mt-3">
                        ${msg.actions.map(action => `
                          <button class="bg-white border border-purple-300 text-purple-600 text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-purple-50 transition-colors" onclick="${action.action}">
                            ${action.text}
                          </button>
                        `).join('')}
                      </div>
                    ` : ''}
                  </div>
                </div>
              </div>
            `;
          }
        }).join('')}
      </div>

      <!-- 思考动画容器 -->
      <div id="thinkingIndicator" class="hidden">
        <div class="flex gap-3">
          <div class="w-8 h-8 ai-gradient rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-sm">🤖</span>
          </div>
          <div class="ai-gradient-subtle rounded-2xl rounded-tl-sm border-l-2 border-purple-500 px-4 py-3">
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600">AI正在思考</span>
              <div class="thinking-dots">
                <div class="thinking-dot"></div>
                <div class="thinking-dot"></div>
                <div class="thinking-dot"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部输入框 -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3" style="max-width: 428px; margin: 0 auto;">
      <div class="flex items-center gap-2">
        <button class="p-2 text-gray-500 hover:text-purple-500">
          <i class="fas fa-paperclip text-xl"></i>
        </button>
        <input
          type="text"
          id="chatInput"
          placeholder="输入你的问题..."
          class="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          onkeypress="if(event.key==='Enter')sendMessage()"
        >
        <button class="ai-gradient text-white rounded-full p-2.5" onclick="sendMessage()">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>

    ${renderTabBar()}
  `;
}

// ==================== 个人中心页 ====================
function renderProfilePage() {
  const user = DataUtils.getUser();
  const jobs = DataUtils.getJobs();
  const experiences = DataUtils.getExperiences();

  const userData = {
    nickname: user.nickname,
    avatar: user.avatar,
    stats: {
      totalJobs: jobs.length,
      interviewJobs: jobs.filter(j => j.status === 'interview').length,
      experiences: experiences.length,
      favorites: experiences.filter(e => e.isFavorite).length
    }
  };

  return `
    <div class="page-header">
      <h1>个人中心</h1>
      <button class="back-btn" onclick="showSettings()">
        <i class="fas fa-cog"></i>
      </button>
    </div>

    <div class="main-content">
      <!-- 用户信息卡片 -->
      <div class="card ai-gradient-subtle">
        <div class="flex items-center gap-4">
          <img src="${userData.avatar}" alt="头像" class="w-16 h-16 rounded-full">
          <div class="flex-1">
            <h2 class="text-lg font-bold text-gray-900 mb-1">${userData.nickname}</h2>
            <p class="text-sm text-gray-600">求职路上，AI与你同行</p>
          </div>
          <button class="btn btn-sm btn-secondary" onclick="editProfile()">
            编辑
          </button>
        </div>
      </div>

      <!-- 数据统计 -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="card text-center">
          <div class="text-2xl font-bold text-purple-600 mb-1">${userData.stats.totalJobs}</div>
          <div class="text-xs text-gray-600">全部岗位</div>
        </div>
        <div class="card text-center">
          <div class="text-2xl font-bold text-blue-600 mb-1">${userData.stats.interviewJobs}</div>
          <div class="text-xs text-gray-600">面试中</div>
        </div>
        <div class="card text-center">
          <div class="text-2xl font-bold text-green-600 mb-1">${userData.stats.experiences}</div>
          <div class="text-xs text-gray-600">面经</div>
        </div>
        <div class="card text-center">
          <div class="text-2xl font-bold text-yellow-600 mb-1">${userData.stats.favorites}</div>
          <div class="text-xs text-gray-600">收藏</div>
        </div>
      </div>

      <!-- 功能菜单 -->
      <div class="card">
        <div class="space-y-1">
          <button class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors" onclick="navigateTo('home')">
            <div class="flex items-center gap-3">
              <i class="fas fa-briefcase text-purple-600"></i>
              <span class="text-sm text-gray-700">我的岗位</span>
            </div>
            <i class="fas fa-chevron-right text-gray-400"></i>
          </button>
          <button class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors" onclick="navigateTo('interviews')">
            <div class="flex items-center gap-3">
              <i class="fas fa-calendar text-blue-600"></i>
              <span class="text-sm text-gray-700">面试记录</span>
            </div>
            <i class="fas fa-chevron-right text-gray-400"></i>
          </button>
          <button class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors" onclick="navigateTo('experience')">
            <div class="flex items-center gap-3">
              <i class="fas fa-book text-green-600"></i>
              <span class="text-sm text-gray-700">收藏面经</span>
            </div>
            <i class="fas fa-chevron-right text-gray-400"></i>
          </button>
          <button class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors" onclick="showSummary()">
            <div class="flex items-center gap-3">
              <i class="fas fa-clipboard-list text-orange-600"></i>
              <span class="text-sm text-gray-700">面试总结</span>
            </div>
            <i class="fas fa-chevron-right text-gray-400"></i>
          </button>
        </div>
      </div>

      <!-- AI功能说明卡片 -->
      <div class="ai-card">
        <div class="flex items-center gap-2 mb-3">
          <span class="text-lg">✨</span>
          <span class="font-bold text-gray-900">AI 增强功能</span>
        </div>
        <div class="text-sm text-gray-700 space-y-2">
          <div class="flex items-start gap-2">
            <span class="text-purple-600">•</span>
            <span>JD 智能解析 - 自动提取关键信息</span>
          </div>
          <div class="flex items-start gap-2">
            <span class="text-purple-600">•</span>
            <span>岗位匹配度分析 - 多维度评估</span>
          </div>
          <div class="flex items-start gap-2">
            <span class="text-purple-600">•</span>
            <span>AI 面试准备 - 智能生成清单</span>
          </div>
          <div class="flex items-start gap-2">
            <span class="text-purple-600">•</span>
            <span>AI 助手对话 - 随时解答疑问</span>
          </div>
        </div>
      </div>

      <!-- 系统设置 -->
      <div class="card">
        <div class="space-y-1">
          <button class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors" onclick="showNotificationSettings()">
            <div class="flex items-center gap-3">
              <i class="fas fa-bell text-gray-600"></i>
              <span class="text-sm text-gray-700">消息提醒</span>
            </div>
            <i class="fas fa-chevron-right text-gray-400"></i>
          </button>
          <button class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors" onclick="showPrivacySettings()">
            <div class="flex items-center gap-3">
              <i class="fas fa-shield-alt text-gray-600"></i>
              <span class="text-sm text-gray-700">隐私设置</span>
            </div>
            <i class="fas fa-chevron-right text-gray-400"></i>
          </button>
          <button class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors" onclick="showAbout()">
            <div class="flex items-center gap-3">
              <i class="fas fa-info-circle text-gray-600"></i>
              <span class="text-sm text-gray-700">关于我们</span>
            </div>
            <i class="fas fa-chevron-right text-gray-400"></i>
          </button>
        </div>
      </div>
    </div>

    ${renderTabBar()}
  `;
}

// ==================== 渲染TabBar ====================
function renderTabBar() {
  return `
    <div class="tabbar">
      ${tabBarItems.map(item => `
        <button
          class="tab-item ${AppState.currentPage === item.id ? 'active' : ''}"
          onclick="navigateTo('${item.id}')"
        >
          ${item.isAI ? `
            <div class="relative">
              <div class="w-10 h-10 ai-gradient rounded-full flex items-center justify-center mx-auto">
                <span class="text-lg">🤖</span>
              </div>
            </div>
          ` : `
            <i class="fas ${item.icon}"></i>
          `}
          <span>${item.label}</span>
        </button>
      `).join('')}
    </div>
  `;
}

// ==================== 路由导航 ====================
function navigateTo(page, params = {}) {
  AppState.currentPage = page;

  if (page === 'job-detail' && params.id) {
    AppState.selectedJob = DataUtils.getJobById(params.id);
  }

  render();
  window.scrollTo(0, 0);
}

// ==================== 渲染应用 ====================
function render() {
  const app = document.getElementById('app');
  const renderFn = pages[AppState.currentPage];

  if (renderFn) {
    app.innerHTML = renderFn();
  } else {
    app.innerHTML = renderHomePage();
  }
}

// ==================== 事件处理函数 ====================

// 设置筛选器
function setFilter(filter) {
  AppState.currentFilter = filter;
  render();
}

// 搜索岗位
function handleSearch(value) {
  console.log('搜索:', value);
  // TODO: 实现搜索逻辑
}

// AI解析JD
async function handleParseJD() {
  const jdInput = document.getElementById('jdInput');
  const jdText = jdInput.value.trim();

  if (!jdText) {
    Toast.error('请先输入JD内容');
    return;
  }

  Toast.loading('AI正在解析JD...');

  try {
    const result = await AI.parseJD(jdText);
    Toast.hideLoading();

    // 填充表单
    const form = document.getElementById('jobForm');
    if (result.location) form.elements['location'].value = result.location;
    if (result.salaryRange) form.elements['salary'].value = result.salaryRange;

    Toast.success('JD解析成功！已自动填充关键信息');

    // 显示解析结果
    Modal.alert('解析结果', `
      <div class="text-left text-sm">
        <p class="mb-2"><strong>岗位职责：</strong></p>
        <p class="text-gray-600 mb-3">${result.responsibilities}</p>
        <p class="mb-2"><strong>技能要求：</strong></p>
        <div class="flex flex-wrap gap-2">
          ${result.skills.map(s => `<span class="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">${s}</span>`).join('')}
        </div>
      </div>
    `);
  } catch (error) {
    Toast.hideLoading();
    Toast.error('解析失败，请重试');
  }
}

// 保存岗位
function handleSaveJob(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  const job = {
    company: formData.get('company'),
    position: formData.get('position'),
    channel: formData.get('channel'),
    location: formData.get('location'),
    salary: formData.get('salary'),
    applyDate: formData.get('applyDate'),
    jd: formData.get('jd'),
    contact: formData.get('contact'),
    remark: formData.get('remark'),
    status: 'pending'
  };

  DataUtils.addJob(job);
  Toast.success('岗位添加成功！');

  setTimeout(() => {
    navigateTo('home');
  }, 1000);
}

// 发送AI消息
async function sendMessage() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();

  if (!message) return;

  // 添加用户消息
  DataUtils.addMessage({ role: 'user', content: message });
  input.value = '';
  render();

  // 显示思考动画
  const thinking = document.getElementById('thinkingIndicator');
  if (thinking) thinking.classList.remove('hidden');

  // 滚动到底部
  setTimeout(() => {
    const container = document.getElementById('chatContainer');
    if (container) container.scrollTop = container.scrollHeight;
  }, 100);

  try {
    const response = await AI.respond(message);
    DataUtils.addMessage({ role: 'assistant', ...response });
    render();
  } catch (error) {
    Toast.error('AI响应失败，请重试');
  }

  // 滚动到底部
  setTimeout(() => {
    const container = document.getElementById('chatContainer');
    if (container) container.scrollTop = container.scrollHeight;
  }, 100);
}

// 快速提问
function askAI(question) {
  document.getElementById('chatInput').value = question;
  sendMessage();
}

// 清空对话历史
function clearChatHistory() {
  Modal.confirm('清空对话', '确定要清空所有对话记录吗？', () => {
    DataUtils.clearConversations();
    render();
    Toast.success('对话已清空');
  });
}

// 切换准备清单项
function togglePrepList(interviewId, itemId) {
  const interview = DataUtils.getInterviews().find(i => i.id === interviewId);
  if (interview && interview.aiPrepList) {
    const item = interview.aiPrepList.find(i => i.id === itemId);
    if (item) {
      item.completed = !item.completed;
    }
  }
}

// 切换面经收藏
function toggleFavorite(expId) {
  DataUtils.toggleFavorite(expId);
  render();
  Toast.success(DataUtils.getExperiences().find(e => e.id === expId).isFavorite ? '已收藏' : '已取消收藏');
}

// 初始化应用
App.init(() => {
  render();
});

// ==================== 补充的事件处理函数 ====================

// 显示设置菜单
function showSettingsMenu() {
  Modal.alert('设置', '更多功能开发中...');
}

// 编辑岗位
function editJob(id) {
  Modal.alert('提示', '编辑功能开发中...');
}

// 添加面试
function addInterview(jobId) {
  Modal.alert('提示', '添加面试功能开发中...');
}

// 显示岗位菜单
function showJobMenu(id) {
  Modal.confirm('岗位操作', '请选择操作', () => {
    // 删除岗位
    DataUtils.deleteJob(id);
    Toast.success('岗位已删除');
    navigateTo('home');
  });
}

// 显示匹配度详情
function showMatchDetail() {
  Modal.alert('匹配度分析', `
    <div class="text-left text-sm space-y-2">
      <p><strong>技能匹配度：</strong>您的技术栈与岗位要求高度匹配</p>
      <p><strong>经验匹配度：</strong>项目经验相关度较高</p>
      <p><strong>学历匹配度：</strong>完全符合要求</p>
      <p><strong>薪资匹配度：</strong>在预期范围内</p>
      <hr class="my-2">
      <p class="text-green-600"><strong>✅ 优势：</strong></p>
      <ul class="list-disc pl-5">
        <li>学历完全符合要求</li>
        <li>技术栈匹配度高</li>
        <li>项目经验相关</li>
      </ul>
      <p class="text-orange-600 mt-2"><strong>⚠️ 建议：</strong></p>
      <ul class="list-disc pl-5">
        <li>补充更多性能优化经验</li>
        <li>加强架构设计能力</li>
      </ul>
    </div>
  `);
}

// 显示面试详情
function showInterviewDetail(id) {
  Modal.alert('面试详情', '详细信息开发中...');
}

// 开始模拟面试
function startMockInterview(id) {
  navigateTo('ai-assistant');
  setTimeout(() => {
    askAI('开始模拟面试');
  }, 500);
}

// 搜索面经
function handleSearchExp(value) {
  console.log('搜索面经:', value);
}

// 添加面经
function showAddExperience() {
  Modal.alert('添加面经', '面经添加功能开发中...');
}

// 查看面经详情
function viewExperience(id) {
  const exp = DataUtils.getExperiences().find(e => e.id === id);
  if (exp) {
    Modal.alert(exp.company + ' - ' + exp.position, `
      <div class="text-left text-sm">
        <div class="mb-3">
          <span class="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">${exp.round}</span>
          <span class="text-gray-500 ml-2">${exp.date}</span>
        </div>
        <div class="whitespace-pre-line text-gray-700">${exp.content}</div>
      </div>
    `);
  }
}

// 分享面经
function shareExperience(id) {
  Toast.success('分享功能开发中...');
}

// 切换准备清单项
function togglePrepItem(interviewId, itemId) {
  const interview = DataUtils.getInterviews().find(i => i.id === interviewId);
  if (interview && interview.aiPrepList) {
    const item = interview.aiPrepList.find(i => i.id === itemId);
    if (item) {
      item.completed = !item.completed;
      render();
    }
  }
}

// 清空聊天历史
function clearChatHistory() {
  Modal.confirm('清空对话', '确定要清空所有对话记录吗？', () => {
    DataUtils.clearConversations();
    render();
    Toast.success('对话已清空');
  });
}

// 编辑个人资料
function editProfile() {
  Modal.alert('编辑资料', '个人资料编辑功能开发中...');
}

// 显示设置
function showSettings() {
  Modal.alert('系统设置', '设置功能开发中...');
}

// 显示通知设置
function showNotificationSettings() {
  Modal.alert('消息提醒', '消息提醒设置开发中...');
}

// 显示隐私设置
function showPrivacySettings() {
  Modal.alert('隐私设置', '隐私设置功能开发中...');
}

// 显示关于
function showAbout() {
  Modal.alert('关于我们', `
    <div class="text-center text-sm">
      <p class="text-lg font-bold mb-2">求职追踪助手 AI版</p>
      <p class="text-gray-600 mb-2">版本 1.0.0</p>
      <p class="text-gray-500">一款AI增强的求职管理工具</p>
      <p class="text-gray-500 mt-2">© 2025 All Rights Reserved</p>
    </div>
  `);
}

// 显示总结
function showSummary() {
  Modal.alert('面试总结', '面试总结功能开发中...');
}

// AI操作函数
const view_guide = () => Modal.alert('面试准备指南', '详细指南开发中...');
const mock_interview = () => askAI('开始模拟面试');
const view_template = () => Modal.alert('简历模板', '模板功能开发中...');
const diagnose_resume = () => Modal.alert('简历诊断', '简历诊断功能开发中...');
const view_email_template = () => Modal.alert('邮件模板', '邮件模板功能开发中...');
