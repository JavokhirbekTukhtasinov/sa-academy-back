export declare function generatePasswordHash(password: string): Promise<string>;
export declare function comparePasswordHash(password: string, hash: string): Promise<boolean>;
export declare function generateOTP(): string;
