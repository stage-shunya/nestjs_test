import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class TestGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    return this.validateRequest(request);
  }

  // ヘッダーの authorization の値を照合
  async validateRequest(request: Request): Promise<boolean> {
    const API_KEY = 'secret';
    const token = request.headers['authorization'];
    if (token) {
      return token.split(' ')[1] === API_KEY;
    }
  }
}
