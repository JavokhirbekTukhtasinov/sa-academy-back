import { Module } from "@nestjs/common";
import { CurriclumResolver } from "./curriclum.resolver";
import { CurriclumService } from "./curriclum.service";
import { PrismaService } from "src/prisma.service";
import { JwtService } from "@nestjs/jwt";

@Module({
    imports: [],
    controllers: [],
    providers: [CurriclumService,CurriclumResolver, PrismaService, JwtService],
    exports: []
})

export class CurriclumModule {}