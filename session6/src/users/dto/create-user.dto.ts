import { UserRoleTypes } from '../types/user-roles.types';

export class CreateUserDto {
  username: string;
  password: string;
  role: UserRoleTypes; // role 값을 유효성 검사 및 이후 전송될 데이터에 추가합니다.
}
