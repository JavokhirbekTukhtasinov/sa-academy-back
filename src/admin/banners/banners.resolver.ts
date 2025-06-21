import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BannersService } from './banners.service';
import { Banner } from './entities/banner.entity';
import { CreateBannerInput } from './dto/create-banner.input';
import { UpdateBannerInput } from './dto/update-banner.input';
import { UseGuards } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/client/decorators/current-user.decorator';
import { CurrentUserProps } from 'src/client/entities/common.entities';
import { AuthGuard } from 'src/client/guards/gql-auth.guard';
import { Roles } from 'src/client/decorators/oles.decorator';
import { RolesGuard } from 'src/client/guards/roles.guard';

@Resolver(() => Banner)
export class BannersResolver {
  constructor(private readonly bannersService: BannersService) {}

  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles('ADMIN')
  @Mutation(() => Banner)
  createBanner(@CurrentUser() user: CurrentUserProps, @Args('input') createBannerInput: CreateBannerInput) {
    console.log({createBannerInput})
    return this.bannersService.create(createBannerInput, user);
  }

  @Query(() => [Banner], { name: 'getBanners' })
  getBanners() {
    return this.bannersService.findAll();
  }


  //Get banner for only admin
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Query(() => Banner, { name: 'getBannerById' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.bannersService.findOne(id);
  }


  //Update banner 
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Mutation(() => Banner)
  updateBanner(@Args('updateBannerInput') updateBannerInput: UpdateBannerInput) {
    return this.bannersService.update(updateBannerInput.id, updateBannerInput);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Mutation(() => Banner)
  removeBanner(@Args('id', { type: () => Int }) id: number) {
    return this.bannersService.remove(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Mutation(() => [Banner])
  changeBannerOrder(@Args('ids', { type: () => [Int] }) ids: number[]) {
    return this.bannersService.changeOrder(ids);
  }

}
