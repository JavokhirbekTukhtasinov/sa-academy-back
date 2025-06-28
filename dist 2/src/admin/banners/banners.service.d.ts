import { CreateBannerInput } from './dto/create-banner.input';
import { UpdateBannerInput } from './dto/update-banner.input';
import { CurrentUserProps } from 'src/client/entities/common.entities';
import { PrismaService } from 'src/prisma.service';
import { UploadService } from 'src/utils/upload.service';
export declare class BannersService {
    private prisma;
    private uploadService;
    constructor(prisma: PrismaService, uploadService: UploadService);
    create(createBannerInput: CreateBannerInput, user: CurrentUserProps): Promise<{
        id: number;
        created_at: Date;
        order_num: import("@prisma/client/runtime/library").Decimal | null;
        banner_link: string | null;
        open_new_window: boolean | null;
        created_by: number | null;
        image_mobile: string | null;
        image_desktop: string | null;
    }>;
    findAll(): Promise<{
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
    update(id: number, updateBannerInput: UpdateBannerInput): Promise<{
        id: number;
        created_at: Date;
        order_num: import("@prisma/client/runtime/library").Decimal | null;
        banner_link: string | null;
        open_new_window: boolean | null;
        created_by: number | null;
        image_mobile: string | null;
        image_desktop: string | null;
    }>;
    remove(id: number): Promise<any>;
    changeOrder(ids: number[]): Promise<any>;
}
