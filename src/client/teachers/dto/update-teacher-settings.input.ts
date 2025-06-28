import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsString, IsUrl, IsInt } from 'class-validator';

@InputType()
export class UpdateTeacherSettingsInput {
  @Field(() => Int)
  @IsInt()
  id: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  first_name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  last_name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  full_name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  email?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  academy_id?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  image?: string;
  
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  headline?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUrl()
  website_url?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUrl()
  instagram_url?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUrl()
  facebook_url?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUrl()
  youtube_url?: string;
} 