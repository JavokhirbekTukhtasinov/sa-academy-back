import { Query, Resolver } from '@nestjs/graphql';
import { readFileSync } from 'fs';
import { join } from 'path';

@Resolver()
export class AppResolver {
 
    @Query(() => String)
  hello(): string {
    return 'Hello from schema-first!';
  }

  @Query(() => String, { name: 'schemaSDL' })
  getSchemaSDL(): string {
    const schemaPath = join(process.cwd(), 'src/schema.gql');
    return readFileSync(schemaPath, 'utf8');
  }
}