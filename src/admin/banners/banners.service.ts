import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBannerInput } from './dto/create-banner.input';
import { UpdateBannerInput } from './dto/update-banner.input';
import { CurrentUserProps } from 'src/client/entities/common.entities';
import { PrismaService } from 'src/prisma.service';
import { UploadService } from 'src/utils/upload.service';

@Injectable()
export class BannersService {
constructor(
  private  prisma: PrismaService,
  private uploadService: UploadService
){}
async  create(createBannerInput: CreateBannerInput, user: CurrentUserProps) {
  try {
          const image = await this.uploadService.uploadFromGraphQL((await createBannerInput.image_desktop), 'image', `banners/${createBannerInput.banner_link}`);
          const image_mobile = await this.uploadService.uploadFromGraphQL((await createBannerInput.image_mobile), 'image', `banners/${createBannerInput.banner_link}`);
          const bannerCount = await this.prisma.sa_banners.count()
          const newBanner = await this.prisma.sa_banners.create({
            data: {
              banner_link: createBannerInput.banner_link,
              image_desktop: image.url,
              image_mobile: image_mobile.url,
              open_new_window: createBannerInput.open_new_window,
              created_by: user.id,
              order_num: (bannerCount || 0) + 1
            }
          })
          return newBanner
  } catch (error) {
    
  }
  }

 async findAll() {
    try {
      return await this.prisma.sa_banners.findMany({
        orderBy: {
          order_num: 'asc'
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} banner`;
  }

 async update(id: number, updateBannerInput: UpdateBannerInput) {
  try {
    const banner = await this.prisma.sa_banners.findUnique({
      where: {
        id
      }
    })
      const image_desktop = await this.uploadService.uploadFromGraphQL((await updateBannerInput.image_desktop), 'image', `banners/${updateBannerInput.banner_link}`);
      const image_mobile = await this.uploadService.uploadFromGraphQL((await updateBannerInput.image_mobile), 'image', `banners/${updateBannerInput.banner_link}`);
      return await this.prisma.sa_banners.update({
        where: {
          id
        },
        data: {
          banner_link: updateBannerInput.banner_link,
          image_desktop: image_desktop.url,
          image_mobile: image_mobile.url,
          open_new_window: updateBannerInput.open_new_window,
        }
      })
  } catch (error) {
    throw new BadRequestException(error)
  }
  }

  remove(id: number) {
    return `This action removes a #${id} banner`;
  }
}
