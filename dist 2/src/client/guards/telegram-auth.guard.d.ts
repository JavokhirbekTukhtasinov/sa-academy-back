import { ExecutionContext } from '@nestjs/common';
declare const TelegramAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class TelegramAuthGuard extends TelegramAuthGuard_base {
    getRequest(context: ExecutionContext): any;
}
export {};
