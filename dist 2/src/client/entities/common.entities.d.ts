import { Course } from "../courses/entities/course.entity";
import { Academy } from "../academies/entities/academy.entity";
export interface CurrentUserProps {
    id: number;
    email: string;
    role: "STUDENT" | "TEACHER" | "ACADEMY" | "ADMIN";
}
export declare class Category {
    id: number;
    created_at: Date;
    name: string;
    sa_sub_categories?: SubCategory[];
    sa_courses?: Course[];
    sa_academies?: Academy;
}
export declare class SubCategory {
    id: number;
    created_at: Date;
    name: string;
    parent_type_id?: number;
    sa_categories?: Category;
}
export declare class PaginationMeta {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev?: number;
    next?: number;
}
