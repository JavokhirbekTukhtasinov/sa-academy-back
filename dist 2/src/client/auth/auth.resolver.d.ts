import { AuthService } from './auth.service';
import { LoginInput, RequestPasswordResetInput, ResetPasswordInput, SignUpInput, userLoginResponse, verifyOTPInput } from './entities/auth.entity';
import { CreateAuthInput } from './dto/create-auth.input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { TelegramLoginInput } from './entities/social-auth.entity';
export declare class AuthResolver {
    private readonly authService;
    constructor(authService: AuthService);
    signup(createAuthInput: SignUpInput): Promise<{
        message: string;
    }>;
    verifyOTP(verifyOTPInput: verifyOTPInput): Promise<{
        message: string;
    }>;
    requestPasswordReset(requestPasswordResetInput: RequestPasswordResetInput): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordInput: ResetPasswordInput): Promise<{
        message: string;
    }>;
    login(LoginInput: LoginInput, context: any): Promise<any>;
    initiateGoogleLogin(): string;
    loginWithTelegram(telegramLoginInput: TelegramLoginInput, context: any): Promise<userLoginResponse>;
    findAll(): string;
    findOne(id: number): string;
    updateAuth(updateAuthInput: UpdateAuthInput): string;
    removeAuth(id: number): string;
    deleteUser(id: string): Promise<{
        id: number;
        created_at: Date;
        first_name: string | null;
        last_name: string | null;
        full_name: string | null;
        password: string | null;
        email: string | null;
        otp: string | null;
        is_verified: boolean | null;
        avatar: string | null;
        google_id: string | null;
        telegram_id: string | null;
        otp_expires_at: Date | null;
        password_reset_token: string | null;
        password_reset_token_expires_at: Date | null;
    }>;
    refreshToken(context: any): Promise<string>;
    signInWithGoogle(token: string, context: any): Promise<{
        user: any;
        access_token: string;
        refresh_token: string;
    }>;
    createAuth(createAuthInput: CreateAuthInput): string;
}
