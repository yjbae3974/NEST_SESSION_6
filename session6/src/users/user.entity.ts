import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Board } from '../boards/board.entity';
import { UserRoleTypes } from './types/user-roles.types'; // import로 roles 타입 가져오기

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Board, (board) => board.user, { cascade: true })
  boards: Board[];

  @Column({ nullable: true })
  role: UserRoleTypes; // 유저 역할을 엔티티에 추가합니다.
}
