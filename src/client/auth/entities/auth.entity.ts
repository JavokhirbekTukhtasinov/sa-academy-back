import { ObjectType, Field, Int, InputType, registerEnumType, createUnionType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Academy } from 'src/client/academies/entities/academy.entity';
import { Teacher } from 'src/client/teachers/entities/teacher.entity';
import { User } from 'src/client/users/entities/user.entity';

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
  

  @IsNotEmpty()
  @IsString()
  @Field({nullable: false})
  full_name: string;
  // @Field()
  // @MinLength(3)
  // first_name: string;
  
  // @Field()
  // @MinLength(3)
  // last_name: string;
}




export enum LoginRole {
  ADMIN = "ADMIN",
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
  ACADEMY = "ACADEMY"
}

registerEnumType(LoginRole, {
  name: "LoginRole",
});


@InputType()
export class LoginInput {

  @Field()
  @IsEmail()
  email: string;
  
  @Field()
  @MinLength(8)
  password: string;

  @Field({nullable:false, description: 'send login role(ADMIN, TEACHER, STUDENT, ACADEMY)'})
  role: LoginRole

}


export const userUnion = createUnionType({
  name: 'userUnion',
  types: () => [User, Teacher, Academy] as const,
  resolveType(value) {
    if (value.__typename === 'STUDENT') {
      return User;
    }
    if (value.__typename === 'Teacher') {
      return Teacher;
    }
    if (value.__typename === 'Academy') {
      return Academy;
    }
  }
})


@ObjectType()
export class userLoginResponse {
  @Field()
  access_token: string;
  
  @Field()
  refresh_token: string;

  @Field(() => userUnion)
  user:typeof userUnion;
}