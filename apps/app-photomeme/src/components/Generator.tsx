'use client'

import { useState } from 'react'
import { IMAGE_STYLES } from '@repo/image-gen'
import type { GeneratedImage, ImageSize, ImageStyleId } from '@repo/image-gen'
import { MAX_PROMPT_LENGTH } from '@/lib/prompt'

const STYLE_LABELS: Record<ImageStyleId, string> = {
  auto: '智能',
  realistic: '写实摄影',
  anime: '动漫',
  'oil-painting': '油画',
  watercolor: '水彩',
  cyberpunk: '赛博朋克',
  '3d-render': '3D 渲染',
  pixel: '像素风',
  'line-art': '线稿',
}

const SIZES: { id: ImageSize; label: string; hint: string; box: string }[] = [
  { id: '1:1', label: '1:1', hint: '方形', box: 'aspect-square' },
  { id: '16:9', label: '16:9', hint: '横屏', box: 'aspect-video' },
  { id: '9:16', label: '9:16', hint: '竖屏', box: 'aspect-[9/16]' },
  { id: '4:3', label: '4:3', hint: '经典', box: 'aspect-[4/3]' },
  { id: '3:4', label: '3:4', hint: '海报', box: 'aspect-[3/4]' },
]

const EXAMPLE_PROMPTS = [
  '一只戴着宇航员头盔的橘猫在月球表面漫步，地球悬挂在星空背景中',
  '赛博朋克风格的雨夜城市街道，霓虹灯牌倒影在湿润的路面上',
  '中国水墨风的群山与一叶孤舟，远山如黛，云雾缭绕',
]

interface ErrorResponse {
  ok: false
  error: { code: string; message: string }
}

interface SuccessResponse {
  ok: true
  data: GeneratedImage
}

export function Generator(): React.ReactElement {
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState<ImageStyleId>('auto')
  const [size, setSize] = useState<ImageSize>('1:1')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [image, setImage] = useState<GeneratedImage | null>(null)

  const currentBox = SIZES.find((item) => item.id === size)?.box ?? 'aspect-square'
  const charCount = prompt.length
  const overLimit = charCount > MAX_PROMPT_LENGTH

  async function handleGenerate(event: React.FormEvent): Promise<void> {
    event.preventDefault()
    const trimmed = prompt.trim()
    if (!trimmed) {
      setError('请先描述你想要生成的画面')
      return
    }
    if (overLimit) {
      setError(`画面描述不能超过 ${MAX_PROMPT_LENGTH} 字`)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: trimmed, style, size }),
      })
      const data = (await response.json()) as SuccessResponse | ErrorResponse
      if (!response.ok || data.ok === false) {
        const message = data.ok === false ? data.error.message : '生成失败，请稍后重试'
        setError(message)
        return
      }
      setImage(data.data)
    } catch {
      setError('网络异常，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card grid gap-0 overflow-hidden lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
      {/* 左侧：输入区 */}
      <form onSubmit={handleGenerate} className="flex flex-col gap-5 p-6 sm:p-8">
        <div>
          <label htmlFor="prompt" className="mb-2 block text-sm font-medium">
            画面描述
          </label>
          <textarea
            id="prompt"
            className="input-base min-h-[120px] resize-y leading-relaxed"
            placeholder="描述你脑海中的画面，例如：清晨森林里的一只小鹿，阳光穿过树叶洒下丁达尔光……"
            value={prompt}
            maxLength={MAX_PROMPT_LENGTH + 200}
            onChange={(event) => setPrompt(event.target.value)}
            disabled={loading}
          />
          <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
            <span>越具体的描述，生成效果越好</span>
            <span className={overLimit ? 'text-destructive' : undefined}>
              {charCount}/{MAX_PROMPT_LENGTH}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {EXAMPLE_PROMPTS.map((example) => (
            <button
              key={example}
              type="button"
              className="rounded-full bg-accent-soft px-3 py-1 text-xs text-accent transition hover:opacity-80"
              onClick={() => {
                setPrompt(example)
                setError(null)
              }}
              disabled={loading}
            >
              {example.length > 16 ? `${example.slice(0, 16)}…` : example}
            </button>
          ))}
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">视觉风格</p>
          <div className="flex flex-wrap gap-2">
            {IMAGE_STYLES.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`chip ${style === item.id ? 'chip-active' : 'chip-idle'}`}
                onClick={() => setStyle(item.id)}
                disabled={loading}
              >
                {STYLE_LABELS[item.id]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">画幅比例</p>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`chip ${size === item.id ? 'chip-active' : 'chip-idle'}`}
                onClick={() => setSize(item.id)}
                disabled={loading}
                title={item.hint}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <button type="submit" className="btn-primary w-full" disabled={loading || overLimit}>
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              正在生成，请稍候…
            </>
          ) : (
            '✨ 生成图片'
          )}
        </button>
      </form>

      {/* 右侧：结果区 */}
      <div className="flex flex-col justify-center gap-3 border-t border-border bg-secondary/40 p-6 sm:p-8 lg:border-l lg:border-t-0">
        <div
          className={`relative w-full overflow-hidden rounded-xl border border-border bg-white ${currentBox}`}
        >
          {image ? (
            <img
              src={image.url}
              alt={prompt}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <span className="text-3xl">🎨</span>
              <p className="text-sm">{loading ? '模型创作中…' : '生成结果将在这里展示'}</p>
            </div>
          )}
        </div>

        {image && (
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-full bg-white px-2.5 py-1 text-xs text-muted-foreground">
              {image.provider} · {image.model}
            </span>
            <a
              href={image.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-accent hover:underline"
            >
              新窗口查看 ↗
            </a>
          </div>
        )}

        {image?.provider === 'mock' && (
          <p className="text-xs text-muted-foreground">
            当前为 Mock 模式：在 <code className="rounded bg-white px-1">.env.local</code> 中配置
            <code className="ml-1 rounded bg-white px-1">REPLICATE_API_TOKEN</code>
            后即可生成真实图片。
          </p>
        )}
      </div>
    </div>
  )
}
