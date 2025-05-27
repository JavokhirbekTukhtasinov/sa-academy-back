// upload.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuid } from 'uuid';
import { FileUpload } from 'graphql-upload';
import { Readable } from 'stream';
import {buffer} from 'node:stream/consumers'
import { Upload } from 'src/scalers/upload.scaler';

@Injectable()
export class UploadService {
  private wasabi = new S3Client({
    endpoint: 'https://s3.ap-northeast-1.wasabisys.com',
    region: 'ap-northeast-1',
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.WASABI_KEY,
      secretAccessKey: process.env.WASABI_SECRET,
    },
  });

  async generateSignedVideoUrl(filename: string, destination: string) {
    const key = `${destination}-${filename}`;
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      ContentType: 'video/mp4',
    });
    const uploadUrl = await getSignedUrl(this.wasabi, command, { expiresIn: 300 });
    return { uploadUrl, key };
  }

  async uploadFromGraphQL(file: FileUpload, type: 'image' | 'file', destination: string) {
    try {
    const { createReadStream, filename, mimetype } = file;
    const key = `${type}s/${destination}-${filename}`;
    const stream = createReadStream();

    if (!stream || typeof stream.pipe !== 'function') {
      throw new Error('Invalid file stream.');
    }

    const _buffer = await this.streamToBuffer(stream);

    console.log(_buffer.length)
    await this.wasabi.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: _buffer,
      ContentType: mimetype,
      ContentLength: _buffer.length
    }));
    return { key, url: `https://s3.ap-northeast-1.wasabisys.com/${process.env.S3_BUCKET}/${key}`,};
  } catch (error) {
    console.log(error)   
    throw new BadRequestException(error);
  }
  }


  async streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
  
      stream.on('data', (chunk) => {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      });
  
      stream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
  
      stream.on('error', (err) => {
        console.log(err)
        reject(err);
      });
    });
  }
  
  
  async uploadSmallFile(file: FileUpload, type: 'image' | 'file') {
    const { createReadStream, filename } = file;
    const ext = filename.split('.').pop();
    const key = `${type}s/${uuid()}.${ext}`;

    const stream = createReadStream();

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: stream,
      ContentType: this.getContentType(ext, type),
    });

    await this.wasabi.send(command);

    return {
      key,
      url: `https://s3.ap-northeast-1.wasabisys.com/${process.env.S3_BUCKET}/${key}`,
    };
  }

  private getContentType(ext: string, type: string): string {
    if (type === 'image') {
      if (ext === 'png') return 'image/png';
      if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
      if (ext === 'webp') return 'image/webp';
    }
    if (ext === 'pdf') return 'application/pdf';
    return 'application/octet-stream';
  }

  public async deleteFile(key: string) {
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
    });
    await this.wasabi.send(command);
  }
}
