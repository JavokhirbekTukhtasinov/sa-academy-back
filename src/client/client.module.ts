import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AcademiesModule } from './academies/academies.module';
import { TeachersModule } from './teachers/teachers.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { LecturesModule } from './lectures/lectures.module';
import { CurriclumModule } from './curriclum/curriclum.module';
import { SectionsModule } from './sections/sections.module';

@Module({
 imports: [AuthModule, UsersModule, AcademiesModule, TeachersModule, CoursesModule, LecturesModule, CurriclumModule, SectionsModule],
  providers: [],
})
export class ClientModule {}
