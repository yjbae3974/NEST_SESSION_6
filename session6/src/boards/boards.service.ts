import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { User } from '../users/user.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private boardsRepository: Repository<Board>,
    @InjectRepository(User)
    private usersRepository: Repository<User>, // UserRepository 추가
  ) {}

  async create(createBoardDto: CreateBoardDto, userId: number): Promise<Board> {
    // 사용자 ID로 전체 User 엔티티 조회
    const completeUser = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!completeUser) {
      throw new NotFoundException('User not found');
    }

    // Board 생성
    const board = this.boardsRepository.create({
      ...createBoardDto,
      user: completeUser,
    });
    console.log('Board to save:', board); // 완전한 User 엔티티로 설정된 Board 확인용 로그
    return this.boardsRepository.save(board);
  }

  async findAll(): Promise<Board[]> {
    return this.boardsRepository.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<Board> {
    const board = await this.boardsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!board) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }
    return board;
  }

  async update(id: number, updateBoardDto: UpdateBoardDto): Promise<Board> {
    await this.boardsRepository.update(id, updateBoardDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.boardsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }
  }
}
