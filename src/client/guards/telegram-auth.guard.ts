import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class TelegramAuthGuard extends AuthGuard('telegram') {
  // This method is crucial for passing GraphQL arguments to the Passport strategy.
  getRequest(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context);
    const { req } = gqlContext.getContext();
    // The Telegram strategy needs access to the arguments passed to the GraphQL mutation (telegramLoginInput).
    // We attach the GraphQL arguments to the request object so the strategy can access them.
    req.body = gqlContext.getArgs().telegramLoginInput; 
    return req;
  }

  // Optional: Override handleRequest for custom error handling or user object manipulation.
  // handleRequest(err, user, info, context, status) {
  //   if (err || !user) {
  //     throw err || new UnauthorizedException('Telegram authentication failed');
  //   }
  //   return user; // This user object is the result of TelegramStrategy's validate method
  // }
}
