import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
} from '@aws-sdk/client-s3'
import { createHash, createHmac } from 'node:crypto'
import { ApiError, err, ok } from '@repo/common'

import type { AsyncResult } from '@repo/common'
import type {
  Content,
  StorageProvider,
  UploadOpts,
  UploadResult,
} from '../index'
import { toApiError, toBuffer, toWebStream } from '../util'

export interface R2ProviderConfig {
  bucket: string
  accountId: string
  accessKeyId: string
  secretAccessKey: string
  publicUrl?: string
}

interface ObjectKeyed {
  Key?: string
}

// Cloudflare R2 storage provider. Uses the S3-compatible API via the AWS SDK
// v3 client with virtual-hosted-style addressing (forcePathStyle: false).
export class R2Provider implements StorageProvider {
  private readonly client: S3Client
  private readonly bucket: string
  private readonly publicUrl?: string
  private readonly accessKeyId: string
  private readonly secretAccessKey: string
  private readonly endpointHost: string

  constructor(cfg: R2ProviderConfig) {
    this.bucket = cfg.bucket
    this.publicUrl = cfg.publicUrl
    this.accessKeyId = cfg.accessKeyId
    this.secretAccessKey = cfg.secretAccessKey
    this.endpointHost = `${cfg.accountId}.r2.cloudflarestorage.com`
    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${this.endpointHost}`,
      forcePathStyle: false,
      credentials: {
        accessKeyId: cfg.accessKeyId,
        secretAccessKey: cfg.secretAccessKey,
      },
    })
  }

  async upload(
    key: string,
    content: Content,
    opts?: UploadOpts,
  ): AsyncResult<UploadResult> {
    try {
      const body = await toBuffer(content)
      const out = await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: body,
          ContentType: opts?.contentType,
          Metadata: opts?.metadata,
        }),
      )
      const url =
        opts?.public && this.publicUrl ? `${this.publicUrl}/${key}` : undefined
      return ok<UploadResult>({ key, url, etag: out.ETag })
    } catch (e) {
      return err(toApiError(e))
    }
  }

  async download(key: string): AsyncResult<ReadableStream> {
    try {
      const out = await this.client.send(
        new GetObjectCommand({ Bucket: this.bucket, Key: key }),
      )
      if (!out.Body) {
        return err(new ApiError('NOT_FOUND', 404, `Object not found: ${key}`))
      }
      return ok(toWebStream(out.Body))
    } catch (e) {
      return err(toApiError(e))
    }
  }

  async delete(key: string): AsyncResult<void> {
    try {
      await this.client.send(
        new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
      )
      return ok(undefined)
    } catch (e) {
      return err(toApiError(e))
    }
  }

  async listObjects(
    prefix?: string,
  ): AsyncResult<{ key: string; lastModified?: Date }[]> {
    try {
      const out: { key: string; lastModified?: Date }[] = []
      let token: string | undefined
      do {
        const list = await this.client.send(
          new ListObjectsV2Command({
            Bucket: this.bucket,
            Prefix: prefix,
            MaxKeys: 1000,
            ContinuationToken: token,
          }),
        )
        for (const item of list.Contents ?? []) {
          if (item.Key) {
            out.push({ key: item.Key, lastModified: item.LastModified })
          }
        }
        token = list.IsTruncated ? list.NextContinuationToken : undefined
      } while (token)
      return ok(out)
    } catch (e) {
      return err(toApiError(e))
    }
  }

  async deleteByOwner(ownerId: string): AsyncResult<{ deleted: number }> {
    try {
      let deleted = 0
      let token: string | undefined
      do {
        const list = await this.client.send(
          new ListObjectsV2Command({
            Bucket: this.bucket,
            Prefix: ownerId,
            MaxKeys: 1000,
            ContinuationToken: token,
          }),
        )
        const contents = (list.Contents ?? []) as ObjectKeyed[]
        if (contents.length > 0) {
          await this.client.send(
            new DeleteObjectsCommand({
              Bucket: this.bucket,
              Delete: {
                Quiet: true,
                Objects: contents
                  .filter((o): o is ObjectKeyed & { Key: string } => !!o.Key)
                  .map((o) => ({ Key: o.Key })),
              },
            }),
          )
          deleted += contents.length
        }
        token = list.IsTruncated ? list.NextContinuationToken : undefined
      } while (token)
      return ok({ deleted })
    } catch (e) {
      return err(toApiError(e))
    }
  }

  async getSignedUrl(
    key: string,
    opts: { expiresInSec: number; action: 'get' | 'put' },
  ): AsyncResult<string> {
    try {
      return ok(this.presign(key, opts.action, opts.expiresInSec))
    } catch (e) {
      return err(toApiError(e, 'SIGN_URL_ERROR', 500))
    }
  }

  async exists(key: string): AsyncResult<boolean> {
    try {
      await this.client.send(
        new HeadObjectCommand({ Bucket: this.bucket, Key: key }),
      )
      return ok(true)
    } catch (e) {
      const name = (e as { name?: string })?.name
      if (name === 'NotFound' || name === 'NoSuchKey' || name === '404') {
        return ok(false)
      }
      return err(toApiError(e))
    }
  }

  // Build an AWS Signature V4 query-string presigned URL. Done manually with
  // node:crypto because @aws-sdk/s3-request-presigner is not installed in this
  // workspace and createPresignedUrl is no longer exported by client-s3.
  // R2 fully supports SigV4 presigned URLs.
  private presign(
    key: string,
    action: 'get' | 'put',
    expiresInSec: number,
  ): string {
    const method = action === 'put' ? 'PUT' : 'GET'
    const region = 'auto'
    const service = 's3'
    const now = new Date()
    const amzDate = now
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}Z$/, 'Z')
    const datestamp = amzDate.slice(0, 8)
    const credentialScope = `${datestamp}/${region}/${service}/aws4_request`
    const credential = `${this.accessKeyId}/${credentialScope}`
    const host = `${this.bucket}.${this.endpointHost}`
    const canonicalUri =
      '/' + key.split('/').map(encodeURIComponent).join('/')

    const queryParams: Record<string, string> = {
      'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
      'X-Amz-Credential': credential,
      'X-Amz-Date': amzDate,
      'X-Amz-Expires': String(expiresInSec),
      'X-Amz-SignedHeaders': 'host',
    }
    const canonicalQuery = Object.keys(queryParams)
      .sort()
      .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(queryParams[k])}`)
      .join('&')
    const canonicalHeaders = `host:${host}\n`
    const signedHeaders = 'host'
    const canonicalRequest = [
      method,
      canonicalUri,
      canonicalQuery,
      canonicalHeaders,
      '',
      signedHeaders,
      'UNSIGNED-PAYLOAD',
    ].join('\n')
    const canonicalHash = createHash('sha256')
      .update(canonicalRequest)
      .digest('hex')
    const stringToSign = [
      'AWS4-HMAC-SHA256',
      amzDate,
      credentialScope,
      canonicalHash,
    ].join('\n')
    const signingKey = this.deriveSigningKey(datestamp, region, service)
    const signature = createHmac('sha256', signingKey)
      .update(stringToSign)
      .digest('hex')
    return `https://${host}${canonicalUri}?${canonicalQuery}&X-Amz-Signature=${signature}`
  }

  private deriveSigningKey(
    datestamp: string,
    region: string,
    service: string,
  ): Buffer {
    const kDate = createHmac('sha256', `AWS4${this.secretAccessKey}`)
      .update(datestamp)
      .digest()
    const kRegion = createHmac('sha256', kDate).update(region).digest()
    const kService = createHmac('sha256', kRegion).update(service).digest()
    return createHmac('sha256', kService).update('aws4_request').digest()
  }
}
