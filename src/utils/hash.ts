import * as bcrypt from 'bcrypt';


 export async function generatePasswordHash(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }
  export async function comparePasswordHash(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}




  export function generateOTP(): string {
    let otp = '';
    for (let i = 0; i < 6; i++) {
      otp += Math.floor(Math.random() * 10).toString();
    }
    return otp;
  }
