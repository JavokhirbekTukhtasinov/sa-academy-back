"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("./auth/auth.module");
const academies_module_1 = require("./academies/academies.module");
const teachers_module_1 = require("./teachers/teachers.module");
const users_module_1 = require("./users/users.module");
const courses_module_1 = require("./courses/courses.module");
const lectures_module_1 = require("./lectures/lectures.module");
const curriclum_module_1 = require("./curriclum/curriclum.module");
const sections_module_1 = require("./sections/sections.module");
let ClientModule = class ClientModule {
};
exports.ClientModule = ClientModule;
exports.ClientModule = ClientModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, users_module_1.UsersModule, academies_module_1.AcademiesModule, teachers_module_1.TeachersModule, courses_module_1.CoursesModule, lectures_module_1.LecturesModule, curriclum_module_1.CurriclumModule, sections_module_1.SectionsModule],
        providers: [],
    })
], ClientModule);
//# sourceMappingURL=client.module.js.map