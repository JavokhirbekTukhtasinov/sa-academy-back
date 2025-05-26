import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  // This method is needed to make AuthGuard work with GraphQL requests.
  // For REST requests, super.canActivate(context) would be sufficient.
  getRequest(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context);
    const gqlReq = gqlContext.getContext().req;
    if (gqlReq) {
      // If it's a GraphQL request, Passport expects the request object here.
      // If you're also using this guard for REST, you might need to handle both.
      // For the Google OAuth redirect flow (REST), the standard request object is used.
      // The GoogleStrategy's `validate` method will populate `gqlReq.user`.
      return gqlReq;
    }
    // For RESTful requests (like the OAuth callback)
    return context.switchToHttp().getRequest();
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
