"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannersModule = void 0;
const common_1 = require("@nestjs/common");
const banners_service_1 = require("./banners.service");
const banners_resolver_1 = require("./banners.resolver");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../prisma.service");
const upload_service_1 = require("../../utils/upload.service");
let BannersModule = class BannersModule {
};
exports.BannersModule = BannersModule;
exports.BannersModule = BannersModule = __decorate([
    (0, common_1.Module)({
        providers: [banners_resolver_1.BannersResolver, banners_service_1.BannersService, jwt_1.JwtService, prisma_service_1.PrismaService, upload_service_1.UploadService],
        imports: [],
        exports: [banners_service_1.BannersService]
    })
], BannersModule);
//# sourceMappingURL=banners.module.js.map