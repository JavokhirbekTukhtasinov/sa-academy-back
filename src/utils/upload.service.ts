// ✅ NESTJS UPLOAD SERVICE — WASABI & CLOUDFLARE R2 (VIDEOS, IMAGES, FILES)

import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UploadService {
  private wasabi = new S3Client({
    endpoint: 'https://s3.ap-northeast-1.wasabisys.com',
    credentials: {
      accessKeyId: process.env.WASABI_KEY,
      secretAccessKey: process.env.WASABI_SECRET,
    },
    region: 'ap-northeast-1',
    forcePathStyle: true,
  });

  private r2 = new S3Client({
    endpoint: 'https://<your-account-id>.r2.cloudflarestorage.com',
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_R2_KEY,
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET,
    },
    region: 'auto',
    forcePathStyle: true,
  });

  async generateUploadUrl({
    filename,
    provider,
    fileType,
  }: {
    filename: string;
    provider: 'wasabi' | 'r2';
    fileType: 'video' | 'image' | 'file';
  }) {
    const key = `${fileType}s/${uuid()}-${filename}`;
    const client = provider === 'wasabi' ? this.wasabi : this.r2;

    const contentType = this.getMimeTypeFromFile(filename, fileType);

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(client, command, { expiresIn: 300 });
    return { uploadUrl, key };
  }

  async generatePlaybackUrl({ key, provider }: { key: string; provider: 'wasabi' | 'r2' }) {
    const client = provider === 'wasabi' ? this.wasabi : this.r2;

    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
    });

    const playbackUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
    return { playbackUrl };
  }

  private getMimeTypeFromFile(filename: string, fileType: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (fileType === 'video') return 'video/mp4';
    if (fileType === 'image') {
      if (ext === 'png') return 'image/png';
      if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
      if (ext === 'webp') return 'image/webp';
    }
    return 'application/octet-stream';
  }
}
