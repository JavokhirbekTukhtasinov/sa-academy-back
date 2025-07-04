"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeachersModule = void 0;
const common_1 = require("@nestjs/common");
const teachers_service_1 = require("./teachers.service");
const teachers_resolver_1 = require("./teachers.resolver");
const prisma_service_1 = require("../../prisma.service");
const upload_service_1 = require("../../utils/upload.service");
const jwt_1 = require("@nestjs/jwt");
let TeachersModule = class TeachersModule {
};
exports.TeachersModule = TeachersModule;
exports.TeachersModule = TeachersModule = __decorate([
    (0, common_1.Module)({
        providers: [teachers_resolver_1.TeachersResolver, teachers_service_1.TeachersService, prisma_service_1.PrismaService, upload_service_1.UploadService, jwt_1.JwtService],
        imports: []
    })
], TeachersModule);
//# sourceMappingURL=teachers.module.js.map