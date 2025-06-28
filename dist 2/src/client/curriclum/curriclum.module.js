"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurriclumModule = void 0;
const common_1 = require("@nestjs/common");
const curriclum_service_1 = require("./curriclum.service");
const curriclum_resolver_1 = require("./curriclum.resolver");
const prisma_service_1 = require("../../prisma.service");
const jwt_1 = require("@nestjs/jwt");
const upload_service_1 = require("../../utils/upload.service");
const signed_url_service_1 = require("../../utils/signed-url.service");
const courses_service_1 = require("../courses/courses.service");
const courses_module_1 = require("../courses/courses.module");
let CurriclumModule = class CurriclumModule {
};
exports.CurriclumModule = CurriclumModule;
exports.CurriclumModule = CurriclumModule = __decorate([
    (0, common_1.Module)({
        providers: [
            curriclum_resolver_1.CurriclumResolver,
            curriclum_service_1.CurriclumService,
            prisma_service_1.PrismaService,
            jwt_1.JwtService,
            upload_service_1.UploadService,
            signed_url_service_1.SignedUrlService,
            courses_service_1.CoursesService
        ],
        imports: [
            courses_module_1.CoursesModule,
        ]
    })
], CurriclumModule);
//# sourceMappingURL=curriclum.module.js.map