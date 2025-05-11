import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth, SignUpInput, SignUpresponse, userLoginInput, userLoginResponse, verifyOTPInput, verifyOTPresponse } from './entities/auth.entity';
import { CreateAuthInput } from './dto/create-auth.input';
import { UpdateAuthInput } from './dto/update-auth.input';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignUpresponse)
  signup(@Args('createAuthInput') createAuthInput: SignUpInput ) {
    return this.authService.signup(createAuthInput);
  }

  @Mutation(() => Auth)
  createAuth(@Args('createAuthInput') createAuthInput: CreateAuthInput) {
    return this.authService.create(createAuthInput);
  }

  @Mutation(() => verifyOTPresponse)
  verifyOTP(@Args('verifyOTPInput') verifyOTPInput: verifyOTPInput ) {
    return this.authService.verifyOTP(verifyOTPInput);
  }

  @Mutation(() => userLoginResponse)
  userLogin(@Args('userLoginInput') userLoginInput: userLoginInput ) {
    return this.authService.userLogin(userLoginInput);
  }

  @Query(() => [Auth], { name: 'auth' })
  findAll() {
    return this.authService.findAll();
  }

  @Query(() => Auth, { name: 'auth' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.authService.findOne(id);
  }

  @Mutation(() => Auth)
  updateAuth(@Args('updateAuthInput') updateAuthInput: UpdateAuthInput) {
    return this.authService.update(updateAuthInput.id, updateAuthInput);
  }

  @Mutation(() => Auth)
  removeAuth(@Args('id', { type: () => Int }) id: number) {
    return this.authService.remove(id);
  }
}
