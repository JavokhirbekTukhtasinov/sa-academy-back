import { Field, InputType, ObjectType, Float } from '@nestjs/graphql'; // Added Float for auth_date
import { userLoginResponse } from './auth.entity'; // Assuming this is your existing login response

@InputType()
export class GoogleLoginInput {
  @Field(() => String, { description: 'Google ID Token or Access Token from frontend' })
  token: string;
  // Depending on your frontend flow, this could be an ID token or an access token.
  // If it's an ID token, you might verify it here or in the strategy.
  // If it's an access token, the strategy uses it to fetch profile info.
  // The current GoogleStrategy expects to handle the OAuth flow itself after initial trigger,
  // or receive an authorization code. For simplicity, let's assume the frontend
  // somehow provides a token that the backend can use to get user info if needed,
  // or that the GoogleStrategy's redirect flow is triggered by a simple GET request.
  // The current GoogleStrategy is set up for a server-side OAuth flow.
  // We might need to adjust this if the frontend handles the full OAuth and sends an ID token.
}

// For Telegram, the widget typically posts data that the strategy validates.
// So, the input might be the TelegramUser object itself or specific fields.
@InputType()
export class TelegramLoginInput {
  @Field(() => String)
  id: string;

  @Field(() => String)
  first_name: string;

  @Field(() => String, { nullable: true })
  last_name?: string;

  @Field(() => String, { nullable: true })
  username?: string;

  @Field(() => String, { nullable: true })
  photo_url?: string;

  @Field(() => Float) // Changed to Float as auth_date is typically a Unix timestamp
  auth_date: number;

  @Field(() => String)
  hash: string;
}

// You can reuse your existing userLoginResponse or create a specific one if needed
// For now, let's assume userLoginResponse is suitable.
// @ObjectType()
// export class SocialLoginResponse extends userLoginResponse {}
