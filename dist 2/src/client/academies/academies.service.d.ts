import { CreateAcademyInput, createAcademyInputResponse } from './dto/create-academy.input';
import { UpdateAcademyInput } from './dto/update-academy.input';
import { PrismaService } from 'src/prisma.service';
export declare class AcademiesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createAcademyInput: CreateAcademyInput): Promise<createAcademyInputResponse>;
    getAcademyCategories(): Promise<{
        id: number;
        created_at: Date;
        name: string;
    }[]>;
    findAll(): Promise<{
        id: number;
        created_at: Date;
        password: string | null;
        email: string | null;
        name: string | null;
        location: string | null;
        owner_name: string | null;
        phone_number: string | null;
        description: string | null;
        amount_of_teachers: import("@prisma/client/runtime/library").Decimal | null;
        academy_type_id: number | null;
        status: import(".prisma/client").$Enums.academy_status | null;
    }[]>;
    findOne(id: number): string;
    update(id: number, updateAcademyInput: UpdateAcademyInput): string;
    remove(id: number): string;
}
