import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getSummariesPaginated, createSummary, updateSummary, deleteSummary, getSummaryById } from '@/api/summary'
import type { Summary, SummaryDisplay, SummaryCreateRequest, SummaryUpdateRequest } from '@job-ai/shared'

export const useSummariesStore = defineStore('summaries', () => {
    // 状态
    const summaries = ref<SummaryDisplay[]>([])
    const currentFilter = ref('all')
    const loading = ref(false)
    const total = ref(0)
    const currentPage = ref(1)
    const pageSize = ref(10)

    // 辅助函数：将API返回的Summary转换为前端显示的SummaryDisplay
    const mapSummaryToDisplay = (s: Summary): SummaryDisplay => {
        let weakness = ''
        let improvements = ''
        let status: 'pending' | 'completed' = 'pending'

        // 解析 content JSON
        // 假设 content 结构为 { weakness: string, improvements: string, status?: string, ... }
        // 如果 content 是字符串则尝试解析
        try {
            const contentObj = typeof s.content === 'string' ? JSON.parse(s.content) : s.content
            weakness = contentObj.weakness || contentObj.content || '' // 兼容舊字段
            improvements = Array.isArray(contentObj.improvements) ? contentObj.improvements.join(' ') : (contentObj.improvements || '')
            status = contentObj.status === 'completed' ? 'completed' : 'pending'
            var remark = contentObj.remark || ''
        } catch (e) {
            console.error('Failed to parse summary content', e)
        }

        // 颜色映射 logic (可以使用 hash 或随机，这里简单根据 round 映射)
        const colors = ['blue', 'green', 'orange', 'purple', 'red', 'indigo']
        const colorIndex = (s.companyName.length + (s.round?.length || 0)) % colors.length

        return {
            ...s,
            company: s.companyName,
            position: s.positionName,
            status, // 优先使用 content 中的状态
            weakness,
            improvements,
            comments: 0, // 暂时没有评论数据
            remark,
            color: colors[colorIndex],
            date: Number(s.date) // 确保是数字
        }
    }

    // 计算属性
    const filteredSummaries = computed(() => {
        if (currentFilter.value === 'all') {
            return summaries.value
        }
        if (currentFilter.value === 'pending') {
            return summaries.value.filter(s => s.status === 'pending')
        }
        // 这里的 filter value 可能是公司名
        return summaries.value.filter(s => s.company === currentFilter.value)
    })

    const summaryStats = computed(() => ({
        total: total.value, // 使用后端返回的总数
        completed: summaries.value.filter(s => s.status === 'completed').length,
        pending: summaries.value.filter(s => s.status === 'pending').length,
        progress: summaries.value.length > 0
            ? Math.round((summaries.value.filter(s => s.status === 'completed').length / summaries.value.length) * 100)
            : 0
    }))

    // Actions
    const fetchSummaries = async (page = 1, size = 10) => {
        loading.value = true
        try {
            const res = await getSummariesPaginated({ current: page, size })
            if (res.data) {
                summaries.value = res.data.records.map(mapSummaryToDisplay)
                total.value = res.data.total
                currentPage.value = res.data.current
                pageSize.value = res.data.size
            }
        } catch (error) {
            console.error('Failed to fetch summaries', error)
        } finally {
            loading.value = false
        }
    }

    const fetchSummaryById = async (id: string) => {
        try {
            const res = await getSummaryById(id)
            if (res.data) {
                return mapSummaryToDisplay(res.data)
            }
            return null
        } catch (error) {
            console.error('Failed to fetch summary', error)
            return null
        }
    }

    const addSummary = async (data: SummaryCreateRequest) => {
        try {
            await createSummary(data)
            // 重新加载列表
            await fetchSummaries(1, pageSize.value)
            return true
        } catch (error) {
            console.error('Failed to create summary', error)
            return false
        }
    }

    const editSummary = async (id: string, data: SummaryUpdateRequest) => {
        try {
            await updateSummary(id, data)
            await fetchSummaries(currentPage.value, pageSize.value)
            return true
        } catch (error) {
            console.error('Failed to update summary', error)
            return false
        }
    }

    const removeSummary = async (id: string) => {
        try {
            await deleteSummary(id)
            await fetchSummaries(currentPage.value, pageSize.value)
            return true
        } catch (error) {
            console.error('Failed to delete summary', error)
            return false
        }
    }

    const updateSummaryStatus = async (id: string, status: 'pending' | 'completed') => {
        // 需要先获取完整信息，再更新 content 中的 status
        const summary = summaries.value.find(s => s.id === id)
        if (!summary) return

        // 构造新的 content
        const contentObj = typeof summary.content === 'string' ? JSON.parse(summary.content) : { ...summary.content }
        contentObj.status = status

        await editSummary(id, {
            id,
            content: contentObj
        })
    }

    const setFilter = (filter: string) => {
        currentFilter.value = filter
    }

    return {
        summaries,
        currentFilter,
        filteredSummaries,
        summaryStats,
        loading,
        total,
        currentPage,
        pageSize,
        fetchSummaries,
        getSummaryById: fetchSummaryById,
        addSummary,
        editSummary,
        removeSummary,
        updateSummaryStatus,
        setFilter
    }
})
