import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board } from './board.entity';
import { AuthGuard } from '@nestjs/passport';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Roles } from 'src/common/decorator/role.decorator';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { request } from 'http';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() createBoardDto: CreateBoardDto,
    @Request() req,
  ): Promise<Board> {
    console.log('User from request:', req.user); // 디버그용 로그
    return this.boardsService.create(createBoardDto, req.user.userId); // userId만 전달
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(): Promise<Board[]> {
    return this.boardsService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Board> {
    return this.boardsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateBoardDto: UpdateBoardDto,
    @Request() req,
  ): Promise<Board> {
    const board = await this.boardsService.findOne(id);

    // Access the user ID from the `user` object
    if (board.user.id !== req.user.userId && req.user.role !== 'admin') {
      throw new ForbiddenException('You are not allowed to update this board');
    }

    return this.boardsService.update(id, updateBoardDto);
  }

  @Roles('admin') // Roles 데코레이터 추가
  @UseGuards(AuthGuard('jwt'), RolesGuard) // RolesGuard 적용
  @Delete(':id')
  async remove(@Param('id') id: number, @Request() req): Promise<void> {
    const board = await this.boardsService.findOne(id);

    // Access the user ID from the `user` object
    if (board.user.id !== req.user.userId && req.user.role !== 'admin') {
      throw new ForbiddenException('You are not allowed to delete this board');
    }

    return this.boardsService.remove(id);
  }
}