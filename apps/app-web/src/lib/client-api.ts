// 前端调用统一生成 API 的薄封装（浏览器端使用）
export interface StartGenerationOpts {
  photoId: string
  styleIds?: string[]
  customPrompt?: string
  hairColor?: string
  referencePhotoId?: string
}

export interface GenerationStatus {
  id: string
  status: 'queued' | 'processing' | 'succeeded' | 'failed'
  resultUrl: string | null
  error: string | null
  createdAt: string
  photoUrl?: string | null
  styleId?: string | null
  styleName?: string | null
  mode?: 'style' | 'custom' | 'reference'
  hairColor?: string | null
  shareToken?: string | null
  photoId?: string
}

export async function startGeneration(
  opts: StartGenerationOpts,
): Promise<{ generationIds: string[]; batchId: string }> {
  const res = await fetch('/api/generate-hairstyle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(opts),
  })
  const data = (await res.json()) as {
    generationIds?: string[]
    batchId?: string
    error?: { code: string; message: string }
  }
  if (!res.ok || !data.generationIds) {
    throw new Error(data.error?.message ?? 'Failed to start generation')
  }
  return { generationIds: data.generationIds, batchId: data.batchId ?? '' }
}

export async function pollGeneration(
  generationId: string,
): Promise<GenerationStatus> {
  const res = await fetch(`/api/generate/${generationId}`)
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as {
      error?: { message: string }
    } | null
    throw new Error(data?.error?.message ?? 'Failed to load generation')
  }
  return (await res.json()) as GenerationStatus
}
