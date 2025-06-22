import {  Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ClientModule } from './client/client.module';
import { AdminModule } from './admin/admin.module';
import { ConfigModule } from '@nestjs/config';
import { VoyagerController } from './voyager.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      introspection: true,
      autoSchemaFile:  join(process.cwd(), 'src/schema.gql'),
      context: ({ req, res }) => ({ req, res }),
      playground: {
        settings: {
          'editor.theme': 'dark',
          'editor.reuseHeaders': true,
          'tracing.hideTracingResponse': true,
        },
        tabs: [
          {
            endpoint: '/graphql',
            query: `# Welcome to SA Academy GraphQL API
# 
# This playground allows you to explore and test the API.
# 
# Example queries you can try:
#
# Query all academies:
query GetAcademies {
  academies {
    id
    name
    location
    owner_name
    status
  }
}
#
# Query courses with pagination:
query GetCourses($page: Int, $perPage: Int) {
  getTeacherCourses(page: $page, perPage: $perPage) {
    data {
      id
      course_name
      real_price
      sale_price
      status
    }
    meta {
      total
      currentPage
      lastPage
    }
  }
}`,
            variables: JSON.stringify({ page: 1, perPage: 10 }, null, 2),
          },
        ],
      },
    }),
    ClientModule,
    AdminModule,
  ],
  controllers: [VoyagerController],
  providers: [ ],
})


export class AppModule {
}
