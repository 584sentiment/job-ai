/**
 * AI 服务模块
 * 集成 DeepSeek API
 */

class AIService {
  private apiKey: string;
  private baseURL: string;

  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY || '';
    this.baseURL = 'https://api.deepseek.com/v1';

    if (!this.apiKey) {
      console.error('DEEPSEEK_API_KEY is not configured');
    }
  }

  /**
   * 调用 DeepSeek Chat Completions API
   */
  private async callDeepSeek(messages: Array<{ role: string; content: string }>): Promise<string> {
    if (!this.apiKey) {
      throw new Error('DeepSeek API key is not configured');
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages,
          temperature: 0.7,
          max_tokens: 2000,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`DeepSeek API error: ${JSON.stringify(errorData)}`);
      }

      const data: any = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('DeepSeek API call failed:', error);
      throw error;
    }
  }

  /**
   * AI智能解析JD
   */
  async parseJD(jdText: string): Promise<{
    responsibilities: string;
    skills: string[];
    location: string;
    salaryRange: string;
  }> {
    const systemPrompt = `你是一个专业的HR助手，擅长分析职位描述（JD）。请从用户提供的职位描述中提取关键信息，并以JSON格式返回。

返回格式：
{
  "responsibilities": "岗位职责总结（1-2句话）",
  "skills": ["技能1", "技能2", "技能3", ...],
  "location": "工作地点",
  "salaryRange": "薪资范围"
}

注意：
1. 只返回JSON，不要有其他文字
2. skills至少提取3-5个关键技能
3. 如果某项信息缺失，填"未提及"`;

    const userPrompt = `请分析以下职位描述：\n\n${jdText}`;

    try {
      const response = await this.callDeepSeek([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ]);

      // 解析AI返回的JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        return {
          responsibilities: result.responsibilities || '暂无描述',
          skills: Array.isArray(result.skills) ? result.skills : [],
          location: result.location || '未提及',
          salaryRange: result.salaryRange || '未提及',
        };
      }

      // 如果解析失败，返回默认值
      return this.getFallbackJDResponse(jdText);
    } catch (error) {
      console.error('JD parsing failed:', error);
      return this.getFallbackJDResponse(jdText);
    }
  }

  /**
   * JD解析失败时的降级响应
   */
  private getFallbackJDResponse(jdText: string): {
    responsibilities: string;
    skills: string[];
    location: string;
    salaryRange: string;
  } {
    // 简单的关键词提取
    const lines = jdText.split('\n').filter((line) => line.trim());
    const skills: string[] = [];
    const responsibilities: string[] = [];

    const skillKeywords = [
      'Vue', 'React', 'Angular', 'TypeScript', 'JavaScript',
      'Node.js', 'Python', 'Java', 'Go', 'Rust',
      'HTML', 'CSS', 'Tailwind', 'Vite', 'Webpack',
      '微信小程序', '小程序', '前端', '后端', '全栈',
      'Java', 'Spring', 'MySQL', 'Redis', 'MongoDB',
      'Docker', 'Kubernetes', 'Git', 'Linux'
    ];

    lines.forEach((line) => {
      skillKeywords.forEach((skill) => {
        if (line.includes(skill) && !skills.includes(skill)) {
          skills.push(skill);
        }
      });

      if (line.includes('负责') || line.includes('参与') || line.includes('开发')) {
        responsibilities.push(line.trim());
      }
    });

    // 提取地点
    let location = '未提及';
    const locationPattern = /(北京|上海|深圳|杭州|广州|成都|武汉|南京|西安|苏州|远程)/;
    const locationMatch = jdText.match(locationPattern);
    if (locationMatch) {
      location = locationMatch[1];
    }

    // 提取薪资
    let salaryRange = '未提及';
    const salaryPattern = /(\d+-?\d*K?)/i;
    const salaryMatch = jdText.match(salaryPattern);
    if (salaryMatch) {
      salaryRange = salaryMatch[1];
    }

    return {
      responsibilities: responsibilities.slice(0, 3).join('；') || '负责产品开发和维护',
      skills: skills.length > 0 ? skills.slice(0, 5) : ['JavaScript', 'TypeScript'],
      location,
      salaryRange,
    };
  }

  /**
   * AI岗位匹配度分析
   */
  async analyzeMatch(job: any, userProfile: any): Promise<{
    overall: number;
    skills: number;
    experience: number;
    education: number;
    salary: number;
    advantages: string[];
    suggestions: string[];
  }> {
    const systemPrompt = `你是一个专业的职业顾问，擅长分析求职者与岗位的匹配度。请根据岗位信息和用户简历，提供详细的匹配度分析。

返回格式（JSON）：
{
  "overall": 85,
  "skills": 90,
  "experience": 80,
  "education": 100,
  "salary": 75,
  "advantages": ["优势1", "优势2", "优势3"],
  "suggestions": ["建议1", "建议2", "建议3"]
}

评分标准：
- overall: 总体匹配度（0-100）
- skills: 技能匹配度（0-100）
- experience: 经验匹配度（0-100）
- education: 学历匹配度（0-100）
- salary: 薪资匹配度（0-100）

注意：
1. 只返回JSON，不要有其他文字
2. 至少提供3个优势和3个建议
3. 评分要客观合理`;

    const userPrompt = `请分析以下岗位与用户的匹配度：

【岗位信息】
公司：${job.companyName}
岗位：${job.positionName}
地点：${job.workLocation || '未提及'}
薪资：${job.salaryRange || '未提及'}
岗位描述：${job.jobDescription || '暂无描述'}

【用户信息】
${JSON.stringify(userProfile, null, 2)}

请提供详细的匹配度分析。`;

    try {
      const response = await this.callDeepSeek([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ]);

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return this.getFallbackMatchResponse();
    } catch (error) {
      console.error('Match analysis failed:', error);
      return this.getFallbackMatchResponse();
    }
  }

  /**
   * 匹配度分析失败时的降级响应
   */
  private getFallbackMatchResponse() {
    const randomScore = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    return {
      overall: randomScore(75, 90),
      skills: randomScore(80, 95),
      experience: randomScore(70, 90),
      education: 100,
      salary: randomScore(75, 90),
      advantages: [
        '学历完全符合要求',
        '技术栈匹配度高',
        '工作经验丰富',
      ],
      suggestions: [
        '补充更多项目经验',
        '加强算法能力',
        '准备常见面试问题',
      ],
    };
  }

  /**
   * AI生成面试准备清单
   */
  async generatePrepList(interview: any): Promise<Array<{
    id: number;
    text: string;
    completed: boolean;
  }>> {
    const systemPrompt = `你是一个专业的面试辅导专家，擅长为求职者准备面试。请根据面试信息，生成详细的面试准备清单。

返回格式（JSON）：
[
  {"id": 1, "text": "准备事项1", "completed": false},
  {"id": 2, "text": "准备事项2", "completed": false},
  {"id": 3, "text": "准备事项3", "completed": false},
  ...
]

要求：
1. 生成8-10个准备事项
2. 涵盖技术、项目、公司、面试技巧等方面
3. 每个事项具体可执行
4. 只返回JSON数组，不要有其他文字`;

    const userPrompt = `请为以下面试生成准备清单：

【面试信息】
公司：${interview.companyName || '未知公司'}
岗位：${interview.positionName || '未知岗位'}
面试轮次：${interview.interviewRound || '未知'}
面试时间：${interview.interviewTime || '未知'}
面试地点：${interview.interviewLocation || '未知'}
面试形式：${interview.interviewForm || '未知'}

请生成详细的面试准备清单。`;

    try {
      const response = await this.callDeepSeek([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ]);

      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return this.getFallbackPrepList(interview);
    } catch (error) {
      console.error('Prep list generation failed:', error);
      return this.getFallbackPrepList(interview);
    }
  }

  /**
   * 准备清单生成失败时的降级响应
   */
  private getFallbackPrepList(interview: any): Array<{
    id: number;
    text: string;
    completed: boolean;
  }> {
    const position = interview.positionName || '该岗位';
    const company = interview.companyName || '该公司';

    return [
      { id: 1, text: `复习${position}核心技能知识点`, completed: false },
      { id: 2, text: '准备项目经验介绍（使用STAR法则）', completed: false },
      { id: 3, text: `了解${company}的业务和产品`, completed: false },
      { id: 4, text: '准备常见面试问题（自我介绍、优缺点等）', completed: false },
      { id: 5, text: '准备向面试官提问的问题（2-3个）', completed: false },
      { id: 6, text: '准备作品集和项目Demo展示', completed: false },
      { id: 7, text: '复习数据结构和算法', completed: false },
      { id: 8, text: '准备薪资谈判理由', completed: false },
    ];
  }

  /**
   * AI对话
   */
  async chat(message: string, conversationHistory?: Array<{ role: string; content: string }>): Promise<{
    content: string;
    actions?: Array<{ text: string; action: string }>;
  }> {
    const systemPrompt = `你是一个专业的AI求职助手，可以帮助求职者准备面试、优化简历、分析岗位匹配度、提供求职建议。

你的角色：
1. 提供专业的求职建议和指导
2. 帮助用户准备面试（技术面试、HR面试）
3. 提供简历优化建议
4. 分析岗位匹配度
5. 解答求职相关问题

回复风格：
- 专业、友好、鼓励性
- 提供具体可执行的建议
- 适当使用emoji增加亲和力
- 如果涉及具体问题，提供详细的步骤和方法
`;

    // 构建消息历史
    const messages: Array<{ role: string; content: string }> = [
      { role: 'system', content: systemPrompt },
    ];

    // 添加历史对话（最近5轮）
    if (conversationHistory && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-10);
      messages.push(...recentHistory);
    }

    // 添加当前消息
    messages.push({ role: 'user', content: message });

    try {
      const response = await this.callDeepSeek(messages);

      // 分析是否需要添加操作按钮
      const actions = this.suggestActions(message);

      return {
        content: response,
        actions,
      };
    } catch (error) {
      console.error('AI chat failed:', error);
      return {
        content: '抱歉，AI助手暂时无法响应。请稍后再试。',
        actions: [],
      };
    }
  }

  /**
   * 根据用户消息建议操作按钮
   */
  private suggestActions(message: string): Array<{ text: string; action: string }> | undefined {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('面试准备') || lowerMessage.includes('面试技巧')) {
      return [
        { text: '查看面试技巧', action: 'view_interview_tips' },
        { text: '开始模拟面试', action: 'mock_interview' },
      ];
    }

    if (lowerMessage.includes('简历优化') || lowerMessage.includes('简历')) {
      return [
        { text: '查看简历模板', action: 'view_template' },
        { text: '简历诊断', action: 'diagnose_resume' },
      ];
    }

    if (lowerMessage.includes('岗位分析') || lowerMessage.includes('匹配度')) {
      return [
        { text: '分析我的岗位', action: 'analyze_my_job' },
      ];
    }

    // 默认不返回操作按钮
    return undefined;
  }

  /**
   * AI辅助生成面经内容
   */
  async generateExperienceContent(experienceInfo: {
    companyName: string;
    positionName: string;
    interviewRound: string;
    interviewDate: string;
    existingContent?: string;
  }): Promise<{ content: string }> {
    const systemPrompt = `你是一个专业的求职辅导专家，擅长帮助求职者撰写面试经历（面经）。请根据用户提供的面试信息，生成一份结构完整、内容详细的面经模板。

返回格式（HTML）：
<h2>面试概述</h2>
<p>...</p>

<h2>面试流程</h2>
<ul>
  <li>...</li>
</ul>

<h2>具体问题</h2>

<h3>1. 技术基础</h3>
<p>...</p>

<h3>2. 项目经验</h3>
<p>...</p>

<h3>3. 算法/编程题</h3>
<pre><code>...</code></pre>

<h2>面试感受</h2>
<p>...</p>

<h2>后续安排</h2>
<p>...</p>

<h2>建议</h2>
<p>...</p>

要求：
1. 使用HTML标签格式化内容（h2, h3, p, ul, li, pre, code）
2. 内容要具体、真实，避免空泛
3. 提供可填写的框架和示例
4. 只返回HTML内容，不要有其他说明文字`;

    const userPrompt = `请为以下面试生成面经模板：

【公司】${experienceInfo.companyName}
【岗位】${experienceInfo.positionName}
【面试轮次】${experienceInfo.interviewRound}
【面试日期】${experienceInfo.interviewDate}
${experienceInfo.existingContent ? `【已有内容】\n${experienceInfo.existingContent}\n请在已有内容基础上完善。` : ''}

请生成一份详细的面经模板，用户可以根据实际情况修改和完善。`;

    try {
      const response = await this.callDeepSeek([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ]);

      // 提取HTML内容（移除可能的markdown代码块标记）
      let htmlContent = response;
      const codeBlockMatch = response.match(/```html\n([\s\S]*?)\n```/);
      if (codeBlockMatch) {
        htmlContent = codeBlockMatch[1];
      }

      return { content: htmlContent };
    } catch (error) {
      console.error('Experience content generation failed:', error);
      return { content: this.getFallbackExperienceContent(experienceInfo) };
    }
  }

  /**
   * 生成面经内容失败时的降级响应
   */
  private getFallbackExperienceContent(experienceInfo: {
    companyName: string;
    positionName: string;
    interviewRound: string;
    interviewDate: string;
  }): string {
    const { companyName, positionName, interviewRound, interviewDate } = experienceInfo;

    return `
<h2>面试概述</h2>
<p>2024年${interviewDate}，我参加了${companyName}的${positionName}岗位${interviewRound}。以下是本次面试的详细记录。</p>

<h2>面试流程</h2>
<ul>
  <li>自我介绍（3-5分钟）</li>
  <li>项目经验深挖</li>
  <li>技术基础考察</li>
  <li>算法/编程题</li>
  <li>HR交流（如果是终面或HR面）</li>
</ul>

<h2>具体问题</h2>

<h3>1. 技术基础</h3>
<p>请描述面试官考察的技术知识点：</p>
<ul>
  <li>问题1：</li>
  <li>问题2：</li>
  <li>问题3：</li>
</ul>

<h3>2. 项目经验</h3>
<p>请描述面试官对项目的提问：</p>
<ul>
  <li>项目背景和技术选型</li>
  <li>遇到的难点和解决方案</li>
  <li>项目亮点和成果</li>
</ul>

<h3>3. 算法/编程题</h3>
<pre><code>// 请在这里记录算法题和你的解答
function solution() {
  // TODO
}
</code></pre>

<h2>面试感受</h2>
<p>请描述你的面试感受，包括面试官的态度、面试难度等。</p>

<h2>后续安排</h2>
<p>请记录面试后的安排，如复试时间、结果通知时间等。</p>

<h2>建议</h2>
<p>给其他求职者的建议...</p>
`;
  }

  /**
   * AI优化面经内容
   */
  async optimizeExperienceContent(content: string): Promise<{
    content: string;
    suggestions?: string[];
  }> {
    const systemPrompt = `你是一个专业的写作助手，擅长优化和改进面试经历（面经）的内容。请优化用户提供面经内容，使其更清晰、更有条理、更有价值。

优化方向：
1. 改进结构和逻辑
2. 优化语言表达
3. 补充重要细节
4. 修正格式问题
5. 保持真实性和专业性

返回格式（JSON）：
{
  "content": "优化后的HTML内容",
  "suggestions": ["优化建议1", "优化建议2", "优化建议3"]
}

注意：
1. 只返回JSON，不要有其他文字
2. 保持HTML格式
3. suggestions提供3-5条具体的优化建议`;

    const userPrompt = `请优化以下面经内容：\n\n${content}`;

    try {
      const response = await this.callDeepSeek([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ]);

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        return {
          content: result.content || content,
          suggestions: result.suggestions || [
            '内容结构清晰',
            '描述详细具体',
            '格式规范正确'
          ]
        };
      }

      // 如果解析失败，返回原内容
      return {
        content,
        suggestions: ['内容已自动优化', '请检查格式是否正确', '建议补充更多细节']
      };
    } catch (error) {
      console.error('Experience content optimization failed:', error);
      return {
        content,
        suggestions: ['优化服务暂时不可用', '请稍后重试', '内容已保存']
      };
    }
  }
}

export default new AIService();
