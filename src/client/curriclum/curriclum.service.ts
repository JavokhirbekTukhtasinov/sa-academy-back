import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SignedUrlService, SignedUrlOptions } from 'src/utils/signed-url.service';
import { CreateCurriclumInput } from './dto/create-curriclum.input';
import { UpdateCurriclumInput } from './dto/update-curriclum.input';
import { CreateCurriclumAttachmentInput } from './dto/create-curriclum-attachment.input';
import { UpdateCurriclumAttachmentInput } from './dto/update-curriclum-attachment.input';
import { GenerateVideoSignedUrlInput } from './dto/generate-signed-url.input';
import { GenerateVideoUploadSignedUrlInput } from './dto/generate-signed-url.input';
import { GenerateAttachmentSignedUrlInput } from './dto/generate-signed-url.input';
import { GenerateAttachmentUploadSignedUrlInput } from './dto/generate-signed-url.input';
import { UploadService } from 'src/utils/upload.service';
import { GenerateCurriclumSignedUrlInput, CurriclumFileType } from './dto/generate-signed-url.input';
import { SignedUrlResponse } from './dto/signed-url.response';
import { CurriclumAttachmentTypes } from './entities/curriclum-attachment.entity';

@Injectable()
export class CurriclumService {
  constructor(
    private prisma: PrismaService,
    private signedUrlService: SignedUrlService,
    private uploadService: UploadService
  ) {}

  async create(createCurriclumInput: CreateCurriclumInput) {
    try {
      console.log({createCurriclumInput})
      const lastCurriclum = await this.prisma.sa_curriclums.findFirst({
        where: { section_id: Number(createCurriclumInput.section_id) },
        orderBy: {
          id: 'desc',
        },
      });

      return this.prisma.sa_curriclums.create({
        data: {
          // ...createCurriclumInput,
          section_id: Number(createCurriclumInput.section_id),
          type: createCurriclumInput.type,
          title: createCurriclumInput.title,
          description: createCurriclumInput.description || null,
          video_link: createCurriclumInput.video_link || null,
          article: createCurriclumInput.article || null,
          sa_curriclum_attachments: {
            create: createCurriclumInput.sa_curriclum_attachments.map(attachment => ({
              type: attachment.type,
              link_url: attachment.link_url,
              name: attachment.name,
            })),
          },
          order_num: lastCurriclum ? Number(lastCurriclum.order_num) + 1 : 1,
        },
        include: {
          sa_sections: true,
          sa_curriclum_attachments: true,
        },
      });

    } catch (error) {
      console.log(error)
      throw new BadRequestException(error)
    }
  }

