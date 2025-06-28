import { AcademiesService } from './academies.service';
import { CreateAcademyInput, createAcademyInputResponse } from './dto/create-academy.input';
import { UpdateAcademyInput } from './dto/update-academy.input';
export declare class AcademiesResolver {
    private readonly academiesService;
    constructor(academiesService: AcademiesService);
    createAcademy(createAcademyInput: CreateAcademyInput): Promise<createAcademyInputResponse>;
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
    updateAcademy(updateAcademyInput: UpdateAcademyInput): string;
    getAcademyCategories(): Promise<{
        id: number;
        created_at: Date;
        name: string;
    }[]>;
    removeAcademy(id: number): string;
}
