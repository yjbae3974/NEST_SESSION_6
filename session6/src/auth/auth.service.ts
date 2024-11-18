import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService, // UsersService를 주입하여 사용자 데이터에 접근
    private jwtService: JwtService, // JwtService를 주입하여 JWT 토큰을 생성하고 검증
  ) {}

  // 사용자 유효성 검증
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result; // 비밀번호를 제외한 사용자 정보 반환
    }
    return null;
  }

  // 로그인하여 accessToken과 refreshToken 발급
  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role }; // role 추가
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.generateRefreshToken(user.id),
    };
  }

  private generateRefreshToken(userId: number): string {
    const payload = { sub: userId };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }
}
