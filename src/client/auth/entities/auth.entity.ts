import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';

@ObjectType()
export class Auth {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}

@InputType()
export class verifyOTPInput {
  @Field( () => Int )
  otp: number

  @Field( () => String )
  email: string
}


@ObjectType()
export class verifyOTPresponse {
  @Field()
  message: string;
}

@ObjectType()
export class SignUpresponse {
  @Field()
  message: string;  
}


@InputType()
export class SignUpInput {
  
  @Field()
  @IsEmail()
  email: string;
  
  @Field()
  @MinLength(8)
  password: string;
  
  @Field()
  @MinLength(3)
  first_name: string;
  
  @Field()
  @MinLength(3)
  last_name: string;
}


@InputType()
export class userLoginInput {
  
  @Field()
  @IsEmail()
  email: string;
  
  @Field()
  @MinLength(8)
  password: string;
}



@ObjectType()
export class userLoginResponse {
  @Field()
  access_token: string;
  
  @Field()
  refresh_token: string;
}