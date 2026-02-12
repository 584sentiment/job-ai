/**
 * full-aui 组件库类型声明
 */
declare module 'full-aui' {
  export const Select: import('@job-ai-components/dist/components/Select/Select.vue')
  export const Input: import('@job-ai-components/dist/components/Input/Input.vue')
  export const Switch: import('@job-ai-components/dist/components/Switch/Switch.vue')
  export const Modal: import('@job-ai-components/dist/components/Modal/Modal.vue')
  export const Tabs: import('@job-ai-components/dist/components/Tabs/Tabs.vue')
  export type { SelectProps, SelectOption } from '@job-ai-components/dist/components/Select/types'
  export type { InputProps } from '@job-ai-components/dist/components/Input/types'
  export type { SwitchProps } from '@job-ai-components/dist/components/Switch/types'
  export type { ModalProps } from '@job-ai-components/dist/components/Modal/types'
  export type { TabsProps, TabPaneProps } from '@job-ai-components/dist/components/Tabs/types'
  export * from '@job-ai-components/dist/components'
  export * from '@job-ai-components/dist/design-system/tokens'
  export * from '@job-ai-components/dist/design-system/themes'
  export * from '@job-ai-components/dist/composables'
}
