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

@Resolver(() => Banner)
export class BannersResolver {
  constructor(private readonly bannersService: BannersService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Banner)
  createBanner(@CurrentUser() user: CurrentUserProps, @Args('input') createBannerInput: CreateBannerInput) {
    return this.bannersService.create(createBannerInput, user);
  }

  @Query(() => [Banner], { name: 'banners' })
  getBanners() {
    return this.bannersService.findAll();
  }

  @Query(() => Banner, { name: 'banner' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.bannersService.findOne(id);
  }

  @Mutation(() => Banner)
  updateBanner(@Args('updateBannerInput') updateBannerInput: UpdateBannerInput) {
    return this.bannersService.update(updateBannerInput.id, updateBannerInput);
  }

  @Mutation(() => Banner)
  removeBanner(@Args('id', { type: () => Int }) id: number) {
    return this.bannersService.remove(id);
  }
}
