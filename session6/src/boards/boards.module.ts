import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { UsersModule } from '../users/users.module'; // UsersModule import

@Module({
  imports: [
    TypeOrmModule.forFeature([Board]),
    UsersModule, // UsersModule 추가
  ],
  providers: [BoardsService],
  controllers: [BoardsController],
  exports: [BoardsService],
})
export class BoardsModule {}
