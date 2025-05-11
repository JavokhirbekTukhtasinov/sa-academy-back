import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppResolver } from './app.resolver';
import { join } from 'path';
import { AcademiesModule } from './client/academies/academies.module';
import { UsersModule } from './client/users/users.module';
import { UsersResolver } from './client/users/users.resolver';
import { AuthModule } from './client/auth/auth.module';
import { ClientModule } from './client/client.module';


@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
     autoSchemaFile:  join(process.cwd(), 'src/schema.gql'),
    }),
    ClientModule
  ],
  controllers: [],
  providers: [ ],
})

export class AppModule {}
