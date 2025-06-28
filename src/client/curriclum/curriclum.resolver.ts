import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CurriclumService } from './curriclum.service';
import { Curriclum } from './entities/curriclum.entity';
import { CurriclumAttachment } from './entities/curriclum-attachment.entity';
import { CreateCurriclumInput } from './dto/create-curriclum.input';
import { UpdateCurriclumInput } from './dto/update-curriclum.input';
import { CreateCurriclumAttachmentInput } from './dto/create-curriclum-attachment.input';
import { UpdateCurriclumAttachmentInput } from './dto/update-curriclum-attachment.input';
import { GenerateVideoSignedUrlInput } from './dto/generate-signed-url.input';
import { GenerateVideoUploadSignedUrlInput } from './dto/generate-signed-url.input';
import { GenerateAttachmentSignedUrlInput } from './dto/generate-signed-url.input';
import { GenerateAttachmentUploadSignedUrlInput } from './dto/generate-signed-url.input';
import { VideoSignedUrlResponse } from './dto/signed-url.response';
import { AttachmentSignedUrlResponse } from './dto/signed-url.response';
import { CurriclumWithSignedUrlsResponse } from './dto/signed-url.response';
import { GenerateCurriclumSignedUrlInput } from './dto/generate-signed-url.input';
import { SignedUrlResponse } from './dto/signed-url.response';
import { AuthGuard } from '../guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Curriclum)
export class CurriclumResolver {
  constructor(private readonly curriclumService: CurriclumService) {}

  @Mutation(() => Curriclum)
  createCurriclum(@Args('createCurriclumInput') createCurriclumInput: CreateCurriclumInput) {
    return this.curriclumService.create(createCurriclumInput);
  }

  @Query(() => [Curriclum], { name: 'curriclums' })
  findAll() {
    return this.curriclumService.findAll();
  }

  @Query(() => Curriclum, { name: 'curriclum' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.curriclumService.findOne(id);
  }

  @Query(() => [Curriclum], { name: 'curriclumsBySection' })
  findBySectionId(@Args('sectionId', { type: () => Int }) sectionId: number) {
    return this.curriclumService.findBySectionId(sectionId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Curriclum)
  updateCurriclum(@Args('updateCurriclumInput') updateCurriclumInput: UpdateCurriclumInput) {
    return this.curriclumService.update(updateCurriclumInput.id, updateCurriclumInput);
  }

  @Mutation(() => Curriclum)
  removeCurriclum(@Args('id', { type: () => Int }) id: number) {
    return this.curriclumService.remove(id);
  }

  // Curriclum Attachment resolvers
  @Mutation(() => CurriclumAttachment)
  createCurriclumAttachment(@Args('createAttachmentInput') createAttachmentInput: CreateCurriclumAttachmentInput) {
    return this.curriclumService.createAttachment(createAttachmentInput);
  }

  @Query(() => [CurriclumAttachment], { name: 'curriclumAttachments' })
  findAttachmentsByCurriclumId(@Args('curriclumId', { type: () => Int }) curriclumId: number) {
    return this.curriclumService.findAttachmentsByCurriclumId(curriclumId);
  }

  @Mutation(() => CurriclumAttachment)
  updateCurriclumAttachment(@Args('updateAttachmentInput') updateAttachmentInput: UpdateCurriclumAttachmentInput) {
    return this.curriclumService.updateAttachment(updateAttachmentInput.id, updateAttachmentInput);
  }

  @Mutation(() => CurriclumAttachment)
  removeCurriclumAttachment(@Args('id', { type: () => Int }) id: number) {
    return this.curriclumService.removeAttachment(id);
  }

  // Signed URL resolvers
  @UseGuards(AuthGuard)
  @Mutation(() => VideoSignedUrlResponse)
  generateVideoSignedUrl(@Args('input') input: GenerateVideoSignedUrlInput) {
    return this.curriclumService.generateVideoSignedUrl(input);
  }

  @Mutation(() => VideoSignedUrlResponse)
  generateVideoUploadSignedUrl(@Args('input') input: GenerateVideoUploadSignedUrlInput) {
    return this.curriclumService.generateVideoUploadSignedUrl(input);
  }

  @Mutation(() => AttachmentSignedUrlResponse)
  generateAttachmentSignedUrl(@Args('input') input: GenerateAttachmentSignedUrlInput) {
    return this.curriclumService.generateAttachmentSignedUrl(input);
  }

  @Mutation(() => AttachmentSignedUrlResponse)
  generateAttachmentUploadSignedUrl(@Args('input') input: GenerateAttachmentUploadSignedUrlInput) {
    return this.curriclumService.generateAttachmentUploadSignedUrl(input);
  }

  @Query(() => CurriclumWithSignedUrlsResponse, { name: 'curriclumWithSignedUrls' })
  findOneWithSignedUrls(@Args('id', { type: () => Int }) id: number) {
    return this.curriclumService.findOneWithSignedUrls(id);
  }

  @Query(() => [CurriclumWithSignedUrlsResponse], { name: 'curriclumsBySectionWithSignedUrls' })
  findBySectionIdWithSignedUrls(@Args('sectionId', { type: () => Int }) sectionId: number) {
    return this.curriclumService.findBySectionIdWithSignedUrls(sectionId);
  }

  @Query(() => Boolean, { name: 'validateFileAccess' })
  validateFileAccess(@Args('url', { type: () => String }) url: string) {
    return this.curriclumService.validateFileAccess(url);
  }

  @Query(() => String, { name: 'getFileMetadata' })
  async getFileMetadata(@Args('url', { type: () => String }) url: string) {
    const metadata = await this.curriclumService.getFileMetadata(url);
    return JSON.stringify(metadata);
  }

  @Mutation(() => Boolean)
  removeAttachmentFile(@Args('attachmentId', { type: () => Int }) attachmentId: number) {
    return this.curriclumService.removeAttachmentFile(attachmentId);
  }

  @Mutation(() => Boolean)
  removeCurriclumFile(
    @Args('curriclumId', { type: () => Int }) curriclumId: number,
    @Args('fileField', { type: () => String }) fileField: string
  ) {
    return this.curriclumService.removeCurriclumFile(curriclumId, fileField);
  }

  @Mutation(() => SignedUrlResponse)
  generateCurriclumSignedUrl(@Args('input') input: GenerateCurriclumSignedUrlInput) {
    return this.curriclumService.generateCurriclumSignedUrl(input);
  }
}
