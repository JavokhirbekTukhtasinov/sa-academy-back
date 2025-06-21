import { registerEnumType } from "@nestjs/graphql";



export enum LectureType {
    VIDEO = "VIDEO",
    ARTICLE = "ARTICLE",
}

registerEnumType(LectureType, {
    name: "LectureType",
});