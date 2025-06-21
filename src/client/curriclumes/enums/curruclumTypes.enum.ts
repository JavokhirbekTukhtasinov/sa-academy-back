import { registerEnumType } from "@nestjs/graphql";

export enum CurriclumType {
  LECTURE = "LECTURE",
  QUIZ = "QUIZ",
  ASSIGNMENT = "ASSIGNMENT"
}


registerEnumType(CurriclumType, {
  name: "CurriclumType",
});