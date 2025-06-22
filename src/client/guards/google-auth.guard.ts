import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GoogleAuthGuard extends PassportAuthGuard('google') {
  // This method is needed to make AuthGuard work with GraphQL requests.
  // For REST requests, super.canActivate(context) would be sufficient.
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  // Optional: You might override handleRequest if you need to customize error handling
  // or the way the user object is returned after successful authentication.
  // handleRequest(err, user, info, context, status) {
  //   if (err || !user) {
  //     throw err || new UnauthorizedException('Google authentication failed');
  //   }
  //   return user; // This user object is the result of GoogleStrategy's validate method
  // }
}
