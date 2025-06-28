"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LecturesModule = void 0;
const common_1 = require("@nestjs/common");
const lectures_service_1 = require("./lectures.service");
const lectures_resolver_1 = require("./lectures.resolver");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../prisma.service");
const upload_service_1 = require("../../utils/upload.service");
let LecturesModule = class LecturesModule {
};
exports.LecturesModule = LecturesModule;
exports.LecturesModule = LecturesModule = __decorate([
    (0, common_1.Module)({
        providers: [lectures_resolver_1.LecturesResolver, lectures_service_1.LecturesService, jwt_1.JwtService, prisma_service_1.PrismaService, upload_service_1.UploadService],
        imports: []
    })
], LecturesModule);
//# sourceMappingURL=lectures.module.js.map