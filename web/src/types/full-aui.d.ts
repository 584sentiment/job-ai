/**
 * full-aui 组件库类型声明
 */
declare module 'full-aui' {
  export const Select: import('@job-ai-components/dist/components/Select/Select.vue')
  export const Input: import('@job-ai-components/dist/components/Input/Input.vue')
  export type { SelectProps, SelectOption } from '@job-ai-components/dist/components/Select/types'
  export * from '@job-ai-components/dist/components'
  export * from '@job-ai-components/dist/design-system/tokens'
  export * from '@job-ai-components/dist/design-system/themes'
  export * from '@job-ai-components/dist/composables'
}
