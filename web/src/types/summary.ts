import type { ApiResponse } from './user'

export type { ApiResponse }

export interface Summary {
    id: string
    positionId?: string
    interviewId?: string
    userId: string
    companyName: string
    positionName: string
    interviewRound?: string
    content: any // JSON content from backend
    round?: string
    date?: number // timestamp
    createTime: number
    updateTime: number
}

// Frontend display model (after parsing content)
export interface SummaryDisplay extends Summary {
    company: string
    position: string
    status: 'pending' | 'completed'
    weakness: string
    improvements: string
    comments: number
    remark?: string
    color: string
}

export interface SummaryCreateRequest {
    interviewId?: string
    positionId?: string
    companyName: string
    positionName: string
    round?: string
    content: any
}

export interface SummaryUpdateRequest {
    id: string
    interviewId?: string
    positionId?: string
    companyName?: string
    positionName?: string
    round?: string
    content?: any
}

export interface SummaryQueryParams {
    current?: number
    size?: number
    interviewId?: string
    positionId?: string
}

export interface SummaryListResult {
    records: Summary[]
    total: number
    current: number
    size: number
    pages: number
}

export type SummaryListResponse = ApiResponse<SummaryListResult>
export type SummaryResponse = ApiResponse<Summary>
