import { BannersService } from './banners.service';
import { CreateBannerInput } from './dto/create-banner.input';
import { UpdateBannerInput } from './dto/update-banner.input';
import { CurrentUserProps } from 'src/client/entities/common.entities';
export declare class BannersResolver {
    private readonly bannersService;
    constructor(bannersService: BannersService);
    createBanner(user: CurrentUserProps, createBannerInput: CreateBannerInput): Promise<{
        id: number;
        created_at: Date;
        order_num: import("@prisma/client/runtime/library").Decimal | null;
        banner_link: string | null;
        open_new_window: boolean | null;
        created_by: number | null;
        image_mobile: string | null;
        image_desktop: string | null;
    }>;
    getBanners(): Promise<{
        id: number;
        created_at: Date;
        order_num: import("@prisma/client/runtime/library").Decimal | null;
        banner_link: string | null;
        open_new_window: boolean | null;
        created_by: number | null;
        image_mobile: string | null;
        image_desktop: string | null;
    }[]>;
    findOne(id: number): string;
    updateBanner(updateBannerInput: UpdateBannerInput): Promise<{
        id: number;
        created_at: Date;
        order_num: import("@prisma/client/runtime/library").Decimal | null;
        banner_link: string | null;
        open_new_window: boolean | null;
        created_by: number | null;
        image_mobile: string | null;
        image_desktop: string | null;
    }>;
    removeBanner(id: number): Promise<any>;
    changeBannerOrder(ids: number[]): Promise<any>;
}
