import type { AsyncResult } from '@repo/common'

// Cookie/用途同意
export type ConsentPurpose = 'essential' | 'analytics' | 'marketing' | 'functional'

export interface ConsentRecord {
  userId: string
  accepted: ConsentPurpose[]
  policyVersion: string
  recordedAt: number
}

export function recordConsent(
  userId: string,
  accepted: ConsentPurpose[],
  policyVersion: string
): AsyncResult<void> {
  throw new Error('Not implemented')
}

export function getConsent(userId: string): AsyncResult<ConsentRecord | null> {
  throw new Error('Not implemented')
}

// 数据删除请求（DSR）
export type DeletionStep =
  | 'anonymize-user'
  | 'delete-storage'
  | 'suppress-tracking'
  | 'send-confirmation'
  | 'audit-log'

export interface DeletionJob {
  requestId: string
  userId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  completedSteps: DeletionStep[]
  reason?: string
  createdAt: number
  completedAt?: number
}

export function requestDataDeletion(
  userId: string,
  opts?: { reason?: string }
): AsyncResult<{ requestId: string }> {
  throw new Error('Not implemented')
}

export function processDeletionRequest(
  requestId: string
): AsyncResult<{ status: DeletionJob['status']; completedSteps: DeletionStep[] }> {
  throw new Error('Not implemented')
}

// 内部编排：调用 auth.anonymizeUser / storage.deleteByOwner / tracking.suppressUser / notifications.sendDeletionConfirmationEmail / errors.capture

// 数据导出（可携带权，portability）
export interface UserDataExport {
  downloadUrl: string
  expiresAt: number
  createdAt: number
}

export function exportUserData(userId: string): AsyncResult<UserDataExport> {
  throw new Error('Not implemented')
}

// 隐私政策版本
export interface PolicyVersion {
  version: string
  effectiveAt: number
  url?: string
}

export function getCurrentPolicyVersion(): string {
  throw new Error('Not implemented')
}

export function getPolicyHistory(): AsyncResult<PolicyVersion[]> {
  throw new Error('Not implemented')
}
