import { Module } from "@nestjs/common";
import { BannersModule } from "./banners/banners.module";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma.service";
import { JwtStrategy } from "src/client/auth/strategies/jwt.strategy";

@Module({
    imports: [BannersModule],
    exports: [],
    // controllers: [],
    // providers: [JwtStrategy]
})


export class AdminModule{}