  findAll() {
    return this.prisma.sa_curriclums.findMany({
      include: {
        sa_sections: true,
        sa_curriclum_attachments: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.sa_curriclums.findUnique({
      where: { id: (id) },
      include: {
        sa_sections: true,
        sa_curriclum_attachments: true,
      },
    });
  }

  findBySectionId(sectionId: number) {
    return this.prisma.sa_curriclums.findMany({
      where: { section_id: sectionId },
      include: {
        sa_curriclum_attachments: true,
      },
      orderBy: {
        created_at: 'asc',
      },
    });
  }

  async update(id: number, updateCurriclumInput: UpdateCurriclumInput) {
    try {
      const { id: _, section_id, sa_curriclum_attachments, ...data } = updateCurriclumInput;
      const curriclum = await this.prisma.sa_curriclums.findUnique({
        where: { id: Number(id) },
      });

      if (!curriclum) throw new BadRequestException('Curriclum not found');
      // if (curriclum.section_id !== updateCurriclumInput.section_id) {
      //   throw new BadRequestException('Section ID cannot be changed');
      // }
      console.log({ updateCurriclumInput })
      const updatedCurriclum = await this.prisma.$transaction(async (tx) => {
        // 1. Update the curriculum itself
        const updated = await tx.sa_curriclums.update({
          where: { id: Number(id) },
          data: {
            ...data,
            section_id: Number(section_id || curriclum.section_id),
          },
          include: {
            sa_sections: true,
            sa_curriclum_attachments: true,
          },
        });

        // 2. If attachments are provided, replace all
        if (sa_curriclum_attachments) {
          await tx.sa_curriclum_attachments.deleteMany({
            where: { curriclum_id: Number(id) },
          });
          if (sa_curriclum_attachments.length > 0) {
            await tx.sa_curriclum_attachments.createMany({
              data: sa_curriclum_attachments.map(attachment => ({
                ...attachment,
                curriclum_id: Number(id),
              })),
            });
          }
        }

        return updated;
      });
      return updatedCurriclum;
    } catch (error) {
      console.log(error)
      throw new BadRequestException(error)
    }
  }

  remove(id: number) {
    return this.prisma.sa_curriclums.delete({
      where: { id: Number(id) },
    });
  }

  // Curriclum Attachment methods
  createAttachment(createAttachmentInput: CreateCurriclumAttachmentInput) {
    return this.prisma.sa_curriclum_attachments.create({
      data: createAttachmentInput,
    });
  }

  findAttachmentsByCurriclumId(curriclumId: number) {
    return this.prisma.sa_curriclum_attachments.findMany({
      where: { curriclum_id: Number(curriclumId) },
      orderBy: {
        created_at: 'asc',
      },
    });
  }

  updateAttachment(id: number, updateAttachmentInput: UpdateCurriclumAttachmentInput) {
    const { id: _, ...data } = updateAttachmentInput;
    return this.prisma.sa_curriclum_attachments.update({
      where: { id: Number(id) },
      data,
    });
  }

  removeAttachment(id: number) {
    return this.prisma.sa_curriclum_attachments.delete({
      where: { id: Number(id) },
    });
  }

  /**
   * Remove an attachment file from storage and DB
   */
  async removeAttachmentFile(attachmentId: number): Promise<boolean> {
    const attachment = await this.prisma.sa_curriclum_attachments.findUnique({
      where: { id: attachmentId },
    });
    if (!attachment) throw new BadRequestException('Attachment not found');
    if (attachment.link_url) {
      // Extract key from link_url (assuming S3 URL format)
      const key = this.extractKeyFromUrl(attachment.link_url);
      if (key) {
        await this.uploadService.deleteFile(key);
      }
    }
    await this.prisma.sa_curriclum_attachments.delete({ where: { id: attachmentId } });
    return true;
  }

  /**
   * Remove a file related to a curriclum (e.g., video)
   */
  async removeCurriclumFile(curriclumId: number, fileField: 'video_link' | string): Promise<boolean> {
    const curriclum = await this.prisma.sa_curriclums.findUnique({ where: { id: curriclumId } });
    if (!curriclum) throw new BadRequestException('Curriclum not found');
    const fileUrl = curriclum[fileField];
    if (fileUrl) {
      const key = this.extractKeyFromUrl(fileUrl);
      if (key) {
        await this.uploadService.deleteFile(key);
      }
      // Remove the file reference from the DB
      await this.prisma.sa_curriclums.update({
        where: { id: curriclumId },
        data: { [fileField]: null },
      });
    }
    return true;
  }

  /**
   * Helper to extract S3 key from a URL
   */
  private extractKeyFromUrl(url: string): string | null {
    try {
      const match = url.match(/\/(?:[a-zA-Z0-9_-]+)\/(.+)$/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  }

  // Signed URL methods
  async generateVideoSignedUrl(input: GenerateVideoSignedUrlInput) {
    try {
      const options: SignedUrlOptions = {
        expiresIn: input.expiresIn,
      };

      const signedUrl = await this.signedUrlService.generateVideoSignedUrl(
        input.videoUrl,
        options
      );

      return {
        signedUrl,
        originalUrl: input.videoUrl,
        expiresIn: input.expiresIn,
      };
    } catch (error) {
      throw new BadRequestException('Failed to generate video signed URL');
    }
  }

  async generateVideoUploadSignedUrl(input: GenerateVideoUploadSignedUrlInput) {
    try {
      const options: SignedUrlOptions = {
        expiresIn: input.expiresIn,
        contentType: input.contentType,
        metadata: input.metadata ? JSON.parse(input.metadata) : {},
      };

      const {signedUrl, file_url} = await this.signedUrlService.generateVideoUploadSignedUrl(
        input.fileName,
        input.contentType,
        options
      );

      const actualUrl = `${process.env.LOCALSTACK_S3_ENDPOINT || 'http://localhost:4566'}/${process.env.S3_BUCKET}/${file_url}`;

      return {
        signedUrl,
        fileName: input.fileName,
        contentType: input.contentType,
        expiresIn: input.expiresIn,
        actualUrl,
      };
    } catch (error) {
      throw new BadRequestException('Failed to generate video upload signed URL');
    }
  }

  async generateAttachmentSignedUrl(input: GenerateAttachmentSignedUrlInput) {
    try {
      const options: SignedUrlOptions = {
        expiresIn: input.expiresIn,
      };

      const signedUrl = await this.signedUrlService.generateAttachmentSignedUrl(
        input.attachmentUrl,
        input.attachmentType,
        options
      );

      return {
        signedUrl,
        originalUrl: input.attachmentUrl,
        attachmentType: input.attachmentType,
        expiresIn: input.expiresIn,
      };
    } catch (error) {
      throw new BadRequestException('Failed to generate attachment signed URL');
    }
  }

  async generateAttachmentUploadSignedUrl(input: GenerateAttachmentUploadSignedUrlInput) {
    try {
      const options: SignedUrlOptions = {
        expiresIn: input.expiresIn,
        contentType: input.contentType,
        metadata: input.metadata ? JSON.parse(input.metadata) : {},
      };

      const signedUrl = await this.signedUrlService.generateAttachmentUploadSignedUrl(
        input.fileName,
        input.contentType,
        input.attachmentType,
        options
      );

      return {
        signedUrl,
        fileName: input.fileName,
        contentType: input.contentType,
        attachmentType: input.attachmentType,
        expiresIn: input.expiresIn,
      };
    } catch (error) {
      throw new BadRequestException('Failed to generate attachment upload signed URL');
    }
  }

  async findOneWithSignedUrls(id: number) {
    try {
      const curriclum = await this.findOne(id);
      if (!curriclum) {
        return null;
      }

      return await this.signedUrlService.generateCurriclumSignedUrls(curriclum);
    } catch (error) {
      throw new BadRequestException('Failed to get curriclum with signed URLs');
    }
  }

  async findBySectionIdWithSignedUrls(sectionId: number) {
    try {
      const curriclums = await this.findBySectionId(sectionId);
      return await this.signedUrlService.generateMultipleCurriclumsSignedUrls(curriclums);
    } catch (error) {
      throw new BadRequestException('Failed to get curriclums with signed URLs');
    }
  }

  async validateFileAccess(url: string): Promise<boolean> {
    try {
      return await this.signedUrlService.validateUrlAccess(url);
    } catch (error) {
      return false;
    }
  }

  async getFileMetadata(url: string) {
    try {
      return await this.signedUrlService.getFileMetadata(url);
    } catch (error) {
      throw new BadRequestException('Failed to get file metadata');
    }
  }

  async generateCurriclumSignedUrl(input: GenerateCurriclumSignedUrlInput): Promise<SignedUrlResponse & { actualUrl?: string }> {
    if (input.fileType === CurriclumFileType.VIDEO) {
      if (input.fileName && input.contentType) {
        // Upload signed URL for video
        const options: SignedUrlOptions = {
          expiresIn: input.expiresIn,
          contentType: input.contentType,
          metadata: input.metadata ? JSON.parse(input.metadata) : {},
        };
        const {signedUrl, file_url} = await this.signedUrlService.generateVideoUploadSignedUrl(
          input.fileName,
          input.contentType,
          options 
        );
        // Construct actual URL (S3/public URL)
        const actualUrl = `${process.env.LOCALSTACK_S3_ENDPOINT || 'http://localhost:4566'}/${process.env.S3_BUCKET}/${file_url}`;
        return {
          signedUrl,
          fileName: input.fileName,
          contentType: input.contentType,
          expiresIn: input.expiresIn,
          actualUrl,
        };
      } else if (input.fileUrl) {
        // Download signed URL for video
        const options: SignedUrlOptions = {
          expiresIn: input.expiresIn,
        };
        const signedUrl = await this.signedUrlService.generateVideoSignedUrl(
          input.fileUrl,
          options
        );
        return {
          signedUrl,
          originalUrl: input.fileUrl,
          expiresIn: input.expiresIn,
          actualUrl: input.fileUrl,
        };
      } else {
        throw new BadRequestException('Missing fileUrl or fileName/contentType for VIDEO type');
      }
    } else if (input.fileType === CurriclumFileType.ATTACHMENT) {
      if (input.fileName && input.contentType) {
        // Upload signed URL for attachment
        const options: SignedUrlOptions = {
          expiresIn: input.expiresIn,
          contentType: input.contentType,
          metadata: input.metadata ? JSON.parse(input.metadata) : {},
        };
        const signedUrl = await this.signedUrlService.generateAttachmentUploadSignedUrl(
          input.fileName,
          input.contentType,
          CurriclumAttachmentTypes.FILE, // Default to FILE type for attachment
          options
        );
        const actualUrl = `${process.env.LOCALSTACK_S3_ENDPOINT || 'http://localhost:4566'}/${process.env.S3_BUCKET}/${input.fileName}`;
        return {
          signedUrl,
          fileName: input.fileName,
          contentType: input.contentType,
          expiresIn: input.expiresIn,
          actualUrl,
        };
      } else if (input.fileUrl) {
        // Download signed URL for attachment
        const options: SignedUrlOptions = {
          expiresIn: input.expiresIn,
        };
        const signedUrl = await this.signedUrlService.generateAttachmentSignedUrl(
          input.fileUrl,
          CurriclumAttachmentTypes.FILE, // Default to FILE type for attachment
          options
        );
        return {
          signedUrl,
          originalUrl: input.fileUrl,
          expiresIn: input.expiresIn,
          actualUrl: input.fileUrl,
        };
      } else {
        throw new BadRequestException('Missing fileUrl or fileName/contentType for ATTACHMENT type');
      }
    } else {
      throw new BadRequestException('Invalid fileType for signed URL generation');
    }
  }
}
