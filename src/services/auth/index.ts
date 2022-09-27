import { BaseService } from '../base';
import { Auth } from '../interfaces';
import { SignupParams, SignupVerifyParams, SignupVerifyResult } from './interfaces';

export class AuthService extends BaseService implements Auth {
  public async signup(params: SignupParams): Promise<boolean> {
    const code = this.generateCode();

    const codeSetResult = await this.repositories.auth.setCode(
      code,
      {
        email: params.email,
        name: params.username,
      },
    );
    this.log.debug({ codeSetResult }, 'signup add code to storage');
    await this.resources.mail.signup(params.email, code);

    return true;
  }

  public async signupVerify(params: SignupVerifyParams): Promise<SignupVerifyResult> {
    const info = await this.repositories.auth.getCode(params.code);

    if (!info) {
      throw new Error('Invalid verification code');
    }

    const userId = await this.repositories.users.create({
      email: info.email,
      username: info.name as string,
    });

    const tokens = await this.jwt.encode(userId);

    await this.repositories.auth.addRefreshToken(userId, tokens.refresh);

    return {
      refresh: tokens.refresh,
      access: tokens.access,
    };
  }

  private generateCode(): number {
    return Math.floor(
      10000 + (Math.random() * 900000),
    );
  }
}
