import { AxiosError } from 'axios'
import { FormUI, Card, ConfirmProps } from '..'

export interface PostPage<UI = any> {
  error?: Error
  loading?: boolean
  submitted: boolean
  form?: FormUI
  confirm?: ConfirmProps
  card?: Card
  ui?: UI
}

export type PostResult = { raw_log?: string }
export type ParsedRaw = { success?: boolean; log?: string }[] | ParsedLog
export type ParsedLog = { message?: string }
export type ErrorResult = ParsedLog | { error?: string | ParsedRaw }
export type PostError = AxiosError<ErrorResult> | Error
