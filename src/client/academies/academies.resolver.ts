import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AcademiesService } from './academies.service';
import { Academy } from './entities/academy.entity';
import { CreateAcademyInput, createAcademyInputResponse } from './dto/create-academy.input';
import { UpdateAcademyInput } from './dto/update-academy.input';

@Resolver(() => Academy)
export class AcademiesResolver {
  constructor(private readonly academiesService: AcademiesService) {}

  @Mutation(() => createAcademyInputResponse)
  createAcademy(@Args('createAcademyInput') createAcademyInput: CreateAcademyInput) {
    console.log(createAcademyInput)
    return this.academiesService.create(createAcademyInput);
  }

  @Query(() => [Academy], { name: 'academies' })
  findAll() {
    return this.academiesService.findAll();
  }

  @Query(() => Academy, { name: 'academy' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.academiesService.findOne(id);
  }

  @Mutation(() => Academy)
  updateAcademy(@Args('updateAcademyInput') updateAcademyInput: UpdateAcademyInput) {
    return this.academiesService.update(updateAcademyInput.id, updateAcademyInput);
  }

  @Mutation(() => Academy)
  removeAcademy(@Args('id', { type: () => Int }) id: number) {
    return this.academiesService.remove(id);
  }
}
