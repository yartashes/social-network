import { BaseService } from '../base';
import { Auth } from '../interfaces';
import { SignupParams } from './interfaces';

export class AuthService extends BaseService implements Auth {
  public async signup(params: SignupParams): Promise<boolean> {
    const code = this.generateCode();

    await this.resources.mail.signup(params.email, code);

    return true;
  }

  private generateCode(): number {
    return Math.floor(
      10000 + (Math.random() * 90000),
    );
  }
}
