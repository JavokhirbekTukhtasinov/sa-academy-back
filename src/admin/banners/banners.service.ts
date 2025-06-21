import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBannerInput } from './dto/create-banner.input';
import { UpdateBannerInput } from './dto/update-banner.input';
import { CurrentUserProps } from 'src/client/entities/common.entities';
import { PrismaService } from 'src/prisma.service';
import { UploadService } from 'src/utils/upload.service';
import { Banner } from './entities/banner.entity';

@Injectable()
export class BannersService {
constructor(
  private  prisma: PrismaService,
  private uploadService: UploadService
){}
async  create(createBannerInput: CreateBannerInput, user: CurrentUserProps) {
  try {
         const bannerCount = await this.prisma.sa_banners.count()
          const image = await this.uploadService.uploadFromGraphQL((await createBannerInput.image_desktop), 'image', `banners/${bannerCount + 1}`);
          const image_mobile = await this.uploadService.uploadFromGraphQL((await createBannerInput.image_mobile), 'image', `banners/${bannerCount + 1}`);
          const newBanner = await this.prisma.sa_banners.create({
            data: {
              banner_link: createBannerInput.banner_link,
              image_desktop: image.url,
              image_mobile: image_mobile.url,
              open_new_window: createBannerInput.open_new_window,
              // created_by: user.id,
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

 async findOne(id: number): Promise<Banner> {
try {
  return await this.prisma.sa_banners.findUnique({
    where: {
      id
    }
  })
} catch (error) {
  throw new BadRequestException(error)
}
  }

 async update(id: number, updateBannerInput: UpdateBannerInput) {
  try {
    const banner = await this.prisma.sa_banners.findUnique({
      where: {
        id
      }
    })

      let images: {
        image_desktop: string;
        image_mobile: string;
      } = {
        image_desktop: banner.image_desktop,
        image_mobile: banner.image_mobile
      }
       if(updateBannerInput.image_desktop && typeof updateBannerInput.image_desktop !== 'string') {
        images.image_desktop = await this.uploadService.uploadFromGraphQL((await updateBannerInput.image_desktop), 'image', `banners/${banner.image_desktop.split('/').pop()}`).then(res => res.url);
       }
       if(updateBannerInput.image_mobile && typeof updateBannerInput.image_mobile !== 'string') {
        images.image_mobile = await this.uploadService.uploadFromGraphQL((await updateBannerInput.image_mobile), 'image', `banners/${banner.image_mobile.split('/').pop()}`).then(res => res.url);
       }

      return await this.prisma.sa_banners.update({
        where: {
          id
        },
        data: {
          banner_link: updateBannerInput.banner_link,
          image_desktop: images.image_desktop || banner.image_desktop,
          image_mobile: images.image_mobile || banner.image_mobile,
          open_new_window: updateBannerInput.open_new_window || banner.open_new_window,
        }
      })
  } catch (error) {
    throw new BadRequestException(error)
  }
  }

 async remove(id: number): Promise<any> {
try {
  const banner = await this.prisma.sa_banners.findUnique({
    where: {
      id
    }
  })
    await this.uploadService.deleteFile(banner.image_desktop)
    await this.uploadService.deleteFile(banner.image_mobile)
    return await this.prisma.sa_banners.delete({
      where: {
        id
      }
    })
} catch (error) {
  throw new BadRequestException(error)
}
  }


  public async changeOrder(ids: number[]): Promise<any> {
    try {
      const banners = await this.prisma.sa_banners.findMany({
        where: {
          id: {
            in: ids
          }
        },
        orderBy: {
          order_num: 'asc'
        }
      })
      for (let i = 0; i < banners.length; i++) {
        await this.prisma.sa_banners.update({
          where: {
            id: banners[i].id
          },
          data: {
            order_num: i + 1
          }
        })
      }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

}
