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

@Injectable()
export class CurriclumService {
  constructor(
    private prisma: PrismaService,
    private signedUrlService: SignedUrlService
  ) {}

  async create(createCurriclumInput: CreateCurriclumInput) {
    try {
      const { attachments, ...curriclumData } = createCurriclumInput;
      const lastCurriclum = await this.prisma.sa_curriclums.findFirst({
        where: { section_id: Number(createCurriclumInput.section_id) },
        orderBy: {
          id: 'desc',
        },
      });
      return this.prisma.sa_curriclums.create({
        data: {
          ...curriclumData,
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

  update(id: number, updateCurriclumInput: UpdateCurriclumInput) {
    const { id: _, ...data } = updateCurriclumInput;
    return this.prisma.sa_curriclums.update({
      where: { id: Number(id) },
      data,
      include: {
        sa_sections: true,
        sa_curriclum_attachments: true,
      },
    });
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

      const signedUrl = await this.signedUrlService.generateVideoUploadSignedUrl(
        input.fileName,
        input.contentType,
        options
      );


      return {
        signedUrl,
        fileName: input.fileName,
        contentType: input.contentType,
        expiresIn: input.expiresIn,
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
}
