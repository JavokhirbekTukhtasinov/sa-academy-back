import { MiddlewareConsumer, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
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


export class AppModule {
}
