"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Upload = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_upload_1 = require("graphql-upload");
let Upload = class Upload {
    constructor() {
        this.description = 'Upload files';
    }
    parseValue(value) {
        return graphql_upload_1.GraphQLUpload.parseValue(value);
    }
    serialize(value) {
        return graphql_upload_1.GraphQLUpload.serialize(value);
    }
    parseLiteral(ast) {
        return graphql_upload_1.GraphQLUpload.parseLiteral(ast, ast.value);
    }
};
exports.Upload = Upload;
exports.Upload = Upload = __decorate([
    (0, graphql_1.Scalar)('Upload')
], Upload);
//# sourceMappingURL=upload.scaler.js.map