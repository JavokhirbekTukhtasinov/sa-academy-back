import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { CurriclumService } from "./curriclum.service";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "../guards/gql-auth.guard";
import { Curriclum } from "./enteties/curriclum.entity";
import { CreateCurriculumInput } from "./dtos/create-curriclum.input";


@Resolver()
export class CurriclumResolver {

    constructor(
        private readonly curriclumService: CurriclumService
    ) {}

    @UseGuards(AuthGuard)
    @Mutation( () => Curriclum)
    async createCurriclum(@Args('input') createCurriclumInput: CreateCurriculumInput) {
        return this.curriclumService.createCurriclum(createCurriclumInput)
    }



}
