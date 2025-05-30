import { Scalar } from '@nestjs/graphql';
import {GraphQLUpload} from 'graphql-upload';

@Scalar('Upload')
export class Upload {
  description = 'Upload files';

  parseValue(value) {
    return GraphQLUpload.parseValue(value);
  }

  serialize(value) {
    return GraphQLUpload.serialize(value);
  }

  parseLiteral(ast) {
    return GraphQLUpload.parseLiteral(ast, ast.value);
  }
}