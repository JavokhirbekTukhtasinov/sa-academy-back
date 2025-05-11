import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    // constructor() {
    //    super({
    //     datasources: {
    //         db: {
    //             url: process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL
    //         }
    //     }
    //    }); 
    // }
    async onModuleInit() {
        try {
            await this.$connect();
        } catch (error) {
            console.log(error);
        }
    }
    async onModuleDestroy() {
        await this.$disconnect();
      }
}
